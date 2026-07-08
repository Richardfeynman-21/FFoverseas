import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, GraduationCap, BarChart3, MessageCircle,
  LogOut, Menu, X, ChevronRight, Search, ExternalLink,
  CheckCircle2, Clock, Circle, FileText, Upload, Send,
  Plane, Users, DollarSign, Calendar, Award, MapPin,
  Globe, Shield, Sparkles, Building2, Filter, Star,
  CheckSquare, Square, ChevronDown, ChevronUp, Bot, Settings
} from 'lucide-react';
import { Flag } from './Flag';

const NAVY = '#001F3F';
const RED = '#FF0000';

// ── Admin-configurable application stages ──
const DEFAULT_APPLICATION_STAGES = [
  { id: 1, name: 'Profile Submitted', status: 'completed' as const, date: 'May 28, 2026', description: 'Your personal and academic profile has been submitted and recorded in our system.' },
  { id: 2, name: 'Documents Verified', status: 'completed' as const, date: 'Jun 05, 2026', description: 'All submitted documents have been verified and approved by our admissions team.' },
  { id: 3, name: 'University Shortlisted', status: 'current' as const, date: '', description: 'Our experts are shortlisting the best universities matching your profile and preferences.' },
  { id: 4, name: 'Application Sent', status: 'pending' as const, date: '', description: 'Your finalized applications will be dispatched to selected universities.' },
  { id: 5, name: 'Offer Letter', status: 'pending' as const, date: '', description: 'Awaiting acceptance letters and offer confirmations from universities.' },
  { id: 6, name: 'Visa Processing', status: 'pending' as const, date: '', description: 'Visa application preparation, mock interviews, and embassy submission.' },
  { id: 7, name: 'Pre-Departure Briefing', status: 'pending' as const, date: '', description: 'Final orientation including accommodation, travel, and cultural prep.' },
];

// ── Universities data ──
interface University {
  name: string;
  country: string;
  flag: string;
  ranking: string;
  tuition: string;
  scholarship: string;
  programs: string[];
  acceptanceRate: string;
}

const UNIVERSITIES: University[] = [
  { name: 'Massachusetts Institute of Technology', country: 'USA', flag: 'US', ranking: 'QS #1', tuition: '$55,000 - $61,000/yr', scholarship: 'Up to $30,000/yr', programs: ['Computer Science', 'Engineering', 'Data Science'], acceptanceRate: '3.9%' },
  { name: 'Stanford University', country: 'USA', flag: 'US', ranking: 'QS #5', tuition: '$56,000 - $62,000/yr', scholarship: 'Up to $28,000/yr', programs: ['AI & Machine Learning', 'Business', 'Bioengineering'], acceptanceRate: '3.7%' },
  { name: 'Harvard University', country: 'USA', flag: 'US', ranking: 'QS #4', tuition: '$52,000 - $57,000/yr', scholarship: 'Up to $35,000/yr', programs: ['Law', 'Medicine', 'Economics'], acceptanceRate: '3.2%' },
  { name: 'UC Berkeley', country: 'USA', flag: 'US', ranking: 'QS #10', tuition: '$44,000 - $48,000/yr', scholarship: 'Up to $20,000/yr', programs: ['EECS', 'Business Analytics', 'Environmental Science'], acceptanceRate: '11.6%' },
  { name: 'Columbia University', country: 'USA', flag: 'US', ranking: 'QS #23', tuition: '$63,000 - $68,000/yr', scholarship: 'Up to $25,000/yr', programs: ['Journalism', 'Finance', 'International Relations'], acceptanceRate: '3.9%' },
  { name: 'University of Oxford', country: 'UK', flag: 'GB', ranking: 'QS #3', tuition: '£28,000 - £44,000/yr', scholarship: 'Up to £18,000/yr', programs: ['PPE', 'Computer Science', 'Medicine'], acceptanceRate: '15.3%' },
  { name: 'University of Cambridge', country: 'UK', flag: 'GB', ranking: 'QS #2', tuition: '£25,000 - £40,000/yr', scholarship: 'Up to £16,000/yr', programs: ['Natural Sciences', 'Engineering', 'Mathematics'], acceptanceRate: '18.0%' },
  { name: 'Imperial College London', country: 'UK', flag: 'GB', ranking: 'QS #6', tuition: '£30,000 - £45,000/yr', scholarship: 'Up to £12,000/yr', programs: ['Biomedical Engineering', 'Computing', 'Physics'], acceptanceRate: '14.3%' },
  { name: 'UCL', country: 'UK', flag: 'GB', ranking: 'QS #9', tuition: '£22,000 - £38,000/yr', scholarship: 'Up to £10,000/yr', programs: ['Architecture', 'Neuroscience', 'Education'], acceptanceRate: '28.0%' },
  { name: 'LSE', country: 'UK', flag: 'GB', ranking: 'QS #45', tuition: '£24,000 - £35,000/yr', scholarship: 'Up to £15,000/yr', programs: ['Economics', 'Political Science', 'Social Policy'], acceptanceRate: '8.9%' },
  { name: 'University of Toronto', country: 'Canada', flag: 'CA', ranking: 'QS #21', tuition: 'CAD $45,000 - $62,000/yr', scholarship: 'Up to CAD $20,000/yr', programs: ['Computer Science', 'Engineering', 'Life Sciences'], acceptanceRate: '43.0%' },
  { name: 'UBC', country: 'Canada', flag: 'CA', ranking: 'QS #34', tuition: 'CAD $40,000 - $55,000/yr', scholarship: 'Up to CAD $16,000/yr', programs: ['Forestry', 'Commerce', 'Kinesiology'], acceptanceRate: '46.0%' },
  { name: 'McGill University', country: 'Canada', flag: 'CA', ranking: 'QS #30', tuition: 'CAD $25,000 - $50,000/yr', scholarship: 'Up to CAD $12,000/yr', programs: ['Medicine', 'Music', 'Neuroscience'], acceptanceRate: '41.0%' },
  { name: 'University of Melbourne', country: 'Australia', flag: 'AU', ranking: 'QS #13', tuition: 'AUD $35,000 - $50,000/yr', scholarship: 'Up to AUD $15,000/yr', programs: ['Biomedicine', 'Design', 'Commerce'], acceptanceRate: '52.0%' },
  { name: 'University of Sydney', country: 'Australia', flag: 'AU', ranking: 'QS #18', tuition: 'AUD $38,000 - $52,000/yr', scholarship: 'Up to AUD $18,000/yr', programs: ['Law', 'Arts', 'Engineering'], acceptanceRate: '48.0%' },
  { name: 'Technical University of Munich', country: 'Germany', flag: 'DE', ranking: 'QS #37', tuition: '€250 semester fee', scholarship: 'DAAD up to €15,000/yr', programs: ['Mechanical Engineering', 'Informatics', 'Physics'], acceptanceRate: '8.0%' },
  { name: 'LMU Munich', country: 'Germany', flag: 'DE', ranking: 'QS #54', tuition: '€250 semester fee', scholarship: 'DAAD up to €12,000/yr', programs: ['Biology', 'Philosophy', 'Law'], acceptanceRate: '12.0%' },
];

// ── Document checklist ──
const DOCUMENTS = [
  { id: 'passport', name: 'Passport Copy', uploaded: true },
  { id: 'transcripts', name: 'Academic Transcripts', uploaded: true },
  { id: 'sop', name: 'Statement of Purpose', uploaded: true },
  { id: 'lor', name: 'Letters of Recommendation', uploaded: false },
  { id: 'financial', name: 'Financial Documents', uploaded: true },
  { id: 'english', name: 'English Test Score (IELTS/TOEFL)', uploaded: true },
  { id: 'photos', name: 'Passport Size Photos', uploaded: false },
];

// ── Chat bot responses ──
function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('status') || lower.includes('application') || lower.includes('progress'))
    return "Your application is currently in the **University Shortlisting** phase. Our experts are matching your profile with the best-fit universities. You'll receive shortlist notifications within 3-5 business days. 📋";
  if (lower.includes('scholarship') || lower.includes('financial') || lower.includes('aid'))
    return "Based on your profile, you're eligible for scholarships worth up to **$12,000 - $25,000/year** across partner universities. We've flagged merit-based and need-based options. Your advisor will share the final list soon! 💰";
  if (lower.includes('visa') || lower.includes('interview') || lower.includes('embassy'))
    return "Visa processing begins after you receive your offer letter. We provide **3 mock visa interviews**, a complete document audit, and embassy appointment scheduling. Our visa success rate is 98.4%! 🛂";
  if (lower.includes('advisor') || lower.includes('talk') || lower.includes('call') || lower.includes('help'))
    return "Your dedicated advisor is **Ms. Priya Sharma**. You can reach her at +91 8374740505 or email advisor@ffoverseas.in. Office hours: Mon-Sat, 9 AM - 6 PM IST. Would you like us to schedule a callback? 📞";
  if (lower.includes('document') || lower.includes('upload') || lower.includes('lor'))
    return "You've uploaded **5 out of 7** required documents. Missing: Letters of Recommendation and Passport Photos. Please upload them through the 'My Progress' tab to avoid delays. 📄";
  if (lower.includes('university') || lower.includes('college'))
    return "Check out the **Universities** tab to explore 17+ partner universities across USA, UK, Canada, Australia, and Germany. Each listing includes tuition fees, scholarship amounts, and acceptance rates! 🎓";
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey'))
    return "Hello! 👋 Welcome to Fly & Flourish Support. I'm here to help with your study abroad journey. Ask me about your application status, scholarships, visa process, or anything else!";
  return "Thank you for your message! I've noted your query. For specific questions, try asking about: **application status**, **scholarships**, **visa process**, **documents**, or **universities**. You can also request to **talk to an advisor** for personalized guidance. 🌍";
}

type TabKey = 'dashboard' | 'universities' | 'progress' | 'chat';

const NAV_ITEMS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'universities', label: 'Universities', icon: Building2 },
  { key: 'progress', label: 'My Progress', icon: BarChart3 },
  { key: 'chat', label: 'Chat Support', icon: MessageCircle },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState<{ name: string; email: string; id: string } | null>(null);
  const [countryFilter, setCountryFilter] = useState('All');
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<{ text: string; isBot: boolean; time: string }[]>([
    { text: "Hi there! 👋 Welcome to **Fly & Flourish Support**. How can I help with your study abroad journey today?", isBot: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [docChecks, setDocChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(DOCUMENTS.map(d => [d.id, d.uploaded]))
  );

  const [stages, setStages] = useState(() => {
    const saved = localStorage.getItem('ff_application_stages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_APPLICATION_STAGES;
  });

  useEffect(() => {
    const saved = localStorage.getItem('ff_application_stages');
    if (saved) {
      try {
        setStages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeTab]);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('ff_student_token');
    const storedStudent = localStorage.getItem('ff_student');
    if (!token) {
      router.push('/student/login');
      return;
    }
    if (storedStudent) {
      try { setStudent(JSON.parse(storedStudent)); } catch { router.push('/student/login'); }
    }
  }, [router]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotTyping]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('ff_student_refresh_token');
    if (refreshToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (err) {
        console.error('Failed to call backend logout:', err);
      }
    }
    localStorage.removeItem('ff_student_token');
    localStorage.removeItem('ff_student_refresh_token');
    localStorage.removeItem('ff_student');
    router.push('/student/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSendChat = (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { text: msg, isBot: false, time }]);
    setChatInput('');
    setIsBotTyping(true);
    setTimeout(() => {
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [...prev, { text: getBotResponse(msg), isBot: true, time: botTime }]);
      setIsBotTyping(false);
    }, 1200);
  };

  const completedCount = stages.filter((s: any) => s.status === 'completed').length;
  const progressPercent = stages.length ? Math.round((completedCount / stages.length) * 100) : 0;
  const filteredUniversities = countryFilter === 'All' ? UNIVERSITIES : UNIVERSITIES.filter(u => u.country === countryFilter);
  const uploadedDocs = Object.values(docChecks).filter(Boolean).length;

  if (!student) return null;

  return (
    <div className="flex h-screen bg-[#f4f6f9] overflow-hidden">

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        className={`fixed lg:static z-50 h-full flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 272, minWidth: 272, background: `linear-gradient(180deg, ${NAVY} 0%, #001230 100%)` }}
      >
        {/* Brand */}
        <div>
          <div className="px-6 pt-7 pb-5 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 border border-white/10 shadow-sm shrink-0">
                <img src="/logo.svg" className="w-full h-full object-contain" alt="Fly & Flourish Logo" />
              </div>
              <div>
                <p className="text-white font-extrabold text-sm tracking-tight leading-tight">Fly & Flourish</p>
                <p className="text-[9px] font-mono font-medium tracking-wider" style={{ color: '#FF6B6B' }}>STUDENT PORTAL</p>
              </div>
            </div>
          </div>

          {/* Student Profile */}
          <div className="px-6 py-5 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #FF0000, #ff4444)', color: '#fff' }}>
                {getInitials(student.name)}
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm truncate">{student.name}</p>
                <p className="text-slate-400 text-[11px] font-mono truncate">{student.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 py-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.key;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-[13px] font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white border-l-3 border-[#FF0000]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#FF0000]' : ''} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Simulation & Logout */}
        <div className="px-3 pb-6 space-y-1">
          <button
            onClick={() => router.push('/admin')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[13px] font-semibold cursor-pointer"
          >
            <Settings size={18} />
            Simulate Admin
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-[13px] font-semibold cursor-pointer"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200/70" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
              <Menu size={20} color={NAVY} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shadow-sm shrink-0">
                <img src="/logo.svg" className="w-full h-full object-contain" alt="Fly & Flourish Logo" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold text-[#001F3F] capitalize">{activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'universities' ? 'Universities' : activeTab === 'progress' ? 'My Progress' : 'Chat Support'}</h1>
                <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">STUDENT COMMAND CENTER</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#001F3F] flex items-center justify-center text-white text-[10px] font-bold">
              {getInitials(student.name)}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {/* ══════ DASHBOARD TAB ══════ */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="space-y-6">

                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #003166 100%)` }}>
                  <div className="absolute right-0 top-0 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(255,0,0,0.08)' }} />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl" style={{ background: 'rgba(100,150,255,0.06)' }} />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono text-white/70 tracking-wider mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        WELCOME BACK
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Hello, <span style={{ color: '#FF6B6B' }}>{student.name.split(' ')[0]}</span> 👋
                      </h2>
                      <p className="text-slate-300 text-sm mt-2 max-w-lg">Your academic flight path is taking shape. Here's your latest progress and upcoming milestones.</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center p-2 self-start md:self-auto shadow-inner shrink-0">
                      <img src="/logo.svg" className="w-full h-full object-contain brightness-0 invert" alt="Fly & Flourish Logo" />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Applications', value: '3', icon: FileText, color: '#3b82f6', bg: '#eff6ff' },
                    { label: 'Documents', value: `${uploadedDocs}/7`, icon: Upload, color: '#10b981', bg: '#ecfdf5' },
                    { label: 'Next Event', value: 'Jun 20', icon: Calendar, color: '#f59e0b', bg: '#fffbeb', sub: 'Mock Interview' },
                    { label: 'Scholarship', value: '$12,000', icon: DollarSign, color: '#ef4444', bg: '#fef2f2', sub: 'Potential' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.bg }}>
                        <stat.icon size={18} color={stat.color} />
                      </div>
                      <p className="text-2xl font-black text-[#001F3F] font-mono">{stat.value}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{stat.label}</p>
                      {stat.sub && <p className="text-[10px] text-slate-300 font-mono">{stat.sub}</p>}
                    </motion.div>
                  ))}
                </div>

                {/* Progress Tracker */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-[#001F3F] text-base">Application Progress</h3>
                      <p className="text-[11px] text-slate-400 font-mono">ADMIN-CONFIGURED PIPELINE</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black font-mono" style={{ color: RED }}>{progressPercent}%</p>
                      <p className="text-[10px] text-slate-400">Complete</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, #10b981, #34d399)` }}
                    />
                  </div>

                  {/* Timeline */}
                  <div className="space-y-0">
                    {stages.map((stage: any, idx: number) => (
                      <div key={stage.id} className="flex gap-4">
                        {/* Line + Dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            stage.status === 'completed' ? 'bg-emerald-500 text-white' :
                            stage.status === 'current' ? 'bg-amber-400 text-white' :
                            'bg-slate-200 text-slate-400'
                          }`}>
                            {stage.status === 'completed' ? <CheckCircle2 size={16} /> :
                             stage.status === 'current' ? <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-3 h-3 rounded-full bg-white" /> :
                             <Circle size={14} />}
                          </div>
                          {idx < stages.length - 1 && (
                            <div className={`w-0.5 flex-1 min-h-[32px] ${
                              stage.status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'
                            }`} />
                          )}
                        </div>
                        {/* Content */}
                        <div className="pb-6 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold text-sm ${stage.status === 'pending' ? 'text-slate-400' : 'text-[#001F3F]'}`}>{stage.name}</p>
                            {stage.status === 'current' && (
                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wider">In Progress</span>
                            )}
                          </div>
                          {stage.date && <p className="text-[11px] text-slate-400 font-mono mt-0.5">{stage.date}</p>}
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════ UNIVERSITIES TAB ══════ */}
            {activeTab === 'universities' && (
              <motion.div key="universities" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="space-y-6">

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  {['All', 'USA', 'UK', 'Canada', 'Australia', 'Germany'].map(country => (
                    <button
                      key={country}
                      onClick={() => setCountryFilter(country)}
                      className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer ${
                        countryFilter === country
                          ? 'bg-[#001F3F] text-white shadow-md'
                          : 'bg-white text-slate-500 border border-slate-200 hover:border-[#001F3F] hover:text-[#001F3F]'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                  <span className="text-[11px] text-slate-400 font-mono ml-auto">{filteredUniversities.length} RESULTS</span>
                </div>

                {/* University Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredUniversities.map((uni, i) => (
                    <motion.div
                      key={uni.name}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#001F3F] text-sm leading-tight group-hover:text-[#FF0000] transition-colors">{uni.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Flag country={uni.flag} className="w-5 h-3.5 rounded-[2px]" />
                            <span className="text-[11px] text-slate-400 font-medium">{uni.country}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 shrink-0">{uni.ranking}</span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign size={13} className="text-slate-400 shrink-0" />
                          <span className="text-xs text-slate-600">{uni.tuition}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={13} className="text-emerald-500 shrink-0" />
                          <span className="text-xs text-emerald-600 font-medium">{uni.scholarship}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={13} className="text-slate-400 shrink-0" />
                          <span className="text-xs text-slate-500">Acceptance: {uni.acceptanceRate}</span>
                        </div>
                      </div>

                      {/* Programs */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {uni.programs.map(prog => (
                          <span key={prog} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100">{prog}</span>
                        ))}
                      </div>

                      {/* CTA */}
                      <button className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer bg-[#001F3F]/5 text-[#001F3F] hover:bg-[#001F3F] hover:text-white flex items-center justify-center gap-2">
                        Learn More <ExternalLink size={12} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════ PROGRESS TAB ══════ */}
            {activeTab === 'progress' && (
              <motion.div key="progress" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="space-y-6">

                {/* Overall Progress */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#001F3F]">Overall Application Journey</h3>
                    <span className="text-lg font-black font-mono" style={{ color: progressPercent >= 50 ? '#10b981' : RED }}>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${NAVY}, ${RED})` }} />
                  </div>
                </div>

                {/* Expandable Timeline */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-[#001F3F]">Detailed Stage Breakdown</h3>
                    <p className="text-[11px] text-slate-400 font-mono">CLICK TO EXPAND DETAILS</p>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {stages.map((stage: any) => (
                      <button
                        key={stage.id}
                        onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                        className="w-full text-left px-6 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            stage.status === 'completed' ? 'bg-emerald-500 text-white' :
                            stage.status === 'current' ? 'bg-amber-400 text-white' :
                            'bg-slate-200 text-slate-400'
                          }`}>
                            {stage.status === 'completed' ? <CheckCircle2 size={14} /> :
                             stage.status === 'current' ? <Clock size={14} /> :
                             <Circle size={12} />}
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${stage.status === 'pending' ? 'text-slate-400' : 'text-[#001F3F]'}`}>{stage.name}</p>
                            {stage.date && <p className="text-[11px] text-slate-400 font-mono">{stage.date}</p>}
                          </div>
                          {expandedStage === stage.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </div>
                        <AnimatePresence>
                          {expandedStage === stage.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
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

                {/* Document Checklist */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-[#001F3F]">Document Checklist</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{uploadedDocs} OF {DOCUMENTS.length} UPLOADED</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                      background: `conic-gradient(#10b981 ${(uploadedDocs / DOCUMENTS.length) * 360}deg, #e2e8f0 0deg)`,
                    }}>
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[11px] font-bold font-mono text-emerald-600">
                        {uploadedDocs}/{DOCUMENTS.length}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {DOCUMENTS.map(doc => (
                      <label
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <button
                          onClick={(e) => { e.preventDefault(); setDocChecks(prev => ({ ...prev, [doc.id]: !prev[doc.id] })); }}
                          className="shrink-0 cursor-pointer"
                        >
                          {docChecks[doc.id] ? (
                            <CheckSquare size={20} className="text-emerald-500" />
                          ) : (
                            <Square size={20} className="text-slate-300" />
                          )}
                        </button>
                        <span className={`text-sm ${docChecks[doc.id] ? 'text-slate-500 line-through' : 'text-[#001F3F] font-medium'}`}>{doc.name}</span>
                        {docChecks[doc.id] ? (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 ml-auto">UPLOADED</span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 ml-auto">PENDING</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════ CHAT TAB ══════ */}
            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
                className="flex flex-col h-[calc(100vh-7.5rem)] bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                {/* Chat Header */}
                <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-100" style={{ background: `linear-gradient(135deg, ${NAVY}, #003166)` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white p-1" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                    <img src="/logo.svg" className="w-full h-full object-contain" alt="F&F Logo" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">F&F Support Assistant</p>
                    <p className="text-[10px] font-mono" style={{ color: '#34d399' }}>● ONLINE · INSTANT REPLIES</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ background: '#fafbfc' }}>
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${msg.isBot ? '' : 'flex-row-reverse'}`}
                    >
                      {msg.isBot && (
                        <div className="w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center bg-white p-0.5 border border-slate-100 shadow-sm">
                          <img src="/logo.svg" className="w-full h-full object-contain" alt="F&F Logo" />
                        </div>
                      )}
                      <div>
                        <div
                          className={`px-4 py-3 max-w-xs sm:max-w-md text-[13px] leading-relaxed ${
                            msg.isBot
                              ? 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm'
                              : 'bg-[#001F3F] text-white rounded-2xl rounded-tr-sm'
                          }`}
                          style={msg.isBot ? { boxShadow: '0 1px 4px rgba(0,0,0,0.04)' } : {}}
                          dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                        />
                        <p className="text-[9px] font-mono text-slate-300 mt-1 mx-1">{msg.time}</p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isBotTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-white p-0.5 border border-slate-100 shadow-sm">
                        <img src="/logo.svg" className="w-full h-full object-contain" alt="F&F Logo" />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                        {[0, 1, 2].map(d => (
                          <motion.span key={d} className="w-2 h-2 rounded-full bg-slate-300" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }} />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Quick replies (show only if few messages) */}
                  {chatMessages.length <= 2 && (
                    <div className="pl-9 pt-2">
                      <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-2">QUICK QUESTIONS</p>
                      <div className="flex flex-wrap gap-2">
                        {['Check Application Status', 'Scholarship Info', 'Visa Help', 'Talk to Advisor'].map(q => (
                          <button
                            key={q}
                            onClick={() => handleSendChat(q)}
                            className="px-3 py-1.5 rounded-full text-[11px] font-semibold border border-slate-200 bg-white text-[#001F3F] hover:bg-[#001F3F] hover:text-white hover:border-[#001F3F] transition-all cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 flex items-center gap-2 border-t border-slate-100 bg-white">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    placeholder="Ask about universities, visas, scholarships…"
                    className="flex-1 text-[13px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[#001F3F] placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F]/30 transition-colors"
                  />
                  <button
                    onClick={() => handleSendChat()}
                    className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl cursor-pointer transition-transform hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${RED}, #cc1e1e)`, boxShadow: '0 4px 12px rgba(255,0,0,0.25)' }}
                  >
                    <Send size={16} color="#fff" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
