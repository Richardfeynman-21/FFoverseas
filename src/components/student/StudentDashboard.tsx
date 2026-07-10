'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { AnimatePresence, motion } from 'motion/react';

// Imports from local files
import { TabKey, ChatMessage, Student, UploadedFile, StudentApplication } from './types';
import {
  DEFAULT_APPLICATION_STAGES,
  UNIVERSITIES,
  DOCUMENTS,
  getBotResponse,
  DEFAULT_APPLICATIONS,
} from './constants';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardTab } from './DashboardTab';
import { UniversitiesTab } from './UniversitiesTab';
import { ProgressTab } from './ProgressTab';
import { VaultTab } from './VaultTab';
import { ProfileTab } from './ProfileTab';
import { ChatTab } from './ChatTab';
import { VisaTab } from './VisaTab';

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [countryFilter, setCountryFilter] = useState('All');
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  
  const [agentMessages, setAgentMessages] = useState<ChatMessage[]>([]);
  const [agentInput, setAgentInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ff_uploaded_docs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Default mock files for documents that are marked as uploaded by default
    return [
      {
        id: 'mock-passport',
        documentId: 'passport',
        name: 'passport_photo_page.pdf',
        size: '1.2 MB',
        uploadedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      },
      {
        id: 'mock-transcripts',
        documentId: 'transcripts',
        name: 'academic_transcripts_consolidated.pdf',
        size: '3.4 MB',
        uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      },
      {
        id: 'mock-sop',
        documentId: 'sop',
        name: 'sop_final_v2.pdf',
        size: '480 KB',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      },
      {
        id: 'mock-financial',
        documentId: 'financial',
        name: 'bank_statement_signed.pdf',
        size: '1.8 MB',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      },
      {
        id: 'mock-english',
        documentId: 'english',
        name: 'ielts_report_card.pdf',
        size: '820 KB',
        uploadedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      }
    ];
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('ff_uploaded_docs', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const [docChecks, setDocChecks] = useState<Record<string, boolean>>(() => {
    const checks: Record<string, boolean> = {};
    DOCUMENTS.forEach((d) => {
      // Find matching mock/loaded files or fallback
      checks[d.id] = d.uploaded;
    });
    return checks;
  });

  // Whenever uploadedFiles changes, sync docChecks
  useEffect(() => {
    setDocChecks((prev) => {
      const next = { ...prev };
      DOCUMENTS.forEach((d) => {
        next[d.id] = uploadedFiles.some((f) => f.documentId === d.id);
      });
      return next;
    });
  }, [uploadedFiles]);

  // Synchronize manual docChecks toggles back to uploadedFiles
  useEffect(() => {
    setUploadedFiles((prevFiles) => {
      let changed = false;
      const nextFiles = [...prevFiles];
      
      DOCUMENTS.forEach((d) => {
        const isChecked = docChecks[d.id];
        const hasFile = nextFiles.some((f) => f.documentId === d.id);
        
        if (isChecked && !hasFile) {
          // Manually checked, add a simulated mock file
          nextFiles.push({
            id: `manual-${d.id}-${Date.now()}`,
            documentId: d.id,
            name: `${d.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_document.pdf`,
            size: '1.5 MB',
            uploadedAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
          });
          changed = true;
        } else if (!isChecked && hasFile) {
          // Manually unchecked, remove all files for this document
          const filtered = nextFiles.filter((f) => f.documentId !== d.id);
          nextFiles.length = 0;
          nextFiles.push(...filtered);
          changed = true;
        }
      });
      
      return changed ? nextFiles : prevFiles;
    });
  }, [docChecks]);

  const [applications, setApplications] = useState<StudentApplication[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ff_student_applications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_APPLICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('ff_student_applications', JSON.stringify(applications));
  }, [applications]);

  const [activeApplicationId, setActiveApplicationId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ff_active_application_id');
      if (saved && DEFAULT_APPLICATIONS.some(a => a.id === saved)) {
        return saved;
      }
    }
    return DEFAULT_APPLICATIONS[0]?.id || '';
  });

  useEffect(() => {
    localStorage.setItem('ff_active_application_id', activeApplicationId);
  }, [activeApplicationId]);

  const activeApplication = applications.find(a => a.id === activeApplicationId) || applications[0];

  const [stages, setStages] = useState(() => {
    if (activeApplication) {
      return activeApplication.stages;
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ff_application_stages');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_APPLICATION_STAGES;
  });

  // Whenever activeApplicationId changes, set stages
  useEffect(() => {
    if (activeApplication) {
      setStages(activeApplication.stages);
    }
  }, [activeApplicationId]);

  // Whenever stages changes, update the active application's stages in applications list
  useEffect(() => {
    if (activeApplicationId && stages.length > 0) {
      setApplications(prevApps => prevApps.map(app => 
        app.id === activeApplicationId 
          ? { ...app, stages: stages }
          : app
      ));
    }
  }, [stages, activeApplicationId]);

  // Initialize chatbot messages with a standard message that uses formatted timestamps
  useEffect(() => {
    setChatMessages([
      {
        text: "Hi there! 👋 Welcome to **Fly & Flourish Support**. How can I help with your study abroad journey today?",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Load agent messages when student is loaded
  useEffect(() => {
    if (student) {
      const saved = localStorage.getItem(`ff_agent_messages_${student.id}`);
      if (saved) {
        try {
          setAgentMessages(JSON.parse(saved));
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setAgentMessages([
        {
          text: `Hi ${student.name}! Ms. Priya Sharma here, your Senior Admissions Counselor. I'm online and ready to assist you. Ask me anything about your university shortlists, visas, or documents!`,
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [student]);

  // Sync agent messages to localStorage
  useEffect(() => {
    if (student && agentMessages.length > 0) {
      localStorage.setItem(`ff_agent_messages_${student.id}`, JSON.stringify(agentMessages));
    }
  }, [agentMessages, student]);

  // Listen for changes in localStorage from other tabs/pages (like Admin replying)
  useEffect(() => {
    const handleStorageChange = () => {
      if (student) {
        const savedMessages = localStorage.getItem(`ff_agent_messages_${student.id}`);
        if (savedMessages) {
          try {
            setAgentMessages(JSON.parse(savedMessages));
          } catch (e) {
            console.error(e);
          }
        }
        const savedStages = localStorage.getItem('ff_application_stages');
        if (savedStages) {
          try {
            setStages(JSON.parse(savedStages));
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [student]);

  // Update stages from localstorage if admin changes them
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
      try {
        setStudent(JSON.parse(storedStudent));
      } catch {
        router.push('/student/login');
      }
    } else {
      router.push('/student/login');
    }
  }, [router]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotTyping, agentMessages, isAgentTyping, activeTab]);

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
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSendChat = (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { text: msg, isBot: false, time }]);
    setChatInput('');
    setIsBotTyping(true);
    setTimeout(() => {
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [...prev, { text: getBotResponse(msg), isBot: true, time: botTime }]);
      setIsBotTyping(false);
    }, 1200);
  };

  const handleSendAgentChat = (text?: string) => {
    const msg = text || agentInput.trim();
    if (!msg) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAgentMessages((prev) => [...prev, { text: msg, isBot: false, time }]);
    setAgentInput('');
    setIsAgentTyping(true);
    
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let replyText = "";
      const lower = msg.toLowerCase();
      
      if (lower.includes('status') || lower.includes('shortlist') || lower.includes('university') || lower.includes('curation')) {
        replyText = "I've reviewed your GPA and preferences. We have selected 5 top universities for you, including Toronto and TUM. Let me know if you want to swap any.";
      } else if (lower.includes('visa') || lower.includes('slot') || lower.includes('mock')) {
        replyText = "Your visa documents are looking good! I am scheduling a mock interview session for you this Friday at 3 PM. Please make sure to be available.";
      } else if (lower.includes('scholarship') || lower.includes('fee') || lower.includes('aid')) {
        replyText = "For Canada and Germany, there are excellent entrance scholarships. I've already submitted the merit aid requests on your behalf.";
      } else if (lower.includes('document') || lower.includes('upload') || lower.includes('lor')) {
        replyText = "Please upload your LORs (Letters of Recommendation) in the Progress Tab so I can complete the university packet submission today.";
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        replyText = `Hello ${student ? student.name : 'there'}! Hope your day is going well. How can I help you with your applications today?`;
      } else {
        replyText = "Thanks for the details. I am checking this on our portal right now and will get back to you shortly. Let me know if there are other files to upload.";
      }
      
      setAgentMessages((prev) => [...prev, { text: replyText, isBot: true, time: replyTime }]);
      setIsAgentTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setChatMessages([
      {
        text: "Hi there! 👋 Welcome to **Fly & Flourish Support**. How can I help with your study abroad journey today?",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const completedCount = stages.filter((s: any) => s.status === 'completed').length;
  const progressPercent = stages.length ? Math.round((completedCount / stages.length) * 100) : 0;
  const filteredUniversities =
    countryFilter === 'All'
      ? UNIVERSITIES
      : UNIVERSITIES.filter((u) => u.country === countryFilter);
  const uploadedDocs = Object.values(docChecks).filter(Boolean).length;

  if (!student) return null;

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col font-portal overflow-hidden">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        student={student}
        getInitials={getInitials}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Sidebar navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          student={student}
          handleLogout={handleLogout}
          getInitials={getInitials}
        />

        {/* Main Content Area */}
        <main className={`flex-1 min-w-0 ${
          (activeTab === 'chat' || activeTab === 'agent-chat')
            ? 'p-0 max-w-none overflow-hidden h-full pb-20 lg:pb-0'
            : 'p-4 sm:p-6 lg:p-14 max-w-[1400px] mx-auto overflow-y-auto pb-28 lg:pb-14'
        }`}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardTab
                student={student}
                uploadedDocs={uploadedDocs}
                progressPercent={progressPercent}
                stages={stages}
                setActiveTab={setActiveTab}
                applications={applications}
                activeApplicationId={activeApplicationId}
                setActiveApplicationId={setActiveApplicationId}
              />
            )}

            {activeTab === 'universities' && (
              <UniversitiesTab
                countryFilter={countryFilter}
                setCountryFilter={setCountryFilter}
                filteredUniversities={filteredUniversities}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressTab
                progressPercent={progressPercent}
                stages={stages}
                expandedStage={expandedStage}
                setExpandedStage={setExpandedStage}
                applications={applications}
                activeApplicationId={activeApplicationId}
                setActiveApplicationId={setActiveApplicationId}
              />
            )}

            {activeTab === 'visa' && (
              <VisaTab
                student={student}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'vault' && (
              <VaultTab
                docChecks={docChecks}
                setDocChecks={setDocChecks}
                uploadedDocs={uploadedDocs}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
              />
            )}

            {activeTab === 'chat' && (
              <ChatTab
                chatMessages={chatMessages}
                isBotTyping={isBotTyping}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleSendChat={handleSendChat}
                chatEndRef={chatEndRef}
                setActiveTab={setActiveTab}
                clearChat={clearChat}
                forcedMode="ai"
              />
            )}

            {activeTab === 'agent-chat' && (
              <ChatTab
                chatMessages={agentMessages}
                isBotTyping={isAgentTyping}
                chatInput={agentInput}
                setChatInput={setAgentInput}
                handleSendChat={handleSendAgentChat}
                chatEndRef={chatEndRef}
                setActiveTab={setActiveTab}
                clearChat={() => {
                  setAgentMessages([
                    {
                      text: `Hi ${student?.name || 'Student'}! Ms. Priya Sharma here, your Senior Admissions Counsel. I'm online and ready to assist you. Ask me anything about your university shortlists, visas, or documents!`,
                      isBot: true,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    }
                  ]);
                }}
                forcedMode="agent"
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile/Tablet BottomNavBar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-outline-variant flex items-center justify-around z-50 px-4 sm:px-6">
        <button
          onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === 'dashboard' ? 'text-secondary' : 'text-on-surface-variant opacity-60'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="font-label-caps text-[7px] mt-1 tracking-widest">HOME</span>
        </button>
        <button
          onClick={() => { setActiveTab('universities'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === 'universities' ? 'text-secondary' : 'text-on-surface-variant opacity-60'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">list_alt</span>
          <span className="font-label-caps text-[7px] mt-1 tracking-widest">APPS</span>
        </button>
        <button
          onClick={() => { setActiveTab('vault'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === 'vault' && !mobileMenuOpen ? 'text-secondary' : 'text-on-surface-variant opacity-60'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">folder_shared</span>
          <span className="font-label-caps text-[7px] mt-1 tracking-widest">VAULT</span>
        </button>
        <button
          onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === 'chat' ? 'text-secondary' : 'text-on-surface-variant opacity-60'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">chat</span>
          <span className="font-label-caps text-[7px] mt-1 tracking-widest">CHAT</span>
        </button>
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className={`flex flex-col items-center cursor-pointer ${
            (mobileMenuOpen || activeTab === 'progress' || activeTab === 'visa' || activeTab === 'agent-chat' || activeTab === 'profile') ? 'text-secondary' : 'text-on-surface-variant opacity-60'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
          <span className="font-label-caps text-[7px] mt-1 tracking-widest">MORE</span>
        </button>
      </nav>

      {/* Mobile/Tablet Bottom Sheet Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Bottom Sheet Drawer Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] border-t border-outline shadow-2xl z-50 p-6 pb-8 space-y-6 max-h-[80vh] overflow-y-auto flex flex-col justify-between"
            >
              {/* Header with drag indicator line and Close button */}
              <div>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-display font-semibold text-primary">Fly &amp; Flourish</h3>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="material-symbols-outlined p-2 hover:bg-slate-50 rounded-full text-on-surface-variant cursor-pointer"
                  >
                    close
                  </button>
                </div>
              </div>

              {/* Menu items grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'dashboard' as TabKey, label: 'Dashboard', icon: 'dashboard' },
                  { key: 'progress' as TabKey, label: 'Applications', icon: 'description' },
                  { key: 'universities' as TabKey, label: 'Shortlist', icon: 'list_alt' },
                  { key: 'vault' as TabKey, label: 'Doc Vault', icon: 'folder_shared' },
                  { key: 'visa' as TabKey, label: 'Visa Tracking', icon: 'airplane_ticket' },
                  { key: 'chat' as TabKey, label: 'AI Support', icon: 'chat' },
                  { key: 'profile' as TabKey, label: 'Profile', icon: 'person' },
                ].map((item, idx) => {
                  const isReallyActive = activeTab === item.key;

                  return (
                    <button
                      key={`${item.key}-mob-${idx}`}
                      onClick={() => {
                        setActiveTab(item.key);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        isReallyActive
                          ? 'bg-primary border-primary text-white shadow-md'
                          : 'bg-slate-50/50 border-outline text-on-surface-variant hover:bg-slate-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px] mb-1.5">{item.icon}</span>
                      <span className="text-[11px] font-bold tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-secondary text-white py-3 rounded-xl font-mono text-[10.5px] hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95 tracking-widest cursor-pointer text-center"
                >
                  BOOK CONSULTATION
                </button>
                <div className="flex justify-between text-xs px-2">
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setActiveTab('chat'); setMobileMenuOpen(false); }} 
                    className="text-on-surface-variant hover:text-primary font-semibold flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">help_outline</span>
                    Support Center
                  </a>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                    className="text-on-surface-variant hover:text-error font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
