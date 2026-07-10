'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { ApplicationRecord } from '../types';

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

interface ApplicationsTabProps {
  applications: ApplicationRecord[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationRecord[]>>;
  triggerNotification: (text: string, isError?: boolean) => void;
}

type ViewMode = 'list' | 'kanban';

export default function ApplicationsTab({
  applications,
  setApplications,
  triggerNotification
}: ApplicationsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  const filteredApps = applications.filter(ap =>
    ap.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ap.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ap.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses: Array<'Applied' | 'Offered' | 'Accepted' | 'Rejected'> = ['Applied', 'Offered', 'Accepted', 'Rejected'];

  const handleStatusChange = (appId: string, name: string, newStatus: 'Applied' | 'Offered' | 'Accepted' | 'Rejected') => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    triggerNotification(`Application moved: ${name} -> ${newStatus}`);
  };

  return (
    <motion.div className="space-y-6 bg-white" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Tab Title */}
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5" variants={staggerItem}>
        <div>
          <h2 className="text-xl sm:text-2.5xl font-black tracking-tight text-[#001F3F] uppercase">Applications Hub</h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Track, update, and manage university application lifecycles across cohort stages.</p>
        </div>
      </motion.div>

      {/* Filter and View Switcher Toolbar */}
      <motion.div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.005)]" variants={staggerItem}>
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 placeholder:text-slate-400 shadow-2xs font-semibold"
          />
        </div>

        {/* Switcher Toggle */}
        <div className="flex p-1 bg-slate-50 border border-slate-200/50 rounded-2xl self-start">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'kanban' 
                ? 'bg-slate-100 text-[#001F3F] shadow-2xs border border-slate-200/20' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid size={13} />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'list' 
                ? 'bg-slate-100 text-[#001F3F] shadow-2xs border border-slate-200/20' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List size={13} />
            <span>Detailed List</span>
          </button>
        </div>
      </motion.div>

      {/* Main View Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-x-auto bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.005)]"
          >
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-mono bg-slate-50/20">
                  <th className="p-4 uppercase tracking-wider font-bold">Student Name</th>
                  <th className="p-4 uppercase tracking-wider font-bold">Target University</th>
                  <th className="p-4 uppercase tracking-wider font-bold">Program</th>
                  <th className="p-4 uppercase tracking-wider font-bold">Applied Date</th>
                  <th className="p-4 uppercase tracking-wider font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                {filteredApps.map(ap => (
                  <tr key={ap.id} className="hover:bg-slate-50/20 transition-colors duration-150">
                    <td className="p-4 font-bold text-[#001F3F]">{ap.studentName}</td>
                    <td className="p-4 text-slate-700">{ap.universityName}</td>
                    <td className="p-4 text-slate-600">{ap.program}</td>
                    <td className="p-4 font-mono text-slate-450 font-bold">{ap.appliedDate}</td>
                    <td className="p-4">
                      <select
                        value={ap.status}
                        onChange={(e) => handleStatusChange(ap.id, ap.studentName, e.target.value as any)}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold tracking-tight bg-white focus:outline-none cursor-pointer transition-all shadow-2xs ${
                          ap.status === 'Accepted' ? 'border-emerald-200 text-emerald-700 bg-emerald-50/30' :
                          ap.status === 'Offered' ? 'border-indigo-200 text-indigo-705 bg-indigo-50/30' :
                          ap.status === 'Rejected' ? 'border-rose-200 text-rose-700 bg-rose-50/30' :
                          'border-amber-250 text-amber-700 bg-amber-50/30'
                        }`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Offered">Offered</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div 
            key="kanban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-5"
          >
            {statuses.map(lane => {
              const laneApps = filteredApps.filter(a => a.status === lane);
              
              // Colors for lane headers
              const headerColors = {
                Applied: 'bg-amber-50 border-amber-250 text-amber-700',
                Offered: 'bg-indigo-50 border-indigo-250 text-indigo-700',
                Accepted: 'bg-emerald-50 border-emerald-250 text-emerald-700',
                Rejected: 'bg-rose-50 border-rose-200 text-rose-700'
              };

              return (
                <div 
                  key={lane} 
                  className="bg-slate-50/20 border border-slate-100 rounded-3xl p-4 flex flex-col space-y-4 min-h-[500px]"
                >
                  {/* Lane Header */}
                  <div className={`p-3 rounded-2xl border text-center flex items-center justify-between font-bold text-xs uppercase tracking-wider ${headerColors[lane]}`}>
                    <span>{lane}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/40 text-[9px] font-mono">{laneApps.length}</span>
                  </div>

                  {/* Lane Cards Container */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-hide">
                    {laneApps.map(ap => (
                      <motion.div
                        layout
                        key={ap.id}
                        className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.005)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.015)] transition-all cursor-grab active:cursor-grabbing space-y-3"
                      >
                        <div>
                          <h4 className="font-extrabold text-xs text-[#001F3F] leading-none mt-0.5">{ap.studentName}</h4>
                          <p className="text-[10px] text-slate-450 font-semibold mt-2">{ap.universityName}</p>
                          <p className="text-[9px] text-slate-400 font-mono font-bold mt-1 uppercase">{ap.program}</p>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-[8px] font-mono text-slate-400 font-bold">{ap.appliedDate}</span>
                          
                          {/* Fast move options */}
                          <select
                            value={ap.status}
                            onChange={(e) => handleStatusChange(ap.id, ap.studentName, e.target.value as any)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-700 cursor-pointer focus:outline-none shadow-2xs"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Offered">Offered</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </motion.div>
                    ))}
                    {laneApps.length === 0 && (
                      <div className="h-28 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-semibold">
                        No applications
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
