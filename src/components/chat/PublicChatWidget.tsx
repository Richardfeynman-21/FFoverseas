import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Globe, Plane } from 'lucide-react';
import ChatBubble from './ChatBubble';
import AuthPromptCard from './AuthPromptCard';
import FlyFlourishLogo from '../FlyFlourishLogo';

const NAVY = '#001F3F';
const RED   = '#CC1E1E';

// Placeholder for the logged-in RAG chatbot endpoint
const RAG_ENDPOINT = '/api/rag-chat'; // [PLACEHOLDER: update this when RAG bot is integrated]

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function PublicChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showSignupSoon, setShowSignupSoon] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sid = localStorage.getItem('orbit_chat_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('orbit_chat_session_id', sid);
    }
    setSessionId(sid);

    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hi there! 👋 Welcome to Fly & Flourish. How can we help with your study abroad journey today?"
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showAuthPrompt, showSignupSoon]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setShowSignupSoon(false);

    try {
      const token = localStorage.getItem('ff_student_token');
      const backendUrl = import.meta.env.VITE_PUBLIC_CHAT_API_URL || '/api/public-chat';
      const endpoint = token ? RAG_ENDPOINT : backendUrl;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sessionId, message: userMessage })
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
      
      if (data.action === 'prompt_signup_soon') {
        setShowSignupSoon(true);
      } else if (data.action === 'show_auth_prompt') {
        setShowAuthPrompt(true);
      }
      
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit   ={{ opacity: 0, y: 18, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="w-[360px] rounded-[20px] overflow-hidden flex flex-col h-[480px]"
            style={{
              background:  '#ffffff',
              boxShadow:   '0 20px 60px rgba(0,31,63,0.18), 0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="px-5 py-[18px] flex items-center gap-3 relative overflow-hidden shrink-0"
              style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #002d5a 100%)` }}
            >
              <span className="absolute -top-5 -right-4 w-[110px] h-[110px] rounded-full pointer-events-none"
                style={{ background: RED, opacity: 0.09 }} />
              <span className="absolute -bottom-7 right-12 w-[76px] h-[76px] rounded-full pointer-events-none"
                style={{ background: '#fff', opacity: 0.04 }} />

              <div className="relative shrink-0">
                <div
                  className="w-11 h-11 xl:w-14 xl:h-14 rounded-xl flex items-center justify-center bg-white p-1"
                  style={{
                    border:     '1px solid rgba(255,255,255,0.20)',
                  }}
                >
                  <FlyFlourishLogo iconOnly={true} size="100%" showGlobeBg={false} />
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: '#34d399', borderColor: NAVY }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold leading-tight m-0">Fly & Flourish</p>
                <p className="text-[10px] font-mono tracking-[0.08em] mt-[3px] m-0 font-medium"
                  style={{ color: '#34d399' }}>
                  ● ONLINE · READY TO HELP
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                style={{ background: 'rgba(255,255,255,0.10)' }}
              >
                <X size={14} color="rgba(255,255,255,0.75)" />
              </button>
            </div>

            <div className="px-5 py-2 flex items-center gap-1.5 shrink-0"
              style={{ background: '#f8fafc', borderBottom: '1px solid #edf0f4' }}>
              <Globe size={10} color="#94a3b8" />
              <p className="text-[10px] font-semibold tracking-[0.05em] uppercase m-0"
                style={{ color: '#94a3b8' }}>
                Study Abroad Assistant
              </p>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-[18px]"
              style={{ background: '#fafbfc' }}>
              
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} role={msg.role} content={msg.content} />
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-start">
                  <div
                    className="w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center bg-white p-0.5 border border-slate-100 shadow-sm"
                  >
                    <FlyFlourishLogo iconOnly={true} size="100%" showGlobeBg={false} />
                  </div>
                  <div className="px-[15px] py-3 rounded-[16px] rounded-tl-[4px] border border-[#e8ecf0] bg-white shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}

              {showSignupSoon && !showAuthPrompt && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 shadow-sm mt-2">
                  <p className="text-[12px] text-yellow-800 m-0 font-medium leading-relaxed">
                    💡 Create a free account to keep chatting and get personalized guidance!
                  </p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 flex flex-col items-center gap-2 shrink-0"
              style={{ background: '#fff', borderTop: '1px solid #edf0f4' }}>
              
              {showAuthPrompt ? (
                <div className="w-full">
                  <AuthPromptCard />
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about universities, visas, scholarships…"
                    className="flex-1 text-[12.5px] font-[inherit] transition-colors"
                    style={{
                      background:   '#f7f9fc',
                      border:       '1.5px solid #e8ecf0',
                      borderRadius: 12,
                      padding:      '10px 14px',
                      color:        NAVY,
                      outline:      'none',
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className="w-[38px] h-[38px] shrink-0 flex items-center justify-center transition-transform duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:   `linear-gradient(135deg, ${RED}, #e02a2a)`,
                      border:       'none',
                      borderRadius: 10,
                      boxShadow:    '0 4px 12px rgba(204,30,30,0.28)',
                    }}
                  >
                    <Send size={14} color="#fff" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="px-4 py-[7px] text-center shrink-0"
              style={{ background: '#f8fafc', borderTop: '1px solid #edf0f4' }}>
              <p className="text-[9px] font-mono tracking-[0.08em] m-0" style={{ color: '#cbd5e1' }}>
                FLY & FLOURISH OVERSEAS · MEDPALLI, TELANGANA
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center">
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: 'rgba(0,31,63,0.40)' }}
            animate={{ scale: [1, 1.55, 1.55], opacity: [0.45, 0, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-[58px] h-[58px] rounded-2xl flex items-center justify-center cursor-pointer relative border-none"
          style={{
            background: `linear-gradient(145deg, ${NAVY} 0%, #003166 50%, ${RED} 100%)`,
            boxShadow:  `0 8px 24px rgba(0,31,63,0.40), 0 2px 8px rgba(204,30,30,0.20)`,
          }}
          whileHover={{ scale: 1.07 }}
          whileTap  ={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="x"
                initial={{ rotate: -80, opacity: 0 }}
                animate={{ rotate:   0, opacity: 1 }}
                exit   ={{ rotate:  80, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={20} color="#fff" />
              </motion.div>
            ) : (
              <motion.div key="plane"
                initial={{ rotate: 80, opacity: 0 }}
                animate={{ rotate:  0, opacity: 1 }}
                exit   ={{ rotate: -80, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Plane size={22} color="#fff" style={{ transform: 'rotate(-30deg)' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
