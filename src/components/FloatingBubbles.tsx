import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from '../data';
import { Quote, Star, MessageCircleCode, ChevronLeft, ChevronRight } from 'lucide-react';
import { Flag } from './Flag';

// ─── Physics constants ────────────────────────────────────────────────────────
const RESTITUTION   = 0.82;        // bounciness on collision (0–1)
const DAMPING       = 0.9995;      // velocity decay per frame
const MAX_SPEED     = 2.2;         // px / frame cap
const MIN_SPEED     = 0.35;        // px / frame floor (keeps bubbles alive)
const MOUSE_RADIUS  = 130;         // px repulsion reach
const MOUSE_FORCE   = 3.0;         // repulsion strength

interface BubblePhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
}


export default function FloatingBubbles() {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Dynamic scale of bubbles
  const [bubbleRadius, setBubbleRadius] = useState(72);

  const containerRef  = useRef<HTMLDivElement>(null);
  // Direct DOM refs for each bubble — bypasses React re-renders entirely
  const bubbleElRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const physicsRef    = useRef<BubblePhysics[]>([]);        // mutable physics state
  const mouseRef      = useRef({ x: -9999, y: -9999 });
  const mouseOverRef  = useRef(false);
  const rafRef        = useRef<number>(0);
  const sizeRef       = useRef({ w: 0, h: 0 });
  const isVisibleRef  = useRef(false);

  // ── Initialise bubble positions so they don't overlap ──────────────────────
  const initPhysics = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    sizeRef.current = { w, h };

    // Set bubble radius based on container width
    const r = w < 480 ? 54 : w < 768 ? 64 : w < 1440 ? 72 : 82;
    setBubbleRadius(r);

    const n = TESTIMONIALS.length;
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const states: BubblePhysics[] = [];

    for (let i = 0; i < n; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = Math.max(r, Math.min(w - r,
        (col + 0.5) * (w / cols)));
      const y = Math.max(r, Math.min(h - r,
        (row + 0.5) * (h / rows)));
      const angle = Math.random() * Math.PI * 2;
      const speed = MIN_SPEED + Math.random() * 0.8;
      states.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
    }

    physicsRef.current = states;
    // Apply initial positions directly to DOM
    states.forEach((b, i) => {
      const el = bubbleElRefs.current[i];
      if (el) {
        el.style.transform = `translate3d(${b.x - r}px, ${b.y - r}px, 0)`;
      }
    });
  }, []);

  // ── RAF physics loop — writes directly to DOM, NO React setState ──────────
  const lastPhysicsTimeRef = useRef(0);
  const PHYSICS_INTERVAL = 1000 / 30;
  const tick = useCallback((time: number) => {
    if (time - lastPhysicsTimeRef.current < PHYSICS_INTERVAL) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    lastPhysicsTimeRef.current = time;
    // Only run physics when the section is visible on screen
    if (!isVisibleRef.current) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const { w, h } = sizeRef.current;
    if (!w || !h) { rafRef.current = requestAnimationFrame(tick); return; }

    const bs = physicsRef.current;
    const n  = bs.length;
    const m  = mouseRef.current;
    const r  = w < 480 ? 54 : w < 768 ? 64 : w < 1440 ? 72 : 82;
    const D  = r * 2;

    // 1. Mouse repulsion
    if (mouseOverRef.current) {
      for (let i = 0; i < n; i++) {
        const b = bs[i];
        const dx = b.x - m.x;
        const dy = b.y - m.y;
        const dist2 = dx * dx + dy * dy;
        const dist  = Math.sqrt(dist2);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const f = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          b.vx += (dx / dist) * f;
          b.vy += (dy / dist) * f;
        }
      }
    }

    // 2. Bubble-bubble elastic collisions
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a  = bs[i];
        const b  = bs[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < D && dist > 0) {
          const overlap = (D - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;

          const dvx = a.vx - b.vx;
          const dvy = a.vy - b.vy;
          const dot  = dvx * nx + dvy * ny;

          if (dot > 0) {
            const impulse = dot * RESTITUTION;
            a.vx -= impulse * nx;
            a.vy -= impulse * ny;
            b.vx += impulse * nx;
            b.vy += impulse * ny;
          }
        }
      }
    }

    // 3. Integrate + wall bounce + speed clamp
    for (let i = 0; i < n; i++) {
      const b = bs[i];

      b.vx *= DAMPING;
      b.vy *= DAMPING;

      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > MAX_SPEED) {
        b.vx = (b.vx / speed) * MAX_SPEED;
        b.vy = (b.vy / speed) * MAX_SPEED;
      }
      if (speed > 0 && speed < MIN_SPEED) {
        b.vx = (b.vx / speed) * MIN_SPEED;
        b.vy = (b.vy / speed) * MIN_SPEED;
      }

      b.x += b.vx;
      b.y += b.vy;

      if (b.x < r)      { b.x = r;      b.vx =  Math.abs(b.vx); }
      if (b.x > w - r)  { b.x = w - r;  b.vx = -Math.abs(b.vx); }
      if (b.y < r)      { b.y = r;       b.vy =  Math.abs(b.vy); }
      if (b.y > h - r)  { b.y = h - r;  b.vy = -Math.abs(b.vy); }
    }

    // 4. Write positions directly to DOM — zero React overhead
    for (let i = 0; i < n; i++) {
      const el = bubbleElRefs.current[i];
      if (el) {
        el.style.transform = `translate3d(${bs[i].x - r}px, ${bs[i].y - r}px, 0)`;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    initPhysics();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [initPhysics, tick]);

  // Re-init on resize
  useEffect(() => {
    const ro = new ResizeObserver(() => initPhysics());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [initPhysics]);

  // ── Pause physics when off-screen (IntersectionObserver) ──────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Mouse handlers (pixel coords relative to container) ───────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const handleMouseEnter = () => { mouseOverRef.current = true; };
  const handleMouseLeave = () => { mouseOverRef.current = false; };

  const prevTestimonial = () =>
    setActiveIndex(p => (p === 0 ? TESTIMONIALS.length - 1 : p - 1));
  const nextTestimonial = () =>
    setActiveIndex(p => (p === TESTIMONIALS.length - 1 ? 0 : p + 1));

  return (
    <div className="w-full relative py-8 px-4 md:px-0" id="success-stories">
      {/* Decorative ambient blobs — removed animate-pulse for perf */}
      <div className="absolute top-1/4 left-1/12 w-48 h-48 rounded-full bg-gradient-to-tr from-sky-500/5 to-indigo-500/5 blur-xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/12 w-64 h-64 rounded-full bg-gradient-to-tr from-red-500/5 to-pink-500/5 blur-2xl pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-10">

        <h2 className="text-4xl md:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-[#001F3F]">
          Elite Success Chronicles
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Listen to the high-achieving scholars who collaborated with Fly &amp; Flourish to unlock admissions at premier world research destinations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* ── Bubble physics field ── */}
        <div
          ref={containerRef}
          className="lg:col-span-7 relative h-[420px] 2xl:h-[520px] overflow-hidden bg-white/10 rounded-3xl border border-white/40 shadow-inner"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#001F3F_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          {TESTIMONIALS.map((t, idx) => {
            const isActive  = idx === activeIndex;
            const isHovered = idx === hoveredIndex;

            return (
              <div
                key={t.id}
                ref={(el) => { bubbleElRefs.current[idx] = el; }}
                className="absolute top-0 left-0"
                style={{
                  width:  bubbleRadius * 2,
                  height: bubbleRadius * 2,
                  willChange: 'transform',
                  zIndex: isActive ? 30 : isHovered ? 20 : 10,
                }}
              >
                <div
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`w-full h-full rounded-full flex flex-col items-center justify-center cursor-pointer select-none border text-center relative transition-colors transition-shadow duration-300 ${
                    isActive
                      ? 'bg-white/60 border-[#FF0000]/40 scale-105'
                      : isHovered
                        ? 'bg-white/80 border-slate-300 scale-102'
                        : 'bg-white/30 border-white/50'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? '0 15px 35px rgba(255,0,0,0.12), inset 0 2px 10px rgba(255,255,255,0.9)'
                      : '0 8px 24px rgba(0,31,63,0.06), inset 0 2px 8px rgba(255,255,255,0.8)',
                  }}
                >
                  {/* Inner dashed ring */}
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#001F3F]/8 opacity-40 pointer-events-none" />

                  <Flag country={t.destination} className="w-8 h-5.5 rounded-[2px]" />
                  <h4 className="font-bold text-[#001F3F] text-xs xl:text-sm mt-1.5 px-3 truncate w-full text-center">{t.name}</h4>
                  <p className="text-[10px] text-gray-400 font-mono font-medium px-3 truncate w-full text-center">{t.university}</p>

                  {isActive && ( 
                    <span className="absolute bottom-4 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF0000] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0000]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        

        {/* ── Testimonial detail panel ── */}
        <div className="lg:col-span-5">
          <div
            className="rounded-3xl bg-white/35 border border-white/60 shadow-xl p-6 md:p-8 overflow-hidden flex flex-col justify-between"
            style={{ boxShadow: '0 20px 50px rgba(0,31,63,0.06), inset 0 2px 10px rgba(255,255,255,0.95)' }}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <Quote className="w-8 h-8 text-[#FF0000]/40" />
                <div className="flex space-x-0.5">
                  {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF0000] text-transparent" />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={TESTIMONIALS[activeIndex].id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 text-sm md:text-base xl:text-lg 2xl:text-xl leading-relaxed italic">
                    "{TESTIMONIALS[activeIndex].quote}"
                  </p>
                  <div className="mt-6 pt-6 border-t border-dashed border-white/40">
                    <h4 className="text-lg font-extrabold text-[#001F3F]">
                      {TESTIMONIALS[activeIndex].name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                      <span className="text-xs xl:text-sm font-semibold text-[#FF0000] font-mono uppercase tracking-wider">
                        {TESTIMONIALS[activeIndex].course}
                      </span>
                      <span className="text-gray-300 text-[10px]">|</span>
                      <span className="text-xs xl:text-sm text-gray-500 font-medium">
                        {TESTIMONIALS[activeIndex].university}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#001F3F]/10">
              <span className="text-xs xl:text-sm font-mono text-gray-400">
                CHRONICLE {String(activeIndex + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-xl bg-white/40 hover:bg-white/60 border border-white/60 flex items-center justify-center text-gray-600 hover:text-[#001F3F] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-xl bg-white/40 hover:bg-white/60 border border-white/60 flex items-center justify-center text-gray-600 hover:text-[#001F3F] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}