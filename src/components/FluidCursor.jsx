import React, { useEffect, useRef } from 'react';
import { initFluid as originalInitFluid } from 'smokey-fluid-cursor';

// Wrapper to support both initFluid(config) and initFluid(canvasElement, config) signatures
// and map UPPERCASE configs to library's camelCase parameters.
const initFluid = (canvas, config) => {
  const targetConfig = (canvas && typeof canvas === 'object' && !canvas.tagName)
    ? canvas
    : { ...config, id: canvas?.id || config?.id || 'smokey-fluid-canvas' };

  const mappedConfig = {
    ...targetConfig,
    id: targetConfig.id,
    simResolution: targetConfig.SIM_RESOLUTION ?? targetConfig.simResolution,
    dyeResolution: targetConfig.DYE_RESOLUTION ?? targetConfig.dyeResolution,
    densityDissipation: targetConfig.DENSITY_DISSIPATION ?? targetConfig.densityDissipation,
    velocityDissipation: targetConfig.VELOCITY_DISSIPATION ?? targetConfig.velocityDissipation,
    pressure: targetConfig.PRESSURE ?? targetConfig.pressure,
    pressureIteration: targetConfig.PRESSURE_ITERATIONS ?? targetConfig.pressureIteration,
    curl: targetConfig.CURL ?? targetConfig.curl,
    splatRadius: targetConfig.SPLAT_RADIUS ?? targetConfig.splatRadius,
    splatForce: targetConfig.SPLAT_FORCE ?? targetConfig.splatForce,
    shading: targetConfig.SHADING ?? targetConfig.shading,
    colorUpdateSpeed: targetConfig.COLOR_UPDATE_SPEED ?? targetConfig.colorUpdateSpeed,
    backColor: targetConfig.BACK_COLOR ?? targetConfig.backColor,
    transparent: targetConfig.TRANSPARENT ?? targetConfig.transparent,
  };

  return originalInitFluid(mappedConfig);
};

export default function FluidCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Mobile optimization: prevent running on touch-only devices
    if (window.matchMedia('(pointer: fine)').matches) {
      const cursor = initFluid(canvasRef.current, {

        // ── Simulation Quality ─────────────────────────────────
        SIM_RESOLUTION:      128,   // keep at 128 — enough for smooth physics
        DYE_RESOLUTION:      1440,  // ↑ higher than default → crisper, glassier trails

        // ── Fluid Behaviour ────────────────────────────────────
        DENSITY_DISSIPATION: 4.5,   // ↑ faster fade → clean glass evaporation look
        VELOCITY_DISSIPATION: 0.92, // motion slows down naturally, not abruptly
        PRESSURE:            0.8,
        PRESSURE_ITERATIONS: 30,    // ↑ more solver steps → glass-smooth accurate flow

        // ── Movement Character ─────────────────────────────────
        CURL:                1,     // ↓↓ KEY — near-zero = viscous glass pour, no chaos
        SPLAT_RADIUS:        0.18,  // moderate pour size per cursor movement
        SPLAT_FORCE:         8000,  // ↑ strong — dramatic glass pour energy

        // ── Visual ─────────────────────────────────────────────
        SHADING:             true,  // KEY — adds 3D depth/dimensionality to the fluid
        COLORFUL:            true,  // iridescent colour shifts as fluid moves
        COLOR_UPDATE_SPEED:  8,

        // ── Background ─────────────────────────────────────────
        BACK_COLOR:          { r: 0, g: 0, b: 0 },
        TRANSPARENT:         true,  // overlay mode — your site shows through

        // ── Bloom (the glass luminosity/glow) ──────────────────
        BLOOM:               true,
        BLOOM_ITERATIONS:    8,
        BLOOM_RESOLUTION:    512,   // ↑ crisper glow edges (default is 256)
        BLOOM_INTENSITY:     0.7,   // strong enough to look luminous
        BLOOM_THRESHOLD:     0.4,   // ↓ lower = more of the fluid catches the glow
        BLOOM_SOFT_KNEE:     0.5,

        // ── Sunrays (light-through-glass refraction) ───────────
        SUNRAYS:             true,
        SUNRAYS_WEIGHT:      1.5,   // ↑ stronger light shafts through the fluid
        SUNRAYS_RESOLUTION:  196,

      });

      return () => {
        if (cursor && typeof cursor.destroy === 'function') {
          cursor.destroy();
        }
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="smokey-fluid-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
