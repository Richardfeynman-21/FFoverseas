'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Search,
  MessageCircle,
  Send,
  Zap,
  RefreshCw
} from 'lucide-react';
import { StudentRecord, ChatMessage } from './types';

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } }
} as const;

interface ChatTabProps {
  students: StudentRecord[];
  activeChatStudentId: string;
  setActiveChatStudentId: (id: string) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
  handleSendReply: (e?: React.FormEvent) => void;
  getInboxConversations: () => Array<{
    student: StudentRecord;
    lastMessage: string;
    time: string;
    unread: boolean;
  }>;
  chatUpdateTrigger?: number;
  refreshChat?: () => void;
}

export default function ChatTab({
  students,
  activeChatStudentId,
  setActiveChatStudentId,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendReply,
  getInboxConversations,
  chatUpdateTrigger,
  refreshChat
}: ChatTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const currentStudent = students.find(s => s.id === activeChatStudentId);

  // Template Quick Reply macros for counselor productivity
  const quickMacros = [
    { label: '📝 SOP Draft', text: 'Dear student, please upload your latest SOP draft so we can review the career goals section today.' },
    { label: '🛡️ Visa Slot', text: 'Hi, let\'s schedule a mock visa interview for this week. Please let me know your availability.' },
    { label: '📂 Transcripts', text: 'Hello, your consolidated transcript files are pending review. Please ensure they are clear scanned PDF copies.' },
    { label: '🎓 Shortlist', text: 'Great news! I have prepared your customized university shortlist. Let\'s connect to finalize your preferences.' }
  ];

  return (
    <motion.div className="flex-1 min-h-0 flex flex-col md:flex-row bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.005)]" variants={staggerItem} initial="hidden" animate="visible">
      {/* Left side conversations panel */}
      <div className="w-full md:w-80 max-h-[35vh] md:max-h-none border-b md:border-b-0 md:border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/10">
        <div className="p-4 border-b border-slate-100 space-y-3">
          <h3 className="font-extrabold text-xs text-[#001F3F] uppercase tracking-tight flex items-center gap-2">
            <MessageSquare className="text-indigo-600 w-4 h-4" />
            <span>Counselor Desk Inbox</span>
          </h3>
          
          {/* Search bar inside chat */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search active chats..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Conversation entries */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-hide">
          {getInboxConversations()
            .filter(conv => conv.student.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((conv) => (
              <button
                key={conv.student.id}
                onClick={() => setActiveChatStudentId(conv.student.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-all text-left cursor-pointer border ${
                  activeChatStudentId === conv.student.id 
                    ? 'bg-slate-50 border-slate-200/40 shadow-2xs' 
                    : 'border-transparent hover:bg-slate-50/40'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-650 font-mono shrink-0 shadow-2xs">
                  {conv.student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-slate-800 text-xs font-bold truncate leading-none mt-0.5">{conv.student.name}</p>
                    {conv.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate leading-tight font-semibold">{conv.lastMessage}</p>
                  <span className="text-[8px] font-mono text-slate-400 font-bold block">{conv.time}</span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Right side active chat container */}
      <div className="flex-1 flex flex-col justify-between bg-white">
        {activeChatStudentId ? (
          <>
            {/* Active Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-black text-slate-600 font-mono shrink-0 shadow-2xs">
                  {currentStudent?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#001F3F] leading-none">
                    {currentStudent?.name}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-mono mt-1.5 leading-none font-bold">
                    {currentStudent?.email} · {currentStudent?.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {refreshChat && (
                  <button
                    onClick={refreshChat}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-3xs"
                    title="Refresh Chat History"
                  >
                    <RefreshCw size={10} />
                    <span className="text-[8px] font-bold hidden sm:inline">Refresh</span>
                  </button>
                )}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-mono text-emerald-700 tracking-wider uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg font-bold">
                  Active Now
                </span>
              </div>
            </div>

            {/* Chat log message stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/5 scrollbar-hide">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                  <MessageCircle className="w-8 h-8 opacity-20" />
                  <span className="text-[10px]">No messages exchanged yet</span>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.isBot ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 leading-relaxed text-xs shadow-2xs ${
                      msg.isBot 
                        ? 'bg-gradient-to-br from-[#001F3F] to-indigo-950 text-white rounded-tr-none' 
                        : 'bg-slate-100/60 text-slate-800 rounded-tl-none border border-slate-200/10'
                    }`}>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 font-bold mt-1 px-1">{msg.time}</span>
                  </div>
                ))
              )}
            </div>

            {/* Chat macros & Quick replies */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/10 flex flex-wrap gap-2 items-center">
              <span className="flex items-center gap-1 text-[8px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-1">
                <Zap size={10} />
                Macros:
              </span>
              {quickMacros.map((macro, idx) => (
                <button
                  key={idx}
                  onClick={() => setChatInput(macro.text)}
                  className="px-2.5 py-1 text-[9px] bg-white border border-slate-200 rounded-lg hover:border-slate-300 text-[#001F3F] font-bold transition-all shadow-2xs cursor-pointer"
                >
                  {macro.label}
                </button>
              ))}
            </div>

            {/* Chat typing form inputs */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Type counselor reply to ${currentStudent?.name || 'student'}...`}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]/5 shadow-2xs"
              />
              <button 
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#001F3F] text-white hover:bg-slate-800 active:scale-[0.97] transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0 shadow-sm"
              >
                <Send size={13} />
                <span>SEND</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
            <MessageSquare className="w-12 h-12 opacity-20" />
            <span className="text-xs font-bold tracking-tight text-slate-400">Select a student from the inbox to open chat session</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
