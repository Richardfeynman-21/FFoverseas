import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import OriginalLogo from './OriginalLogo';

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
}

const BRAND_CHARS = 'Fly & Flourish'.split('');
const TAGLINE = 'OVERSEAS CONSULTANTS';

// Custom easing — snappy decelerate, Lusion-style
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'loading' | 'done'>('intro');
  const progressRef = useRef(0);

  // Phase 1: intro — wait for typography reveal
  useEffect(() => {
    const t = setTimeout(() => setPhase('loading'), 600);
    return () => clearTimeout(t);
  }, []);

  // Phase 2: animate progress
  useEffect(() => {
    if (phase !== 'loading') return;

    const DURATION = 2600; // ms
    const TICK = 16; // ~60fps
    const start = performance.now();

    const raf = (now: number) => {
      const elapsed = now - start;
      // Ease-in-out curve so it doesn't feel mechanical
      const t = Math.min(elapsed / DURATION, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const val = eased * 100;
      progressRef.current = val;
      setProgress(val);

      if (t < 1) {
        requestAnimationFrame(raf);
      } else {
        setPhase('done');
        setTimeout(() => onComplete(), 500);
      }
    };

    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [phase, onComplete]);

  const displayNum = Math.min(100, Math.round(progress));

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{
        // Curtain-wipe upward — the signature Lusion exit
        y: '-100%',
        transition: { duration: 1, ease: EASE_IN_OUT_QUART },
      }}
    >
      {/*
        ─────────────────────────────────────────────
        SCAN LINE — a single horizontal red line that
        travels top → bottom once, like a boot scan.
        Pure signal, zero noise.
        ─────────────────────────────────────────────
      */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'rgba(255,0,0,0.55)' }}
        initial={{ top: '0%', opacity: 0 }}
        animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
        transition={{ delay: 0.7, duration: 2.2, ease: 'linear', times: [0, 0.05, 0.9, 1] }}
      />

      {/*
        ─────────────────────────────────────────────
        MAIN CONTENT — vertically centered
        ─────────────────────────────────────────────
      */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">

        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.9, ease: EASE_OUT_EXPO }}
          className="mb-8 md:mb-10"
        >
          <OriginalLogo
            className="invert brightness-200"
            showText={false}
            showGlobeBg={false}
            size="52px"
          />
        </motion.div>

        {/* Brand name — character-by-character staggered reveal from below */}
        <div
          className="flex overflow-hidden mb-3 md:mb-4"
          aria-label="Fly & Flourish"
        >
          {BRAND_CHARS.map((char, i) => (
            <motion.span
              key={i}
              className="text-white text-3xl md:text-[3.25rem] font-light leading-none"
              style={{
                fontFamily:
                  "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                letterSpacing: '0.12em',
                display: 'inline-block',
              }}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                delay: 0.25 + i * 0.038,
                duration: 0.75,
                ease: EASE_OUT_EXPO,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* Tagline — thin white, tight tracking, fades in after name finishes */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.7, ease: EASE_OUT_EXPO }}
          style={{
            fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif",
            letterSpacing: '0.38em',
            fontSize: '9px',
          }}
          className="text-white font-medium uppercase"
        >
          {TAGLINE}
        </motion.p>
      </div>

      {/*
        ─────────────────────────────────────────────
        BOTTOM HUD — progress bar + counter
        Clean, typographic, nothing extra.
        ─────────────────────────────────────────────
      */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 md:pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.9 }}
      >
        {/* Label + counter row */}
        <div className="flex items-end justify-between mb-2.5">
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              letterSpacing: '0.28em',
              fontSize: '9px',
            }}
            className="text-white/25 uppercase"
          >
            Initializing
          </span>

          {/* Large-ish number — tabular, no jitter */}
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
              fontWeight: 300,
              fontSize: '13px',
              letterSpacing: '0.05em',
              fontVariantNumeric: 'tabular-nums',
              minWidth: '3ch',
              textAlign: 'right',
            }}
            className="text-white"
          >
            {String(displayNum).padStart(2, '0')}
          </span>
        </div>

        {/* Hairline progress track */}
        <div className="relative w-full h-px bg-white/10 overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#FF0000]"
            style={{ width: `${progress}%` }}
          />
          {/* Trailing glow on the leading edge */}
          <motion.div
            className="absolute top-0 h-full pointer-events-none"
            style={{
              width: '60px',
              left: `calc(${progress}% - 60px)`,
              background:
                'linear-gradient(to right, transparent, rgba(255,0,0,0.4))',
            }}
          />
        </div>
      </motion.div>

      {/*
        ─────────────────────────────────────────────
        CORNER MARKS — ultra-subtle bracket corners
        give a precision instrument feel
        ─────────────────────────────────────────────
      */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos, i) => (
        <motion.div
          key={pos}
          className="absolute pointer-events-none"
          style={{
            width: 14,
            height: 14,
            ...(pos === 'tl' && { top: 20, left: 20, borderTop: '1px solid rgba(255,255,255,0.12)', borderLeft: '1px solid rgba(255,255,255,0.12)' }),
            ...(pos === 'tr' && { top: 20, right: 20, borderTop: '1px solid rgba(255,255,255,0.12)', borderRight: '1px solid rgba(255,255,255,0.12)' }),
            ...(pos === 'bl' && { bottom: 20, left: 20, borderBottom: '1px solid rgba(255,255,255,0.12)', borderLeft: '1px solid rgba(255,255,255,0.12)' }),
            ...(pos === 'br' && { bottom: 20, right: 20, borderBottom: '1px solid rgba(255,255,255,0.12)', borderRight: '1px solid rgba(255,255,255,0.12)' }),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
        />
      ))}
    </motion.div>
  );
}