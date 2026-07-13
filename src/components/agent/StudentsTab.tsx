'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Search,
  X,
  UserCheck,
  Calendar,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Check,
  Save,
  GraduationCap,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { StudentRecord, PipelineStage } from './types';

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

interface StudentsTabProps {
  students: StudentRecord[];
  handleUpdateStudentStatus: (studentId: string, newStatus: 'lead' | 'in_progress' | 'completed' | 'inactive') => void;
  handleRemoveStudent: (studentId: string) => void;
  handleSaveProfile: (studentId: string, updatedFields: Partial<StudentRecord>) => void;
  loadStagesForStudent: (studentId: string) => PipelineStage[];
  saveStagesForStudent: (studentId: string, stages: PipelineStage[]) => void;
  triggerNotification: (text: string, isError?: boolean) => void;
}

export default function StudentsTab({
  students,
  handleUpdateStudentStatus,
  handleRemoveStudent,
  handleSaveProfile,
  loadStagesForStudent,
  saveStagesForStudent,
  triggerNotification
}: StudentsTabProps) {
  const [studentSubTab, setStudentSubTab] = useState<'in_progress' | 'leads' | 'completed'>('in_progress');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const selectedStudent = students.find(s => s.id === selectedStudentId) || null;

  const [studentStages, setStudentStages] = useState<PipelineStage[]>([]);
  
  // Edit variables
  const [editRemarks, setEditRemarks] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editDegree, setEditDegree] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [editSpecificCourses, setEditSpecificCourses] = useState('');
  const [editIntake, setEditIntake] = useState('');
  const [editGPA, setEditGPA] = useState<number | null>(null);
  const [editPriority, setEditPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Milestone edit states
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [editStageName, setEditStageName] = useState('');
  const [editStageDesc, setEditStageDesc] = useState('');
  const [editStageStatus, setEditStageStatus] = useState<'completed' | 'current' | 'pending'>('pending');
  const [editStageDate, setEditStageDate] = useState('');
  const [showAddStage, setShowAddStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  // Sync details when selection changes
  useEffect(() => {
    if (selectedStudent) {
      const stages = loadStagesForStudent(selectedStudent.id);
      setStudentStages(stages);
      
      setEditRemarks(selectedStudent.remarks || '');
      setEditDestination(selectedStudent.targetDestination || '');
      setEditDegree(selectedStudent.targetDegree || '');
      setEditUniversity(selectedStudent.targetUniversity || '');
      setEditCourse(selectedStudent.targetCourse || '');
      setEditSpecificCourses(selectedStudent.specificCourses || '');
      setEditIntake(selectedStudent.interestedIntake || '');
      setEditGPA(selectedStudent.gpa);
      
      // Default mock priority based on GPA or status
      setEditPriority(selectedStudent.gpa && selectedStudent.gpa > 8.8 ? 'High' : 'Medium');
    } else {
      setStudentStages([]);
    }
  }, [selectedStudentId, selectedStudent]);

  // Sync listener
  useEffect(() => {
    const handleStorageChange = () => {
      if (selectedStudentId) {
        setStudentStages(loadStagesForStudent(selectedStudentId));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage_sync', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage_sync', handleStorageChange);
    };
  }, [selectedStudentId]);

  const handleSave = () => {
    if (!selectedStudent) return;
    const updatedFields: Partial<StudentRecord> = {
      remarks: editRemarks,
      targetDestination: editDestination.trim() || null,
      targetDegree: editDegree.trim() || null,
      targetUniversity: editUniversity.trim() || null,
      targetCourse: editCourse.trim() || null,
      specificCourses: editSpecificCourses.trim() || null,
      interestedIntake: editIntake.trim() || null,
      gpa: editGPA
    };
    handleSaveProfile(selectedStudent.id, updatedFields);
  };

  // Milestone Actions
  const handleStartEditStage = (stage: PipelineStage) => {
    setEditingStageId(stage.id);
    setEditStageName(stage.name);
    setEditStageDesc(stage.description);
    setEditStageStatus(stage.status);
    setEditStageDate(stage.date || new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
  };

  const handleSaveStageEdit = (stageId: number) => {
    if (!selectedStudent) return;
    const updated = studentStages.map(s => {
      if (s.id === stageId) {
        return {
          ...s,
          name: editStageName,
          description: editStageDesc,
          status: editStageStatus,
          date: editStageStatus === 'pending' ? '' : editStageDate
        };
      }
      return s;
    });

    saveStagesForStudent(selectedStudent.id, updated);
    setEditingStageId(null);
    triggerNotification('Timeline stage successfully edited.');
  };

  const handleQuickMarkStage = (stageId: number, status: 'completed' | 'current' | 'pending') => {
    if (!selectedStudent) return;
    const dateStr = status === 'completed' 
      ? new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      : '';
      
    const updated = studentStages.map(s => {
      if (s.id === stageId) {
        return { ...s, status, date: dateStr };
      }
      return s;
    });
    saveStagesForStudent(selectedStudent.id, updated);
    triggerNotification(`Milestone marked as: ${status}`);
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newStageName.trim()) return;

    const newStage: PipelineStage = {
      id: Date.now(),
      name: newStageName.trim(),
      status: 'pending',
      date: '',
      description: newStageDesc.trim()
    };

    const updated = [...studentStages, newStage];
    saveStagesForStudent(selectedStudent.id, updated);
    
    setShowAddStage(false);
    setNewStageName('');
    setNewStageDesc('');
    triggerNotification('Timeline milestone added.');
  };

  const handleDeleteStage = (stageId: number) => {
    if (!selectedStudent) return;
    if (window.confirm('Delete this milestone from the student\'s timeline?')) {
      const updated = studentStages.filter(s => s.id !== stageId);
      saveStagesForStudent(selectedStudent.id, updated);
      triggerNotification('Milestone deleted.', true);
    }
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if (!selectedStudent) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= studentStages.length) return;

    const reordered = [...studentStages];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    saveStagesForStudent(selectedStudent.id, reordered);
    triggerNotification('Milestone reordered.');
  };

  const activeStudents = students.filter(s => s.status === 'in_progress');
  const leadStudents = students.filter(s => s.status === 'lead' || s.status === 'inactive');
  const completedStudents = students.filter(s => s.status === 'completed');

  const filteredStudentsList = () => {
    let list = students;
    if (studentSubTab === 'in_progress') list = activeStudents;
    else if (studentSubTab === 'leads') list = leadStudents;
    else if (studentSubTab === 'completed') list = completedStudents;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.email.toLowerCase().includes(term) || 
        (s.targetDestination && s.targetDestination.toLowerCase().includes(term))
      );
    }
    return list;
  };

  // Percentage completion for current selected student
  const completedStagesCount = studentStages.filter(s => s.status === 'completed').length;
  const percentComplete = studentStages.length ? Math.round((completedStagesCount / studentStages.length) * 100) : 0;

  return (
    <motion.div className="space-y-6 bg-white" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Header section */}
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5" variants={staggerItem}>
        <div>
          <h2 className="text-xl sm:text-2.5xl font-black tracking-tight text-[#001F3F] uppercase">Students Directory</h2>
          <p className="text-slate-400 text-xs mt-1 font-semibold">Review student profile cards, configure milestones, and audit timeline logs.</p>
        </div>
      </motion.div>

      {/* Sub-tabs Selection Toolbar */}
      <motion.div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.005)]" variants={staggerItem}>
        <div className="flex p-1 bg-slate-50 border border-slate-200/50 rounded-2xl self-start">
          {[
            { key: 'leads', label: 'Consultation Leads', count: leadStudents.length },
            { key: 'in_progress', label: 'In Progress', count: activeStudents.length },
            { key: 'completed', label: 'Completed Process', count: completedStudents.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setStudentSubTab(tab.key as any); setSelectedStudentId(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                studentSubTab === tab.key 
                  ? 'bg-slate-100 text-[#001F3F] shadow-2xs border border-slate-200/20' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-lg font-mono font-bold ${
                studentSubTab === tab.key ? 'bg-[#001F3F]/10 text-[#001F3F]' : 'bg-slate-200/60 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search filter input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student details..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 transition-all shadow-2xs"
          />
        </div>
      </motion.div>

      {/* List and Details Layout Grid */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-6" variants={staggerItem}>
        {/* Left Column: Student Cards List */}
        <div className={`${selectedStudent ? 'lg:col-span-6 xl:col-span-5' : 'lg:col-span-12'} space-y-3.5 max-h-[750px] overflow-y-auto pr-1 scrollbar-hide`}>
          {filteredStudentsList().length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3 shadow-sm">
              <Users className="w-10 h-10 opacity-20 text-slate-400" />
              <p className="text-xs font-semibold">No student profiles found matching filters</p>
            </div>
          ) : (
            filteredStudentsList().map(st => {
              const stages = loadStagesForStudent(st.id);
              const completedCount = stages.filter(s => s.status === 'completed').length;
              const percent = stages.length ? Math.round((completedCount / stages.length) * 100) : 0;
              const prio = st.gpa && st.gpa > 8.8 ? 'High' : 'Medium';
              
              return (
                <div 
                  key={st.id} 
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`bg-white rounded-3xl p-5 border text-left transition-all cursor-pointer relative overflow-hidden group ${
                    selectedStudent?.id === st.id 
                      ? 'border-[#001F3F] shadow-sm shadow-[#001F3F]/5' 
                      : 'border-slate-100 hover:border-slate-250 shadow-[0_4px_15px_rgba(0,0,0,0.005)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.01)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-extrabold text-xs text-slate-805 group-hover:text-[#001F3F] transition-colors">{st.name}</h4>
                        <span className={`text-[7px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                          st.status === 'lead' ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold' :
                          st.status === 'in_progress' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' :
                          st.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' :
                          'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {st.status.replace('_', ' ')}
                        </span>
                        
                        {/* Priority Badge */}
                        <span className={`text-[7px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${
                          prio === 'High' ? 'bg-amber-50 border-amber-250 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}>
                          {prio} Attention
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px] font-mono font-semibold">{st.email}</p>
                    </div>
                    
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-655 shrink-0 shadow-2xs">
                      {st.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  </div>

                  {/* Metadata layout grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-4 text-[9px] font-mono text-slate-400 font-semibold">
                    <div>COUNTRY: <span className="text-[#001F3F] font-black">{st.targetDestination || 'UNSET'}</span></div>
                    <div>DEGREE: <span className="text-[#001F3F] font-black">{st.targetDegree || 'UNSET'}</span></div>
                    <div>UNIVERSITY: <span className="text-[#001F3F] font-black truncate block">{st.targetUniversity || 'UNSET'}</span></div>
                    <div>COURSE: <span className="text-[#001F3F] font-black truncate block">{st.targetCourse || 'UNSET'}</span></div>
                  </div>

                  {/* Process Progression slider bar */}
                  {st.status === 'in_progress' && (
                    <div className="mt-4 space-y-1">
                      <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 font-bold">
                        <span>TRANSITION PIPELINE PROGRESS</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-[#001F3F]" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Lead progress buttons */}
                  {st.status === 'lead' && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStudentStatus(st.id, 'in_progress');
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                      >
                        Enroll & Start Process
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStudentStatus(st.id, 'inactive');
                        }}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                      >
                        Mark Inactive
                      </button>
                    </div>
                  )}

                  {st.status === 'inactive' && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStudentStatus(st.id, 'lead');
                        }}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-700 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                      >
                        Re-activate Lead
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStudent(st.id);
                        }}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                      >
                        Delete Record
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed slide drawer */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-6 xl:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-[0_4px_25px_rgba(0,0,0,0.005)]"
            >
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-sm font-black text-indigo-700 font-mono shrink-0 shadow-2xs">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-[#001F3F] leading-none mt-0.5">{selectedStudent.name}</h3>
                      <button onClick={() => setSelectedStudentId(null)} className="lg:hidden text-slate-400 hover:text-slate-800">
                        <X size={15} />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono font-semibold mt-1.5 leading-none">{selectedStudent.email} · {selectedStudent.phone}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedStudentId(null)} 
                  className="hidden lg:flex p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Horizontal Interactive Timeline Panel */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.004)] space-y-4">
                <div className="flex items-center justify-between text-xs font-extrabold uppercase text-[#001F3F] tracking-tight pb-2 border-b border-slate-100">
                  <span className="flex items-center gap-2">
                    <Bookmark size={13} className="text-indigo-600" />
                    <span>Progress Pipeline Timeline</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-150">{percentComplete}% Done</span>
                </div>
                
                <div className="relative flex items-center justify-between py-2 px-1">
                  {/* Connecting bar */}
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-[#001F3F] transition-all duration-500" 
                      style={{ width: `${percentComplete}%` }} 
                    />
                  </div>
                  
                  {/* Pipeline Step Nodes */}
                  {studentStages.map((stage, idx) => {
                    const isCompleted = stage.status === 'completed';
                    const isCurrent = stage.status === 'current';
                    
                    return (
                      <button
                        key={stage.id}
                        title={`${stage.name}: ${stage.description || 'No description'}`}
                        onClick={() => handleQuickMarkStage(stage.id, isCompleted ? 'pending' : 'completed')}
                        className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                      >
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 shadow-2xs ${
                          isCompleted ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/10' :
                          isCurrent ? 'bg-indigo-50 border-indigo-400 text-indigo-700 animate-pulse' :
                          'bg-white border-slate-200 text-slate-400 hover:border-slate-350'
                        }`}>
                          {isCompleted ? <Check size={11} /> : <span className="text-[9px] font-mono font-bold">{idx + 1}</span>}
                        </div>
                        
                        <span className="absolute top-10 text-[7px] font-mono font-bold text-slate-400 group-hover:text-[#001F3F] transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] uppercase">
                          {stage.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
                {/* Form fields: profile metadata */}
                <div className="bg-slate-50/20 p-5 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#001F3F] tracking-tight">
                    <UserCheck size={13} className="text-indigo-600" />
                    <span>Admission Profile & Interests</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Target Country</label>
                      <input 
                        type="text" 
                        value={editDestination} 
                        onChange={(e) => setEditDestination(e.target.value)}
                        placeholder="Not updated"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Target Degree</label>
                      <input 
                        type="text" 
                        value={editDegree} 
                        onChange={(e) => setEditDegree(e.target.value)}
                        placeholder="Not updated"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Target University</label>
                      <input 
                        type="text" 
                        value={editUniversity} 
                        onChange={(e) => setEditUniversity(e.target.value)}
                        placeholder="Not updated"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Target Course</label>
                      <input 
                        type="text" 
                        value={editCourse} 
                        onChange={(e) => setEditCourse(e.target.value)}
                        placeholder="Not updated"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Specific Courses Interested</label>
                      <input 
                        type="text" 
                        value={editSpecificCourses} 
                        onChange={(e) => setEditSpecificCourses(e.target.value)}
                        placeholder="Not updated"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Interested Intake</label>
                      <input 
                        type="text" 
                        value={editIntake} 
                        onChange={(e) => setEditIntake(e.target.value)}
                        placeholder="Not updated"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Academic GPA</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={editGPA === null ? '' : editGPA} 
                        onChange={(e) => setEditGPA(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Not updated"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Audit Attention Priority</label>
                      <select 
                        value={editPriority} 
                        onChange={(e) => setEditPriority(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs cursor-pointer font-bold"
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Remarks on Student</label>
                    <textarea 
                      rows={3}
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      placeholder="Add administrative remarks regarding SOP drafts, visa slots, or university matching probability."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs transition-all resize-none font-medium"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <label className="text-[8px] font-mono text-slate-450 uppercase font-bold">Status:</label>
                      <select
                        value={selectedStudent.status}
                        onChange={(e) => handleUpdateStudentStatus(selectedStudent.id, e.target.value as any)}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs"
                      >
                        <option value="lead">Lead</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#001F3F] hover:bg-slate-800 text-white text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all active:scale-[0.97] cursor-pointer shadow-sm"
                    >
                      <Save size={12} />
                      <span>Save Profile & Remarks</span>
                    </button>
                  </div>
                </div>

                {/* Milestone list editor */}
                <div className="bg-slate-50/20 p-5 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#001F3F] tracking-tight">
                      <Calendar size={13} className="text-indigo-600" />
                      <span>Detailed Milestone Editor</span>
                    </div>
                    
                    <button
                      onClick={() => setShowAddStage(true)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[9px] font-bold uppercase rounded-lg hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                    >
                      <Plus size={10} />
                      <span>Add Milestone Step</span>
                    </button>
                  </div>

                  {showAddStage && (
                    <motion.form 
                      onSubmit={handleAddStage}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Stage Name</label>
                          <input 
                            type="text" required value={newStageName} onChange={(e) => setNewStageName(e.target.value)}
                            placeholder="e.g. Visa Approved"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-400 uppercase font-bold">Description</label>
                          <input 
                            type="text" required value={newStageDesc} onChange={(e) => setNewStageDesc(e.target.value)}
                            placeholder="e.g. Received visual stamp clearance"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 text-[9px] font-bold">
                        <button type="button" onClick={() => setShowAddStage(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600">Cancel</button>
                        <button type="submit" className="px-3 py-1.5 bg-[#001F3F] text-white rounded-lg hover:bg-slate-800 shadow-2xs">Create</button>
                      </div>
                    </motion.form>
                  )}

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                    {studentStages.map((stage, idx) => {
                      const isEditing = editingStageId === stage.id;
                      
                      return (
                        <div 
                          key={stage.id} 
                          className={`p-3.5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs bg-white ${
                            isEditing ? 'border-[#001F3F]/40 shadow-xs' : 'border-slate-100 shadow-2xs'
                          }`}
                        >
                          {isEditing ? (
                            <div className="w-full space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <input 
                                  type="text" value={editStageName} onChange={(e) => setEditStageName(e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 font-bold focus:outline-none"
                                />
                                <select 
                                  value={editStageStatus} 
                                  onChange={(e) => setEditStageStatus(e.target.value as any)}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="current">Current</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>
                              <input 
                                type="text" value={editStageDesc} onChange={(e) => setEditStageDesc(e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-500 focus:outline-none"
                                placeholder="Description..."
                              />
                              {editStageStatus !== 'pending' && (
                                <input 
                                  type="text" value={editStageDate} onChange={(e) => setEditStageDate(e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-500 focus:outline-none"
                                  placeholder="Milestone Date (e.g. Jun 26, 2026)"
                                />
                              )}
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => handleSaveStageEdit(stage.id)} className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/80"><Check size={12} /></button>
                                <button onClick={() => setEditingStageId(null)} className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"><X size={12} /></button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="flex flex-col items-center justify-center shrink-0">
                                  <button disabled={idx === 0} onClick={() => handleMoveStage(idx, 'up')} className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-10"><ArrowUp size={11} /></button>
                                  <span className="text-[9px] font-mono font-bold text-[#001F3F]">{idx + 1}</span>
                                  <button disabled={idx === studentStages.length - 1} onClick={() => handleMoveStage(idx, 'down')} className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-10"><ArrowDown size={11} /></button>
                                </div>
                                
                                <div className="min-w-0 flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-extrabold text-[#001F3F] truncate text-xs">{stage.name}</h5>
                                    <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                      stage.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                      stage.status === 'current' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse' :
                                      'bg-slate-50 text-slate-400 border border-slate-200'
                                    }`}>
                                      {stage.status}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-normal font-semibold truncate">{stage.description}</p>
                                  {stage.date && (
                                    <span className="text-[8px] font-mono text-slate-450 font-bold block pt-0.5">Cleared: {stage.date}</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                {stage.status !== 'completed' ? (
                                  <button 
                                    onClick={() => handleQuickMarkStage(stage.id, 'completed')}
                                    className="px-2 py-1 bg-emerald-50 border border-emerald-250 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                                  >
                                    Clear
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleQuickMarkStage(stage.id, 'pending')}
                                    className="px-2 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                                  >
                                    Revert
                                  </button>
                                )}
                                <button onClick={() => handleStartEditStage(stage)} className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-550 hover:text-slate-805 hover:bg-slate-100 shadow-2xs cursor-pointer"><Edit2 size={11} /></button>
                                <button onClick={() => handleDeleteStage(stage.id)} className="p-1.5 rounded-lg bg-red-50/50 border border-red-200 text-red-650 hover:text-red-700 hover:bg-red-100 shadow-2xs cursor-pointer"><Trash2 size={11} /></button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
