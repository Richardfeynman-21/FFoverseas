'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Activity,
  FileCheck
} from 'lucide-react';
import { StudentRecord, ApplicationRecord, DocumentRecord } from './types';

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

interface OverviewTabProps {
  students: StudentRecord[];
  applications: ApplicationRecord[];
  documents: DocumentRecord[];
  getInboxConversations: () => Array<{
    student: StudentRecord;
    lastMessage: string;
    time: string;
    unread: boolean;
  }>;
  setActiveTab: (tab: 'overview' | 'students' | 'chat' | 'applications' | 'documents' | 'universities') => void;
  setActiveChatStudentId: (id: string) => void;
}

export default function OverviewTab({
  students,
  applications,
  documents,
  getInboxConversations,
  setActiveTab,
  setActiveChatStudentId
}: OverviewTabProps) {
  const activeStudents = students.filter(s => s.status === 'in_progress');
  const completedStudents = students.filter(s => s.status === 'completed');
  const leadStudents = students.filter(s => s.status === 'lead');
  const totalStudents = students.length;

  // Funnel calculations
  const leadPercent = totalStudents ? Math.round((leadStudents.length / totalStudents) * 100) : 0;
  const activePercent = totalStudents ? Math.round((activeStudents.length / totalStudents) * 100) : 0;
  const completedPercent = totalStudents ? Math.round((completedStudents.length / totalStudents) * 100) : 0;



  return (
    <motion.div className="space-y-8 bg-white" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Top Welcome Title */}
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5" variants={staggerItem}>
        <div>
          <h2 className="text-xl sm:text-2.5xl font-black tracking-tight text-[#001F3F] uppercase font-sans">
            Agent Cockpit
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-semibold tracking-wide">
            Real-time workload metrics, application progression funnels, and communication channels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">
            UTC SYNCED
          </span>
        </div>
      </motion.div>

      {/* Grid stats */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5" variants={staggerItem}>
        {[
          { 
            title: 'STUDENTS ASSIGNED', 
            value: activeStudents.length, 
            desc: 'Currently in-progress applications', 
            color: 'text-indigo-600', 
            icon: Users,
            bgGradient: 'from-indigo-50/20 to-transparent'
          },
          { 
            title: 'APPLICATIONS PENDING', 
            value: applications.filter(a => a.status === 'Applied').length + documents.filter(d => d.status === 'Pending Review').length, 
            desc: 'Awaiting university/agent audit', 
            color: 'text-amber-600', 
            icon: Clock,
            bgGradient: 'from-amber-50/20 to-transparent'
          },
          { 
            title: 'COMPLETED TRANSITIONS', 
            value: completedStudents.length, 
            desc: 'Secured admissions & departures', 
            color: 'text-emerald-600', 
            icon: CheckCircle2,
            bgGradient: 'from-emerald-50/20 to-transparent'
          },
          { 
            title: 'ACTIVE LEADS', 
            value: leadStudents.length, 
            desc: 'Potential students to recruit', 
            color: 'text-rose-600', 
            icon: Sparkles,
            bgGradient: 'from-rose-50/20 to-transparent'
          }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.008)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.02)] transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">{stat.title}</span>
              <stat.icon size={16} className={`${stat.color} opacity-80`} />
            </div>
            <p className="text-3xl font-black text-[#001F3F] mt-3 leading-none relative z-10 tracking-tight">{stat.value}</p>
            <p className="text-[10px] text-slate-400 mt-3 font-semibold relative z-10">{stat.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Funnel Section */}
      <motion.div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.008)] space-y-5" variants={staggerItem}>
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-xs text-[#001F3F] uppercase tracking-tight">Admissions Funnel Conversion</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Total student cohort lifecycle distribution.</p>
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-lg uppercase">
            Cohort: {totalStudents}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
          {/* Leads Lane */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono font-bold">
              <span className="text-slate-500">1. CONSULTATION LEADS</span>
              <span className="text-rose-600">{leadStudents.length} Students ({leadPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full" style={{ width: `${leadPercent}%` }} />
            </div>
          </div>

          {/* In Progress Lane */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono font-bold">
              <span className="text-slate-500">2. APPLICATION IN-PROGRESS</span>
              <span className="text-indigo-600">{activeStudents.length} Students ({activePercent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full" style={{ width: `${activePercent}%` }} />
            </div>
          </div>

          {/* Completed Lane */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono font-bold">
              <span className="text-slate-500">3. COMPLETED TRANSITIONS</span>
              <span className="text-emerald-600">{completedStudents.length} Students ({completedPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: `${completedPercent}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Recent Messages Summary Card & Applications Tracker */}
      <motion.div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" variants={staggerItem}>
        
        {/* Recent Messages Summary card - 7 Columns */}
        <div className="xl:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.008)]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-indigo-600 w-4.5 h-4.5" />
              <h3 className="font-extrabold text-xs text-[#001F3F] uppercase tracking-tight">Recent Student Messages</h3>
            </div>
            <button 
              onClick={() => setActiveTab('chat')}
              className="text-[9px] font-bold text-[#001F3F] hover:bg-slate-50 transition-all cursor-pointer border border-slate-200/60 px-3 py-1.5 rounded-xl bg-white shadow-2xs"
            >
              Open Chat Desk
            </button>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
            {getInboxConversations().map((conv) => (
              <div 
                key={conv.student.id}
                onClick={() => {
                  setActiveChatStudentId(conv.student.id);
                  setActiveTab('chat');
                }}
                className="flex items-start justify-between gap-4 p-3.5 bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-100/75 cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.005)]"
              >
                <div className="flex gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-600 font-mono shrink-0 shadow-2xs">
                    {conv.student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-slate-800 text-xs font-bold truncate leading-none mt-0.5">{conv.student.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-2 leading-none font-medium">{conv.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-2 font-mono">
                  <span className="text-[8px] text-slate-400 font-semibold">{conv.time}</span>
                  {conv.unread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.5)] animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Tracker - 5 Columns */}
        <div className="xl:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.008)]">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-xs text-[#001F3F] uppercase tracking-tight">Recent Activity Stream</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Latest university logs registered on the server.</p>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
            {applications.slice(0, 5).map((ap, i) => (
              <div key={i} className="flex items-start gap-3.5 text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#001F3F]/40 shrink-0 mt-1.5" />
                <div className="space-y-1">
                  <p className="text-slate-800 font-bold leading-normal">
                    {ap.studentName} <span className="font-normal text-slate-500">applied to</span> <span className="text-[#001F3F] font-bold">{ap.universityName}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Program: {ap.program} · Status: <span className="font-bold text-slate-700">{ap.status}</span></p>
                  <span className="text-[8px] font-mono text-slate-400 font-semibold block pt-0.5">{ap.appliedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Action Navigation Grid */}
      <motion.div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.008)]" variants={staggerItem}>
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-xs text-[#001F3F] uppercase tracking-tight">Agent Core Quicklinks</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold font-sans">Access system managers, documents checks, and configuration panels directly.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {[
            { label: 'Directory', icon: Users, tab: 'students', desc: 'Audit student cohort' },
            { label: 'Audits', icon: FileCheck, tab: 'documents', desc: 'Verify passport & transcripts' },
            { label: 'Universities', icon: TrendingUp, tab: 'universities', desc: 'Institutional DB' }
          ].map((act, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(act.tab as any)}
              className="flex items-center gap-3 p-3.5 bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl cursor-pointer text-left transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.008)] group"
            >
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[#001F3F] group-hover:bg-slate-100/50 transition-colors">
                <act.icon size={14} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#001F3F]">{act.label}</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{act.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
