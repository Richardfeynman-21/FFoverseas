import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// -------------------------------------------------------------
// Shader Definitions
// -------------------------------------------------------------

// Sim Vertex Shader: Renders a full-screen quad
const simVertexShader = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Sim Fragment Shader: Handles physics advection, mouse interaction, and dissipation
const simFragmentShader = `
  uniform sampler2D u_prevTexture;
  uniform vec2 u_texelSize;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;
  uniform vec2 u_velocity;
  uniform float u_pushStrength;
  uniform float u_velocityDissipation;
  uniform float u_densityDissipation;
  uniform float u_radius;
  uniform float u_densityStrength;
  uniform float u_curl;
  varying vec2 v_uv;

  // Segment SDF to compute distance of current pixel to the mouse movement path
  float sdSegment(in vec2 p, in vec2 a, in vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    // 1. Fluid Advection
    // Read previous frame's velocity (stored in .rg) and use it to advect
    vec2 prevVel = texture2D(u_prevTexture, v_uv).rg - 0.5;
    vec2 advectedUv = v_uv - prevVel * u_texelSize * 1.5;
    
    // Clamp advected UVs to prevent border bleeding
    advectedUv = clamp(advectedUv, vec2(0.001), vec2(0.999));
    vec4 data = texture2D(u_prevTexture, advectedUv);
    
    // Decode velocity back to signed float
    vec2 velocity = data.rg - 0.5;
    float density = data.b;

    // 2. Curl / Vorticity — adds rotational turbulence
    float L = texture2D(u_prevTexture, v_uv - vec2(u_texelSize.x, 0.0)).g;
    float R = texture2D(u_prevTexture, v_uv + vec2(u_texelSize.x, 0.0)).g;
    float T = texture2D(u_prevTexture, v_uv + vec2(0.0, u_texelSize.y)).g;
    float B = texture2D(u_prevTexture, v_uv - vec2(0.0, u_texelSize.y)).g;
    float vorticity = R - L - T + B;
    velocity += u_curl * vec2(abs(T) - abs(B), abs(R) - abs(L)) * sign(vorticity) * 0.05;

    // 3. Mouse Interaction
    // Compute distance to mouse segment in UV space
    float dist = sdSegment(v_uv, u_prevMouse, u_mouse);
    
    // Add velocity and density based on proximity
    float force = smoothstep(u_radius, 0.0, dist);
    velocity += u_velocity * force * u_pushStrength;
    density += force * u_densityStrength;

    // 4. Dissipation
    velocity *= u_velocityDissipation;
    density *= u_densityDissipation;

    // Encode velocity back to unsigned float (0.0 to 1.0)
    gl_FragColor = vec4(velocity + 0.5, density, 1.0);
  }
`;

// Render Vertex Shader
const renderVertexShader = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Render Fragment Shader: Computes normals from density, calculates specular and chromatic aberration
// The rainbow effect is driven by u_rgbShift and u_shade which are dynamically
// computed from mouse velocity magnitude — fast movement = vivid rainbow
const renderFragmentShader = `
  uniform sampler2D u_simTexture;
  uniform vec2 u_texelSize;
  uniform float u_rgbShift;
  uniform float u_shade;
  uniform float u_velMagnitude;
  varying vec2 v_uv;

  void main() {
    // Read simulation data
    vec4 simData = texture2D(u_simTexture, v_uv);
    float density = simData.b;
    vec2 vel = simData.rg - 0.5;
    
    if (density < 0.003) {
      discard;
    }

    // Sample density values around the current pixel to calculate the normal vector
    float dL = texture2D(u_simTexture, v_uv - vec2(u_texelSize.x * 2.0, 0.0)).b;
    float dR = texture2D(u_simTexture, v_uv + vec2(u_texelSize.x * 2.0, 0.0)).b;
    float dU = texture2D(u_simTexture, v_uv + vec2(0.0, u_texelSize.y * 2.0)).b;
    float dD = texture2D(u_simTexture, v_uv - vec2(0.0, u_texelSize.y * 2.0)).b;

    // Compute surface normal from gradients
    // The multiplier controls the visual "steepness" / refraction index of the glass
    vec3 normal = normalize(vec3((dL - dR) * 18.0, (dD - dU) * 18.0, 0.08));

    // 1. Specular Highlights (phong-like reflection)
    vec3 lightDir = normalize(vec3(1.2, 1.5, 2.5));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 28.0) * u_shade;

    // 2. Chromatic Aberration / Rainbow Dispersion (Lusion's sine wave formula)
    // This is the KEY rainbow effect — uses normal projection through sin() with
    // phase offsets to create RGB channel separation, simulating light dispersion
    // through glass/prism.
    // u_rgbShift dynamically scales with velocity — fast mouse = vivid rainbow
    float normalProjection = normal.x + normal.y;
    
    // The sin() creates the rainbow spectrum, phase offsets (0, 2, 4) separate RGB channels
    // The frequency (35.0) controls how many rainbow bands appear
    vec3 rainbow = sin(
      vec3(normalProjection) * 35.0 + 
      vec3(0.0, 2.094, 4.188) * u_rgbShift
    ) * 0.5 + 0.5;

    // Also add velocity-based hue shifting for extra vibrancy
    float velAngle = atan(vel.y, vel.x);
    vec3 velRainbow = sin(
      vec3(velAngle) * 3.0 + 
      vec3(0.0, 2.094, 4.188)
    ) * 0.5 + 0.5;

    // Blend both rainbow sources — velocity rainbow adds color even in flat areas
    float rainbowIntensity = clamp(u_velMagnitude * 8.0, 0.0, 1.0);
    vec3 chromatic = mix(rainbow, velRainbow, rainbowIntensity * 0.3);

    // 3. Composite Shading
    // Mix between white (no color) and rainbow based on velocity + density
    // Higher velocityMix = more vivid rainbow
    float velocityMix = clamp(u_velMagnitude * 6.0 + density * 0.5, 0.15, 0.85);
    vec3 tint = mix(vec3(1.0), chromatic, velocityMix);
    
    // Add specular reflection onto the glass shape
    vec3 finalColor = tint * 0.85 + vec3(spec * 0.95);
    
    // Enhance saturation in high-velocity areas
    float grey = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(grey), finalColor, 1.0 + rainbowIntensity * 0.5);

    // Alpha: high density + specular + chromatic all contribute to opacity
    float edgeAlpha = smoothstep(0.0, 0.2, density);
    float chromaticAlpha = length(chromatic - 0.5) * 0.15;
    float alpha = edgeAlpha * (0.08 + spec * 0.8 + chromaticAlpha);

    // Apply color clamp to prevent over-exposure
    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), clamp(alpha, 0.0, 0.9));
  }
`;

// -------------------------------------------------------------
// React Component
// -------------------------------------------------------------

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Keep track of mouse coordinates and velocities
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const prevMouse = useRef({ x: 0.5, y: 0.5 });
  const velocity = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  
  // Smoothed velocity magnitude for rainbow intensity (lerped for smooth transitions)
  const smoothVelMag = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Initialize Renderer
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Setup Scenes & Cameras
    // Orthographic camera covering the normalized [-1, 1] screen space
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const simScene = new THREE.Scene();
    const renderScene = new THREE.Scene();

    // 3. Double-Buffering Render Targets (Ping-Pong FBOs)
    // Low resolution rendering target for performance and smoother fluid simulation diffusion
    const simWidth = Math.floor(width / 4);
    const simHeight = Math.floor(height / 4);
    
    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };

    let rtA = new THREE.WebGLRenderTarget(simWidth, simHeight, rtOptions);
    let rtB = new THREE.WebGLRenderTarget(simWidth, simHeight, rtOptions);

    // Clear initial render targets to midtone (neutral velocity)
    const initialData = new Float32Array(simWidth * simHeight * 4);
    for (let i = 0; i < initialData.length; i += 4) {
      initialData[i] = 0.5;     // Neutral velocity X
      initialData[i + 1] = 0.5; // Neutral velocity Y
      initialData[i + 2] = 0.0; // Density
      initialData[i + 3] = 1.0;
    }
    
    const initialTexture = new THREE.DataTexture(
      initialData,
      simWidth,
      simHeight,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    initialTexture.needsUpdate = true;

    // Initialize targets with neutral values
    renderer.setRenderTarget(rtA);
    renderer.clear();
    renderer.setRenderTarget(rtB);
    renderer.clear();

    // 4. Create Geometries and Materials
    const quadGeometry = new THREE.PlaneGeometry(2, 2);

    // Simulation Material Setup (using ShaderMaterial — auto-injects precision + attributes)
    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: simVertexShader,
      fragmentShader: simFragmentShader,
      uniforms: {
        u_prevTexture: { value: initialTexture },
        u_texelSize: { value: new THREE.Vector2(1 / simWidth, 1 / simHeight) },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_velocity: { value: new THREE.Vector2(0.0, 0.0) },
        u_pushStrength: { value: 7.0 },
        u_velocityDissipation: { value: 0.975 },
        u_densityDissipation: { value: 0.94 },
        u_radius: { value: 0.018 },
        u_densityStrength: { value: 0.85 },
        u_curl: { value: 0.35 },
      },
      depthWrite: false,
      depthTest: false,
    });

    const simMesh = new THREE.Mesh(quadGeometry, simMaterial);
    simScene.add(simMesh);

    // Final Rendering Material Setup
    const renderMaterial = new THREE.ShaderMaterial({
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      uniforms: {
        u_simTexture: { value: null },
        u_texelSize: { value: new THREE.Vector2(1 / simWidth, 1 / simHeight) },
        u_rgbShift: { value: 0.0 },
        u_shade: { value: 0.0 },
        u_velMagnitude: { value: 0.0 },
      },
      depthWrite: false,
      depthTest: false,
      transparent: true,
    });

    const renderMesh = new THREE.Mesh(quadGeometry, renderMaterial);
    renderScene.add(renderMesh);

    // 5. Track Mouse Input Events
    const handleMouseMove = (e: MouseEvent) => {
      hasMoved.current = true;
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;
      
      // Normalize to [0, 1] UV coordinates
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1.0 - (e.clientY / window.innerHeight);

      // Compute velocity
      velocity.current.x = mouse.current.x - prevMouse.current.x;
      velocity.current.y = mouse.current.y - prevMouse.current.y;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      hasMoved.current = true;
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;
      
      mouse.current.x = e.touches[0].clientX / window.innerWidth;
      mouse.current.y = 1.0 - (e.touches[0].clientY / window.innerHeight);

      velocity.current.x = mouse.current.x - prevMouse.current.x;
      velocity.current.y = mouse.current.y - prevMouse.current.y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 6. Handle Window Resizing
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      renderer.setSize(w, h);
      
      const sW = Math.floor(w / 4);
      const sH = Math.floor(h / 4);

      rtA.setSize(sW, sH);
      rtB.setSize(sW, sH);
      
      simMaterial.uniforms.u_texelSize.value.set(1 / sW, 1 / sH);
      renderMaterial.uniforms.u_texelSize.value.set(1 / sW, 1 / sH);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Animation Loop
    let animationId = 0;
    
    const tick = () => {
      // ── Compute dynamic rainbow parameters from velocity ──
      const velX = velocity.current.x;
      const velY = velocity.current.y;
      const rawVelMag = Math.sqrt(velX * velX + velY * velY);
      
      // Smooth the velocity magnitude with lerp for graceful rainbow fade
      smoothVelMag.current += (rawVelMag - smoothVelMag.current) * 0.15;
      const velMag = smoothVelMag.current;
      
      // u_rgbShift: Controls RGB channel phase separation
      // At rest (velMag≈0) → 0.3 (subtle shimmer)
      // At full speed → 2.5 (vivid rainbow dispersion)
      const rgbShift = 0.3 + velMag * 180.0;
      const clampedRgbShift = Math.min(rgbShift, 2.8);
      
      // u_shade: Controls specular highlight intensity
      // At rest → 0.6 (soft highlights)
      // At full speed → 2.2 (bright, glass-like reflections)
      const shade = 0.6 + velMag * 120.0;
      const clampedShade = Math.min(shade, 2.5);
      
      // ── Set simulation uniforms ──
      simMaterial.uniforms.u_mouse.value.set(mouse.current.x, mouse.current.y);
      simMaterial.uniforms.u_prevMouse.value.set(prevMouse.current.x, prevMouse.current.y);
      
      if (hasMoved.current) {
        simMaterial.uniforms.u_velocity.value.set(velX, velY);
      } else {
        simMaterial.uniforms.u_velocity.value.set(0.0, 0.0);
      }
      
      simMaterial.uniforms.u_prevTexture.value = rtA.texture;

      // ── Set render uniforms (dynamic per-frame!) ──
      renderMaterial.uniforms.u_rgbShift.value = clampedRgbShift;
      renderMaterial.uniforms.u_shade.value = clampedShade;
      renderMaterial.uniforms.u_velMagnitude.value = velMag;

      // Stage A: Render the simulation state to Target B (RTB)
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);

      // Stage B: Render final composite scene using RTB simulation texture to Canvas
      renderer.setRenderTarget(null);
      renderMaterial.uniforms.u_simTexture.value = rtB.texture;
      renderer.render(renderScene, camera);

      // Ping-pong render targets for feedback loop
      const temp = rtA;
      rtA = rtB;
      rtB = temp;

      // Slow down velocity slightly each frame if mouse isn't moving
      velocity.current.x *= 0.85;
      velocity.current.y *= 0.85;
      
      // Update prevMouse coordinates to slowly catch up
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;
      
      hasMoved.current = false;

      animationId = requestAnimationFrame(tick);
    };

    tick();

    // 8. Clean Up on Unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose Geometries & Materials
      quadGeometry.dispose();
      simMaterial.dispose();
      renderMaterial.dispose();
      
      // Dispose RenderTargets
      rtA.dispose();
      rtB.dispose();
      initialTexture.dispose();
      
      // Dispose Renderer
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="liquid-glass-cursor-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'normal',
      }}
    />
  );
}
