import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { logoPaths } from './logoPaths';

interface LoadingScreenProps {
  onComplete: () => void;
}

// Bezier curve control points (matching coordinate system of FFlogo.svg)
const P0 = { x: 171.146, y: 325.333 }; // Start
const P1 = { x: 207.881, y: 331.513 }; // Control 1
const P2 = { x: 320, y: 331.142 };     // Control 2
const P3 = { x: 471, y: 276.893 };     // End

// Evaluates a cubic Bezier curve at parameter t (0 to 1)
function getBezierPoint(t: number) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * P0.x + 3 * mt2 * t * P1.x + 3 * mt * t2 * P2.x + t3 * P3.x,
    y: mt3 * P0.y + 3 * mt2 * t * P1.y + 3 * mt * t2 * P2.y + t3 * P3.y,
  };
}

// Evaluates the derivative (tangent vector) of a cubic Bezier curve at parameter t
function getBezierDerivative(t: number) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;

  return {
    x: 3 * mt2 * (P1.x - P0.x) + 6 * mt * t * (P2.x - P1.x) + 3 * t2 * (P3.x - P2.x),
    y: 3 * mt2 * (P1.y - P0.y) + 6 * mt * t * (P2.y - P1.y) + 3 * t2 * (P3.y - P2.y),
  };
}

// Evaluates the tangent angle in radians at parameter t
function getBezierTangentAngle(t: number) {
  const der = getBezierDerivative(t);
  return Math.atan2(der.y, der.x);
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [success, setSuccess] = useState(false);
  const [phase, setPhase] = useState<'loading' | 'success' | 'reveal-text' | 'done'>('loading');
  const [displayProgress, setDisplayProgress] = useState(0);
  
  // Motion value for parameter t along the flight curve (0 to 1)
  const tMotion = useMotionValue(0);

  // Synchronize motion value with local state for HUD display
  useEffect(() => {
    return tMotion.on('change', (val) => {
      setDisplayProgress(Math.round(val * 100));
    });
  }, [tMotion]);

  // Automatic takeoff flight animation loop on mount
  useEffect(() => {
    let flightAnimation: { stop: () => void } | null = null;
    
    // Deliberate starting delay for loading initialization effect
    const delayTimer = setTimeout(() => {
      flightAnimation = animate(tMotion, 1, {
        duration: 3.2,
        ease: [0.76, 0, 0.175, 1], // Extra smooth, gradual deceleration curve
        onComplete: () => {
          setSuccess(true);
          setPhase('success');
        }
      });
    }, 500);

    return () => {
      clearTimeout(delayTimer);
      if (flightAnimation) flightAnimation.stop();
    };
  }, [tMotion]);

  // Compute translation and rotation dynamically to guide the jet plane along the curve
  const planeTransform = useTransform(tMotion, (t) => {
    const pt = getBezierPoint(t);
    const angleRad = getBezierTangentAngle(t);
    const angleDeg = angleRad * (180 / Math.PI);
    
    // The baked SVG path for the plane is centered at P3 (t=1).
    // Its baked rotation matches the tangent angle at t=1, which is approximately -19.78 degrees.
    const refPt = { x: 471, y: 276.893 };
    const refAngleDeg = -19.7818;
    
    const dAngle = angleDeg - refAngleDeg;
    
    // Graphic Pipeline: Shift to origin, rotate relative angle, shift to target coordinates on curve
    return `translate(${pt.x}px, ${pt.y}px) rotate(${dAngle}deg) translate(${-refPt.x}px, ${-refPt.y}px)`;
  });

  // Glow gradient sweep coordinates
  const glowX1 = useTransform(tMotion, [0, 1], [100, 420]);
  const glowX2 = useTransform(tMotion, [0, 1], [150, 470]);

  // Exit transition curve for curtain-wipe
  const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black select-none overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #001020 0%, #000000 100%)',
      }}
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 1.2, ease: 'easeInOut' },
      }}
    >

      {/* DYNAMIC HUD STATE */}
      <motion.div
        className="absolute top-8 right-8 md:top-12 md:right-12 flex flex-col items-end pointer-events-none"
        exit={{ opacity: 0, y: -15, transition: { duration: 0.6, ease: 'easeOut' } }}
      >
        <span className="text-[9px] text-[#FF0000] tracking-[0.3em] uppercase font-medium">
          {success ? 'TAKEOFF SUCCESS' : 'FLIGHT IN PROGRESS'}
        </span>
      </motion.div>

      {/* CORE CANVAS CONTAINER */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <motion.div
          className="relative w-full max-w-[500px] aspect-square flex items-center justify-center"
          exit={{
            scale: 4.5,
            opacity: 0,
            filter: 'blur(10px)',
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full select-none overflow-visible"
          >
            {/* SVG definitions for masks */}
            <defs>
              {/* Glowing gradient that sweeps from left to right */}
              <motion.linearGradient
                id="glow-grad"
                x1={glowX1}
                y1="0"
                x2={glowX2}
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="white" stopOpacity={1} />
                <stop offset="100%" stopColor="white" stopOpacity={0} />
              </motion.linearGradient>

              {/* Simple gradient sweep mask with no cutouts */}
              <mask id="glow-sweep-mask">
                <rect width="600" height="600" fill="url(#glow-grad)" />
              </mask>

              {/* 1. Mask path that sweeps along the Bezier curve white-on-black */}
              <mask id="swoosh-mask">
                <motion.path
                  d="M 171.146 325.333 C 207.881 331.513, 320 331.142, 471 276.893"
                  fill="none"
                  stroke="white"
                  strokeWidth={60}
                  strokeLinecap="round"
                  style={{ pathLength: tMotion }}
                />
              </mask>

            </defs>

            {/* A. Base Monogram Logo (F1 & F2) - Static Dim Layer */}
            <g id="brand-emblem-dim">
              <path d={logoPaths.f1} fill="rgba(255, 255, 255, 0.15)" />
              <path d={logoPaths.f2} fill="rgba(255, 255, 255, 0.15)" />
            </g>

            {/* B. Overlapping Interlocking Patches - Static Dim Layer */}
            <g id="brand-emblem-patches-dim">
              <path d="M219 298L171 288H219V298Z" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth={0.5} />
              <path d="M353 299L316 296H353V299Z" fill="rgba(255, 255, 255, 0.15)" />
              <path d="M353 291L316 296H353V291Z" fill="rgba(255, 255, 255, 0.15)" />
              <path d="M252 330C255.5 330 218.5 335 218.5 335H198V330H252Z" fill="rgba(255, 255, 255, 0.15)" />
              <path d="M368 310C353.6 317.8 338 319.75 332 319.75V323H353C354.833 322.278 360.4 318.667 368 310Z" fill="rgba(255, 255, 255, 0.15)" />
            </g>

            {/* C. Red Swoosh Trail (Hidden/Revealed by the Bezier mask) */}
            <g mask="url(#swoosh-mask)">
              <motion.path
                d={logoPaths.swoosh}
                fill="#FF0000"
                animate={success ? {
                  filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))',
                } : {
                  filter: 'none',
                }}
                transition={{ duration: 0.8 }}
              />
            </g>

            {/* D. Glowing Monogram Logo - Double-masked to keep cuts 100% clean and free of bleed/gradient artifacts */}
            <g mask="url(#glow-sweep-mask)">
              <motion.g id="brand-emblem-glow" style={{ opacity: tMotion }}>
                <path
                  d={logoPaths.f1}
                  fill="#FFFFFF"
                  filter="drop-shadow(0 0 12px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))"
                />
                <path
                  d={logoPaths.f2}
                  fill="#FFFFFF"
                  filter="drop-shadow(0 0 12px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))"
                />
              </motion.g>
            </g>

            {/* E. Glowing Overlapping Patches (Triangles only) - Double-masked to keep interlocking splits clean */}
            <g mask="url(#glow-sweep-mask)">
              <motion.g id="brand-emblem-patches-glow" style={{ opacity: tMotion }}>
                <path
                  d="M219 298L171 288H219V298Z"
                  fill="#FFFFFF"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  filter="drop-shadow(0 0 12px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))"
                />
                <path
                  d="M353 299L316 296H353V299Z"
                  fill="#FFFFFF"
                  filter="drop-shadow(0 0 12px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))"
                />
                <path
                  d="M353 291L316 296H353V291Z"
                  fill="#FFFFFF"
                  filter="drop-shadow(0 0 12px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))"
                />
              </motion.g>
            </g>

            {/* D. Jet Plane Silhouette (Flies along the curve) */}
            <motion.g
              style={{
                transform: planeTransform,
              }}
            >
              <path
                d={logoPaths.plane}
                fill="#FFFFFF"
                filter="drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))"
              />
            </motion.g>

            {/* E. Graduation Cap (Drops and bounces onto Left F on success) */}
            <motion.path
              d={logoPaths.cap}
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth={0.6}
              initial={{ y: -300, opacity: 0 }}
              animate={success ? { y: 0, opacity: 1 } : { y: -300, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 11,
                mass: 0.7,
                delay: 0.15,
              }}
              onAnimationComplete={() => {
                if (success) {
                  setPhase('reveal-text');
                }
              }}
              style={{ pointerEvents: 'none' }}
            />

            {/* F. Typography reveals sequentially after the cap lands */}
            <g id="logo-texts" style={{ pointerEvents: 'none' }}>
              {/* Fly & Flourish */}
              <motion.path
                d={logoPaths.fly}
                fill="#FFFFFF"
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === 'reveal-text' || phase === 'done'
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              />

              {/* Overseas Consultants */}
              <motion.path
                d={logoPaths.overseas}
                fill="#FFFFFF"
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === 'reveal-text' || phase === 'done'
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              />

              {/* Tagline: Your Vision, Our Mission */}
              <motion.path
                d={logoPaths.tagline}
                fill="rgba(255, 255, 255, 0.65)"
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === 'reveal-text' || phase === 'done'
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
                onAnimationComplete={() => {
                  if (phase === 'reveal-text') {
                    setPhase('done');
                    setTimeout(() => {
                      onComplete();
                    }, 800);
                  }
                }}
              />
            </g>
          </svg>
        </motion.div>
      </div>

      {/* CONTEXTUAL STATUS HELP TEXT */}
      <motion.div
        className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
      >
        <motion.p
          animate={{ opacity: success ? 0 : [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-[9px] text-white/50 tracking-[0.25em] uppercase font-light"
        >
          {displayProgress < 15 ? 'Calibrating systems...' : 'Simulating international trajectories...'}
        </motion.p>
      </motion.div>

      {/* BOTTOM HUD - PROGRESS BAR & DATA COUNTER */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-8 md:pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        exit={{ opacity: 0, y: 15, transition: { duration: 0.6, ease: 'easeOut' } }}
      >
        <div className="flex items-end justify-between mb-3">
          <span
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
              letterSpacing: '0.28em',
              fontSize: '9px',
            }}
            className="text-white/25 uppercase"
          >
            System Status: {displayProgress === 100 ? 'Takeoff Confirmed' : 'Pre-flight Check'}
          </span>

          <span
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
              fontWeight: 300,
              fontSize: '13px',
              letterSpacing: '0.05em',
              fontVariantNumeric: 'tabular-nums',
              minWidth: '3ch',
              textAlign: 'right',
            }}
            className="text-white"
          >
            {String(displayProgress).padStart(2, '0')}%
          </span>
        </div>

        {/* Thin progress track */}
        <div className="relative w-full h-px bg-white/10 overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#FF0000]"
            style={{ width: `${displayProgress}%` }}
          />
          {/* Active glow trail on leading edge */}
          <motion.div
            className="absolute top-0 h-full pointer-events-none"
            style={{
              width: '60px',
              left: `calc(${displayProgress}% - 60px)`,
              background: 'linear-gradient(to right, transparent, rgba(255, 0, 0, 0.45))',
            }}
          />
        </div>
      </motion.div>

      {/* CORNER BRACKET MARKS */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos, i) => (
        <motion.div
          key={pos}
          className="absolute pointer-events-none"
          style={{
            width: 14,
            height: 14,
            ...(pos === 'tl' && { top: 24, left: 24, borderTop: '1px solid rgba(255,255,255,0.12)', borderLeft: '1px solid rgba(255,255,255,0.12)' }),
            ...(pos === 'tr' && { top: 24, right: 24, borderTop: '1px solid rgba(255,255,255,0.12)', borderRight: '1px solid rgba(255,255,255,0.12)' }),
            ...(pos === 'bl' && { bottom: 24, left: 24, borderBottom: '1px solid rgba(255,255,255,0.12)', borderLeft: '1px solid rgba(255,255,255,0.12)' }),
            ...(pos === 'br' && { bottom: 24, right: 24, borderBottom: '1px solid rgba(255,255,255,0.12)', borderRight: '1px solid rgba(255,255,255,0.12)' }),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
        />
      ))}
    </motion.div>
  );
}