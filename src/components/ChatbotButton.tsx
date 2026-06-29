import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Globe, FileText, GraduationCap, Users, Plane } from 'lucide-react';
import FlyFlourishLogo from './FlyFlourishLogo';

const NAVY = '#001F3F';
const RED   = '#CC1E1E';

const quickReplies = [
  { label: 'Study in USA',    icon: Globe         },
  { label: 'Visa Help',       icon: FileText      },
  { label: 'Scholarships',    icon: GraduationCap },
  { label: 'Talk to Advisor', icon: Users         },
];

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3">

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit   ={{ opacity: 0, y: 18, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="w-[360px] rounded-[20px] overflow-hidden"
            style={{
              background:  '#ffffff',
              boxShadow:   '0 20px 60px rgba(0,31,63,0.18), 0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-[18px] flex items-center gap-3 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #002d5a 100%)` }}
            >
              {/* Decorative depth blobs */}
              <span className="absolute -top-5 -right-4 w-[110px] h-[110px] rounded-full pointer-events-none"
                style={{ background: RED, opacity: 0.09 }} />
              <span className="absolute -bottom-7 right-12 w-[76px] h-[76px] rounded-full pointer-events-none"
                style={{ background: '#fff', opacity: 0.04 }} />

              {/* F&F monogram avatar */}
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
                <p className="text-white text-sm font-bold leading-tight m-0">Fly &amp; Flourish</p>
                <p className="text-[10px] font-mono tracking-[0.08em] mt-[3px] m-0 font-medium"
                  style={{ color: '#34d399' }}>
                  ● ONLINE · READY TO HELP
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                style={{ background: 'rgba(255,255,255,0.10)' }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                onMouseOut ={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
              >
                <X size={14} color="rgba(255,255,255,0.75)" />
              </button>
            </div>

            {/* Sub-header strip */}
            <div className="px-5 py-2 flex items-center gap-1.5"
              style={{ background: '#f8fafc', borderBottom: '1px solid #edf0f4' }}>
              <Globe size={10} color="#94a3b8" />
              <p className="text-[10px] font-semibold tracking-[0.05em] uppercase m-0"
                style={{ color: '#94a3b8' }}>
                Study Abroad Assistant
              </p>
            </div>

            {/* Messages area */}
            <div className="p-5 min-h-[190px] max-h-[270px] overflow-y-auto space-y-[18px]"
              style={{ background: '#fafbfc' }}>

              {/* Bot welcome message */}
              <div className="flex gap-2.5 items-start">
                <div
                  className="w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center bg-white p-0.5 border border-slate-100 shadow-sm"
                >
                  <FlyFlourishLogo iconOnly={true} size="100%" showGlobeBg={false} />
                </div>
                <div>
                  <div
                    className="px-[15px] py-3 max-w-[86%]"
                    style={{
                      background:           '#ffffff',
                      border:               '1px solid #e8ecf0',
                      borderRadius:         16,
                      borderTopLeftRadius:  4,
                      boxShadow:            '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <p className="text-[13px] leading-relaxed m-0" style={{ color: '#374151' }}>
                      Hi there! 👋 Welcome to{' '}
                      <strong style={{ color: NAVY }}>Fly &amp; Flourish</strong>.
                      How can we help with your study abroad journey today?
                    </p>
                  </div>
                  <p className="text-[9px] font-mono mt-1.5 ml-0.5 m-0" style={{ color: '#cbd5e1' }}>
                    Just now
                  </p>
                </div>
              </div>

              {/* Quick replies */}
              <div className="pl-[38px]">
                <p className="text-[10px] font-semibold tracking-[0.05em] uppercase mb-2 m-0"
                  style={{ color: '#94a3b8' }}>
                  Quick questions
                </p>
                <div className="flex flex-wrap gap-[7px]">
                  {quickReplies.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      className="inline-flex items-center gap-[5px] px-[13px] py-[6px] rounded-full font-semibold cursor-pointer font-[inherit] transition-all duration-[180ms]"
                      style={{
                        fontSize:   11.5,
                        border:     '1.5px solid #dde3eb',
                        background: '#fff',
                        color:      NAVY,
                        boxShadow:  '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                      onMouseOver={e => {
                        Object.assign(e.currentTarget.style, {
                          background: NAVY, color: '#fff',
                          borderColor: NAVY,
                          boxShadow: '0 4px 14px rgba(0,31,63,0.22)',
                          transform: 'translateY(-1px)',
                        });
                      }}
                      onMouseOut={e => {
                        Object.assign(e.currentTarget.style, {
                          background: '#fff', color: NAVY,
                          borderColor: '#dde3eb',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          transform: 'none',
                        });
                      }}
                    >
                      <Icon size={11} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ background: '#fff', borderTop: '1px solid #edf0f4' }}>
              <input
                type="text"
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
                onFocus={e => (e.target.style.borderColor = 'rgba(0,31,63,0.30)')}
                onBlur ={e => (e.target.style.borderColor = '#e8ecf0')}
              />
              <button
                className="w-[38px] h-[38px] shrink-0 flex items-center justify-center transition-transform duration-150 cursor-pointer"
                style={{
                  background:   `linear-gradient(135deg, ${RED}, #e02a2a)`,
                  border:       'none',
                  borderRadius: 10,
                  boxShadow:    '0 4px 12px rgba(204,30,30,0.28)',
                }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                onMouseOut ={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Send size={14} color="#fff" />
              </button>
            </div>

            {/* Branding footer */}
            <div className="px-4 py-[7px] text-center"
              style={{ background: '#f8fafc', borderTop: '1px solid #edf0f4' }}>
              <p className="text-[9px] font-mono tracking-[0.08em] m-0" style={{ color: '#cbd5e1' }}>
                FLY &amp; FLOURISH OVERSEAS · HYDERABAD, TELANGANA
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ── */}
      <div className="relative flex items-center justify-center">
        {/* Pulse ring */}
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

        {/* Notification dot */}
        {!isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center pointer-events-none"
            style={{
              background:  '#34d399',
              border:      '2.5px solid #fff',
              boxShadow:   '0 2px 8px rgba(52,211,153,0.45)',
            }}
          >
            <span className="text-white font-extrabold leading-none" style={{ fontSize: 7 }}>1</span>
          </motion.span>
        )}
      </div>
    </div>
  );
}