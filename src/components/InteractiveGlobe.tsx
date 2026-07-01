import React, { useRef, useState, useEffect } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Group,
  SphereGeometry,
  MeshPhongMaterial,
  MeshLambertMaterial,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  LoadingManager,
  Color,
  Vector3,
  ShaderMaterial,
  DoubleSide,
  AdditiveBlending,
  BackSide,
  CatmullRomCurve3,
  TubeGeometry,
  RingGeometry,
  Material,
} from 'three';
import { Sparkles } from 'lucide-react';

const CITIES = [
  { name: 'Fly & Flourish', lng: 78.48, lat: 17.38, isHub: true },
  { name: 'United States', lng: -98.58, lat: 39.83, code: 'USA' },
  { name: 'United Kingdom', lng: -0.1, lat: 51.5, code: 'GBR' },
  { name: 'Canada', lng: -106.35, lat: 56.13, code: 'CAN' },
  { name: 'Australia', lng: 151.2, lat: -33.9, code: 'AUS' },
  { name: 'Germany', lng: 8.7, lat: 50.1, code: 'DEU' },
  { name: 'Ireland', lng: -6.26, lat: 53.35, code: 'IRL' }
];

// FIX 1: Changed (lng + 180) → (lng + 90) to compensate for earthMesh.rotation.y = -Math.PI / 2.
// The earth texture is rotated -90° on the mesh, so all pin/arc coordinates must
// shift their longitude reference by +90° to stay aligned with the visual texture.
function latLngToVector3(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 90) * (Math.PI / 180); // was (lng + 180) — that's the fix
  return new Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function InteractiveGlobe({ onSelectCountry }: { onSelectCountry?: (destId: string) => void } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState(false);
  const isVisibleRef = useRef(true);

  const handleCityClick = (city: typeof CITIES[number]) => {
    if (!onSelectCountry) return;
    const mapping: Record<string, string> = {
      'USA': 'usa',
      'GBR': 'uk',
      'CAN': 'canada',
      'AUS': 'australia',
      'DEU': 'germany'
    };
    const destId = mapping[city.code || ''] || mapping[city.name] || '';
    if (destId) {
      onSelectCountry(destId);
    }
  };


  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.6);

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const ambientLight = new AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    const sunLight = new DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const backLight = new DirectionalLight(0x3366ff, 0.3);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    const globeGroup = new Group();
    scene.add(globeGroup);

    const earthRadius = 2.1;
    const loadingManager = new LoadingManager();
    const textureLoader = new TextureLoader(loadingManager);
    const baseUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/';

    const earthGeo = new SphereGeometry(earthRadius, 64, 64);
    const earthMat = new MeshPhongMaterial({
      map: textureLoader.load(baseUrl + 'earth_atmos_2048.jpg'),
      specularMap: textureLoader.load(baseUrl + 'earth_specular_2048.jpg'),
      normalMap: textureLoader.load(baseUrl + 'earth_normal_2048.jpg'),
      specular: new Color(0x333333),
      shininess: 25,
    });
    const earthMesh = new Mesh(earthGeo, earthMat);
    earthMesh.rotation.y = -Math.PI / 2; // texture alignment offset
    globeGroup.add(earthMesh);

    const cloudGeo = new SphereGeometry(earthRadius * 1.01, 64, 64);
    const cloudMat = new MeshLambertMaterial({
      map: textureLoader.load(baseUrl + 'earth_clouds_1024.png'),
      transparent: true,
      opacity: 0.6,
      blending: AdditiveBlending,
      side: DoubleSide,
      depthWrite: false,
    });
    const cloudMesh = new Mesh(cloudGeo, cloudMat);
    cloudMesh.rotation.y = -Math.PI / 2;
    globeGroup.add(cloudMesh);

    const atmosphereGeo = new SphereGeometry(earthRadius * 1.03, 64, 64);
    const atmosphereMat = new ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 1.5;
        }
      `,
      blending: AdditiveBlending,
      side: BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // FIX 2: Flight animation sync.
    // Previously the shader used fract(uTime * 0.35) for the comet head position, while
    // the jet mesh used a separate flight.progress variable — these drifted apart.
    // Now both use the same uProgress uniform (0→1), set directly from flight.progress
    // each frame, so the cone and the comet head always coincide on the curve.
    const flights: {
      curve: CatmullRomCurve3;
      jetMesh: Mesh;
      lineMesh: Mesh;
      material: ShaderMaterial;
      progress: number;
      speed: number;
    }[] = [];

    const hubCity = CITIES.find((c) => c.isHub) || CITIES[0];

    CITIES.forEach((city) => {
      if (city.isHub) return;

      const curvePoints = [];
      const numSegments = 32;

      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        
        // Directly interpolate latitude and longitude to keep paths in the mid-latitudes
        const lat = hubCity.lat + (city.lat - hubCity.lat) * t;
        
        let lngDiff = city.lng - hubCity.lng;
        while (lngDiff < -180) lngDiff += 360;
        while (lngDiff > 180) lngDiff -= 360;
        const lng = hubCity.lng + lngDiff * t;

        // Hug the ground (flat on the sphere's surface)
        const point = latLngToVector3(lat, lng, earthRadius + 0.012);
        curvePoints.push(point);
      }

      const curve = new CatmullRomCurve3(curvePoints);
      const tubeGeo = new TubeGeometry(curve, 32, 0.004, 3, false);

      const initialProgress = Math.random(); // shared so shader and jet start at the same point

      const pathMaterial = new ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uProgress; // FIX: was uTime — now driven by flight.progress directly
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float percent = vUv.x;
            float progress = uProgress; // 0..1, same value used by the jet cone

            float distToHead = percent - progress;
            if (distToHead > 0.5) distToHead -= 1.0;
            if (distToHead < -0.5) distToHead += 1.0;

            float intensity = 0.0;
            float tailLength = 0.40;

            if (distToHead <= 0.0 && distToHead > -tailLength) {
              intensity = (distToHead + tailLength) / tailLength;
              intensity = pow(intensity, 2.0);
            }

            float baseLine = 0.08;
            float finalGlow = intensity + baseLine;
            float lateralFade = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);

            gl_FragColor = vec4(uColor, finalGlow * lateralFade * 1.5);
          }
        `,
        uniforms: {
          uProgress: { value: initialProgress }, // FIX: was uTime with random seed
          uColor: { value: new Color(0xff2222) },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      });

      const lineMesh = new Mesh(tubeGeo, pathMaterial);
      globeGroup.add(lineMesh);

      // Glowing orb: bright inner core + translucent outer shell (additive blending)
      const orbGroup = new Group();

      const coreGeo = new SphereGeometry(0.038, 6, 6);
      const coreMat = new MeshBasicMaterial({ color: 0xffffff });
      orbGroup.add(new Mesh(coreGeo, coreMat));

      const midGeo = new SphereGeometry(0.075, 6, 6);
      const midMat = new MeshBasicMaterial({
        color: 0xff6633,
        transparent: true,
        opacity: 0.55,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      orbGroup.add(new Mesh(midGeo, midMat));

      const outerGeo = new SphereGeometry(0.125, 6, 6);
      const outerMat = new MeshBasicMaterial({
        color: 0xff2200,
        transparent: true,
        opacity: 0.18,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      orbGroup.add(new Mesh(outerGeo, outerMat));

      globeGroup.add(orbGroup);

      flights.push({
        curve,
        jetMesh: orbGroup as unknown as Mesh,
        lineMesh,
        material: pathMaterial,
        progress: initialProgress,
        speed: 0.0020 + Math.random() * 0.0015,
      });
    });

    CITIES.forEach((city) => {
      const pos = latLngToVector3(city.lat, city.lng, earthRadius);
      const color = city.isHub ? 0xf59e0b : 0xef4444;

      const pinGeo = new SphereGeometry(0.025, 6, 6);
      const pinMat = new MeshBasicMaterial({ color });
      const pinMesh = new Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      const ringGeo = new RingGeometry(0.045, 0.055, 12);
      const ringMat = new MeshBasicMaterial({
        color,
        side: DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ringMesh = new Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);
    });

    // FIX 3: Updated initial rotation so Hyderabad (the hub at lng≈78.48°) faces the camera.
    // With the corrected coordinate mapping, lng=0 sits at +Z (camera direction).
    // Rotating the globe by -78.48° ≈ -1.37 rad brings Hyderabad to face forward.
    let targetRotationX = 0.30;
    let targetRotationY = -1.37; // was -1.35
    let rotationX = 0.30;
    let rotationY = -1.37;      // was -1.35
    let isDragging = false;
    let previousPoint = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      if (e.target && (e.target as HTMLElement).closest('#globe-labels-overlay')) {
        return;
      }
      e.preventDefault();
      isDragging = true;
      previousPoint = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - previousPoint.x;
      const dy = e.clientY - previousPoint.y;
      previousPoint = { x: e.clientX, y: e.clientY };
      const scaleModifier = 0.0042;
      targetRotationY += dx * scaleModifier;
      targetRotationX = Math.max(-1.1, Math.min(1.1, targetRotationX + dy * scaleModifier));
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animateId = 0;
    const tick = () => {
      // Skip rendering when globe is not visible — saves GPU/CPU during scrolling
      if (!isVisibleRef.current) {
        animateId = requestAnimationFrame(tick);
        return;
      }

      if (!isDragging) {
        targetRotationY += 0.0006;
      }

      const lerpSpeed = isDragging ? 0.15 : 0.032;
      rotationX += (targetRotationX - rotationX) * lerpSpeed;
      rotationY += (targetRotationY - rotationY) * lerpSpeed;

      globeGroup.rotation.x = rotationX;
      globeGroup.rotation.y = rotationY;
      cloudMesh.rotation.y += 0.0002;

      flights.forEach((flight) => {
        // Advance progress
        flight.progress += flight.speed;
        if (flight.progress > 1.0) flight.progress = 0.0;

        // FIX: push progress into the shader so the comet head tracks the jet exactly
        flight.material.uniforms.uProgress.value = flight.progress;

        // Position the glowing orb along the curve
        const point = flight.curve.getPointAt(flight.progress);
        flight.jetMesh.position.copy(point);
      });

      const containerW = container.clientWidth;
      const containerH = container.clientHeight;

      // --- Label positioning with overlap repulsion ---
      // 1. Project every city to screen space and collect visible ones
      const visibleLabels: { x: number; y: number; index: number; opacity: number }[] = [];

      CITIES.forEach((city, index) => {
        const el = labelRefs.current[index];
        if (!el) return;

        const locVec = latLngToVector3(city.lat, city.lng, earthRadius);
        const worldVec = locVec.clone().applyMatrix4(globeGroup.matrixWorld);
        const viewVec = camera.position.clone().sub(worldVec).normalize();
        const normVec = locVec.clone().applyQuaternion(globeGroup.quaternion).normalize();
        const factor = normVec.dot(viewVec);

        if (factor > 0.15) {
          const projected = worldVec.project(camera);
          const x = (projected.x * 0.5 + 0.5) * containerW;
          const y = (-(projected.y * 0.5) + 0.5) * containerH;
          visibleLabels.push({ x, y, index, opacity: Math.min(1.0, (factor - 0.15) * 7.5) });
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });

      // 2. Iterative repulsion — push overlapping labels apart
      //    Estimated label footprint: ~92px wide, 28px tall
      const LW = 92, LH = 28, GAP = 6;
      for (let iter = 0; iter < 3; iter++) {
        for (let i = 0; i < visibleLabels.length; i++) {
          for (let j = i + 1; j < visibleLabels.length; j++) {
            const a = visibleLabels[i];
            const b = visibleLabels[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const overlapX = LW + GAP - Math.abs(dx);
            const overlapY = LH + GAP - Math.abs(dy);
            if (overlapX > 0 && overlapY > 0) {
              // Separate along the axis with the smaller overlap (less disruptive)
              if (overlapX < overlapY) {
                const push = overlapX / 2 + 1;
                if (dx >= 0) { a.x -= push; b.x += push; }
                else          { a.x += push; b.x -= push; }
              } else {
                const push = overlapY / 2 + 1;
                if (dy >= 0) { a.y -= push; b.y += push; }
                else          { a.y += push; b.y -= push; }
              }
            }
          }
        }
      }

      // 3. Apply final resolved positions
      visibleLabels.forEach(({ x, y, index, opacity }) => {
        const el = labelRefs.current[index];
        if (!el) return;
        el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
        el.style.opacity = `${opacity}`;
      });

      renderer.render(scene, camera);
      animateId = requestAnimationFrame(tick);
    };

    tick();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryW, height: entryH } = entry.contentRect;
        camera.aspect = entryW / entryH;
        camera.updateProjectionMatrix();
        renderer.setSize(entryW, entryH);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });
    resizeObserver.observe(container);

    // Pause animation when globe is off-screen
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    return () => {
      cancelAnimationFrame(animateId);
      resizeObserver.unobserve(container);
      visibilityObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      earthGeo.dispose();
      earthMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();

      flights.forEach((f) => {
        if (f.jetMesh) {
          f.jetMesh.traverse((child) => {
            if (child instanceof Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((m: Material) => m.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        }
        if (f.lineMesh) {
          if (f.lineMesh.geometry) f.lineMesh.geometry.dispose();
        }
        if (f.material) {
          f.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-[280px] h-[280px] xs:w-[340px] xs:h-[340px] md:w-[450px] md:h-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      id="hero-3d-sculpture"
      style={{ touchAction: 'none' }}
    >
      <div
        className="absolute -inset-10 transition-all duration-700 pointer-events-none rounded-full"
        style={{
          opacity: hovered ? 1.0 : 0.8,
          background: `radial-gradient(circle 220px at 50% 50%, rgba(2, 28, 68, 0.4) 0%, rgba(1, 10, 24, 0.15) 65%, transparent 100%)`
        }}
      />

      <div className="absolute w-[95%] h-[95%] rounded-full border border-sky-400/10 pointer-events-none" />
      <div className="absolute w-[105%] h-[105%] rounded-full border border-dashed border-red-500/10 animate-[spin_120s_linear_infinite] pointer-events-none" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="absolute inset-0 pointer-events-none overflow-visible" id="globe-labels-overlay">
        {CITIES.map((city, index) => {
          const isClickable = !city.isHub && ['USA', 'GBR', 'CAN', 'AUS', 'DEU'].includes(city.code || '');
          return (
            <div
              key={city.name}
              ref={(el) => { labelRefs.current[index] = el; }}
              className={`absolute top-0 left-0 transition-opacity duration-150 select-none hidden pointer-events-auto group ${
                isClickable ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200' : ''
              }`}
              style={{ transform: 'translate(-50%, -100%)' }}
              onClick={() => {
                if (isClickable) {
                  handleCityClick(city);
                }
              }}
            >
              <div className={`flex flex-col items-center gap-0.5 bg-[#020d1c]/92 border ${
                city.isHub 
                  ? 'border-[#ffd700]/70' 
                  : isClickable 
                    ? 'border-[#ef4444]/60 hover:border-[#ff3535] hover:bg-[#03152e]/98 hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] transition-all duration-300' 
                    : 'border-[#ef4444]/45'
              } rounded-lg px-2.5 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md`}>
                <div className="flex items-center gap-1.5">
                  {city.isHub ? (
                    <span className="text-[#ffd700] text-[9.5px] font-bold">★ hub</span>
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${isClickable ? 'bg-[#ff3b3b]' : 'bg-gray-400'} animate-pulse`} />
                  )}
                  <span className="text-white text-[10px] font-semibold tracking-tight whitespace-nowrap">{city.name}</span>
                </div>
              </div>
              <div className={`w-0 h-0 border-l-[4.5px] border-l-transparent border-r-[4.5px] border-r-transparent border-t-[5.5px] ${
                isClickable ? 'border-t-[#020d1c] group-hover:border-t-[#03152e] transition-colors duration-300' : 'border-t-[#020d1c]'
              } mx-auto filter drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.65)]`} />
            </div>
          );
        })}
      </div>


    </div>
  );
}