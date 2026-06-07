import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DESTINATIONS } from '../data';
import { Destination } from '../types';
import { ChevronRight, Globe, University, Calendar, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function DestinationCarousel() {
  const [selectedDestId, setSelectedDestId] = useState<string>(DESTINATIONS[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedDest = DESTINATIONS.find(d => d.id === selectedDestId) || DESTINATIONS[0];

  return (
    <div className="w-full relative py-8 px-4 md:px-0" id="global-destinations">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Destination Selection Stack (5 Col) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF0000]/5 border border-[#FF0000]/25 rounded-full text-xs text-[#FF0000] font-mono mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-ping" />
              <span>TRANS-ORBITAL NETWORKS</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#001F3F]">
              Curated World-Tier Destinations
            </h3>
            
            <p className="text-gray-500 mt-3 text-sm leading-relaxed max-w-sm">
              We focus on premium, research-intensive educational environments with robust visas, high employment leverage, and permanent transition tracks.
            </p>
          </div>

          {/* Responsive Destination Menu: Horizontal scroll on mobile/tablet, vertical stack on desktop */}
          <div className="flex flex-row overflow-x-auto pb-4 lg:pb-0 lg:flex-col lg:space-y-3 lg:overflow-x-visible gap-3 mt-6 snap-x scrollbar-none [scrollbar-width:none]">
            {DESTINATIONS.map((dest) => {
              const isSelected = dest.id === selectedDestId;
              const isHovered = dest.id === hoveredId;

              return (
                <motion.button
                  key={dest.id}
                  onClick={() => setSelectedDestId(dest.id)}
                  onMouseEnter={() => setHoveredId(dest.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative w-auto min-w-[240px] xs:min-w-[280px] lg:w-full text-left p-4 md:p-5 rounded-2xl flex items-center justify-between group cursor-pointer overflow-hidden transition-all duration-300 ease-out border transform hover:scale-[1.015] active:scale-[0.985] shrink-0 snap-start ${
                    isSelected
                      ? 'bg-white/90 backdrop-blur-md border-[#FF0000]/30 border-l-4 border-l-[#FF0000] shadow-[0_12px_28px_-6px_rgba(0,31,63,0.1)] hover:bg-white/95'
                      : 'border-white/40 hover:border-[#FF0000]/20 hover:bg-white/90 hover:translate-x-1.5 bg-white/25 backdrop-blur-sm'
                  }`}
                >
                  {/* Premium animated neon refraction glow layer inside button */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${dest.refractions} opacity-0 group-hover:opacity-20 group-active:opacity-30 transition-opacity duration-500 pointer-events-none rounded-2xl`}
                  />

                  {/* Shimmer sweep effect on hover */}
                  {isHovered && !isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full shimmer-active pointer-events-none" />
                  )}

                  <div className="flex items-center space-x-4 relative z-10">
                    <motion.span 
                      animate={{ 
                        y: isHovered ? -3 : 0, 
                        scale: isHovered ? 1.15 : 1,
                        rotate: isHovered ? [0, -3, 3, 0] : 0
                      }}
                      transition={{ 
                        y: { type: 'spring', stiffness: 300, damping: 10 },
                        scale: { type: 'spring', stiffness: 300, damping: 10 },
                        rotate: { type: 'tween', ease: 'easeInOut', duration: 0.5 }
                      }}
                      className="text-3xl filter drop-shadow-sm select-none inline-block origin-bottom"
                    >
                      {dest.flag}
                    </motion.span>
                    <div>
                      <h4 className={`font-semibold transition-colors duration-300 tracking-tight ${isSelected ? 'text-[#001F3F] text-lg' : 'text-gray-600 group-hover:text-[#001F3F]'}`}>
                        {dest.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-gray-400 font-mono tracking-wider">{dest.code}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-350" />
                        <span className="text-[10px] text-[#FF0000] font-mono tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">EXCELLENCE ORBIT</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 relative z-10">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-mono font-bold text-[#001F3F] opacity-75 group-hover:opacity-100 group-hover:text-[#FF0000] transition-colors leading-none">
                        {dest.visaSuccessRate}
                      </span>
                      <span className="text-[8px] font-mono text-gray-400 leading-none mt-0.5">VISA SUCCESS</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                      isSelected ? 'text-[#FF0000] translate-x-1 scale-110' : 'text-gray-300 group-hover:text-[#FF0000] group-hover:translate-x-1 group-hover:scale-110'
                    }`} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Showcase Glassmorphic Card (8 Col) */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDest.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative rounded-3xl bg-white/35 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden p-6 md:p-8 flex flex-col justify-between"
              style={{
                boxShadow: '0 20px 50px rgba(0,31,63,0.05), inset 0 2px 10px rgba(255,255,255,0.9)',
                background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)`
              }}
            >
              {/* Inner glowing element imitating laser refracting lens */}
              <div 
                className={`absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br ${selectedDest.refractions} blur-3xl opacity-50 pointer-events-none transition-all duration-700`} 
              />

              {/* Dynamic Header */}
              <div>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl md:text-5xl select-none drop-shadow-md">{selectedDest.flag}</span>
                    <div>
                      <span className="text-xs font-mono text-[#FF0000] uppercase tracking-wider font-semibold">GLOBAL SANCTUARY CODES</span>
                      <h2 className="text-2xl md:text-3.5xl font-extrabold text-[#001F3F] tracking-tight">{selectedDest.name}</h2>
                    </div>
                  </div>

                  <div className="bg-[#001F3F]/5 hover:bg-[#001F3F]/8 border border-[#001F3F]/10 px-4 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-sm">
                    <ShieldCheck className="w-4 h-4 text-[#FF0000]" />
                    <div className="text-left">
                      <p className="text-[9px] text-gray-400 font-mono leading-none">VISA INDEX</p>
                      <p className="text-xs font-bold text-[#001F3F] font-mono">{selectedDest.visaSuccessRate}</p>
                    </div>
                  </div>
                </div>

                <p className="text-[#FF0000] font-medium text-sm md:text-base mt-4 italic font-sans">
                  "{selectedDest.tagline}"
                </p>

                <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-3 max-w-2xl">
                  {selectedDest.description}
                </p>
              </div>

              {/* Core Attributes Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#001F3F]/10">
                {/* Admissions Core */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[#001F3F] font-semibold text-sm">
                    <Calendar className="w-4 h-4 text-[#FF0000]" />
                    <span>Intake Orbits</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono leading-relaxed pl-6">{selectedDest.intakes}</p>
                </div>

                {/* Ivy League & Top Universities */}
                <div className="space-y-1.5 md:col-span-1 lg:col-span-2">
                  <div className="flex items-center gap-2 text-[#001F3F] font-semibold text-sm">
                    <University className="w-4 h-4 text-[#001F3F]" />
                    <span>Elite Partner Universities</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-6 mt-1">
                    {selectedDest.universities.map((uni, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#001F3F]/5 border border-[#001F3F]/10 rounded-lg text-xs text-[#001F3F] font-medium hover:bg-[#001F3F]/8 backdrop-blur-xs transition-colors cursor-default"
                      >
                        {uni}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Trigger button */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-dashed border-[#001F3F]/5 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF0000]" />
                  <span className="text-xs text-slate-400 font-mono">Comprehensive admissions counsel is fully unlocked.</span>
                </div>
                
                <a
                  href="#consultation-hub"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-red-500/20 active:scale-95 cursor-pointer"
                >
                  <span>PLAN {selectedDest.code} VOYAGE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
