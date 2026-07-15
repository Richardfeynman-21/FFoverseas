'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { AnimatePresence, motion } from 'motion/react';

// Imports from local files
import { TabKey, ChatMessage, Student, UploadedFile, StudentApplication, ApplicationStage } from './types';
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
import { ReferTab } from './ReferTab';
import { VisaTab } from './VisaTab';

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const mapStatus = (status: string | null | undefined): 'completed' | 'current' | 'pending' => {
  if (!status) return 'pending';
  const lower = status.toLowerCase();
  if (lower === 'completed') return 'completed';
  if (lower === 'in_progress' || lower === 'current' || lower === 'blocked') return 'current';
  return 'pending';
};

const mapDate = (completedAt: string | null | undefined): string => {
  if (!completedAt) return '';
  try {
    return new Date(completedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return '';
  }
};

export default function StudentDashboard() {
  const router = useRouter();
  const chatSessionId = useRef('session_' + Math.random().toString(36).substring(2, 15));
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
  const [token, setToken] = useState<string | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [docChecks, setDocChecks] = useState<Record<string, boolean>>(() => {
    const checks: Record<string, boolean> = {};
    DOCUMENTS.forEach((d) => {
      checks[d.id] = false;
    });
    return checks;
  });

  // Consultation booking state
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [consultationSubject, setConsultationSubject] = useState('General Consultation');

  const getNext7Days = () => {
    const days: { dateStr: string; label: string; }[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const formatted = `${yyyy}-${mm}-${dd}`;
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      days.push({ dateStr: formatted, label: `${weekday} ${dayNum}` });
    }
    return days;
  };

  useEffect(() => {
    if (!consultationOpen || !token) return;
    
    const fetchAvailability = async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/students/me/consultations/availability?date=${selectedDate}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableSlots(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    };
    
    fetchAvailability();
    setSelectedSlot(null);
  }, [selectedDate, consultationOpen, token]);

  const handleBookConsultation = async () => {
    if (!selectedSlot || !token) return;
    setBookingLoading(true);
    try {
      const res = await fetch('/api/students/me/consultations/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_date: selectedDate,
          booking_time: selectedSlot
        })
      });
      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setConsultationOpen(false);
        }, 2000);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to book slot.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

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

  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [activeApplicationId, setActiveApplicationId] = useState<string>('');
  const [stages, setStages] = useState<ApplicationStage[]>([]);

  const activeApplication = applications.find(a => a.id === activeApplicationId) || applications[0];

  // Sync stages back into applications list when stages updates
  useEffect(() => {
    const primaryId = applications[0]?.id;
    if (primaryId && stages.length > 0) {
      setApplications(prevApps => prevApps.map(app => 
        app.id === primaryId 
          ? { ...app, stages: stages }
          : app
      ));
    }
  }, [stages, applications[0]?.id]);

  // Load token on mount
  useEffect(() => {
    const t = localStorage.getItem('ff_student_token');
    if (t) {
      setToken(t);
    }
  }, []);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/students/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const mappedStudent: Student = {
          id: data.id,
          name: data.full_name,
          email: data.email,
          avatar_url: data.avatar_url || null,
          assignedAgentName: data.assigned_agent_name || null,
          assignedAgentId: data.assigned_agent_id || null
        };
        setStudent(mappedStudent);
        localStorage.setItem('ff_student', JSON.stringify(mappedStudent));
      } else if (res.status === 401) {
        localStorage.removeItem('ff_student_token');
        router.replace('/student/login');
      }
    } catch (err) {
      console.error('Error fetching student profile:', err);
    }
  };

  const fetchApplications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications((prevApps) => {
          return data.map((app: any) => {
            const uniInfo = UNIVERSITIES.find(u => u.name.toLowerCase() === app.university_name.toLowerCase());
            const existingApp = prevApps.find(a => a.id === app.id);
            return {
              id: app.id,
              universityName: app.university_name,
              programName: app.course_name,
              country: uniInfo?.country || app.metadata?.country || 'Unknown',
              flag: uniInfo?.flag || app.metadata?.flag || 'UN',
              logoColor: app.metadata?.logoColor || 'from-[#002f6c] to-[#001834]',
              status: app.status || 'draft',
              stages: existingApp ? existingApp.stages : []
            };
          });
        });
        if (data.length > 0) {
          const firstAppId = data[0].id;
          setActiveApplicationId((prev) => {
            if (prev && data.some((a: any) => a.id === prev)) {
              return prev;
            }
            return firstAppId;
          });
        }
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const fetchDocuments = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const mappedDocs: UploadedFile[] = data.map((doc: any) => ({
          id: doc.id,
          documentId: doc.doc_type || 'other',
          name: doc.file_name,
          size: formatSize(doc.file_size_bytes),
          uploadedAt: new Date(doc.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
        }));
        setUploadedFiles(mappedDocs);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  // Fetch student profile, applications, and documents when token is ready
  useEffect(() => {
    if (!token) return;
    fetchProfile();
    fetchApplications();
    fetchDocuments();
  }, [token]);

  const fetchStages = async (appId: string) => {
    if (!token || !appId) return;

    if (appId.startsWith('app-')) {
      const mockApp = DEFAULT_APPLICATIONS.find(a => a.id === appId);
      if (mockApp) {
        setStages(mockApp.stages);
      }
      return;
    }

    try {
      const res = await fetch(`/api/applications/${appId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const mappedStages = data.map((progress: any, index: number) => ({
          id: progress.order_index || (index + 1),
          name: progress.stage_name,
          status: mapStatus(progress.status),
          date: mapDate(progress.completed_at),
          description: progress.description || progress.notes || ''
        }));
        setStages(mappedStages);
      }
    } catch (err) {
      console.error('Error fetching stages:', err);
    }
  };

  // Re-fetch applications and documents when switching tabs to ensure real-time parity with agent updates
  useEffect(() => {
    if (!token) return;
    if (activeTab === 'progress' || activeTab === 'dashboard') {
      fetchApplications();
      const primaryId = applications[0]?.id;
      if (primaryId) {
        fetchStages(primaryId);
      }
    }
    if (activeTab === 'vault' || activeTab === 'dashboard') {
      fetchDocuments();
    }
  }, [activeTab, token, applications[0]?.id]);

  // Fetch stages when primary application changes or on load
  useEffect(() => {
    const primaryId = applications[0]?.id;
    if (primaryId) {
      fetchStages(primaryId);
    }
  }, [applications[0]?.id, token]);

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

  const initChatRoom = async () => {
    if (!student || !token) return;
    
    if (!student.assignedAgentId) {
      console.log("No assigned agent found for student. Cannot open chat room.");
      return;
    }
    
    try {
      const res = await fetch('/api/chat/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let roomId = null;
      if (res.ok) {
        const rooms = await res.json();
        const directRoom = rooms.find((r: any) => 
          r.room_type === 'direct' && 
          r.agent_id === student.assignedAgentId &&
          r.student_id === student.id
        );
        if (directRoom) {
          roomId = directRoom.id;
        }
      }
      
      if (!roomId) {
        const createRes = await fetch('/api/chat/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            student_id: student.id,
            agent_id: student.assignedAgentId,
            room_type: 'direct'
          })
        });
        if (createRes.ok) {
          const newRoom = await createRes.json();
          roomId = newRoom.id;
        }
      }
      
      if (roomId) {
        setChatRoomId(roomId);
        
        const msgRes = await fetch(`/api/chat/rooms/${roomId}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (msgRes.ok) {
          const msgs = await msgRes.json();
          const mappedMsgs = msgs.map((m: any) => ({
            text: m.content,
            isBot: m.sender_role === 'agent',
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          mappedMsgs.reverse();
          setAgentMessages(mappedMsgs);
        }
      }
    } catch (err) {
      console.error('Error initializing chat room:', err);
    }
  };

  // 1. Fetch or create chat room for this student and assigned agent from PostgreSQL backend
  useEffect(() => {
    initChatRoom();
  }, [student, token]);

  // 2. Establish WebSocket connection and handle incoming messages in real-time
  useEffect(() => {
    if (!token || !chatRoomId) return;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.hostname;
    const wsUrl = `${protocol}//${wsHost}:8080/ws/chat?token=${token}`;
    
    console.log("Connecting to WebSocket:", wsUrl);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket event received:", data);
        
        if (data.type === 'NewMessage') {
          const payload = data.payload;
          if (payload.room_id === chatRoomId) {
            const msg = payload.message;
            const newMsg = {
              text: msg.content,
              isBot: msg.sender_role === 'agent',
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setAgentMessages((prev) => [...prev, newMsg]);
          }
        }
      } catch (e) {
        console.error("Error parsing WebSocket event:", e);
      }
    };
    
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [chatRoomId, token]);

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

  const handleSendChat = async (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { text: msg, isBot: false, time }]);
    setChatInput('');
    setIsBotTyping(true);

    try {
      const token = localStorage.getItem('ff_student_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        fetch('/api/students/me/active', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(err => console.error("Failed to transition active status:", err));
      }

      const res = await fetch('/api/public-chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId: chatSessionId.current,
          message: msg
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages((prev) => [...prev, { text: data.reply || data.message || "Failed to fetch response", isBot: true, time: botTime }]);
      } else {
        throw new Error('Failed to connect to the bot');
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [...prev, { text: "Sorry, I am facing a connection issue right now. Please try again.", isBot: true, time: botTime }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleSendAgentChat = (text?: string) => {
    const msg = text || agentInput.trim();
    if (!msg) return;
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && chatRoomId) {
      socketRef.current.send(JSON.stringify({
        type: 'SendMessage',
        payload: {
          room_id: chatRoomId,
          content: msg,
          attachments: null
        }
      }));
      setAgentInput('');
    } else {
      console.warn("WebSocket connection not open. Cannot send message.");
    }
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
          student={student || { id: '', name: 'Student User', email: '', avatar_url: null }}
          handleLogout={handleLogout}
          getInitials={getInitials}
          onBookConsultationClick={() => setConsultationOpen(true)}
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
                docChecks={docChecks}
              />
            )}

            {activeTab === 'universities' && (
              <UniversitiesTab
                countryFilter={countryFilter}
                setCountryFilter={setCountryFilter}
                filteredUniversities={filteredUniversities}
                setActiveTab={setActiveTab}
                onApplySuccess={fetchApplications}
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
                activeApplicationId={activeApplicationId}
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
                  const agentName = student?.assignedAgentName || 'Assigned Counselor';
                  setAgentMessages([
                    {
                      text: `Hi ${student?.name || 'Student'}! ${agentName} here, your Senior Admissions Counsel. I'm online and ready to assist you. Ask me anything about your university shortlists, visas, or documents!`,
                      isBot: true,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    }
                  ]);
                }}
                forcedMode="agent"
                refreshChat={initChatRoom}
                agentName={student?.assignedAgentName || undefined}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab />
            )}

            {activeTab === 'refer' && (
              <ReferTab student={student} />
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
                  { key: 'refer' as TabKey, label: 'Refer & Earn', icon: 'share' },
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
                  onClick={() => { setMobileMenuOpen(false); setConsultationOpen(true); }}
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

      {/* Consultation Booking Modal */}
      <AnimatePresence>
        {consultationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setConsultationOpen(false)}
              className="absolute inset-0 bg-slate-900"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#001F3F] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">calendar_month</span>
                    Book a Consultation
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Select a date and time slot with your counselor</p>
                </div>
                <button 
                  onClick={() => setConsultationOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {bookingSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="material-symbols-outlined text-[36px]">check_circle</span>
                  </div>
                  <h4 className="text-lg font-bold text-emerald-700">Booking Confirmed!</h4>
                  <p className="text-sm font-semibold text-slate-500 max-w-xs">
                    Your appointment has been scheduled for {selectedDate} at {selectedSlot}.
                  </p>
                </motion.div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
                  {/* Date Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase font-mono tracking-wider">
                      Select Date
                    </label>
                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                      {getNext7Days().map((day) => (
                        <button
                          key={day.dateStr}
                          onClick={() => setSelectedDate(day.dateStr)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer min-w-[70px] ${
                            selectedDate === day.dateStr
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                              : 'bg-slate-50/50 border-slate-100 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">
                            {day.label.split(' ')[0]}
                          </span>
                          <span className="text-lg font-extrabold mt-0.5">
                            {day.label.split(' ')[1]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Availability Grid */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-2.5 uppercase font-mono tracking-wider">
                      Available Slots
                    </label>
                    {loadingSlots ? (
                      <div className="py-8 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {availableSlots.map((slot) => {
                          const isBooked = slot.status === 'booked';
                          const isLimited = slot.status === 'limited';
                          const isSelected = selectedSlot === slot.time;

                          return (
                            <button
                              key={slot.time}
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot.time)}
                              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[75px] ${
                                isBooked
                                  ? 'bg-slate-50/40 border-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-primary/5 border-primary text-primary shadow-sm shadow-primary/5 scale-[1.02]'
                                  : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50 text-[#001F3F] cursor-pointer'
                              }`}
                            >
                              <span className="text-sm font-bold tracking-tight">
                                {slot.time}
                              </span>
                              
                              <div className="flex items-center gap-1.5 mt-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isBooked ? 'bg-slate-400' : isLimited ? 'bg-amber-500' : 'bg-emerald-500'
                                }`} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  isBooked ? 'text-slate-400' : isLimited ? 'text-amber-600' : 'text-emerald-600'
                                }`}>
                                  {isBooked ? 'Fully Booked' : isLimited ? 'Last slot' : 'Available'}
                                </span>
                              </div>

                              {isSelected && (
                                <span className="absolute top-2.5 right-2.5 text-primary text-sm material-symbols-outlined">
                                  check_circle
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Consultation Subject */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      value={consultationSubject}
                      onChange={(e) => setConsultationSubject(e.target.value)}
                      placeholder="e.g. Visa Guidance, University Selection"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              {!bookingSuccess && (
                <div className="mt-6 pt-4 border-t border-slate-50 flex gap-3">
                  <button
                    onClick={() => setConsultationOpen(false)}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-[#001F3F] rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedSlot || bookingLoading}
                    onClick={handleBookConsultation}
                    className={`flex-1 py-3 text-white rounded-xl font-bold text-xs tracking-wide shadow-lg transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 ${
                      !selectedSlot || bookingLoading
                        ? 'bg-slate-200 border-transparent text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-primary hover:bg-slate-800 cursor-pointer shadow-primary/10'
                    }`}
                  >
                    {bookingLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
