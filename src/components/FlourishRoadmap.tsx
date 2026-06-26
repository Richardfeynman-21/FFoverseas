import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ROADMAP_STEPS } from '../data';
import { RoadmapStep } from '../types';
import { HelpCircle, CheckSquare, Sparkles, Milestone, ArrowRight, ClipboardCheck, PlaneTakeoff, GraduationCap, Compass, FileText, Award, BadgeDollarSign, ShieldCheck } from 'lucide-react';

export default function FlourishRoadmap() {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [hoveredStepId, setHoveredStepId] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0.14);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll <= 0) return;
    
    const progress = container.scrollTop / maxScroll;
    
    // Scale progress between first stage node (~14%) and last stage node (~95%)
    const minProgress = 0.14;
    const maxProgress = 0.95;
    const calculatedProgress = minProgress + progress * (maxProgress - minProgress);
    
    setScrollProgress(calculatedProgress);
  };

  const handleStepClick = (stepId: number, element: HTMLDivElement) => {
    setActiveStepId(stepId);
    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const elemRect = element.getBoundingClientRect();
      
      const offsetTop = elemRect.top - containerRect.top + container.scrollTop;
      const targetScrollTop = offsetTop - container.clientHeight / 2 + elemRect.height / 2;
      
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  };

  const getStepIcon = (id: number) => {
    switch (id) {
      case 1:
        return <GraduationCap className="w-5 h-5 text-white" />;
  
      case 2:
        return <ClipboardCheck className="w-5 h-5 text-white" />;
  
      case 3:
        return <FileText className="w-5 h-5 text-white" />;
  
      case 4:
        return <Award className="w-5 h-5 text-white" />;
  
      case 5:
        return <BadgeDollarSign className="w-5 h-5 text-white" />;
  
      case 6:
        return <ShieldCheck className="w-5 h-5 text-white" />;
  
      case 7:
        return <PlaneTakeoff className="w-5 h-5 text-white" />;
  
      default:
        return <Milestone className="w-5 h-5 text-white" />;
    }
  };

  const activeStep = ROADMAP_STEPS.find(s => s.id === activeStepId) || ROADMAP_STEPS[0];

  return (
    <div className="w-full relative py-8 px-4 md:px-0" id="flourish-roadmap">
      {/* Container header */}
      <div className="text-center max-w-xl mx-auto mb-10 ml-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#001F3F]/5 border border-[#001F3F]/15 rounded-full text-xs text-[#001F3F] font-mono mb-3 backdrop-blur-sm">
          <Milestone className="w-3.5 h-3.5 text-[#FF0000]" />
          <span>FLOURISH STRATEGIC ROADMAP</span>
        </div>
        <h2 className="text-3.5xl md:text-4.5xl font-extrabold tracking-tight text-[#001F3F]">
          Admissions Orbit Blueprint
        </h2>
        <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">
          From custom alignment profiling to foreign departure integration. Navigate your world study transition flawlessly.
        </p>
      </div>

      {/* Grid Layout of timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Step Progression Left Stack (7 Columns) */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="lg:col-span-7 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar"
        >
          {/* Relative wrapper content spanning full scroll height to allow absolute line to stretch properly */}
          <div className="relative">
            {/* Vertical Connecting Light-Trail Vector Line Graphic */}
            <div className="absolute left-10 md:left-13 top-12 bottom-12 w-1.5 bg-[#001F3F]/5 rounded-full overflow-hidden pointer-events-none">
              {/* Animated glowing neon trail representing flight paths */}
              <div
                className="absolute top-0 left-0 w-full rounded-full transition-all duration-700 ease-out"
                style={{
                  height: `${scrollProgress * 100}%`,
                  background:
                    'linear-gradient(to bottom, #001F3F 0%, #001F3F 30%, #d91212 100%)'
                }}
              />
              {/* Supersonic flying light particle */}
              <div 
                className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-white to-transparent opacity-90 animate-[pulse_2s_infinite]"
                style={{
                  top: `${scrollProgress * 100}%`
                }}
              />
            </div>

            <div className="space-y-6 relative z-10">
              {ROADMAP_STEPS.map((step) => {
                const isActive = step.id === activeStepId;
                const isPast = step.id < activeStepId;

                return (
                  <motion.div
                    data-step-id={step.id}
                    key={step.id}
                    onClick={(e) => handleStepClick(step.id, e.currentTarget as HTMLDivElement)}
                    onMouseEnter={() => setHoveredStepId(step.id)}
                    onMouseLeave={() => setHoveredStepId(null)}
                    initial={{ opacity: 0.35, y: 15, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ root: containerRef, once: false, amount: 0.25 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className={`flex items-start space-x-4 md:space-x-6 p-4 md:p-6 rounded-2xl border transition-all duration-300 cursor-pointer select-none group ${
                      isActive
                        ? 'bg-white/60 border-white/80 border-l-4 border-l-[#FF0000] shadow-md translate-x-2 backdrop-blur-sm'
                        : 'border-transparent bg-transparent hover:bg-white/40 hover:border-white/40'
                    }`}
                  >
                    {/* Circle Indicator with Custom Icons */}
                    <div className="relative">
                      <div 
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-r from-[#001F3F] to-[#FF0000] border-transparent shadow-[0_4px_15px_rgba(0,31,63,0.2)]'
                            : isPast
                              ? 'bg-[#FF0000] border-transparent shadow-[0_2px_10px_rgba(255,0,0,0.15)]'
                              : 'bg-white border-slate-200 group-hover:border-[#FF0000] group-hover:bg-[#FF0000]/5'
                        }`}
                      >
                        {isActive || isPast ? (
                          getStepIcon(step.id)
                        ) : (
                          <span className="text-[#001F3F]/40 font-mono font-bold group-hover:text-[#FF0000]">
                            0{step.id}
                          </span>
                        )}
                      </div>
                      
                      {/* Glowing secondary particle orbit node */}
                      {isActive && (
                        <div className="absolute -inset-1 rounded-full border border-[#FF0000]/30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-400">STAGE 0{step.id} ・ {step.duration}</span>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-md text-[9px] text-[#FF0000] font-mono tracking-wider">
                            ACTIVE PROCESS
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`text-lg md:text-xl font-bold mt-1 transition-colors duration-300 ${
                         isActive ? 'text-[#001F3F]' : 'text-gray-600 group-hover:text-[#001F3F]'
                      }`}>
                        {step.title}
                      </h3>

                      <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                        {step.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deliverables Rigth Side Panel (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-3xl bg-white/35 backdrop-blur-xl border border-white/60 shadow-xl p-6 md:p-8 overflow-hidden flex flex-col justify-between h-full"
              style={{
                boxShadow: '0 25px 55px rgba(0,31,63,0.06), inset 0 2px 10px rgba(255,255,255,0.95)'
              }}
            >
              {/* Corner Glass glow flare */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FF0000]/5 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-42 h-42 rounded-full bg-[#001F3F]/5 blur-2xl pointer-events-none" />

              <div>
                <span className="text-[10px] font-mono font-medium tracking-widest text-[#FF0000]">STAGE METRICS & CHECKS</span>
                <h4 className="text-xl md:text-2xl font-black text-[#001F3F] mt-1">{activeStep.title}</h4>
                <p className="text-xs text-gray-400 font-mono italic mt-0.5">{activeStep.duration} execution window</p>

                <p className="text-gray-500 text-xs md:text-sm leading-relaxed mt-4 bg-white/40 p-3.5 rounded-2xl border border-white/50 backdrop-blur-xs">
                  {activeStep.description}
                </p>

                {/* Sub Deliverables checklists */}
                <div className="mt-6 space-y-3">
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-gray-400 block uppercase">
                    Guaranteed Milestones
                  </span>
                  
                  {activeStep.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-white/65 p-2.5 rounded-xl border border-white/70 backdrop-blur-xs">
                      <div className="w-5 h-5 rounded-md bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] shrink-0">
                        <CheckSquare className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-[#001F3F]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action items */}
              <div className="mt-8 pt-6 border-t border-dashed border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Interactive Consultation</span>
                </div>

                <a 
                  href="#consultation-hub"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF0000] hover:text-[#001F3F] transition-colors"
                >
                  <span>Book This Stage</span>
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
