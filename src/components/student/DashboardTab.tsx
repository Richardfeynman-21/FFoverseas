'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TabKey, Student, ApplicationStage, StudentApplication } from './types';

interface DashboardTabProps {
  student: Student;
  uploadedDocs: number;
  progressPercent: number;
  stages: ApplicationStage[];
  setActiveTab: (key: TabKey) => void;
  applications: StudentApplication[];
  activeApplicationId: string;
  setActiveApplicationId: (id: string) => void;
  docChecks: Record<string, boolean>;
}

interface ActionItem {
  id: number;
  title: string;
  subtitle: string;
  badge: string | null;
  completed: boolean;
  isRed?: boolean;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  student,
  progressPercent,
  stages,
  setActiveTab,
  applications,
  activeApplicationId,
  setActiveApplicationId,
  docChecks,
}) => {
  const getAppLabel = (app: StudentApplication) => {
    let uni = app.universityName;
    if (uni.includes('Toronto')) uni = 'Toronto';
    else if (uni.includes('British Columbia')) uni = 'UBC';
    else if (uni.includes('McGill')) uni = 'McGill';
    else uni = uni.replace('University of ', '').trim();

    let prog = app.programName;
    if (prog.includes('Computer Science')) prog = 'CS';
    else if (prog.includes('Data Science')) prog = 'DS';
    else if (prog.includes('Artificial Intelligence')) prog = 'AI';
    else prog = prog.split(' ').map(w => w[0]).join('').toUpperCase();

    return `${uni} (${prog})`;
  };
  const getShortName = (name: string) => {
    const upper = name.toUpperCase();
    if (upper.includes('PROFILE')) return 'PROFILE';
    if (upper.includes('DOCUMENT')) return 'DOCUMENTS';
    if (upper.includes('SHORTLIST') || upper.includes('UNIVERSIT')) return 'SHORTLIST';
    if (upper.includes('APPLICATION') || upper.includes('SENT') || upper.includes('SUBMISSION')) return 'SUBMISSION';
    if (upper.includes('OFFER')) return 'OFFERS';
    if (upper.includes('VISA')) return 'VISA';
    if (upper.includes('PRE-DEPARTURE') || upper.includes('BRIEFING') || upper.includes('DEPART')) return 'DEPART';
    return name.slice(0, 10).toUpperCase();
  };

  const docMetadata = [
    { id: 'passport', name: 'Passport Copy' },
    { id: 'transcripts', name: 'Academic Transcripts' },
    { id: 'sop', name: 'Statement of Purpose' },
    { id: 'lor', name: 'Letters of Recommendation' },
    { id: 'financial', name: 'Financial Documents' },
    { id: 'english', name: 'English Test Score (IELTS/TOEFL)' },
    { id: 'photos', name: 'Passport Size Photos' },
  ];

  const documentTasks: ActionItem[] = docMetadata
    .filter(d => !docChecks[d.id])
    .map((d, index) => ({
      id: index + 1000,
      title: `Upload ${d.name}`,
      subtitle: 'Required for university application review',
      badge: 'REQUIRED',
      completed: false,
      isRed: true,
    }));

  const [customTasks, setCustomTasks] = useState<ActionItem[]>([]);

  const tasks = [...documentTasks, ...customTasks];

  const toggleTask = (id: number) => {
    if (id >= 1000) {
      // Document task clicked: take user to the Vault tab to upload the document!
      setActiveTab('vault');
      return;
    }
    setCustomTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddNewActionItem = () => {
    const title = prompt('Enter the title for your action item:');
    if (!title || !title.trim()) return;
    const subtitle = prompt('Enter a brief description (optional):') || '';
    const badge = prompt('Enter a badge label (e.g. DUE IN 3D, PLANNING) (optional):') || null;

    const newTask: ActionItem = {
      id: Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      badge: badge ? badge.trim() : null,
      completed: false,
      isRed: badge?.toLowerCase().includes('due') || false,
    };
    setCustomTasks(prev => [...prev, newTask]);
  };

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 md:space-y-8 lg:space-y-10"
    >
      {/* Hero Section */}
      <section className="mb-6 md:mb-8 lg:mb-10 relative overflow-hidden bg-primary-container text-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-secondary/10 rounded-full blur-[60px] md:blur-[80px] lg:blur-[100px] -mr-20 -mt-20 md:-mr-40 md:-mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[180px] h-[180px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] bg-blue-500/10 rounded-full blur-[50px] md:blur-[70px] lg:blur-[80px] -ml-10 -mb-10 md:-ml-20 md:-mb-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-8 lg:gap-10">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display mb-3 md:mb-4 lg:mb-5 tracking-normal leading-tight font-medium">
              Welcome back, {student.name.split(' ')[0]}.
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              Your journey is unfolding beautifully. {applications.length > 0 ? (
                <>
                  Applications for{' '}
                  <span className="text-white font-semibold">{applications.length} {applications.length === 1 ? 'university' : 'universities'}</span>
                  {' '}are <span className="text-white font-semibold italic">{progressPercent}% complete</span>.
                </>
              ) : (
                "Explore universities and start shortlisting courses to begin your applications."
              )}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('progress')}
            className="flex-shrink-0 flex items-center gap-3 bg-secondary text-white px-6 py-3 sm:px-8 sm:py-3.5 lg:px-10 lg:py-4 rounded-full font-label-caps text-xs tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-secondary/40 active:scale-95 font-bold cursor-pointer w-full md:w-auto justify-center"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            RESUME JOURNEY
          </button>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-gutter">
        {/* Key Metrics */}
        <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-gutter mb-2">
          <div className="bento-card glass-card rounded-2xl p-6 md:p-8 flex items-center gap-4 sm:gap-6 justify-start sm:justify-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 flex items-center justify-center text-primary rounded-2xl border border-outline shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-[28px]">
                school
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-label-caps uppercase text-[10px] mb-1">Universities Applied</p>
              <h3 className="text-2xl md:text-3xl font-display text-primary">
                {String(applications.length).padStart(2, '0')}
              </h3>
            </div>
          </div>
          <div className="bento-card glass-card rounded-2xl p-6 md:p-8 flex items-center gap-4 sm:gap-6 justify-start sm:justify-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 flex items-center justify-center text-secondary rounded-2xl border border-outline shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                pending_actions
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-label-caps uppercase text-[10px] mb-1">Pending Actions</p>
              <h3 className="text-2xl md:text-3xl font-display text-primary">
                {String(tasks.filter(t => !t.completed).length).padStart(2, '0')}
              </h3>
            </div>
          </div>
          <div className="bento-card glass-card rounded-2xl p-6 md:p-8 flex items-center gap-4 sm:gap-6 justify-start sm:justify-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 flex items-center justify-center text-slate-400 rounded-2xl border border-outline shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-[28px]">
                calendar_today
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-label-caps uppercase text-[10px] mb-1">Days to Intake</p>
              <h3 className="text-2xl md:text-3xl font-display text-primary">
                {Math.max(0, Math.ceil((new Date('2026-09-01T00:00:00Z').getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
              </h3>
            </div>
          </div>
        </div>

        {/* Next Steps Widget */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 sm:p-10 bento-card">
          <div className="flex justify-between items-center mb-6 sm:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-display text-primary mb-1">Priority Actions</h2>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                {tasks.filter(t => !t.completed).length} Tasks Remaining
              </p>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="space-y-4 sm:space-y-5">
            {tasks.map(task => (
              <label
                key={task.id}
                className={`flex items-center gap-3 sm:gap-5 rounded-2xl border border-outline hover:border-slate-300 transition-all cursor-pointer group py-3 px-4 sm:py-4 sm:px-6 ${
                  task.completed ? 'bg-slate-50/50' : 'bg-white/40 hover:bg-white/80'
                }`}
              >
                <div className="relative flex items-center justify-center shrink-0">
                  <input
                    className="peer w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-outline-variant text-secondary focus:ring-0 cursor-pointer appearance-none checked:bg-secondary checked:border-secondary transition-all"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="material-symbols-outlined absolute text-[12px] sm:text-[14px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                    check
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-primary group-hover:text-secondary transition-colors text-sm sm:text-base truncate ${
                      task.completed ? 'line-through opacity-40' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.subtitle && (
                    <p className="text-label-mono text-on-surface-variant text-[11px] sm:text-[12px] mt-0.5 truncate">{task.subtitle}</p>
                  )}
                </div>
                {task.badge && (
                  <span
                    className={`font-label-caps text-[8px] sm:text-[9px] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border shrink-0 ${
                      task.isRed
                        ? 'text-secondary bg-secondary/5 border-secondary/10'
                        : 'text-slate-400 bg-slate-100 border-transparent'
                    }`}
                  >
                    {task.badge}
                  </span>
                )}
              </label>
            ))}
          </div>
          <button
            onClick={handleAddNewActionItem}
            className="w-full mt-6 sm:mt-10 py-3 sm:py-4 border border-dashed border-outline text-on-surface-variant rounded-2xl text-[10px] sm:text-[11px] font-label-caps tracking-widest hover:bg-slate-50 transition-all hover:border-slate-400 cursor-pointer"
          >
            + CREATE NEW ACTION ITEM
          </button>
        </div>

        {/* Recent Activities Feed */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-gutter">
          <div className="glass-card rounded-2xl p-6 sm:p-10 bento-card flex-1">
            <h2 className="text-xl sm:text-2xl font-display text-primary mb-6 sm:mb-10">Live Updates</h2>
            <div className="relative space-y-6 sm:space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
              {stages.length > 0 ? (
                stages.slice(0, 3).map((stage, idx) => (
                  <div key={stage.id || idx} className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-white border flex items-center justify-center z-10 ${
                      stage.status === 'completed'
                        ? 'border-emerald-500 text-emerald-500'
                        : stage.status === 'current'
                        ? 'border-secondary text-secondary'
                        : 'border-slate-300 text-slate-300'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        stage.status === 'completed'
                          ? 'bg-emerald-500'
                          : stage.status === 'current'
                          ? 'bg-secondary'
                          : 'bg-slate-300'
                      }`}></div>
                    </div>
                    <p className="font-semibold text-primary text-sm sm:text-base">
                      {stage.name}
                    </p>
                    <p className="text-[11px] sm:text-[12px] text-on-surface-variant mt-1">
                      {stage.status === 'completed'
                        ? `Stage completed successfully${stage.date ? ` on ${stage.date}` : ''}.`
                        : stage.status === 'current'
                        ? 'This stage is currently in progress.'
                        : 'Pending next steps in your application.'}
                    </p>
                    {stage.date && (
                      <p className="text-[9px] text-slate-400 mt-2 font-label-caps">{stage.date.toUpperCase()}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400 italic">No recent application updates found.</p>
                </div>
              )}
            </div>
          </div>
          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <button
              onClick={() => setActiveTab('universities')}
              className="bg-primary p-5 sm:p-6 rounded-2xl text-white group text-left transition-all hover:bg-slate-800 shadow-xl shadow-slate-200 bento-card relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12"></div>
              <span className="material-symbols-outlined mb-3 sm:mb-4 block text-slate-400 group-hover:text-white transition-colors">
                list_alt
              </span>
              <p className="font-label-caps text-[8px] sm:text-[9px] tracking-[0.2em] opacity-70 mb-1 sm:mb-2">DIRECTORY</p>
              <p className="text-xs sm:text-sm font-semibold">UNIVERSITY LIST</p>
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className="bg-white border border-outline p-5 sm:p-6 rounded-2xl text-primary text-left group transition-all hover:bg-slate-50 bento-card shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined mb-3 sm:mb-4 block text-secondary">folder_shared</span>
              <p className="font-label-caps text-[8px] sm:text-[9px] tracking-[0.2em] text-on-surface-variant mb-1 sm:mb-2">REPOSITORY</p>
              <p className="text-xs sm:text-sm font-semibold">DOC VAULT</p>
            </button>
          </div>
        </div>

        {/* Bottom Progress Section */}
        <div className="lg:col-span-12 mt-4 lg:mt-8 glass-card rounded-3xl p-6 sm:p-12 bento-card">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-100"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="6"
                ></circle>
                <circle
                  className="text-secondary progress-ring"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="58"
                  stroke="currentColor"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  strokeWidth="6"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-display text-primary">{progressPercent}%</span>
                <span className="text-[7px] sm:text-[8px] font-label-caps text-on-surface-variant">TOTAL</span>
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left w-full min-w-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4 text-left">
                <div>
                  <h3 className="text-lg sm:text-xl font-display text-primary font-bold">Your Journey Roadmap</h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 font-light">
                    Select an application to preview its progress stages:
                  </p>
                </div>
                
                {/* Switcher tabs */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/50 p-0.5 rounded-xl overflow-x-auto max-w-full scrollbar-hide shrink-0">
                  {applications.map((app) => {
                    const isAppActive = app.id === activeApplicationId;
                    return (
                      <button
                        key={app.id}
                        onClick={() => setActiveApplicationId(app.id)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                          isAppActive
                            ? 'bg-[#001F3F] text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {getAppLabel(app)}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Stepper Timeline - Fully responsive, dynamic in-flow grid rendering student application stages */}
              <div className="relative w-full py-4">
                <div 
                  className="grid gap-1 sm:gap-2 relative"
                  style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
                >
                  {stages.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isActive = step.status === 'current';

                    return (
                      <div key={step.id} className="flex flex-col items-center relative text-center min-w-0">
                        {/* Connecting Line to next step */}
                        {idx < stages.length - 1 && (
                          <div 
                            className={`absolute left-1/2 w-full top-4 h-0.5 -translate-y-1/2 -z-10 ${
                              isCompleted && stages[idx + 1].status === 'completed'
                                ? 'bg-primary' 
                                : isCompleted && stages[idx + 1].status === 'current'
                                ? 'bg-gradient-to-r from-primary to-secondary/50' 
                                : 'bg-slate-100'
                            }`}
                          />
                        )}

                        {/* Step Circle Node */}
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 ${
                          isCompleted 
                            ? 'border-primary bg-primary text-white shadow-sm' 
                            : isActive 
                            ? 'border-secondary text-secondary font-bold ring-4 ring-secondary/10' 
                            : 'border-slate-200 text-slate-400 bg-white'
                        }`}>
                          {isCompleted ? (
                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                          ) : isActive ? (
                            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                          ) : (
                            <span className="text-xs font-bold font-mono">{idx + 1}</span>
                          )}
                        </div>

                        {/* Step Label */}
                        <span className={`text-[7.5px] min-[400px]:text-[8px] sm:text-[9px] font-label-caps tracking-normal min-[400px]:tracking-wider mt-3 font-semibold leading-tight w-full text-center whitespace-nowrap px-0.5 uppercase ${
                          isActive 
                            ? 'text-secondary font-bold' 
                            : isCompleted 
                            ? 'text-primary font-medium' 
                            : 'text-slate-400'
                        }`}>
                          {getShortName(step.name)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
