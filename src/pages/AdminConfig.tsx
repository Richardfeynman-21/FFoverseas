import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  ArrowRight,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  X,
  Check,
} from 'lucide-react';

const NAVY = '#001F3F';
const RED = '#FF0000';

interface Stage {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'pending';
  date: string;
  description: string;
}

const DEFAULT_STAGES: Stage[] = [
  { id: 1, name: 'Profile Submitted', status: 'completed', date: 'May 28, 2026', description: 'Your personal and academic profile has been submitted and recorded in our system.' },
  { id: 2, name: 'Documents Verified', status: 'completed', date: 'Jun 05, 2026', description: 'All submitted documents have been verified and approved by our admissions team.' },
  { id: 3, name: 'University Shortlisted', status: 'current', date: '', description: 'Our experts are shortlisting the best universities matching your profile and preferences.' },
  { id: 4, name: 'Application Sent', status: 'pending', date: '', description: 'Your finalized applications will be dispatched to selected universities.' },
  { id: 5, name: 'Offer Letter', status: 'pending', date: '', description: 'Awaiting acceptance letters and offer confirmations from universities.' },
  { id: 6, name: 'Visa Processing', status: 'pending', date: '', description: 'Visa application preparation, mock interviews, and embassy submission.' },
  { id: 7, name: 'Pre-Departure Briefing', status: 'pending', date: '', description: 'Final orientation including accommodation, travel, and cultural prep.' },
];

export default function AdminConfig() {
  const navigate = useNavigate();

  const [stages, setStages] = useState<Stage[]>(() => {
    const saved = localStorage.getItem('ff_application_stages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_STAGES;
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<'completed' | 'current' | 'pending'>('pending');
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState<'completed' | 'current' | 'pending'>('pending');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const saveToLocalStorage = (newStages: Stage[]) => {
    localStorage.setItem('ff_application_stages', JSON.stringify(newStages));
    setStages(newStages);
    showTempMessage('Configuration saved successfully!', false);
  };

  const showTempMessage = (text: string, isError: boolean) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleStartEdit = (stage: Stage) => {
    setEditingId(stage.id);
    setEditName(stage.name);
    setEditStatus(stage.status);
    setEditDate(stage.date);
    setEditDescription(stage.description);
  };

  const handleSaveEdit = (id: number) => {
    if (!editName.trim()) {
      showTempMessage('Stage name cannot be empty.', true);
      return;
    }
    const updated = stages.map((s) =>
      s.id === id
        ? {
            ...s,
            name: editName.trim(),
            status: editStatus,
            date: editStatus === 'pending' ? '' : editDate.trim(),
            description: editDescription.trim(),
          }
        : s
    );
    saveToLocalStorage(updated);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteStage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      const updated = stages.filter((s) => s.id !== id);
      saveToLocalStorage(updated);
    }
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showTempMessage('Stage name cannot be empty.', true);
      return;
    }
    const newStage: Stage = {
      id: Date.now(),
      name: newName.trim(),
      status: newStatus,
      date: newStatus === 'pending' ? '' : newDate.trim(),
      description: newDescription.trim(),
    };
    const updated = [...stages, newStage];
    saveToLocalStorage(updated);
    setShowAddForm(false);
    setNewName('');
    setNewStatus('pending');
    setNewDate('');
    setNewDescription('');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all stages to defaults? This will overwrite your changes.')) {
      saveToLocalStorage(DEFAULT_STAGES);
    }
  };

  const moveStage = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= stages.length) return;

    const updated = [...stages];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    saveToLocalStorage(updated);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#001F3F] pb-12">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-[#001F3F] text-white py-4 px-6 sm:px-10 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
            <GraduationCap className="w-6 h-6 text-[#FF0000]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight leading-none">Fly & Flourish</h1>
            <p className="text-[9px] font-mono text-[#FF6B6B] tracking-[0.2em] uppercase leading-none mt-1">ADMIN CONTROL PANEL</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] hover:bg-[#cc0000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-97 cursor-pointer"
          >
            <LayoutDashboard size={14} />
            <span>Student Dashboard</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-[#FF0000]/5 blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-[10px] font-mono text-red-700 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse" />
              Application Pipeline Configurator
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#001F3F]">Configure Student Journey</h2>
            <p className="text-gray-450 text-sm max-w-2xl font-medium">
              Modify, rearrange, add, or delete the application milestones. Updates will immediately reflect in the Student Portal Dashboard.
            </p>
          </div>
        </div>

        {/* Action Notifications */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                message.isError
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {message.isError ? <span>⚠️</span> : <CheckCircle2 size={16} />}
                <span>{message.text}</span>
              </div>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Configuration Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#001F3F] hover:bg-[#003166] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-97 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Stage</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-slate-200/50 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400">
            TOTAL STEPS: <span className="font-bold text-[#001F3F]">{stages.length}</span>
          </div>
        </div>

        {/* Add Stage Form Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200"
              >
                <div className="px-6 py-4 bg-[#001F3F] text-white flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Add New Journey Stage</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-white/60 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddStage} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">STAGE NAME</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Flight Booked"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#001F3F] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">STATUS</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#001F3F] transition-colors"
                      >
                        <option value="pending">Pending</option>
                        <option value="current">Current (In Progress)</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">COMPLETION DATE (OPTIONAL)</label>
                      <input
                        type="text"
                        disabled={newStatus === 'pending'}
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        placeholder="e.g. Jun 12, 2026"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#001F3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">DESCRIPTION</label>
                    <textarea
                      required
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Detail what happens during this stage..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#001F3F] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FF0000] hover:bg-[#cc0000] text-white text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Create Stage
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stages List */}
        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isEditing = editingId === stage.id;
            return (
              <motion.div
                key={stage.id}
                layoutId={`stage-card-${stage.id}`}
                className={`bg-white rounded-2xl border transition-all ${
                  isEditing
                    ? 'border-[#001F3F] ring-1 ring-[#001F3F]'
                    : stage.status === 'current'
                    ? 'border-amber-300 shadow-sm shadow-amber-50'
                    : 'border-slate-200/70 hover:shadow-md'
                }`}
              >
                {isEditing ? (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="font-bold text-xs uppercase text-[#001F3F] tracking-wider">Editing Stage Coordinates</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(stage.id)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Save Changes"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Cancel Editing"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">STAGE NAME</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#001F3F] transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">STATUS</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#001F3F] transition-colors"
                          >
                            <option value="pending">Pending</option>
                            <option value="current">Current (In Progress)</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">COMPLETION DATE</label>
                          <input
                            type="text"
                            disabled={editStatus === 'pending'}
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            placeholder="e.g. Jun 05, 2026"
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#001F3F] transition-colors disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#001F3F] transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Left: Reorder Buttons */}
                      <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveStage(idx, 'up')}
                          className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-[#001F3F] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <span className="text-[10px] font-mono font-bold text-slate-300 select-none">{idx + 1}</span>
                        <button
                          disabled={idx === stages.length - 1}
                          onClick={() => moveStage(idx, 'down')}
                          className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-[#001F3F] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      {/* Status Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1.5 ${
                        stage.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        stage.status === 'current' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-50 text-slate-400'
                      }`}>
                        {stage.status === 'completed' ? <CheckCircle2 size={16} /> :
                         stage.status === 'current' ? <Clock size={16} className="animate-pulse" /> :
                         <Circle size={14} />}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-[#001F3F] text-sm leading-none">{stage.name}</h4>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            stage.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            stage.status === 'current' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                            {stage.status.toUpperCase()}
                          </span>
                          {stage.date && (
                            <span className="text-[10px] font-mono text-slate-400">({stage.date})</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{stage.description}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleStartEdit(stage)}
                        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-[#001F3F]/5 hover:text-[#001F3F] transition-colors cursor-pointer"
                        title="Edit Stage"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteStage(stage.id)}
                        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-[#FF0000] transition-colors cursor-pointer"
                        title="Delete Stage"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-mono text-gray-450 hover:text-[#001F3F] transition-colors duration-200 tracking-widest uppercase"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>BACK TO HOME PAGE</span>
          </a>
        </div>
      </div>
    </div>
  );
}
