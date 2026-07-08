import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  MessageSquare,
  Activity,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Clock,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Database,
  Search,
  Filter,
  Check,
  Send
} from 'lucide-react';

const NAVY = '#001F3F';
const RED = '#FF0000';

// Types mimicking backend models
interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetDestination: string;
  targetDegree: string;
  gpa: number;
  status: 'active' | 'inactive';
}

interface ApplicationRecord {
  id: string;
  studentName: string;
  universityName: string;
  program: string;
  status: 'Applied' | 'Offered' | 'Accepted' | 'Rejected';
  appliedDate: string;
}

interface DocumentRecord {
  id: string;
  studentName: string;
  documentType: 'Passport' | 'Transcript' | 'SOP' | 'LOR';
  fileName: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
  uploadedAt: string;
}

interface UniversityRecord {
  id: string;
  name: string;
  country: string;
  qsRanking: string;
  tuitionRange: string;
  acceptanceRate: string;
}

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  destination: string;
  degree: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

interface PipelineStage {
  id: number;
  name: string;
  description: string;
  sort_order: number;
}

interface ChatLogRecord {
  id: string;
  sessionId: string;
  message: string;
  reply: string;
  createdAt: string;
}

// ─── Default seed data mimicking backend models ───────────────────────────────
const DEFAULT_STUDENTS: StudentRecord[] = [
  { id: 'st-01', name: 'Test Student', email: 'student@email.com', phone: '+919876543210', targetDestination: 'Canada', targetDegree: 'Masters', gpa: 8.5, status: 'active' },
  { id: 'st-02', name: 'Aanya Sharma', email: 'aanya@sharma.com', phone: '+918889990001', targetDestination: 'USA', targetDegree: 'MS CS', gpa: 9.2, status: 'active' },
  { id: 'st-03', name: 'Ethan Dubois', email: 'ethan@dubois.fr', phone: '+33612345678', targetDestination: 'UK', targetDegree: 'MBA', gpa: 8.1, status: 'active' },
];

const DEFAULT_APPLICATIONS: ApplicationRecord[] = [
  { id: 'ap-01', studentName: 'Test Student', universityName: 'University of Waterloo', program: 'Computer Science (Co-op)', status: 'Applied', appliedDate: '2026-06-08' },
  { id: 'ap-02', studentName: 'Aanya Sharma', universityName: 'Stanford University', program: 'Artificial Intelligence', status: 'Offered', appliedDate: '2026-05-15' },
  { id: 'ap-03', studentName: 'Ethan Dubois', universityName: 'London Business School', program: 'MBA in Finance', status: 'Accepted', appliedDate: '2026-05-20' },
];

const DEFAULT_DOCUMENTS: DocumentRecord[] = [
  { id: 'doc-01', studentName: 'Test Student', documentType: 'Passport', fileName: 'passport_scan.pdf', status: 'Verified', uploadedAt: '2026-05-28' },
  { id: 'doc-02', studentName: 'Test Student', documentType: 'Transcript', fileName: 'undergrad_transcript.pdf', status: 'Verified', uploadedAt: '2026-06-05' },
  { id: 'doc-03', studentName: 'Test Student', documentType: 'SOP', fileName: 'sop_draft_v3.docx', status: 'Pending Review', uploadedAt: '2026-06-12' },
  { id: 'doc-04', studentName: 'Aanya Sharma', documentType: 'LOR', fileName: 'lor_stanford_rec.pdf', status: 'Verified', uploadedAt: '2026-05-10' },
];

const DEFAULT_UNIVERSITIES: UniversityRecord[] = [
  { id: 'uni-01', name: 'Stanford University', country: 'USA', qsRanking: 'QS #5', tuitionRange: '$58k - $64k/yr', acceptanceRate: '3.9%' },
  { id: 'uni-02', name: 'University of Oxford', country: 'UK', qsRanking: 'QS #3', tuitionRange: '£28k - £44k/yr', acceptanceRate: '17.0%' },
  { id: 'uni-03', name: 'University of Toronto', country: 'Canada', qsRanking: 'QS #21', tuitionRange: 'CAD 45k - 62k/yr', acceptanceRate: '43.0%' },
  { id: 'uni-04', name: 'Technical University of Munich', country: 'Germany', qsRanking: 'QS #37', tuitionRange: '€0 (Public)', acceptanceRate: '8.0%' },
];

const DEFAULT_LEADS: LeadRecord[] = [
  { id: 'ld-01', name: 'Vikram Singh', email: 'vikram.s@outlook.com', destination: 'USA', degree: 'master', status: 'New', createdAt: '2026-06-14 10:15' },
  { id: 'ld-02', name: 'Priya Patel', email: 'priya.patel@gmail.com', destination: 'Germany', degree: 'bachelor', status: 'Contacted', createdAt: '2026-06-12 14:30' },
];

const DEFAULT_PIPELINE_STAGES: PipelineStage[] = [
  { id: 1, name: 'Profile Submitted', description: 'Student personal and academic profile recorded.', sort_order: 1 },
  { id: 2, name: 'Documents Verified', description: 'Submitted documents verified by admissions team.', sort_order: 2 },
  { id: 3, name: 'University Shortlisted', description: 'Best-fit universities matched to student profile.', sort_order: 3 },
  { id: 4, name: 'Application Sent', description: 'Finalized applications dispatched to universities.', sort_order: 4 },
  { id: 5, name: 'Offer Letter', description: 'Acceptance letters and offer confirmations received.', sort_order: 5 },
  { id: 6, name: 'Visa Processing', description: 'Visa prep, mock interviews, and embassy submission.', sort_order: 6 },
  { id: 7, name: 'Pre-Departure Briefing', description: 'Final orientation: accommodation, travel, cultural prep.', sort_order: 7 }
];

const DEFAULT_CHAT_LOGS: ChatLogRecord[] = [
  { id: 'ch-01', sessionId: 'sess_982', message: 'Do you cover USA universities?', reply: 'Yes! We specialize in USA admissions, matching profiles to Ivy Leagues and leading tech hubs.', createdAt: '2026-06-14 21:05' },
  { id: 'ch-02', sessionId: 'sess_119', message: 'What is the visa success rate?', reply: 'We hold a near-perfect 98.4% visa success rate globally, backed by custom visa mocks.', createdAt: '2026-06-14 21:12' }
];

// Animation Variants
const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 13 } }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
} as const;

interface AdminPanelProps {
  adminProfile: { name: string; role: string } | null;
  onLogout: () => void;
}

export default function AdminPanel({ adminProfile, onLogout }: AdminPanelProps) {
  const router = useRouter();

  // Layout Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'applications' | 'documents' | 'universities' | 'leads' | 'chat' | 'health'>('overview');

  // Database State (Seeded locally but links to backend logical models)
  const [students, setStudents] = useState<StudentRecord[]>(DEFAULT_STUDENTS);
  const [applications, setApplications] = useState<ApplicationRecord[]>(DEFAULT_APPLICATIONS);
  const [documents, setDocuments] = useState<DocumentRecord[]>(DEFAULT_DOCUMENTS);
  const [universities, setUniversities] = useState<UniversityRecord[]>(DEFAULT_UNIVERSITIES);
  const [leads, setLeads] = useState<LeadRecord[]>(DEFAULT_LEADS);
  
  // Seed stages from localStorage if present to stay in sync with StudentDashboard
  const [stages, setStages] = useState<PipelineStage[]>(() => {
    const saved = localStorage.getItem('ff_application_stages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PIPELINE_STAGES;
  });

  const [chatLogs, setChatLogs] = useState<ChatLogRecord[]>(DEFAULT_CHAT_LOGS);

  // Health check state
  const [dbHealth, setDbHealth] = useState<{ status: string; database: string; timestamp: number } | null>(null);
  const [healthChecking, setHealthChecking] = useState(false);

  // Dynamic forms state
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [editStageName, setEditStageName] = useState('');
  const [editStageDesc, setEditStageDesc] = useState('');
  const [showAddStage, setShowAddStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  const [notification, setNotification] = useState<{ text: string; isError: boolean } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch db health check on mount or when tab changes to health
  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'health') {
      checkDatabaseHealth();
    }
  }, [activeTab]);

  // Sync stages edit to localStorage so Student Dashboard sees them
  useEffect(() => {
    localStorage.setItem('ff_application_stages', JSON.stringify(stages));
  }, [stages]);

  const triggerNotification = (text: string, isError = false) => {
    setNotification({ text, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  // ─── API Methods ─────────────────────────────────────────────────────────────
  
  const checkDatabaseHealth = async () => {
    setHealthChecking(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setDbHealth(data);
      } else {
        setDbHealth({ status: 'unhealthy', database: 'disconnected', timestamp: Date.now() });
      }
    } catch (e) {
      setDbHealth({ status: 'offline', database: 'unreachable', timestamp: Date.now() });
    } finally {
      setHealthChecking(false);
    }
  };

  // ─── Journey pipeline configuration helpers ────────────────────────────────

  const moveStage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= stages.length) return;
    
    const reordered = [...stages];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    // Re-index sort order
    const updated = reordered.map((stage, idx) => ({
      ...stage,
      sort_order: idx + 1
    }));

    setStages(updated);
    triggerNotification('Milestones order calibrated.');
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage: PipelineStage = {
      id: Date.now(),
      name: newStageName.trim(),
      description: newStageDesc.trim(),
      sort_order: stages.length + 1
    };

    setStages([...stages, newStage]);
    setShowAddStage(false);
    setNewStageName('');
    setNewStageDesc('');
    triggerNotification('Pipeline milestone added.');
  };

  const handleDeleteStage = (id: number) => {
    if (window.confirm('Delete this milestone from student pipeline?')) {
      const filtered = stages.filter(s => s.id !== id).map((s, idx) => ({
        ...s,
        sort_order: idx + 1
      }));
      setStages(filtered);
      triggerNotification('Milestone deleted.');
    }
  };

  const handleStartEditStage = (stage: PipelineStage) => {
    setEditingStageId(stage.id);
    setEditStageName(stage.name);
    setEditStageDesc(stage.description);
  };

  const handleSaveStageEdit = (id: number) => {
    const updated = stages.map(s => 
      s.id === id ? { ...s, name: editStageName, description: editStageDesc } : s
    );
    setStages(updated);
    setEditingStageId(null);
    triggerNotification('Milestone updated.');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] font-sans selection:bg-[#FF0000]/15 selection:text-white pb-10 flex flex-col lg:flex-row w-full">
      
      {/* Dynamic notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl border flex items-center gap-3 shadow-xl backdrop-blur-md ${
              notification.isError 
                ? 'bg-red-950/80 border-red-500/30 text-red-200' 
                : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
            }`}
          >
            <CheckCircle2 size={16} className={notification.isError ? 'text-red-400' : 'text-emerald-400'} />
            <span className="text-xs font-semibold font-mono tracking-wide">{notification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-72 bg-[#0c121f] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Branding Banner */}
          <div className="px-6 py-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md">
              <img src="/logo.svg" className="w-full h-full object-contain" alt="Fly & Flourish Logo" />
            </div>
            <div>
              <h2 className="text-white font-black text-sm tracking-tight leading-none">Fly & Flourish</h2>
              <p className="text-[8px] font-mono text-[#FF6B6B] tracking-[0.2em] uppercase leading-none mt-1">ADMIN PORTAL</p>
            </div>
          </div>

          {/* Admin profile detail summary */}
          {adminProfile && (
            <div className="px-6 py-4 border-b border-white/5 bg-slate-900/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/20 flex items-center justify-center text-xs font-black text-[#FF6B6B] font-mono select-none">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-bold truncate leading-none">{adminProfile.name}</p>
                <p className="text-[9px] font-mono text-slate-500 truncate leading-none mt-1.5 uppercase tracking-wider">{adminProfile.role}</p>
              </div>
            </div>
          )}

          {/* Sidebar Action tabs */}
          <nav className="p-4 space-y-1">
            {[
              { key: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { key: 'journey', label: 'Milestones Builder', icon: Users },
              { key: 'applications', label: 'Applications Hub', icon: TrendingUp },
              { key: 'documents', label: 'Document Audits', icon: FileText },
              { key: 'universities', label: 'Universities Manager', icon: Building2 },
              { key: 'leads', label: 'Consultation Leads', icon: Sparkles },
              { key: 'chat', label: 'Chatbot Logs', icon: MessageSquare },
              { key: 'health', label: 'System Health', icon: Activity }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key as any); setSearchTerm(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/10' 
                      : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout panel */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/40 hover:bg-red-900/40 text-red-300 rounded-xl text-xs font-bold transition-all border border-red-500/10 cursor-pointer"
          >
            <LogOut size={14} />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONFIGURATION PANEL */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 space-y-6">
        
        {/* ───── TAB 1: OVERVIEW ───── */}
        {activeTab === 'overview' && (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={staggerItem}>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">System Metrics</h2>
                <p className="text-slate-400 text-xs mt-1">Cross-platform overview of the consultancy pipelines.</p>
              </div>
              <button 
                onClick={checkDatabaseHealth} 
                disabled={healthChecking}
                className="self-start px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-[10px] font-bold tracking-widest text-[#FF0000] uppercase hover:bg-slate-800 transition-all cursor-pointer"
              >
                {healthChecking ? 'Pinging Health...' : 'Check Database Link'}
              </button>
            </motion.div>

            {/* Grid stats */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" variants={staggerItem}>
              {[
                { title: 'TOTAL STUDENTS', value: students.length, desc: 'Enrolled profiles', color: 'border-blue-500/20 text-blue-400', icon: Users },
                { title: 'APPLICATIONS FILED', value: applications.length, desc: 'Tracked in dashboard', color: 'border-emerald-500/20 text-emerald-400', icon: TrendingUp },
                { title: 'PENDING DOCUMENTS', value: documents.filter(d => d.status === 'Pending Review').length, desc: 'Awaiting audit approval', color: 'border-amber-500/20 text-amber-400', icon: FileText },
                { title: 'DATABASE LINK', value: dbHealth?.status === 'healthy' ? 'CONNECTED' : 'STANDBY', desc: dbHealth?.database || 'Pending ping check', color: dbHealth?.status === 'healthy' ? 'border-emerald-500/20 text-emerald-400' : 'border-red-500/20 text-red-400', icon: Database }
              ].map((stat, i) => (
                <div key={i} className={`bg-[#0c121f] rounded-2xl p-5 border shadow-sm ${stat.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">{stat.title}</span>
                    <stat.icon size={15} className="opacity-40" />
                  </div>
                  <p className="text-2xl font-black text-white mt-2 leading-none">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">{stat.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Database Connectivity Banner */}
            <motion.div className="bg-[#0c121f] rounded-2xl border border-white/5 p-6" variants={staggerItem}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 shrink-0 border border-white/10">
                  <Database size={18} />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">Database Core Engine</h4>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      dbHealth?.status === 'healthy' ? 'bg-emerald-950/60 border-emerald-500/20 text-emerald-400' : 'bg-amber-950/60 border-amber-500/20 text-amber-400'
                    }`}>
                      {dbHealth?.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    This administrative page automatically cross-references and matches the data schemas defined in the backend models (<code className="text-[#FF6B6B] font-mono text-[10px]">app/models/</code>). 
                    To store changes permanently, ensure the FastAPI database engine is running locally.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ───── TAB 2: MILESTONES BUILDER (JOURNEY) ───── */}
        {activeTab === 'journey' && (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={staggerItem}>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Journey Milestones</h2>
                <p className="text-slate-400 text-xs mt-1">Rearrange, add, or configure pipeline stages visible in the Student Portal.</p>
              </div>
              <button 
                onClick={() => setShowAddStage(true)}
                className="self-start flex items-center gap-1.5 px-4 py-2.5 bg-[#FF0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-97 cursor-pointer"
              >
                <Plus size={14} />
                <span>Create Milestone</span>
              </button>
            </motion.div>

            {/* Add stage modal */}
            <AnimatePresence>
              {showAddStage && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-[#0e1626] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                  >
                    <div className="px-6 py-4 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-white">Create Journey Stage</h3>
                      <button onClick={() => setShowAddStage(false)} className="text-slate-400 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>
                    <form onSubmit={handleAddStage} className="p-6 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">STAGE NAME</label>
                        <input 
                          type="text" required value={newStageName} onChange={(e) => setNewStageName(e.target.value)}
                          placeholder="e.g. Visa Interview Conducted"
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF0000]/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">DESCRIPTION</label>
                        <textarea 
                          required rows={3} value={newStageDesc} onChange={(e) => setNewStageDesc(e.target.value)}
                          placeholder="What happens during this step..."
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF0000]/40 resize-none"
                        />
                      </div>
                      <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/5">
                        <button type="button" onClick={() => setShowAddStage(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold uppercase rounded-lg hover:bg-slate-700">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#FF0000] text-white text-xs font-bold uppercase rounded-lg hover:bg-red-600">Create</button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stages List */}
            <motion.div className="space-y-3" variants={staggerItem}>
              {stages.map((stage, idx) => {
                const isEditing = editingStageId === stage.id;
                return (
                  <div 
                    key={stage.id} 
                    className={`bg-[#0c121f] rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isEditing ? 'border-[#FF0000]/40 shadow-lg shadow-red-500/5' : 'border-white/5'
                    }`}
                  >
                    {isEditing ? (
                      <div className="w-full space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" value={editStageName} onChange={(e) => setEditStageName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-white"
                          />
                          <div className="flex gap-2 justify-end self-center">
                            <button onClick={() => handleSaveStageEdit(stage.id)} className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-900"><Check size={14} /></button>
                            <button onClick={() => setEditingStageId(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700"><X size={14} /></button>
                          </div>
                        </div>
                        <textarea 
                          value={editStageDesc} onChange={(e) => setEditStageDesc(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-white resize-none" rows={2}
                        />
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        {/* Reorder actions */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                          <button disabled={idx === 0} onClick={() => moveStage(idx, 'up')} className="p-1 text-slate-500 hover:text-white disabled:opacity-20"><ArrowUp size={13} /></button>
                          <span className="text-[10px] font-mono font-bold text-slate-400">{stage.sort_order}</span>
                          <button disabled={idx === stages.length - 1} onClick={() => moveStage(idx, 'down')} className="p-1 text-slate-500 hover:text-white disabled:opacity-20"><ArrowDown size={13} /></button>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-sm text-white">{stage.name}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{stage.description}</p>
                        </div>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button onClick={() => handleStartEditStage(stage)} className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-white"><Edit2 size={13} /></button>
                        <button onClick={() => handleDeleteStage(stage.id)} className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-[#FF0000]"><Trash2 size={13} /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {/* ───── TAB 3: APPLICATIONS HUB ───── */}
        {activeTab === 'applications' && (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={staggerItem}>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Applications Hub</h2>
                <p className="text-slate-400 text-xs mt-1">Cross-reference and update university applications for student profiles.</p>
              </div>
            </motion.div>

            {/* Table search toolbar */}
            <motion.div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c121f] p-4 rounded-2xl border border-white/5" variants={staggerItem}>
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" placeholder="Search by student name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF0000]/40 placeholder:text-slate-600"
                />
              </div>
            </motion.div>

            {/* Applications list */}
            <motion.div className="overflow-x-auto bg-[#0c121f] border border-white/5 rounded-2xl shadow-sm" variants={staggerItem}>
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 font-mono">
                    <th className="p-4 uppercase tracking-wider">Student Name</th>
                    <th className="p-4 uppercase tracking-wider">Target University</th>
                    <th className="p-4 uppercase tracking-wider">Program</th>
                    <th className="p-4 uppercase tracking-wider">Applied Date</th>
                    <th className="p-4 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-350">
                  {applications.filter(ap => ap.studentName.toLowerCase().includes(searchTerm.toLowerCase())).map(ap => (
                    <tr key={ap.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 font-bold text-white">{ap.studentName}</td>
                      <td className="p-4">{ap.universityName}</td>
                      <td className="p-4">{ap.program}</td>
                      <td className="p-4 font-mono text-slate-400">{ap.appliedDate}</td>
                      <td className="p-4">
                        <select
                          value={ap.status}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setApplications(applications.map(a => a.id === ap.id ? { ...a, status: val } : a));
                            triggerNotification(`Status updated: ${ap.studentName} -> ${val}`);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-tight bg-slate-950 focus:outline-none ${
                            ap.status === 'Accepted' ? 'border-emerald-500/30 text-emerald-400' :
                            ap.status === 'Offered' ? 'border-blue-500/30 text-blue-400' :
                            ap.status === 'Rejected' ? 'border-red-500/30 text-red-400' :
                            'border-amber-500/30 text-amber-400'
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
          </motion.div>
        )}

        {/* ───── TAB 4: DOCUMENT AUDITS ───── */}
        {activeTab === 'documents' && (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={staggerItem}>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Document Audits</h2>
                <p className="text-slate-400 text-xs mt-1">Review and approve transcripts, passports, and SOP files uploaded by students.</p>
              </div>
            </motion.div>

            {/* Audit Grid */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerItem}>
              {documents.map(doc => (
                <div key={doc.id} className="bg-[#0c121f] rounded-2xl border border-white/5 p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF6B6B] uppercase">{doc.documentType}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                        doc.status === 'Verified' ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' :
                        doc.status === 'Rejected' ? 'bg-red-950/40 border-red-500/20 text-red-400' :
                        'bg-amber-950/40 border-amber-500/20 text-amber-400'
                      }`}>
                        {doc.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white mt-2">{doc.studentName}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-1 select-all">{doc.fileName}</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono">UPLOADED: {doc.uploadedAt}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        setDocuments(documents.map(d => d.id === doc.id ? { ...d, status: 'Verified' } : d));
                        triggerNotification('Document approved & verified.');
                      }}
                      className="flex-1 py-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-wider uppercase hover:bg-emerald-900 transition-all cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setDocuments(documents.map(d => d.id === doc.id ? { ...d, status: 'Rejected' } : d));
                        triggerNotification('Document rejected.', true);
                      }}
                      className="flex-1 py-2 rounded-lg bg-red-950 text-red-400 border border-red-500/20 text-[10px] font-bold tracking-wider uppercase hover:bg-red-900 transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ───── TAB 5: UNIVERSITIES MANAGER ───── */}
        {activeTab === 'universities' && (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={staggerItem}>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Universities Manager</h2>
                <p className="text-slate-400 text-xs mt-1">Manage institutional database mappings for dynamic routing.</p>
              </div>
            </motion.div>

            {/* Universities listing */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerItem}>
              {universities.map(uni => (
                <div key={uni.id} className="bg-[#0c121f] rounded-2xl border border-white/5 p-5 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white">{uni.name}</h4>
                      <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">{uni.qsRanking}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{uni.country}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono text-slate-400">
                      <div>TUITION: <span className="text-slate-200">{uni.tuitionRange}</span></div>
                      <div>ACCEPTANCE: <span className="text-slate-200">{uni.acceptanceRate}</span></div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${uni.name} from directory?`)) {
                          setUniversities(universities.filter(u => u.id !== uni.id));
                          triggerNotification('University deleted.');
                        }
                      }}
                      className="py-1.5 px-3 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-[#FF0000] text-[10px] font-bold uppercase transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ───── TAB 6: CONSULTATION LEADS ───── */}
        {activeTab === 'leads' && (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={staggerItem}>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Consultation Leads</h2>
                <p className="text-slate-400 text-xs mt-1">Review enquiries submitted through the main consultation form.</p>
              </div>
            </motion.div>

            {/* Leads list */}
            <motion.div className="space-y-3" variants={staggerItem}>
              {leads.map(lead => (
                <div key={lead.id} className="bg-[#0c121f] rounded-2xl border border-white/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white">{lead.name}</h4>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                        lead.status === 'Closed' ? 'bg-slate-900 border-white/10 text-slate-400' :
                        lead.status === 'Contacted' ? 'bg-blue-950/40 border-blue-500/20 text-blue-400' :
                        'bg-red-950/40 border-red-500/20 text-red-400'
                      }`}>
                        {lead.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{lead.email}</p>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      DESTINATION: <span className="text-slate-300 font-bold">{lead.destination}</span> · DEGREE: <span className="text-slate-300 font-bold">{lead.degree}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 self-end sm:self-center">
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setLeads(leads.map(l => l.id === lead.id ? { ...l, status: val } : l));
                        triggerNotification('Lead status updated.');
                      }}
                      className="px-2.5 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-[10px] font-bold text-white focus:outline-none cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ───── TAB 7: CHATBOT LOGS ───── */}
        {activeTab === 'chat' && (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={staggerItem}>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Chatbot Logs</h2>
                <p className="text-slate-400 text-xs mt-1">Review public chat preview queries and AI generation payloads.</p>
              </div>
            </motion.div>

            {/* Logs list */}
            <motion.div className="space-y-4" variants={staggerItem}>
              {chatLogs.map(log => (
                <div key={log.id} className="bg-[#0c121f] rounded-2xl border border-white/5 p-5 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>SESSION: {log.sessionId}</span>
                    <span>{log.createdAt}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-blue-400 text-xs font-mono font-bold shrink-0">[USER]:</span>
                      <p className="text-slate-300 text-xs leading-relaxed">{log.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#FF6B6B] text-xs font-mono font-bold shrink-0">[BOT]:</span>
                      <p className="text-slate-400 text-xs leading-relaxed">{log.reply}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ───── TAB 8: HEALTH ───── */}
        {activeTab === 'health' && (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={staggerItem}>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">System Health</h2>
                <p className="text-slate-400 text-xs mt-1">Real-time status of backend API services and database nodes.</p>
              </div>
            </motion.div>

            {/* Health details */}
            <motion.div className="bg-[#0c121f] rounded-2xl border border-white/5 p-6 space-y-6" variants={staggerItem}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl space-y-1">
                  <p className="text-[10px] font-mono text-slate-500 uppercase">FASTAPI SERVICE STATUS</p>
                  <p className="text-base font-bold text-white uppercase tracking-tight">{dbHealth?.status || 'OFFLINE / STANDBY'}</p>
                </div>
                <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl space-y-1">
                  <p className="text-[10px] font-mono text-slate-500 uppercase">DATABASE CONNECTIVITY</p>
                  <p className="text-base font-bold text-white uppercase tracking-tight">{dbHealth?.database || 'DISCONNECTED'}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5 text-xs leading-relaxed text-slate-400">
                <h4 className="font-bold text-white text-sm">Deployment Information</h4>
                <p>
                  The database uses PostgreSQL via SQLAlchemy and AsyncPG for high-speed, non-blocking queries. 
                  Health checks query the system directly through the <code className="text-[#FF6B6B] font-mono">/api/health</code> endpoint.
                </p>
                <p>
                  To launch the server locally, ensure python virtual environment is initialized, dependencies installed, and run:
                  <br />
                  <code className="block bg-slate-950 p-3 rounded-lg border border-white/5 mt-2 text-[#FF6B6B] font-mono select-all">
                    uvicorn app.main:app --reload --port 8000
                  </code>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
