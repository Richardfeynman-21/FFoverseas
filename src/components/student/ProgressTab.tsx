'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, Circle, ChevronUp, ChevronDown } from 'lucide-react';
import { ApplicationStage, StudentApplication } from './types';
import { NAVY, RED } from './constants';

interface ProgressTabProps {
  progressPercent: number;
  stages: ApplicationStage[];
  expandedStage: number | null;
  setExpandedStage: (stageId: number | null) => void;
  applications: StudentApplication[];
  activeApplicationId: string;
  setActiveApplicationId: (id: string) => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  progressPercent,
  stages,
  expandedStage,
  setExpandedStage,
  applications,
  activeApplicationId,
  setActiveApplicationId,
}) => {
  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Applications Switcher Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-[#001F3F] text-base sm:text-lg tracking-tight uppercase">Your Active Applications</h3>
            <p className="text-xs text-slate-450 font-medium">Select an application to view its detailed timeline and milestone status.</p>
          </div>
          <span className="px-3.5 py-1.5 bg-[#001F3F]/5 text-[#001F3F] text-[10px] font-bold uppercase tracking-wider rounded-xl font-mono self-start sm:self-center border border-[#001F3F]/10">
            {applications.length} Course Applications
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {applications.map((app) => {
            const isSelected = app.id === activeApplicationId;
            const appCompletedCount = app.stages.filter((s) => s.status === 'completed').length;
            const appProgressPercent = app.stages.length 
              ? Math.round((appCompletedCount / app.stages.length) * 100) 
              : 0;

            return (
              <button
                key={app.id}
                onClick={() => setActiveApplicationId(app.id)}
                className={`relative p-5.5 rounded-3xl text-left border cursor-pointer transition-all duration-350 select-none overflow-hidden group space-y-4 ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#001F3F] to-[#1a3a60] border-transparent text-white shadow-xl shadow-slate-900/10 -translate-y-1'
                    : 'bg-white border-slate-100/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm text-[#001F3F] hover:-translate-y-1'
                }`}
              >
                {/* Visual Glow Flare for selected card */}
                {isSelected && (
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-600/10 rounded-full blur-xl" />
                )}

                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg uppercase shrink-0 ${
                        isSelected ? 'bg-white/10 text-white border border-white/5' : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        {app.country}
                      </span>
                      {app.status && (
                        <span className={`text-[9px] font-sans font-extrabold px-1.5 py-0.5 rounded-lg uppercase tracking-wider truncate shrink-0 ${
                          app.status.toLowerCase() === 'accepted' || app.status.toLowerCase() === 'offered'
                            ? (isSelected ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/10' : 'bg-emerald-50 text-emerald-600 border border-emerald-100')
                            : app.status.toLowerCase() === 'rejected'
                            ? (isSelected ? 'bg-red-500/25 text-red-300 border border-red-500/10' : 'bg-red-50 text-red-650 border border-red-100')
                            : app.status.toLowerCase() === 'draft'
                            ? (isSelected ? 'bg-amber-500/25 text-amber-300 border border-amber-500/10' : 'bg-amber-50 text-amber-650 border border-amber-100')
                            : (isSelected ? 'bg-blue-500/25 text-blue-300 border border-blue-500/10' : 'bg-blue-50 text-blue-650 border border-blue-100')
                        }`}>
                          {app.status}
                        </span>
                      )}
                    </div>
                    <span className="text-sm shrink-0">
                      {app.flag === 'CA' ? '🇨🇦' : app.flag === 'US' ? '🇺🇸' : app.flag === 'GB' ? '🇬🇧' : '🏫'}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className={`text-[13px] font-black truncate leading-tight ${isSelected ? 'text-white' : 'text-[#001F3F]'}`}>
                      {app.universityName}
                    </h4>
                    <p className={`text-[10.5px] font-semibold truncate mt-1 ${isSelected ? 'text-slate-205' : 'text-slate-450'}`}>
                      {app.programName}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-900/2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#001F3F]">Overall Application Journey</h3>
          <span
            className="text-lg font-black font-mono"
            style={{ color: progressPercent >= 50 ? '#10b981' : RED }}
          >
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${NAVY}, ${RED})` }}
          />
        </div>
      </div>

      {/* Expandable Timeline */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/2">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#001F3F]">Detailed Stage Breakdown</h3>
            <p className="text-[11px] text-slate-400 font-mono">CLICK TO EXPAND DETAILS</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 font-sans tracking-wide bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl">
            {stages.filter(s => s.status === 'completed').length} OF {stages.length} COMPLETED
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
              className="w-full text-left px-6 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    stage.status === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : stage.status === 'current'
                      ? 'bg-amber-400 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {stage.status === 'completed' ? (
                    <CheckCircle2 size={14} />
                  ) : stage.status === 'current' ? (
                    <Clock size={14} />
                  ) : (
                    <Circle size={12} />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      stage.status === 'pending' ? 'text-slate-400' : 'text-[#001F3F]'
                    }`}
                  >
                    {stage.name}
                  </p>
                  {stage.date && <p className="text-[11px] text-slate-400 font-mono">{stage.date}</p>}
                </div>
                {expandedStage === stage.id ? (
                  <ChevronUp size={16} className="text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400" />
                )}
              </div>
              <AnimatePresence>
                {expandedStage === stage.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-slate-500 mt-3 ml-11 leading-relaxed">{stage.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
