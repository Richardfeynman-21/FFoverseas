'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  Lock, 
  Search, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  ExternalLink,
  Info,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { Student, TabKey } from './types';

interface VisaStep {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending' | 'locked';
  dateCompleted?: string;
  description: string;
  checklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  documents?: {
    name: string;
    url: string;
  }[];
}

interface VisaTabProps {
  student: Student | null;
  setActiveTab: (tab: TabKey) => void;
}

export const VisaTab: React.FC<VisaTabProps> = ({ student, setActiveTab }) => {
  // 1. Live Consulate Slots State
  const consulateSlots = [
    { city: 'New Delhi', date: 'Oct 28, 2026', status: 'available' },
    { city: 'Mumbai', date: 'Nov 02, 2026', status: 'available' },
    { city: 'Hyderabad', date: 'Limited Slots', status: 'warning' },
    { city: 'Chennai', date: 'Nov 12, 2026', status: 'available' },
    { city: 'Kolkata', date: 'Dec 05, 2026', status: 'available' },
  ];

  // 2. Timeline Steps State
  const [steps, setSteps] = useState<VisaStep[]>([]);

  const fetchVisaSteps = async () => {
    try {
      const token = localStorage.getItem('ff_student_token');
      if (!token) return;
      const res = await fetch('/api/students/me/visa-steps', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((v: any) => ({
          id: v.step_index + 1,
          name: v.name,
          status: v.status,
          dateCompleted: v.date_completed,
          description: v.description,
          checklist: v.checklist || [],
          documents: v.documents || []
        }));
        setSteps(mapped);
      }
    } catch (err) {
      console.error('Error fetching visa steps:', err);
    }
  };

  useEffect(() => {
    fetchVisaSteps();
  }, []);

  const [expandedStep, setExpandedStep] = useState<number | null>(3); // Keep active step open by default

  // 3. Resources Data
  const resources = [
    { id: 1, title: 'Top 10 Interview Red Flags', desc: 'Critical errors to avoid during F-1 student visa interviews regarding intent and ties to home.', category: 'F-1 Visa' },
    { id: 2, title: 'Financial Document Guidelines', desc: 'Exact formats for bank balance certificates, loan sanction letters, and affidavits.', category: 'Financials' },
    { id: 3, title: 'Answering why this University', desc: 'Sample responses highlighting course specifics, research modules, and career goals.', category: 'Common Qs' },
    { id: 4, title: 'How to Prove Home Ties', desc: 'Documenting family properties, business stakes, and long-term domestic return plans.', category: 'Common Qs' },
    { id: 5, title: 'Visa Fee Payment Guide', desc: 'Step-by-step payment instructions for NEFT, card, or partner banks in India.', category: 'F-1 Visa' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dynamic calculations
  const totalChecklistItems = useMemo(() => {
    return steps.reduce((acc, step) => acc + step.checklist.length, 0);
  }, [steps]);

  const completedChecklistItems = useMemo(() => {
    return steps.reduce((acc, step) => acc + step.checklist.filter(item => item.completed).length, 0);
  }, [steps]);

  const progressPercent = useMemo(() => {
    if (totalChecklistItems === 0) return 0;
    return Math.round((completedChecklistItems / totalChecklistItems) * 100);
  }, [completedChecklistItems, totalChecklistItems]);

  // Toggle checklist items
  const handleChecklistToggle = async (stepId: number, itemId: string) => {
    const targetStep = steps.find(s => s.id === stepId);
    if (!targetStep) return;

    const updatedChecklist = targetStep.checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const allCompleted = updatedChecklist.every(item => item.completed);
    const noneCompleted = updatedChecklist.every(item => !item.completed);
    
    let newStatus = targetStep.status;
    if (stepId === 1 || stepId === 2) {
      if (allCompleted) {
        newStatus = 'completed';
      } else if (noneCompleted) {
        newStatus = 'active';
      } else {
        newStatus = 'active';
      }
    } else if (stepId !== 6) { // step 6 is locked
      if (allCompleted) {
        newStatus = 'completed';
      } else if (noneCompleted) {
        newStatus = 'pending';
      } else {
        newStatus = 'active';
      }
    }

    const token = localStorage.getItem('ff_student_token');
    if (!token) return;

    try {
      const dateCompleted = newStatus === 'completed' 
        ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;

      const res = await fetch(`/api/students/me/visa-steps/${stepId - 1}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          date_completed: dateCompleted,
          checklist: updatedChecklist
        })
      });

      if (res.ok) {
        await fetchVisaSteps();
      }
    } catch (err) {
      console.error('Error updating visa step:', err);
    }
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            res.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <motion.div
      key="visa"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12"
    >
      {/* ─── Hero Overview Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/2 flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden">
          {/* Subtle light background shader */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-slate-100" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" strokeWidth="8"></circle>
              <circle className="text-emerald-500 transition-all duration-1000 ease-out" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" strokeDasharray="390" strokeDashoffset={390 - (390 * progressPercent) / 100} strokeLinecap="round" strokeWidth="8"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-extrabold text-3xl text-emerald-500 font-mono">{progressPercent}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={11} />
              Almost there, {student?.name || 'Aryan'}!
            </div>
            <h2 className="text-[#001F3F] font-extrabold text-xl sm:text-2xl leading-snug">
              Your Visa Prep is in Progress
            </h2>
            <p className="text-xs text-slate-450 leading-relaxed max-w-lg">
              You have completed <span className="font-bold text-[#001F3F]">{completedChecklistItems} of {totalChecklistItems}</span> checklist items. Next, pay your application fee and book your mock interview session with Counselor {student?.assignedAgentName || 'your Counselor'}.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <button 
                onClick={() => setActiveTab('agent-chat')}
                className="bg-[#001F3F] hover:bg-[#001F3F]/90 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition duration-200 active:scale-95 flex items-center gap-2 cursor-pointer shadow-md shadow-[#001F3F]/15"
              >
                <CalendarDays size={14} />
                Book Mock Interview
              </button>
              <button 
                onClick={() => {
                  const checklistContent = steps.map(s => 
                    `[${s.status.toUpperCase()}] ${s.name}\n` + 
                    s.checklist.map(c => `  - [${c.completed ? 'x' : ' '}] ${c.label}`).join('\n')
                  ).join('\n\n');
                  const blob = new Blob([`Visa Tracking Log - ${student?.name || 'Student'}\n\n` + checklistContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `visa-progress-${student?.name || 'student'}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="bg-slate-50 hover:bg-slate-100 text-[#001F3F] border border-slate-200 text-xs px-5 py-2.5 rounded-xl font-semibold transition duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                Download Tracking Log
              </button>
            </div>
          </div>
        </div>

        {/* Live Slot Availability */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-900/2 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-[#001F3F] text-base uppercase tracking-tight">Embassy Slots</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Live Availability</p>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-3.5 my-4">
            {consulateSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">{slot.city} Consulate</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                  slot.status === 'warning' 
                    ? 'bg-red-50 text-red-500 font-bold' 
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {slot.date}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-50 pt-3 mt-1">
            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider leading-relaxed block">
              Last updated 5 mins ago. Data sourced from CGI booking queue portal.
            </span>
          </div>
        </div>

      </div>

      {/* ─── Timeline and Resource Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Timeline Block */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xl shadow-slate-900/2">
          <h3 className="font-extrabold text-[#001F3F] text-base sm:text-lg tracking-tight uppercase mb-6 flex items-center gap-3">
            <span className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
              <CheckCircle2 size={18} />
            </span>
            Step-by-Step Visa Tracker
          </h3>
          
          <div className="relative pl-7 border-l-2 border-slate-100 ml-4.5 space-y-8 py-2">
            {steps.map((step) => {
              const isExpanded = expandedStep === step.id;
              const completedCount = step.checklist.filter(c => c.completed).length;
              
              // Node color mapping
              let nodeIcon = <Circle size={10} className="text-slate-450 fill-slate-450" />;
              let nodeColorClass = 'bg-slate-100 border border-slate-250';
              
              if (step.status === 'completed') {
                nodeIcon = <CheckCircle2 size={13} className="text-white fill-emerald-500" />;
                nodeColorClass = 'bg-emerald-500 shadow-lg shadow-emerald-500/25';
              } else if (step.status === 'active') {
                nodeIcon = <Clock size={13} className="text-white fill-amber-500" />;
                nodeColorClass = 'bg-amber-400 animate-pulse shadow-lg shadow-amber-400/25';
              } else if (step.status === 'locked') {
                nodeIcon = <Lock size={12} className="text-slate-400" />;
                nodeColorClass = 'bg-slate-50 border border-slate-200';
              }

              return (
                <div key={step.id} className="relative group">
                  
                  {/* Step Node */}
                  <div className={`absolute -left-[39px] top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 text-white ${nodeColorClass}`}>
                    {nodeIcon}
                  </div>

                  {/* Step Card Wrapper */}
                  <div className={`rounded-2xl border transition-all duration-350 ${
                    step.status === 'locked' 
                      ? 'bg-slate-50/50 border-slate-100 opacity-60 cursor-not-allowed' 
                      : isExpanded 
                      ? 'bg-[#001F3F]/[0.015] border-[#001F3F]/15 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-slate-250 hover:bg-slate-50/20'
                  }`}>
                    
                    {/* Header trigger */}
                    <div 
                      onClick={() => {
                        if (step.status !== 'locked') {
                          setExpandedStep(isExpanded ? null : step.id);
                        }
                      }}
                      className={`p-4 sm:p-5 flex items-center justify-between select-none ${
                        step.status !== 'locked' ? 'cursor-pointer' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className={`text-[13px] sm:text-[14.5px] font-black tracking-tight ${
                          step.status === 'completed' ? 'text-slate-650' : step.status === 'active' ? 'text-amber-600' : 'text-[#001F3F]'
                        }`}>
                          {step.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          {step.status === 'completed' && step.dateCompleted 
                            ? `COMPLETED ON ${step.dateCompleted}` 
                            : step.status === 'active' 
                            ? 'ACTIVE • ACTIONS REQUIRED' 
                            : step.status === 'locked' 
                            ? 'LOCKED' 
                            : 'UPCOMING'}
                        </p>
                      </div>
                      
                      {step.status !== 'locked' && (
                        <div className="flex items-center gap-3">
                          <span className="text-[10.5px] text-slate-400 font-bold bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-0.5">
                            {completedCount} / {step.checklist.length} DONE
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={16} className="text-slate-400" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {isExpanded && step.status !== 'locked' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-slate-100/80 bg-white rounded-b-2xl"
                        >
                          <div className="p-4 sm:p-5 space-y-4">
                            <p className="text-xs text-slate-450 leading-relaxed">
                              {step.description}
                            </p>
                            
                            {/* Checklist */}
                            <div className="space-y-2.5 pt-2">
                              <p className="text-[9.5px] text-[#001F3F] font-black uppercase tracking-wider">Required Checklist</p>
                              {step.checklist.map((item) => (
                                <div 
                                  key={item.id} 
                                  onClick={() => handleChecklistToggle(step.id, item.id)}
                                  className="flex items-center gap-3 px-3 py-2 bg-slate-50 hover:bg-[#001F3F]/5 rounded-xl transition duration-200 cursor-pointer text-xs"
                                >
                                  <div className={`w-4.5 h-4.5 rounded flex items-center justify-center transition-all ${
                                    item.completed 
                                      ? 'bg-emerald-500 text-white' 
                                      : 'border border-slate-300 bg-white'
                                  }`}>
                                    {item.completed && <CheckCircle2 size={12} className="stroke-[3]" />}
                                  </div>
                                  <span className={`font-semibold ${item.completed ? 'text-slate-400 line-through' : 'text-[#001F3F]'}`}>
                                    {item.label}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Documents list */}
                            {step.documents && step.documents.length > 0 && (
                              <div className="space-y-2.5 pt-2">
                                <p className="text-[9.5px] text-[#001F3F] font-black uppercase tracking-wider">Related Files</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {step.documents.map((doc, idx) => (
                                    <a 
                                      key={idx} 
                                      href={doc.url}
                                      className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 rounded-xl transition text-xs font-semibold text-[#001F3F]"
                                    >
                                      <span className="truncate">{doc.name}</span>
                                      <ExternalLink size={13} className="text-slate-400 shrink-0 ml-2" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Assigned Counselor Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-900/2 space-y-5">
            <h3 className="font-extrabold text-[#001F3F] text-base uppercase tracking-tight">Assigned Counselor</h3>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500 p-0.5 relative flex-shrink-0">
                <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden">
                  {/* Standard placeholder initials if avatar missing */}
                  <div className="w-full h-full bg-gradient-to-br from-[#001F3F] to-[#1a3a60] flex items-center justify-center text-white font-extrabold text-sm uppercase">
                    {(student?.assignedAgentName || 'Assigned Counselor').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AC'}
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="min-w-0">
                <p className="font-black text-[#001F3F] text-sm truncate">{student?.assignedAgentName || 'Assigned Counselor'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Senior Visa Expert</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button 
                onClick={() => setActiveTab('agent-chat')}
                className="w-full py-3 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white rounded-xl text-xs font-bold transition duration-200 active:scale-97 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#001F3F]/10"
              >
                <MessageSquare size={14} />
                Send Message
              </button>
              <button 
                onClick={() => setActiveTab('agent-chat')}
                className="w-full py-3 border border-[#001F3F]/15 hover:bg-slate-50 text-[#001F3F] rounded-xl text-xs font-bold transition duration-200 active:scale-97 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar size={14} />
                Schedule Mock Session
              </button>
            </div>
          </div>

          {/* Interview Prep Resources */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-900/2 space-y-4">
            <h3 className="font-extrabold text-[#001F3F] text-base uppercase tracking-tight">Interview Prep Hub</h3>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input 
                type="text" 
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#001F3F] placeholder-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['All', 'F-1 Visa', 'Financials', 'Common Qs'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#001F3F]/5 text-[#001F3F] border-[#001F3F]/20 font-bold'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Resources list */}
            <div className="space-y-3 pt-2">
              <AnimatePresence mode="popLayout">
                {filteredResources.map((res) => (
                  <motion.div 
                    layout
                    key={res.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group cursor-pointer border border-slate-50 bg-slate-50/40 hover:bg-[#001F3F]/[0.01] hover:border-[#001F3F]/15 p-3.5 rounded-2xl transition duration-250 flex items-start gap-3"
                  >
                    <span className="p-1.5 bg-white border border-slate-100 text-[#001F3F] rounded-lg mt-0.5 shrink-0 group-hover:scale-105 transition">
                      <BookOpen size={13} />
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-extrabold text-xs text-[#001F3F] group-hover:text-amber-600 transition truncate">{res.title}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{res.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredResources.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <Info size={16} />
                  No resources found matching the criteria.
                </div>
              )}
            </div>
          </div>

        </aside>

      </div>
    </motion.div>
  );
};
