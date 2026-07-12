'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ROADMAP_STEPS } from '../../data/destinations';
import { CheckCircle2, Milestone, ArrowRight, Sparkles } from 'lucide-react';

export default function FlourishRoadmap() {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const activeStep = ROADMAP_STEPS.find(s => s.id === activeStepId) || ROADMAP_STEPS[0];

  const getStepImage = (id: number) => {
    switch (id) {
      case 1:
        return '/images/female-counselor.jpg';
      case 2:
        return '/images/shortlisting.jpg';
      case 3:
        return '/images/application_process.jpg';
      case 4:
        return '/images/offer_acceptance.jpg';
      case 5:
        return '/images/loan_process.jpg';
      case 6:
        return '/images/visa_filing.jpg';
      case 7:
        return '/images/students-walking.jpg';
      default:
        return '/images/female-counselor.jpg';
    }
  };

  // Mathematical center coordinates for 7 stages
  const stepCount = ROADMAP_STEPS.length;
  const startPercent = 7.14; // Center of 1st node: (0.5 / 7) * 100
  const trackWidthPercent = 85.72; // Width between 1st and last nodes: (6 / 7) * 100

  return (
    <div className="w-full relative py-12 px-4 md:px-0 font-sans" id="flourish-roadmap">
      {/* Container header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#001F3F]/5 border border-[#001F3F]/15 rounded-full text-xs text-[#001F3F] font-mono mb-3 backdrop-blur-sm">
          <Milestone className="w-3.5 h-3.5 text-[#FF0000]" />
          <span>FLOURISH STRATEGIC ROADMAP</span>
        </div>
        <h2 className="text-3.5xl md:text-4.5xl 2xl:text-5xl font-extrabold tracking-tight text-[#001F3F]">
          Admissions Orbit Blueprint
        </h2>
        <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
          From custom alignment profiling to foreign departure integration. Navigate your world study transition flawlessly.
        </p>
      </div>

      {/* Horizontal Progress Timeline */}
      <div 
        className="w-full mb-12 overflow-x-auto pb-6 scrollbar-none relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex items-center justify-between min-w-[850px] relative px-4 py-2">
          {/* Horizontal Track Background Line */}
          <div 
            className="absolute top-8 h-1 bg-[#001F3F]/5 rounded-full z-0" 
            style={{ left: `${startPercent}%`, width: `${trackWidthPercent}%` }}
          />
          
          {/* Active progress fill line (Spring-animated scaleX) */}
          <motion.div 
            className="absolute top-8 h-1 bg-gradient-to-r from-[#001F3F] via-[#FF0000] to-[#FF0000] rounded-full z-0 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (activeStepId - 1) / (stepCount - 1) }}
            transition={{ type: "spring", stiffness: 65, damping: 14 }}
            style={{
              left: `${startPercent}%`,
              width: `${trackWidthPercent}%`,
            }}
          />

          {/* Traveling Glowing Particle */}
          <motion.div
            className="absolute top-[28px] w-3 h-3 -ml-1.5 rounded-full bg-[#FF0000] shadow-[0_0_10px_#FF0000] z-10 pointer-events-none"
            animate={{
              left: `${startPercent + ((activeStepId - 1) / (stepCount - 1)) * trackWidthPercent}%`
            }}
            transition={{ type: "spring", stiffness: 65, damping: 14 }}
          >
            <div className="absolute inset-0 rounded-full bg-[#FF0000] animate-ping opacity-75" />
          </motion.div>

          {ROADMAP_STEPS.map((step) => {
            const isActive = step.id === activeStepId;
            const isPast = step.id < activeStepId;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className="flex flex-col items-center relative z-10 group cursor-pointer focus:outline-none"
                style={{ width: `${100 / stepCount}%` }}
              >
                {/* Node Circle */}
                <motion.div 
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    backgroundColor: isActive ? "#001F3F" : isPast ? "#001F3F" : "#ffffff",
                    borderColor: isActive ? "#FF0000" : isPast ? "#001F3F" : "#e2e8f0"
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 relative z-10 cursor-pointer shadow-sm`}
                >
                  <span className="select-none transition-transform duration-300 group-hover:scale-110">
                    {step.emoji || '📍'}
                  </span>
                  
                  {/* Glowing active pulse ring */}
                  {isActive && (
                    <div className="absolute -inset-1.5 rounded-full border border-[#FF0000]/40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
                  )}

                  {/* Completed Badge Indicator */}
                  {isPast && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-extrabold shadow-sm"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Phase Number Tag */}
                <span className={`text-[10px] font-mono mt-3.5 uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? 'text-[#FF0000] font-bold' : 'text-gray-400 group-hover:text-[#001F3F]'
                }`}>
                  Phase 0{step.id}
                </span>
                
                {/* Phase Title */}
                <span className={`text-xs font-semibold mt-1 text-center max-w-[120px] leading-tight px-1 transition-colors duration-300 ${
                  isActive ? 'text-[#001F3F] font-bold' : 'text-gray-500 group-hover:text-[#001F3F]'
                }`}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Layout of timeline details */}
      <div className="w-full min-h-[500px] lg:min-h-[460px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStepId}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            {/* Left Column: Details (7 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -35 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg p-6 md:p-8 flex flex-col justify-between"
              style={{
                boxShadow: '0 20px 45px rgba(0,31,63,0.03), inset 0 2px 10px rgba(255,255,255,0.95)'
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full text-xs text-[#FF0000] font-mono font-medium">
                    <span>STAGE 0{activeStep.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]/40" />
                    <span>{activeStep.duration}</span>
                  </div>
                  
                  <span className="text-[10px] font-mono tracking-wider text-gray-400">ACTIVE PROCESS</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-extrabold text-[#001F3F] tracking-tight font-display">
                  {activeStep.title}
                </h3>
                
                <p className="text-sm text-gray-400 font-mono italic mt-1">{activeStep.subtitle}</p>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-6 bg-white/40 p-4.5 rounded-2xl border border-white/60 backdrop-blur-xs font-sans">
                  {activeStep.description}
                </p>

                {/* Milestones Checklist */}
                <div className="mt-8 space-y-4">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F]/40 uppercase block">
                    Guaranteed Milestones
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {activeStep.deliverables.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center space-x-3 bg-white/70 p-3 rounded-xl border border-white/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#FF0000]/25"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] shrink-0 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-[#001F3F] leading-tight">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-8 pt-6 border-t border-dashed border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Personalized Strategic Counseling</span>
                </div>

                <a 
                  href="#consultation-hub"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-mono uppercase font-bold text-white bg-[#001F3F] hover:bg-[#FF0000] px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Book This Stage</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Right Column: Image (5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 35 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-lg p-3 flex flex-col justify-center min-h-[360px]"
            >
              <div className="relative w-full h-full min-h-[340px] overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                <img
                  src={getStepImage(activeStep.id)}
                  alt={activeStep.title}
                  className="w-full h-full absolute inset-0 object-cover object-center transition-all duration-700 hover:scale-105"
                />
                
                {/* Visual shadow overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/35 via-transparent to-transparent pointer-events-none" />

                {/* Company Logo Overlay - Premium & Sleek */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-white/60 flex items-center gap-1.5 select-none pointer-events-none">
                  <img src="/FFlogo-icon-only.svg" alt="Company Icon" className="h-5 w-5 object-contain" />
                  <span className="text-[10px] font-mono font-bold tracking-tight text-[#001F3F]">FLY & FLOURISH</span>
                </div>

                {/* Stage number bubble */}
                <div className="absolute bottom-4 left-4 bg-[#001F3F]/90 backdrop-blur-md text-white font-mono px-3.5 py-1.5 rounded-lg text-xs font-bold border border-white/10 shadow-sm pointer-events-none">
                  STAGE 0{activeStep.id}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
