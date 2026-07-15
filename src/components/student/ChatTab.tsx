'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Trash2, HelpCircle, Phone, MessageSquare, Check, AlertCircle, 
  UploadCloud, Sparkles, Compass, Plus, PanelLeft, X, Mail, ChevronRight, CheckCheck, Clock, RefreshCw
} from 'lucide-react';
import { ChatMessage, TabKey } from './types';
import { NAVY, RED, DOCUMENTS } from './constants';

interface ChatTabProps {
  chatMessages: ChatMessage[];
  isBotTyping: boolean;
  chatInput: string;
  setChatInput: (input: string) => void;
  handleSendChat: (text?: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  setActiveTab: (tab: TabKey) => void;
  clearChat: () => void;
  forcedMode?: 'ai' | 'agent';
  refreshChat?: () => void;
  agentName?: string;
}

// 1. Advisor Contact Card Component
const AdvisorCard: React.FC<{ agentName?: string }> = ({ agentName = 'Assigned Counselor' }) => {
  const [requested, setRequested] = useState(false);
  const email = agentName.toLowerCase().includes('abhinove') ? 'abhinove@ffoverseas.in' : 'advisor@ffoverseas.in';
  const initials = agentName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 rounded-2xl p-4.5 shadow-sm w-full"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#001F3F] text-white flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-md">
          {initials || 'AC'}
        </div>
        <div>
          <h4 className="font-black text-[#001F3F] text-xs">{agentName}</h4>
          <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Senior Admissions Counselor</p>
        </div>
      </div>
      <div className="mt-3.5 space-y-2 text-[11px] text-slate-650 border-t border-slate-100 pt-3.5">
        <div className="flex justify-between">
          <span className="text-slate-400 font-bold">Direct Email:</span>
          <a href={`mailto:${email}`} className="font-extrabold text-blue-600 hover:underline">{email}</a>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-bold">Hotline:</span>
          <span className="font-mono text-[#001F3F] font-extrabold">+91 83747 40505</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-bold">Office Hours:</span>
          <span className="text-slate-500 font-bold">Mon-Sat, 9 AM - 6 PM IST</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            setRequested(true);
            setTimeout(() => setRequested(false), 5000);
          }}
          disabled={requested}
          className={`flex-1 py-2.5 rounded-xl text-[9px] font-black tracking-wider uppercase transition-all border ${
            requested
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
              : 'bg-[#001F3F] hover:bg-[#003166] text-white border-[#001F3F] cursor-pointer active:scale-95'
          }`}
        >
          {requested ? '✓ CALLBACK REQUESTED' : '📞 REQUEST CALLBACK'}
        </button>
        <a
          href={`mailto:${email}`}
          className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#001F3F] rounded-xl text-[9px] font-black uppercase tracking-wider border border-slate-200/50 flex items-center justify-center transition-colors cursor-pointer"
        >
          EMAIL
        </a>
      </div>
      {requested && (
        <p className="text-[8px] text-emerald-600 mt-2 font-mono text-center animate-pulse">
          Fly &amp; Flourish AI requested: {agentName.toUpperCase()} will call you in 15 mins.
        </p>
      )}
    </motion.div>
  );
};

// 2. Shortlist Timeline Component
const ShortlistTimeline: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-sm w-full space-y-3.5"
    >
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <span className="text-[9px] font-black text-[#001F3F] uppercase tracking-wider font-mono">
          Curation Timeline
        </span>
        <span className="text-[8px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
          MATCHING STAGE
        </span>
      </div>
      
      <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 ml-2">
        {[
          { title: 'Academic Profiling', status: 'completed', desc: 'Analyzed GPA, test sheets, and program preferences.' },
          { title: 'Country & Budget Filter', status: 'completed', desc: 'Isolated USA, UK and Germany matching metrics.' },
          { title: 'Best-Fit Shortlisting', status: 'active', desc: 'Counsellors matching top 5-7 course slots.' },
          { title: 'Final Review & Dispatch', status: 'pending', desc: 'Lock selections and dispatch admissions packages.' }
        ].map((step, idx) => (
          <div key={idx} className="relative">
            <div className={`absolute -left-[24px] top-1 w-3 h-3 rounded-full border-2 border-white flex items-center justify-center ${
              step.status === 'completed' 
                ? 'bg-emerald-500 shadow-sm' 
                : step.status === 'active' 
                ? 'bg-blue-500 ring-2 ring-blue-100' 
                : 'bg-slate-200'
            }`} />
            
            <div>
              <p className={`text-xs font-bold ${
                step.status === 'completed' ? 'text-slate-500' : step.status === 'active' ? 'text-[#001F3F]' : 'text-slate-400'
              }`}>
                {step.title}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// 3. Checklist Shortcut Component
interface ChecklistShortcutProps {
  onGotoUpload: () => void;
}
const ChecklistShortcut: React.FC<ChecklistShortcutProps> = ({ onGotoUpload }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-red-50/5 border border-slate-200 rounded-2xl p-4.5 shadow-sm w-full"
    >
      <div className="flex items-center gap-1.5 text-rose-600 mb-2">
        <AlertCircle size={14} />
        <h4 className="text-[9px] font-black uppercase font-mono tracking-wider">Pending Action Required</h4>
      </div>
      <p className="text-[11px] text-slate-650 leading-relaxed font-medium">
        Admissions needs your **Letters of Recommendation** and **Passport Photos** to finalize university application packages.
      </p>
      
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-[#001F3F] font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Letters of Recommendation (LOR)</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-[#001F3F] font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Passport Size Photos</span>
        </div>
      </div>
      
      <button
        onClick={onGotoUpload}
        className="w-full mt-4 bg-gradient-to-r from-[#001F3F] to-red-650 hover:opacity-90 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
      >
        <UploadCloud size={12} />
        <span>Open Upload Dropzone</span>
      </button>
    </motion.div>
  );
};

// 4. Scholarship Calculator Component
const ScholarshipCalculator: React.FC = () => {
  const [country, setCountry] = useState('USA');
  const estimates: Record<string, { range: string; desc: string; aid: string }> = {
    USA: { range: '$15,000 - $35,000/yr', aid: 'Merit-based scholarships available for GPA > 3.0', desc: 'Harvard, Stanford, MIT matching options.' },
    UK: { range: '£5,000 - £18,000/yr', aid: 'Commonwealth & Vice-Chancellor Bursaries', desc: 'Oxford, Cambridge, UCL and LSE options.' },
    Canada: { range: 'CAD $5,000 - $20,000/yr', aid: 'International Entrance Scholarships', desc: 'Toronto, UBC and McGill options.' },
    Australia: { range: 'AUD $10,000 - $22,000/yr', aid: 'Destination Australia Merit Awards', desc: 'Melbourne and Sydney options.' },
    Germany: { range: 'Tuition-Free (€250 fee)', aid: 'DAAD Scholarship (€934/month stipend)', desc: 'TUM, LMU Munich technical tracks.' }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm w-full space-y-3"
    >
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <span className="text-[9px] font-black text-[#001F3F] uppercase tracking-wider font-mono">
          Scholarship Assessor
        </span>
        <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
          ESTIMATOR
        </span>
      </div>

      <div>
        <label className="block text-[8px] font-black text-[#001F3F] uppercase font-mono tracking-wider mb-1.5">
          Select Target Region:
        </label>
        <div className="flex flex-wrap gap-1">
          {Object.keys(estimates).map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`px-2 py-0.5 rounded text-[9px] font-extrabold border transition-colors cursor-pointer ${
                country === c
                  ? 'bg-[#001F3F] border-[#001F3F] text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/50 space-y-0.5">
        <p className="text-[8px] text-slate-400 font-mono uppercase tracking-wider">Estimated Coverage</p>
        <p className="text-xs font-black text-[#001F3F] font-mono">{estimates[country].range}</p>
        <p className="text-[9px] font-bold text-emerald-600 mt-1">{estimates[country].aid}</p>
        <p className="text-[8px] text-slate-400 italic mt-0.5">{estimates[country].desc}</p>
      </div>
    </motion.div>
  );
};

export const ChatTab: React.FC<ChatTabProps> = ({
  chatMessages,
  isBotTyping,
  chatInput,
  setChatInput,
  handleSendChat,
  chatEndRef,
  setActiveTab,
  clearChat,
  forcedMode,
  refreshChat,
  agentName: agentNameProp,
}) => {
  const [studentName, setStudentName] = useState('Student');
  const [agentNameState, setAgentNameState] = useState('Ms. Priya Sharma');
  const agentName = agentNameProp || agentNameState;
  const chatMode = forcedMode || 'ai';
  const [lastAgentMsg, setLastAgentMsg] = useState('Sure, let me check that for you...');

  useEffect(() => {
    const stored = localStorage.getItem('ff_student');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setStudentName(parsed.name);
        }
        if (parsed?.assignedAgentName) {
          setAgentNameState(parsed.assignedAgentName);
        }
        if (parsed?.id) {
          const saved = localStorage.getItem(`ff_agent_messages_${parsed.id}`);
          if (saved) {
            const parsedMsgs = JSON.parse(saved);
            if (parsedMsgs.length > 0) {
              setLastAgentMsg(parsedMsgs[parsedMsgs.length - 1].text);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [chatMessages]);

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-[#001F3F]">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const getInteractiveWidget = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('priya sharma') || lower.includes('advisor@ffoverseas') || lower.includes('abhinove') || (agentName && lower.includes(agentName.toLowerCase()))) {
      return <AdvisorCard agentName={agentName} />;
    }
    if (lower.includes('shortlisting') || lower.includes('curation timeline')) {
      return <ShortlistTimeline />;
    }
    if (lower.includes('letters of recommendation') || lower.includes('missing: letters of recommendation')) {
      return (
        <ChecklistShortcut 
          onGotoUpload={() => {
            setActiveTab('vault');
            setTimeout(() => {
              const el = document.getElementById('upload-center');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }} 
        />
      );
    }
    if (lower.includes('scholarship') || lower.includes('financial') || lower.includes('aid')) {
      return <ScholarshipCalculator />;
    }
    return null;
  };

  return (
    <motion.div
      key={chatMode}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full bg-white overflow-hidden"
    >
      {/* ── CONVERSATION LIST (LEFT PANEL) ── */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-white shrink-0 hidden md:flex">
        <div className="p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-[#001F3F] tracking-tight">Messages</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Direct Agent Support</p>
        </div>
        <div className="flex-1 overflow-y-auto chat-scrollbar py-2 space-y-1">
          {/* Agent Item (Active if chatMode === 'agent') */}
          <div 
            onClick={() => setActiveTab('agent-chat')}
            className={`flex items-center mx-3 my-1 p-3 rounded-xl cursor-pointer transition-all border ${
              chatMode === 'agent'
                ? 'bg-slate-50 border-slate-200 shadow-xs'
                : 'border-transparent hover:bg-slate-50/55'
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTg8_85p6F9xSjpDyXtkmUF_kt1YVhiyjbLB4JJDFCuK6Z86XRNjg_rg8T18JYqZzKX2ZFZ-Y9A0AibJqXb6i6jTG6vIwPvW6hNc9lD1c1u8lFqMiSIzS-3fzY2AiWYDcEJNMow2ekClkzq1bzbSfSTc9fsbXu3-QZcF0VIk7lhhwye0ABUXQNNGU8XZ3pq4q6D5jjUPPj11ivq52KdlLzSz1PJDX4Zibs7DF0-LcQ73vyeCRe8aivvbErz9u3IHAzsKjwFxGgexs"
                  alt="Sarah Jenkins profile"
                />
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-bold text-[#001F3F] truncate">{agentName}</h3>
                <span className="text-[9px] text-slate-400 font-mono ml-2 shrink-0">10:45 AM</span>
              </div>
              <p className="text-[9px] text-[#FF0000] font-bold uppercase tracking-wider mb-0.5">Senior Admissions Counselor</p>
              <p className="text-[11px] text-slate-500 truncate">{lastAgentMsg}</p>
            </div>
          </div>

          {/* AI Assistant Item (Active if chatMode === 'ai') */}
          <div 
            onClick={() => setActiveTab('chat')}
            className={`flex items-center mx-3 my-1 p-3 rounded-xl cursor-pointer transition-all border ${
              chatMode === 'ai'
                ? 'bg-slate-50 border-slate-200 shadow-xs'
                : 'border-transparent hover:bg-slate-50/55'
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200/50 flex items-center justify-center text-[#001F3F] shadow-sm p-1">
                <img src="/logo.svg" className="w-full h-full object-contain" alt="Fly &amp; Flourish AI Logo" />
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-bold text-[#001F3F] truncate">Fly &amp; Flourish AI</h3>
                <span className="text-[9px] text-slate-400 font-mono ml-2 shrink-0">Active</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Automated Guidance</p>
              <p className="text-[11px] text-slate-500 truncate">
                {chatMode === 'ai' && chatMessages.length > 0 
                  ? chatMessages[chatMessages.length - 1].text 
                  : "Ask about status, visas, or scholarships..."}
              </p>
            </div>
          </div>

          {/* General Support Item (Placeholder) */}
          <div className="flex items-center mx-3 my-1 p-3 rounded-xl border border-transparent opacity-60 cursor-not-allowed">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#001F3F] flex items-center justify-center text-white shadow-sm">
                <HelpCircle size={20} />
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-slate-350 border-2 border-white rounded-full"></span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-semibold text-[#001F3F] truncate">General Support</h3>
                <span className="text-[9px] text-slate-400 font-mono ml-2 shrink-0">Offline</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Helpdesk</p>
              <p className="text-[11px] text-slate-500 truncate">Offline support</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHAT WINDOW (RIGHT PANEL) ── */}
      <div className="flex-1 flex flex-col bg-[#FDFDFD] min-w-0 overflow-hidden">
        {/* Chat Header */}
        <div className="h-20 flex items-center justify-between px-6 sm:px-8 border-b border-slate-200 bg-white z-10 shrink-0">
          <div className="flex items-center min-w-0">
            {chatMode === 'agent' ? (
              <>
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 shadow-sm border border-slate-200">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTg8_85p6F9xSjpDyXtkmUF_kt1YVhiyjbLB4JJDFCuK6Z86XRNjg_rg8T18JYqZzKX2ZFZ-Y9A0AibJqXb6i6jTG6vIwPvW6hNc9lD1c1u8lFqMiSIzS-3fzY2AiWYDcEJNMow2ekClkzq1bzbSfSTc9fsbXu3-QZcF0VIk7lhhwye0ABUXQNNGU8XZ3pq4q6D5jjUPPj11ivq52KdlLzSz1PJDX4Zibs7DF0-LcQ73vyeCRe8aivvbErz9u3IHAzsKjwFxGgexs"
                      alt="Sarah Jenkins profile" 
                    />
                  </div>
                  <span className="absolute bottom-0.5 right-3.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-[#001F3F] leading-tight truncate">{agentName}</h2>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Online</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="text-[9px] text-slate-450 font-medium">Senior Admissions Counselor</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 shadow-sm border border-slate-200 bg-white p-1 flex items-center justify-center">
                    <img src="/logo.svg" className="w-full h-full object-contain" alt="Fly &amp; Flourish AI Logo" />
                  </div>
                  <span className="absolute bottom-0.5 right-3.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-[#001F3F] leading-tight truncate">Fly &amp; Flourish AI</h2>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Online</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="text-[9px] text-slate-450 font-medium">Automated Guidance</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            {refreshChat && (
              <button 
                onClick={refreshChat}
                className="px-2.5 py-1.5 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-[10px] font-bold text-slate-650 transition-all cursor-pointer flex items-center gap-1.5"
                title="Refresh Chat History"
              >
                <RefreshCw size={12} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
            <button 
              onClick={clearChat}
              className="px-2.5 py-1.5 hover:bg-red-50 border border-slate-200 hover:border-red-200/50 rounded-xl text-[10px] font-bold text-slate-500 hover:text-red-500 transition-all cursor-pointer flex items-center gap-1.5"
              title="Clear Chat Log"
            >
              <Trash2 size={12} />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 chat-scrollbar bg-[#fdfdfd]"
          style={{
            backgroundImage: 'radial-gradient(#e5e7eb 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Date Divider */}
          <div className="flex justify-center relative my-4">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/50"></div>
            </div>
            <span className="relative bg-slate-100 px-4 py-1 rounded-full text-slate-500 text-[9px] font-bold tracking-widest uppercase shadow-xs">
              TODAY
            </span>
          </div>

          <div className="max-w-3xl mx-auto w-full space-y-6 py-2">
            {chatMessages.map((msg, i) => {
              const isReceived = msg.isBot;
              return (
                <div key={i} className={`flex ${isReceived ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex flex-col ${isReceived ? 'max-w-[75%]' : 'max-w-[75%] items-end'} space-y-1`}>
                    <div 
                      className={`p-4 sm:p-5 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed ${
                        isReceived
                          ? 'bg-white border border-slate-200/80 text-[#001F3F] rounded-tl-sm'
                          : 'bg-[#001F3F] text-white rounded-tr-sm shadow-md'
                      }`}
                    >
                      <p>{formatText(msg.text)}</p>
                    </div>

                    {isReceived && (
                      <div className="w-full mt-2 text-left">
                        {getInteractiveWidget(msg.text)}
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-1 mx-1 select-none">
                      <span className="text-[9px] text-slate-400 font-mono uppercase">{msg.time}</span>
                      {!isReceived && (
                        <CheckCheck size={12} className="text-[#FF0000] font-bold" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isBotTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1.5 shadow-xs">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-slate-350"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center space-x-3 sm:space-x-4">
            <div className="flex space-x-1 shrink-0">
              <button 
                onClick={() => {
                  setActiveTab('vault');
                  setTimeout(() => {
                    const el = document.getElementById('upload-center');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 300);
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-slate-450 hover:text-[#001F3F] hover:bg-slate-100 rounded-xl transition-all" 
                title="Attach Document"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="flex-1 relative">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder={chatMode === 'agent' ? `Type a message to ${agentName}...` : "Ask Fly & Flourish AI about status, visas, or scholarships..."}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 sm:py-3.5 sm:px-6 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#001F3F]/10 focus:border-[#001F3F]/30 transition-all placeholder:text-slate-450 text-[#001F3F] font-medium"
              />
            </div>
            
            <button 
              onClick={() => handleSendChat()}
              disabled={!chatInput.trim()}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FF0000] text-white rounded-2xl flex items-center justify-center hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#FF0000]/20 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
