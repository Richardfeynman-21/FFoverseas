'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Filter, DollarSign, Award, Users, ExternalLink, GraduationCap, MapPin } from 'lucide-react';
import { University } from '../types';
import { Flag } from '../Flag';

interface UniversitiesTabProps {
  countryFilter: string;
  setCountryFilter: (country: string) => void;
  filteredUniversities: University[];
}

export const UniversitiesTab: React.FC<UniversitiesTabProps> = ({
  countryFilter,
  setCountryFilter,
  filteredUniversities,
}) => {
  return (
    <motion.div
      key="universities"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-7"
    >
      {/* Premium Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
            <Filter size={13} />
          </div>
          <span className="text-xs font-black text-[#001F3F] uppercase tracking-wider font-mono">Filter by Region</span>
        </div>
        
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1 -my-1 w-full sm:w-auto max-w-full">
          {['All', 'USA', 'UK', 'Canada', 'Australia', 'Germany'].map((country) => (
            <button
              key={country}
              onClick={() => setCountryFilter(country)}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer active:scale-95 ${
                countryFilter === country
                  ? 'bg-[#001F3F] text-white shadow-md shadow-[#001F3F]/10'
                  : 'bg-slate-50 text-slate-500 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
        
        <div className="px-3.5 py-1.5 bg-slate-50 border border-slate-200/50 rounded-xl">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
            {filteredUniversities.length} Universities Available
          </span>
        </div>
      </div>

      {/* University Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUniversities.map((uni, i) => (
          <motion.div
            key={uni.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-3xl p-5.5 border border-slate-100/80 hover:border-slate-200 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-350 flex flex-col justify-between group overflow-hidden relative"
          >
            {/* Ambient card top border glow on hover */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#001F3F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4.5">
                <div className="min-w-0 space-y-1">
                  <h3 className="font-extrabold text-[#001F3F] text-[14px] leading-tight group-hover:text-[#FF1E56] transition-colors duration-250">
                    {uni.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Flag country={uni.flag} className="w-4 h-3 rounded shadow-xs shrink-0" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide flex items-center gap-1">
                      <MapPin size={10} className="text-slate-350" />
                      {uni.country}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-black px-2.5 py-1.5 rounded-xl bg-amber-50/70 text-amber-700 border border-amber-100 shrink-0 select-none shadow-xs">
                  {uni.ranking}
                </span>
              </div>

              {/* Statistics details list */}
              <div className="bg-slate-50/50 rounded-2xl p-4.5 border border-slate-150/40 space-y-3 mb-4.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Tuition Fees</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{uni.tuition}</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <Award size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Scholarships</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100/50">
                    {uni.scholarship}
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Acceptance</span>
                  </div>
                  <span className="text-xs font-bold text-slate-650">{uni.acceptanceRate}</span>
                </div>
              </div>

              {/* Programs Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5.5">
                {uni.programs.map((prog) => (
                  <span
                    key={prog}
                    className="text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors select-none"
                  >
                    {prog}
                  </span>
                ))}
              </div>
            </div>

            {/* Learn More Button */}
            <button className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-250 cursor-pointer bg-[#001F3F]/5 text-[#001F3F] hover:bg-[#001F3F] hover:text-white flex items-center justify-center gap-2 shadow-sm border border-transparent group-hover:border-slate-250/20 active:scale-95">
              <span>Request Information</span> 
              <ExternalLink size={12} strokeWidth={2.5} />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
