import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';

// Target cities with actual geographic coordinates
const CITIES = [
  { name: 'Hyderabad', lng: 78.48, lat: 17.38, isHub: true },
  { name: 'United States', lng: -74.0, lat: 40.7, code: 'USA' },
  { name: 'United Kingdom', lng: -0.1, lat: 51.5, code: 'GBR' },
  { name: 'Canada', lng: -79.4, lat: 43.7, code: 'CAN' },
  { name: 'Australia', lng: 151.2, lat: -33.9, code: 'AUS' },
  { name: 'Germany', lng: 8.7, lat: 50.1, code: 'DEU' },
  { name: 'New Delhi', lng: 77.2, lat: 28.6, code: 'DEL' },
  { name: 'Ireland', lng: -6.26, lat: 53.35, code: 'IRL' }
];

// FIX 1: Changed (lng + 180) → (lng + 90) to compensate for earthMesh.rotation.y = -Math.PI / 2.
// The earth texture is rotated -90° on the mesh, so all pin/arc coordinates must
// shift their longitude reference by +90° to stay aligned with the visual texture.
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 90) * (Math.PI / 180); // was (lng + 180) — that's the fix
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const backLight = new THREE.DirectionalLight(0x3366ff, 0.3);
    backLight.position.set(-5, -3, -5);
    scene.add(backLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const earthRadius = 2.1;
    const textureLoader = new THREE.TextureLoader();
    const baseUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/';

    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load(baseUrl + 'earth_atmos_2048.jpg'),
      specularMap: textureLoader.load(baseUrl + 'earth_specular_2048.jpg'),
      normalMap: textureLoader.load(baseUrl + 'earth_normal_2048.jpg'),
      specular: new THREE.Color(0x333333),
      shininess: 25,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.y = -Math.PI / 2; // texture alignment offset
    globeGroup.add(earthMesh);

    const cloudGeo = new THREE.SphereGeometry(earthRadius * 1.01, 64, 64);
    const cloudMat = new THREE.MeshLambertMaterial({
      map: textureLoader.load(baseUrl + 'earth_clouds_1024.png'),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.rotation.y = -Math.PI / 2;
    globeGroup.add(cloudMesh);

    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.03, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
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
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // FIX 2: Flight animation sync.
    // Previously the shader used fract(uTime * 0.35) for the comet head position, while
    // the jet mesh used a separate flight.progress variable — these drifted apart.
    // Now both use the same uProgress uniform (0→1), set directly from flight.progress
    // each frame, so the cone and the comet head always coincide on the curve.
    const flights: {
      curve: THREE.CatmullRomCurve3;
      jetMesh: THREE.Mesh;
      lineMesh: THREE.Mesh;
      material: THREE.ShaderMaterial;
      progress: number;
      speed: number;
    }[] = [];

    const hubCity = CITIES.find((c) => c.isHub) || CITIES[0];

    CITIES.forEach((city) => {
      if (city.isHub) return;

      const p1 = latLngToVector3(hubCity.lat, hubCity.lng, earthRadius);
      const p2 = latLngToVector3(city.lat, city.lng, earthRadius);

      const curvePoints = [];
      const numSegments = 80;
      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const point = new THREE.Vector3().copy(p1).lerp(p2, t).normalize();
        // Tiny fixed offset lifts tube just above surface to avoid z-fighting
        point.multiplyScalar(earthRadius + 0.012);
        curvePoints.push(point);
      }

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.005, 6, false);

      const initialProgress = Math.random(); // shared so shader and jet start at the same point

      const pathMaterial = new THREE.ShaderMaterial({
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
          uColor: { value: new THREE.Color(0xff2222) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const lineMesh = new THREE.Mesh(tubeGeo, pathMaterial);
      globeGroup.add(lineMesh);

      // Glowing orb: bright inner core + translucent outer shell (additive blending)
      const orbGroup = new THREE.Group();

      const coreGeo = new THREE.SphereGeometry(0.022, 12, 12);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      orbGroup.add(new THREE.Mesh(coreGeo, coreMat));

      const midGeo = new THREE.SphereGeometry(0.042, 12, 12);
      const midMat = new THREE.MeshBasicMaterial({
        color: 0xff6633,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      orbGroup.add(new THREE.Mesh(midGeo, midMat));

      const outerGeo = new THREE.SphereGeometry(0.072, 12, 12);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0xff2200,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      orbGroup.add(new THREE.Mesh(outerGeo, outerMat));

      globeGroup.add(orbGroup);

      flights.push({
        curve,
        jetMesh: orbGroup as unknown as THREE.Mesh,
        lineMesh,
        material: pathMaterial,
        progress: initialProgress,
        speed: 0.0020 + Math.random() * 0.0015,
      });
    });

    CITIES.forEach((city) => {
      const pos = latLngToVector3(city.lat, city.lng, earthRadius);
      const color = city.isHub ? 0xf59e0b : 0xef4444;

      const pinGeo = new THREE.SphereGeometry(0.025, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      const ringGeo = new THREE.RingGeometry(0.045, 0.055, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
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
      for (let iter = 0; iter < 8; iter++) {
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

    return () => {
      cancelAnimationFrame(animateId);
      resizeObserver.unobserve(container);
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
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((m: THREE.Material) => m.dispose());
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
        {CITIES.map((city, index) => (
          <div
            key={city.name}
            ref={(el) => { labelRefs.current[index] = el; }}
            className="absolute top-0 left-0 transition-opacity duration-150 select-none hidden"
            style={{ transform: 'translate(-50%, -100%)' }}
          >
            <div className={`flex flex-col items-center gap-0.5 bg-[#020d1c]/92 border ${city.isHub ? 'border-[#ffd700]/70' : 'border-[#ef4444]/60'} rounded-lg px-2.5 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md`}>
              <div className="flex items-center gap-1.5">
                {city.isHub ? (
                  <span className="text-[#ffd700] text-[9.5px] font-bold">★ hub</span>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff3b3b] animate-pulse" />
                )}
                <span className="text-white text-[10px] font-semibold tracking-tight whitespace-nowrap">{city.name}</span>
              </div>
            </div>
            <div className="w-0 h-0 border-l-[4.5px] border-l-transparent border-r-[4.5px] border-r-transparent border-t-[5.5px] border-t-[#020d1c] mx-auto filter drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.65)]" />
          </div>
        ))}
      </div>


    </div>
  );
}