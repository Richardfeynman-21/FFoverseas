'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Building2, Trash2, X, Sparkles } from 'lucide-react';
import { UniversityRecord } from '../types';

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
} as const;

interface UniversitiesTabProps {
  universities: UniversityRecord[];
  setUniversities: React.Dispatch<React.SetStateAction<UniversityRecord[]>>;
  triggerNotification: (text: string, isError?: boolean) => void;
}

export default function UniversitiesTab({
  universities,
  setUniversities,
  triggerNotification
}: UniversitiesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newQsRanking, setNewQsRanking] = useState('');
  const [newTuition, setNewTuition] = useState('');
  const [newAcceptance, setNewAcceptance] = useState('');
  const [newTags, setNewTags] = useState('STEM, Global Top');

  const filteredUnis = universities.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCountry.trim()) return;

    const newUni: UniversityRecord = {
      id: `uni-${Date.now()}`,
      name: newName.trim(),
      country: newCountry.trim(),
      qsRanking: newQsRanking.trim() || 'QS #Unranked',
      tuitionRange: newTuition.trim() || '$30k/yr',
      acceptanceRate: newAcceptance.trim() || '30%'
    };

    setUniversities([newUni, ...universities]);
    triggerNotification(`University added: ${newName}`);

    // Reset
    setNewName('');
    setNewCountry('');
    setNewQsRanking('');
    setNewTuition('');
    setNewAcceptance('');
    setShowAddForm(false);
  };

  return (
    <motion.div className="space-y-6 bg-white" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Title */}
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5" variants={staggerItem}>
        <div>
          <h2 className="text-xl sm:text-2.5xl font-black tracking-tight text-[#001F3F] uppercase">Universities Directory</h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Manage elite institutions mappings, tuition ranges, and admission standards.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="self-start flex items-center gap-1.5 px-4 py-2 bg-[#001F3F] hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus size={13} />
          <span>Register University</span>
        </button>
      </motion.div>

      {/* Search toolbar */}
      <motion.div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.005)]" variants={staggerItem}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search universities by name or location..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 placeholder:text-slate-400 shadow-2xs font-semibold"
          />
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-450 uppercase">Mapped: {filteredUnis.length}</span>
      </motion.div>

      {/* Universities listing */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" variants={staggerItem}>
        {filteredUnis.map(uni => {
          // Generate simulated specialty tags based on university details
          const isIvyOrTop = uni.qsRanking && parseInt(uni.qsRanking.replace(/\D/g, '')) <= 20;
          const tags = isIvyOrTop ? ['Ivy Equivalent', 'STEM Accredited', 'Premium Global'] : ['Top Rated', 'STEM Accredited'];
          
          return (
            <div 
              key={uni.id} 
              className="bg-white rounded-3xl border border-slate-100 p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.005)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.015)] transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-slate-50 opacity-40 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-[#001F3F] transition-colors">{uni.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">{uni.country}</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#001F3F] bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1 shrink-0 shadow-2xs">
                    {uni.qsRanking}
                  </span>
                </div>
                
                {/* Specialty Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="text-[7px] font-mono px-2 py-0.5 bg-slate-50 border border-slate-150 rounded-lg text-slate-500 font-bold uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Tuition requirements */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-3.5 border-t border-slate-50 text-[10px] font-mono text-slate-450 font-semibold">
                  <div>TUITION ANNUALLY: <span className="text-[#001F3F] font-black">{uni.tuitionRange}</span></div>
                  <div>ACCEPTANCE RATE: <span className="text-[#001F3F] font-black">{uni.acceptanceRate}</span></div>
                  <div className="col-span-2 text-[9px] text-slate-400 font-sans pt-1">
                    Req: <span className="font-bold text-[#001F3F]">GPA &gt; 8.0</span> · <span className="font-bold text-[#001F3F]">IELTS &gt; 6.5</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-5 pt-3 border-t border-slate-100 justify-end">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${uni.name} from directory?`)) {
                      setUniversities(universities.filter(u => u.id !== uni.id));
                      triggerNotification('University deleted.');
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 text-[10px] font-bold uppercase transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  <span>Remove Listing</span>
                </button>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Register University Slide-out Modal Form */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001F3F]/5 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-150 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="text-indigo-600 w-4.5 h-4.5" />
                  <h3 className="font-extrabold text-sm text-[#001F3F] uppercase">Register Institutional Mapping</h3>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleAddUniversity} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">University Name</label>
                  <input 
                    type="text" required value={newName} onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Massachusetts Institute of Technology"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Country / Location</label>
                    <input 
                      type="text" required value={newCountry} onChange={(e) => setNewCountry(e.target.value)}
                      placeholder="e.g. USA"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">QS World Ranking</label>
                    <input 
                      type="text" value={newQsRanking} onChange={(e) => setNewQsRanking(e.target.value)}
                      placeholder="e.g. QS #1"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Tuition Range</label>
                    <input 
                      type="text" value={newTuition} onChange={(e) => setNewTuition(e.target.value)}
                      placeholder="e.g. $55k/yr"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Acceptance Rate</label>
                    <input 
                      type="text" value={newAcceptance} onChange={(e) => setNewAcceptance(e.target.value)}
                      placeholder="e.g. 7.3%"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Specialty Tags (Comma separated)</label>
                  <input 
                    type="text" value={newTags} onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. STEM, Global Top, Ivy Equivalent"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#001F3F] text-white hover:bg-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    Add Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
