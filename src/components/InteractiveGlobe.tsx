import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

const CITIES = [
  { name: "Hyderabad", lng: 78.48, lat: 17.38, isHub: true },
  { name: "United States", lng: -98.5, lat: 39.8, code: "USA" },
  { name: "United Kingdom", lng: -1.5, lat: 52.5, code: "GBR" },
  { name: "Canada", lng: -106.3, lat: 56.1, code: "CAN" },
  { name: "Australia", lng: 133.7, lat: -25.2, code: "AUS" },
  { name: "Germany", lng: 10.4, lat: 51.1, code: "DEU" },
  { name: "New Delhi", lng: 77.2, lat: 28.6, code: "DEL" },
  { name: "Ireland", lng: -8.2, lat: 53.4, code: "IRL" },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function makeDotTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.95)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState(false);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // Wave palette: globe breathes between navy and red
    const COLOR_NAVY = new THREE.Color(0x00008b);
    const COLOR_RED = new THREE.Color(0xff0000);
    // Reused scratch colors so we never allocate inside the animation loop
    const globeColor = new THREE.Color(); // current globe color (navy <-> red)
    const oppColor = new THREE.Color();   // exact opposite (red <-> navy)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const gl = canvas.getContext("webgl2", { antialias: true }) || canvas.getContext("webgl", { antialias: true });
    if (!gl) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl as WebGLRenderingContext,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const earthRadius = 2.0;

    // Initial colors (these get overwritten every frame by the wave)
    const COL_DOT = new THREE.Color(0x00008b);
    const COL_ATMO = new THREE.Color(0x00008b);
    const COL_ARC = new THREE.Color(0xff0000);
    const COL_HUB = new THREE.Color(0xff0000);

    // Solid inner core background to hide dots wrapping behind the sphere
    const coreGeo = new THREE.SphereGeometry(earthRadius * 0.99, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Transparent wireframe depth structure
    

    // Atmosphere Fresnel glow (matches the current globe color)
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.12, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: COL_ATMO.clone() } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(uColor, clamp(intensity, 0.0, 0.5));
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    globeGroup.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

    // ---- Image-based land mask (accurate continents) ----
const geo = new THREE.BufferGeometry();
const dotTexture = makeDotTexture();
const mat = new THREE.PointsMaterial({
  size: 0.075,
  map: dotTexture,
  color: COL_DOT.clone(),
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  sizeAttenuation: true,
});
const dots = new THREE.Points(geo, mat);
globeGroup.add(dots);

// Equirectangular black/white land mask (white = land)
const maskImg = new Image();
maskImg.crossOrigin = "anonymous";
maskImg.onload = () => {
  const mw = maskImg.width;
  const mh = maskImg.height;
  const mc = document.createElement("canvas");
  mc.width = mw;
  mc.height = mh;
  const mctx = mc.getContext("2d")!;
  mctx.drawImage(maskImg, 0, 0);
  const data = mctx.getImageData(0, 0, mw, mh).data;

  const isLand = (lat: number, lng: number) => {
    const u = (lng + 180) / 360;
    const v = (90 - lat) / 180;
    const px = Math.min(mw - 1, Math.max(0, Math.floor(u * mw)));
    const py = Math.min(mh - 1, Math.max(0, Math.floor(v * mh)));
    const idx = (py * mw + px) * 4;
    // bright pixel = land
    return data[idx] < 130;
  };

  const positions: number[] = [];
  const SAMPLES = 30000;
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / SAMPLES;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = Math.PI * (1 + Math.sqrt(5)) * i;

    const lat = 90 - (inclination * 180) / Math.PI;
    let lng = ((azimuth * 180) / Math.PI) % 360;
    if (lng > 180) lng -= 360;

    if (isLand(lat, lng)) {
      const vpos = latLngToVector3(lat, lng, earthRadius * 1.005);
      positions.push(vpos.x, vpos.y, vpos.z);
    }
  }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.attributes.position.needsUpdate = true;
};

// Water mask: oceans bright, continents dark (accurate coastlines)
maskImg.src = "https://unpkg.com/three-globe@2.31.0/example/img/earth-water.png";
    // Flight paths tracking lines setup
    const flights: any[] = [];
    const hubCity = CITIES.find((c) => c.isHub) || CITIES[0];

    CITIES.forEach((city) => {
      if (city.isHub) return;

      const p1 = latLngToVector3(hubCity.lat, hubCity.lng, earthRadius);
      const p2 = latLngToVector3(city.lat, city.lng, earthRadius);
      const dist = p1.distanceTo(p2);
      const arcHeight = 0.2 + dist * 0.35;

      const curvePoints: THREE.Vector3[] = [];
      const numSegments = 60;
      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const point = new THREE.Vector3().copy(p1).lerp(p2, t).normalize();
        const lift = earthRadius + Math.sin(Math.PI * t) * arcHeight;
        point.multiplyScalar(lift);
        curvePoints.push(point);
      }

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 60, 0.01, 6, false);
      const initialProgress = Math.random();

      const pathMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uProgress: { value: initialProgress },
          uColor: { value: COL_ARC.clone() },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uProgress;
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float percent = vUv.x;
            float distToHead = percent - uProgress;
            if (distToHead > 0.5) distToHead -= 1.0;
            if (distToHead < -0.5) distToHead += 1.0;

            float intensity = 0.0;
            if (distToHead <= 0.0 && distToHead > -0.4) {
              intensity = (distToHead + 0.4) / 0.4;
              intensity = pow(intensity, 2.0);
            }
            float finalGlow = clamp(intensity + 0.15, 0.0, 1.0);
            float lateralFade = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
            gl_FragColor = vec4(uColor, finalGlow * lateralFade * 0.8);
          }
        `,
        transparent: true,
        depthWrite: false,
      });

      globeGroup.add(new THREE.Mesh(tubeGeo, pathMaterial));

      const orbGroup = new THREE.Group();
      const orbMat = new THREE.MeshBasicMaterial({ color: COL_ARC.clone() });
      orbGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), orbMat));
      globeGroup.add(orbGroup);

      flights.push({
        curve,
        orb: orbGroup,
        orbMat, // recolored each frame to the opposite color
        material: pathMaterial,
        progress: initialProgress,
        speed: 0.002 + Math.random() * 0.0015,
      });
    });

    // Destination Pinpoints
    const pins: { mat: THREE.MeshBasicMaterial }[] = [];
    const rings: any[] = [];
    CITIES.forEach((city) => {
      const pos = latLngToVector3(city.lat, city.lng, earthRadius * 1.005);
      const color = city.isHub ? COL_HUB : COL_ARC;

      const pinMat = new THREE.MeshBasicMaterial({ color: color.clone() });
      const pin = new THREE.Mesh(new THREE.SphereGeometry(city.isHub ? 0.045 : 0.03, 16, 16), pinMat);
      pin.position.copy(pos);
      globeGroup.add(pin);
      pins.push({ mat: pinMat });

      const ringMat = new THREE.MeshBasicMaterial({ color: color.clone(), side: THREE.DoubleSide, transparent: true, opacity: 0.8, depthWrite: false });
      const ringMesh = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.06, 32), ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);
      rings.push({ mesh: ringMesh, mat: ringMat, phase: Math.random() * Math.PI * 2 });
    });

    // Rotational angles
    let targetRotationX = 0.3;
    let targetRotationY = -(hubCity.lng + 180) * (Math.PI / 180) + Math.PI;
    let rotationX = targetRotationX;
    let rotationY = targetRotationY;
    let isDragging = false;
    let previousPoint = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPoint = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - previousPoint.x;
      const dy = e.clientY - previousPoint.y;
      previousPoint = { x: e.clientX, y: e.clientY };
      targetRotationY += dx * 0.005;
      targetRotationX = Math.max(-1.0, Math.min(1.0, targetRotationX + dy * 0.005));
    };
    const onPointerUp = () => { isDragging = false; };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const startTime = performance.now();
    let animateId = 0;

    const tick = () => {
      animateId = requestAnimationFrame(tick);
      if (!isVisibleRef.current) return;

      const elapsed = (performance.now() - startTime) / 1000;

      // --- Continuous navy <-> red wave ---
      // period ~9s. Increase 0.7 for faster pulsing, decrease for slower.
      const wave = 0.5 + 0.5 * Math.sin(elapsed * 0.7);
      globeColor.copy(COLOR_NAVY).lerp(COLOR_RED, wave); // current globe color
      oppColor.copy(COLOR_RED).lerp(COLOR_NAVY, wave);   // exact opposite

      // Globe body: land dots + wireframe + atmosphere glow all share the same color
      mat.color.copy(globeColor);
      
      atmosphereMat.uniforms.uColor.value.copy(globeColor);

      if (!isDragging) targetRotationY += 0.0012;
      const lerpSpeed = isDragging ? 0.25 : 0.05;
      rotationX += (targetRotationX - rotationX) * lerpSpeed;
      rotationY += (targetRotationY - rotationY) * lerpSpeed;
      globeGroup.rotation.x = rotationX;
      globeGroup.rotation.y = rotationY;

      flights.forEach((flight) => {
        flight.progress += flight.speed;
        if (flight.progress > 1) flight.progress = 0;
        flight.material.uniforms.uProgress.value = flight.progress;
        // Places (arcs + travelling orbs) use the opposite color
        flight.material.uniforms.uColor.value.copy(oppColor);
        flight.orbMat.color.copy(oppColor);
        flight.orb.position.copy(flight.curve.getPointAt(flight.progress));
      });

      rings.forEach((ring) => {
        const s = 1 + Math.sin(elapsed * 2.5 + ring.phase) * 0.5 + 0.5;
        ring.mesh.scale.setScalar(s);
        ring.mat.opacity = Math.max(0, 0.8 - (s - 1) * 0.6);
        ring.mat.color.copy(oppColor); // rings opposite to globe
      });

      // Pins opposite to globe
      pins.forEach((p) => p.mat.color.copy(oppColor));

      // HTML overlay positioning projections
      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      const visibleLabels: any[] = [];

      CITIES.forEach((city, index) => {
        const el = labelRefs.current[index];
        if (!el) return;
        const locVec = latLngToVector3(city.lat, city.lng, earthRadius);
        const worldVec = locVec.clone().applyMatrix4(globeGroup.matrixWorld);
        const viewVec = camera.position.clone().sub(worldVec).normalize();
        const normVec = locVec.clone().applyQuaternion(globeGroup.quaternion).normalize();
        const factor = normVec.dot(viewVec);

        if (factor > 0.2) {
          const projected = worldVec.project(camera);
          const x = (projected.x * 0.5 + 0.5) * containerW;
          const y = (-(projected.y * 0.5) + 0.5) * containerH;
          visibleLabels.push({ x, y, index, opacity: Math.min(1, (factor - 0.2) * 8) });
          el.style.display = "block";
        } else {
          el.style.display = "none";
        }
      });

      visibleLabels.forEach(({ x, y, index, opacity }) => {
        const el = labelRefs.current[index];
        if (!el) return;
        el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
        el.style.opacity = `${opacity}`;
      });

      renderer.render(scene, camera);
    };
    tick();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.05 });
    visibilityObserver.observe(container);

    return () => {
      cancelAnimationFrame(animateId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
      dotTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative mx-auto block aspect-square w-full max-w-[480px] shrink-0 cursor-grab select-none overflow-visible active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      {/* Background Soft Glow Aura - Navy/Red blend */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full transition-all duration-700"
        style={{
          opacity: hovered ? 0.9 : 0.6,
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,31,63,0.12) 0%, rgba(255,0,0,0.03) 50%, transparent 70%)",
        }}
      />

      {/* Outer Dashed Orbit Design */}
      <div className="pointer-events-none absolute top-[4%] left-[4%] h-[92%] w-[92%] rounded-full border border-[#001F3F]/10" />
      <div className="pointer-events-none absolute top-[-1%] left-[-1%] h-[102%] w-[102%] animate-[spin_180s_linear_infinite] rounded-full border border-dashed border-[#FF0000]/20" />

      {/* The 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 block h-full w-full"
        style={{ outline: "none" }}
      />

      {/* Floating 2D Dom City tags */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {CITIES.map((city, index) => (
          <div
            key={city.name}
            ref={(el) => {
              labelRefs.current[index] = el;
            }}
            className="absolute top-0 left-0 hidden select-none will-change-transform"
            style={{ transform: "translate(-50%, -100%)" }}
          >
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 shadow-sm backdrop-blur-md ${
                city.isHub
                  ? "border-[#FF0000]/30 bg-white/95 text-[#FF0000]"
                  : "border-[#001F3F]/20 bg-white/90 text-[#001F3F]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  city.isHub ? "animate-ping bg-[#FF0000]" : "bg-[#001F3F]"
                }`}
              />
              <span className="whitespace-nowrap text-[11px] font-medium tracking-tight">
                {city.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}