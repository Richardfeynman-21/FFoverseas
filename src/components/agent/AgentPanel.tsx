'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

import {
  StudentRecord,
  ApplicationRecord,
  DocumentRecord,
  UniversityRecord,
  PipelineStage,
  ChatMessage
} from './types';

import OverviewTab from './OverviewTab';
import StudentsTab from './StudentsTab';
import ChatTab from './ChatTab';
import ApplicationsTab from './ApplicationsTab';
import DocumentsTab from './DocumentsTab';
import UniversitiesTab from './UniversitiesTab';

const NAVY = '#001F3F';
const RED = '#FF0000';

// ─── Default Seed Data ────────────────────────────────────────────────────────
const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'demo-student-id',
    name: 'Demo Student User',
    email: 'demo.student@ffoverseas.com',
    phone: '+91 99999 88888',
    targetDestination: 'Canada',
    targetDegree: 'Masters',
    targetUniversity: 'University of Toronto',
    targetCourse: 'Computer Science',
    specificCourses: 'Robotics, Machine Learning',
    interestedIntake: 'Fall 2026',
    remarks: 'Highly motivated. GPA is outstanding. Needs LOR verification.',
    status: 'in_progress',
    gpa: 9.0
  },
  {
    id: 'st-02',
    name: 'Aanya Sharma',
    email: 'aanya@sharma.com',
    phone: '+91 88899 90001',
    targetDestination: 'USA',
    targetDegree: 'MS CS',
    targetUniversity: 'Stanford University',
    targetCourse: 'Artificial Intelligence',
    specificCourses: null,
    interestedIntake: 'Fall 2026',
    remarks: 'Applying to Stanford and UC Berkeley. SOP is finalised.',
    status: 'in_progress',
    gpa: 9.2
  },
  {
    id: 'st-03',
    name: 'Ethan Dubois',
    email: 'ethan@dubois.fr',
    phone: '+33 61234 5678',
    targetDestination: 'UK',
    targetDegree: 'MBA',
    targetUniversity: 'London Business School',
    targetCourse: 'Finance',
    specificCourses: null,
    interestedIntake: 'Spring 2027',
    remarks: 'Admitted to London Business School. Process completed successfully.',
    status: 'completed',
    gpa: 8.1
  },
  {
    id: 'st-04',
    name: 'Vikram Singh',
    email: 'vikram.s@outlook.com',
    phone: '+91 98765 43210',
    targetDestination: 'USA',
    targetDegree: 'Masters',
    targetUniversity: null,
    targetCourse: null,
    specificCourses: null,
    interestedIntake: null,
    remarks: 'Potential lead. Intrigued by engineering options in California. Needs follow-up call.',
    status: 'lead',
    gpa: 7.8
  },
  {
    id: 'st-05',
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    phone: '+91 77766 55443',
    targetDestination: 'Germany',
    targetDegree: null,
    targetUniversity: null,
    targetCourse: null,
    specificCourses: null,
    interestedIntake: null,
    remarks: 'Looking for public free tuition universities. German level A2.',
    status: 'lead',
    gpa: 8.5
  },
  {
    id: 'st-06',
    name: 'Inactive Candidate',
    email: 'inactive@gmail.com',
    phone: '+91 12345 67890',
    targetDestination: null,
    targetDegree: null,
    targetUniversity: null,
    targetCourse: null,
    specificCourses: null,
    interestedIntake: null,
    remarks: 'Marked inactive. Decided to take a job locally.',
    status: 'inactive',
    gpa: 6.8
  }
];

const DEFAULT_APPLICATIONS: ApplicationRecord[] = [
  { id: 'ap-01', studentId: 'demo-student-id', studentName: 'Demo Student User', universityName: 'University of Toronto', program: 'Computer Science', status: 'Applied', appliedDate: '2026-06-08' },
  { id: 'ap-02', studentId: 'st-02', studentName: 'Aanya Sharma', universityName: 'Stanford University', program: 'Artificial Intelligence', status: 'Offered', appliedDate: '2026-05-15' },
  { id: 'ap-03', studentId: 'st-03', studentName: 'Ethan Dubois', universityName: 'London Business School', program: 'MBA in Finance', status: 'Accepted', appliedDate: '2026-05-20' },
];

const DEFAULT_DOCUMENTS: DocumentRecord[] = [
  { id: 'doc-01', studentName: 'Demo Student User', documentType: 'Passport', fileName: 'passport_photo_page.pdf', status: 'Verified', uploadedAt: '2026-05-28' },
  { id: 'doc-02', studentName: 'Demo Student User', documentType: 'Transcript', fileName: 'academic_transcripts_consolidated.pdf', status: 'Verified', uploadedAt: '2026-06-05' },
  { id: 'doc-03', studentName: 'Demo Student User', documentType: 'SOP', fileName: 'sop_final_v2.pdf', status: 'Pending Review', uploadedAt: '2026-06-12' },
  { id: 'doc-04', studentName: 'Aanya Sharma', documentType: 'LOR', fileName: 'lor_stanford_rec.pdf', status: 'Verified', uploadedAt: '2026-05-10' },
];

const DEFAULT_UNIVERSITIES: UniversityRecord[] = [
  { id: 'uni-01', name: 'Stanford University', country: 'USA', qsRanking: 'QS #5', tuitionRange: '$56k - $62k/yr', acceptanceRate: '3.7%' },
  { id: 'uni-02', name: 'University of Oxford', country: 'UK', qsRanking: 'QS #3', tuitionRange: '£28k - £44k/yr', acceptanceRate: '15.3%' },
  { id: 'uni-03', name: 'University of Toronto', country: 'Canada', qsRanking: 'QS #21', tuitionRange: 'CAD 45k - 62k/yr', acceptanceRate: '43.0%' },
  { id: 'uni-04', name: 'Technical University of Munich', country: 'Germany', qsRanking: 'QS #37', tuitionRange: '€0 (Public)', acceptanceRate: '8.0%' },
];

const DEFAULT_STAGES: PipelineStage[] = [
  { id: 1, name: 'Profile Submitted', status: 'pending', date: '', description: 'Student personal and academic profile recorded.' },
  { id: 2, name: 'Documents Verified', status: 'pending', date: '', description: 'Submitted documents verified by admissions team.' },
  { id: 3, name: 'University Shortlisted', status: 'pending', date: '', description: 'Best-fit universities matched to student profile.' },
  { id: 4, name: 'Application Sent', status: 'pending', date: '', description: 'Finalized applications dispatched to universities.' },
  { id: 5, name: 'Offer Letter', status: 'pending', date: '', description: 'Acceptance letters and offer confirmations received.' },
  { id: 6, name: 'Visa Processing', status: 'pending', date: '', description: 'Visa prep, mock interviews, and embassy submission.' },
  { id: 7, name: 'Pre-Departure Briefing', status: 'pending', date: '', description: 'Final orientation: accommodation, travel, cultural prep.' }
];

interface AgentPanelProps {
  agentProfile: { id: string; name: string; role: string } | null;
  onLogout: () => void;
}

export default function AgentPanel({ agentProfile, onLogout }: AgentPanelProps) {
  const router = useRouter();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'chat' | 'applications' | 'documents' | 'universities'>('overview');

  // Database States loaded from localStorage
  // Database States
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [backendOffline, setBackendOffline] = useState(false);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  const [universities, setUniversities] = useState<UniversityRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ff_universities_db');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_UNIVERSITIES;
  });

  // Chat Inbox States
  const [activeChatStudentId, setActiveChatStudentId] = useState<string>('demo-student-id');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const [chatUpdateTrigger, setChatUpdateTrigger] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const agentSocketRef = useRef<WebSocket | null>(null);
  
  const activeRoomIdRef = useRef<string | null>(null);
  const activeChatStudentIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  useEffect(() => {
    activeChatStudentIdRef.current = activeChatStudentId;
  }, [activeChatStudentId]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('ff_agent_token'));
    }
  }, []);

  const [notification, setNotification] = useState<{ text: string; isError: boolean } | null>(null);

  // Sync universities to localStorage
  useEffect(() => {
    localStorage.setItem('ff_universities_db', JSON.stringify(universities));
  }, [universities]);

  // Sync students to localStorage to enable cross-tab real-time updates
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('ff_students_db', JSON.stringify(students));
    }
  }, [students]);

  // Fetch assigned students, applications, and documents on mount / agentProfile changes
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('ff_agent_token');
      if (!token) return;

      try {
        // 1. Fetch Students
        let studentsData: any[] = [];
        if (agentProfile?.role === 'superadmin') {
          const res = await fetch('/api/admin/students', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            studentsData = data.students || [];
            setBackendOffline(false);
          } else {
            if (res.status === 502 || res.status === 503) {
              setBackendOffline(true);
            }
          }
        } else {
          const res = await fetch('/api/agents/me/students', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            studentsData = await res.json();
            setBackendOffline(false);
          } else if (res.status === 401) {
            localStorage.removeItem('ff_agent_token');
            router.replace('/student/login');
            return;
          } else {
            if (res.status === 502 || res.status === 503) {
              setBackendOffline(true);
            }
          }
        }

        const mappedStudents: StudentRecord[] = studentsData.map((s: any) => ({
          id: s.id,
          name: s.full_name,
          email: s.email,
          phone: s.phone || '',
          targetDestination: s.preferred_destination || null,
          targetDegree: s.preferred_degree_level || null,
          targetUniversity: s.profile_data?.targetUniversity || null,
          targetCourse: s.profile_data?.targetCourse || null,
          specificCourses: s.profile_data?.specificCourses || null,
          interestedIntake: s.profile_data?.interestedIntake || null,
          remarks: s.profile_data?.remarks || '',
          status: s.status || 'lead',
          gpa: s.profile_data?.eduGradeAverage ? parseFloat(s.profile_data.eduGradeAverage) : null,
          assignedAgentId: s.assigned_agent_id || null
        }));
        setStudents(mappedStudents);

        if (mappedStudents.length > 0) {
          setActiveChatStudentId((prev) => {
            if (prev && mappedStudents.some(s => s.id === prev)) {
              return prev;
            }
            return mappedStudents[0].id;
          });
        }

        // 2. Fetch Applications
        const appRes = await fetch('/api/applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (appRes.ok) {
          const appData = await appRes.json();
          const mappedApps: ApplicationRecord[] = appData.map((app: any) => {
            const student = mappedStudents.find(s => s.id === app.student_id);
            let mappedStatus: 'Applied' | 'Offered' | 'Accepted' | 'Rejected' = 'Applied';
            const statusLower = (app.status || '').toLowerCase();
            if (statusLower === 'offered') mappedStatus = 'Offered';
            else if (statusLower === 'accepted') mappedStatus = 'Accepted';
            else if (statusLower === 'rejected') mappedStatus = 'Rejected';

            return {
              id: app.id,
              studentId: app.student_id || '',
              studentName: student ? student.name : 'Unknown Student',
              universityName: app.university_name,
              program: app.course_name,
              status: mappedStatus,
              appliedDate: app.submitted_at || app.created_at ? new Date(app.submitted_at || app.created_at).toISOString().split('T')[0] : '',
              metadata: app.metadata
            };
          });
          setApplications(mappedApps);

          // Fetch and sync stages for each application to local storage
          for (const app of appData) {
            try {
              const stageRes = await fetch(`/api/applications/${app.id}/progress`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (stageRes.ok) {
                const dbStages = await stageRes.json();
                const mappedStages = dbStages.map((ps: any) => ({
                  id: ps.order_index,
                  name: ps.stage_name,
                  status: ps.status === 'completed' ? 'completed' : ps.status === 'in_progress' ? 'current' : 'pending',
                  date: ps.completed_at ? new Date(ps.completed_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                  description: ps.notes || ps.description || '',
                  dbStageId: ps.stage_id
                }));
                localStorage.setItem(`ff_stages_${app.student_id}`, JSON.stringify(mappedStages));
              }
            } catch (err) {
              console.error(`Error fetching stages for app ${app.id}:`, err);
            }
          }
        }

        // 3. Fetch Documents
        const docRes = await fetch('/api/documents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (docRes.ok) {
          const docData = await docRes.json();
          const mappedDocs: DocumentRecord[] = docData.map((doc: any) => {
            const student = mappedStudents.find(s => s.id === doc.student_id);
            let mappedType: DocumentRecord['documentType'] = 'Passport';
            const typeLower = (doc.doc_type || '').toLowerCase();
            if (typeLower === 'transcript') mappedType = 'Transcript';
            else if (typeLower === 'sop') mappedType = 'SOP';
            else if (typeLower === 'lor') mappedType = 'LOR';
            else if (typeLower === 'financial') mappedType = 'Financial';
            else if (typeLower === 'english') mappedType = 'English';
            else if (typeLower === 'photos' || typeLower === 'other') mappedType = 'Photos';

            let mappedStatus: DocumentRecord['status'] = 'Pending Review';
            const statusLower = (doc.status || '').toLowerCase();
            if (statusLower === 'verified' || statusLower === 'approved') mappedStatus = 'Verified';
            else if (statusLower === 'rejected') mappedStatus = 'Rejected';

            return {
              id: doc.id,
              studentName: student ? student.name : 'Unknown Student',
              documentType: mappedType,
              fileName: doc.file_name,
              status: mappedStatus,
              uploadedAt: doc.created_at ? new Date(doc.created_at).toISOString().split('T')[0] : ''
            };
          });
          setDocuments(mappedDocs);
        }
      } catch (err) {
        console.error('Error fetching agent data:', err);
        setBackendOffline(true);
        triggerNotification('Backend service is offline. Please check your server status.', true);
      }
    };

    fetchData();
  }, [agentProfile, activeTab]);

  const initAgentChatRoom = async () => {
    if (!token || !activeChatStudentId || activeChatStudentId === 'demo-student-id') {
      loadChatForStudent(activeChatStudentId);
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
          r.student_id === activeChatStudentId
        );
        if (directRoom) {
          roomId = directRoom.id;
        }
      }
      
      if (!roomId && agentProfile) {
        const currentStudent = students.find(s => s.id === activeChatStudentId);
        const targetAgentId = agentProfile.role === 'superadmin' 
          ? currentStudent?.assignedAgentId 
          : agentProfile.id;

        if (!targetAgentId) {
          console.warn("No agent assigned to this student. Cannot create chat room.");
          triggerNotification("Please assign an advisor to this student first.", true);
          return;
        }

        const createRes = await fetch('/api/chat/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            student_id: activeChatStudentId,
            agent_id: targetAgentId,
            room_type: 'direct'
          })
        });
        if (createRes.ok) {
          const newRoom = await createRes.json();
          roomId = newRoom.id;
        }
      }
      
      if (roomId) {
        setActiveRoomId(roomId);
        
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
          setChatMessages(mappedMsgs);
          localStorage.setItem(`ff_agent_messages_${activeChatStudentId}`, JSON.stringify(mappedMsgs));
          setChatUpdateTrigger(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error('Error fetching chat history from database:', err);
    }
  };

  // Load messages from PostgreSQL database when activeChatStudentId changes
  useEffect(() => {
    initAgentChatRoom();
  }, [activeChatStudentId, token, agentProfile]);

  // Establish WebSocket connection for the counselor (runs once per session token)
  useEffect(() => {
    if (!token) return;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const hostname = window.location.hostname;
    const wsUrl = hostname.includes('localhost') || hostname.includes('127.0.0.1')
      ? `${protocol}//localhost:8080/ws/chat?token=${token}`
      : `wss://api.ffoverseas.in/ws/chat?token=${token}`;
    
    console.log("Agent connecting to WebSocket:", wsUrl);
    const socket = new WebSocket(wsUrl);
    agentSocketRef.current = socket;
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Agent WebSocket event received:", data);
        
        if (data.type === 'NewMessage') {
          const payload = data.payload;
          const msg = payload.message;
          const mappedMsg = {
            text: msg.content,
            isBot: msg.sender_role === 'agent',
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          let targetStudentId: string | null = null;
          if (activeRoomIdRef.current && payload.room_id === activeRoomIdRef.current) {
            targetStudentId = activeChatStudentIdRef.current;
            setChatMessages((prev) => [...prev, mappedMsg]);
          } else {
            // Check if we can find the student from the rooms mapping in localStorage
            // (Standard fallback or direct room mapping checks)
          }
          
          if (targetStudentId) {
            const saved = localStorage.getItem(`ff_agent_messages_${targetStudentId}`);
            let current = [];
            if (saved) {
              try { current = JSON.parse(saved); } catch (e) {}
            }
            const updated = [...current, mappedMsg];
            localStorage.setItem(`ff_agent_messages_${targetStudentId}`, JSON.stringify(updated));
            setChatUpdateTrigger(prev => prev + 1);
          }
        }
      } catch (e) {
        console.error("Error parsing agent WebSocket event:", e);
      }
    };
    
    socket.onclose = () => {
      console.log("Agent WebSocket connection closed");
    };
    
    return () => {
      socket.close();
      agentSocketRef.current = null;
    };
  }, [token]);

  // Listen to storage events to keep the Chat Inbox and Stages synced in real-time
  useEffect(() => {
    const handleStorageChange = (e: any) => {
      // Trigger a visual update on any storage sync / cross-tab changes
      setChatUpdateTrigger(prev => prev + 1);

      // Reload students
      const savedStudents = localStorage.getItem('ff_students_db');
      if (savedStudents) {
        try { setStudents(JSON.parse(savedStudents)); } catch (err) {}
      }
      
      // Reload chat if active chat changes
      if (activeChatStudentId) {
        loadChatForStudent(activeChatStudentId);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage_sync', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage_sync', handleStorageChange);
    };
  }, [activeChatStudentId]);

  // ─── Seed Chat Messages on Mount ──────────────────────────────────────────────
  useEffect(() => {
    // Seed default chats in localStorage if not exists, to make inbox look rich
    const agentName = agentProfile?.name || 'your Counselor';
    students.forEach(st => {
      const chatKey = `ff_agent_messages_${st.id}`;
      if (!localStorage.getItem(chatKey)) {
        let initialMsgs: ChatMessage[] = [];
        if (st.id === 'demo-student-id') {
          initialMsgs = [
            { text: `Hi ${st.name}! ${agentName} here, your Senior Admissions Counselor. I'm online and ready to assist you. Ask me anything about your university shortlists, visas, or documents!`, isBot: true, time: '10:00 AM' },
            { text: `Hello ${agentName}! I uploaded my consolidate transcripts. Can you please check if they are verified? Also, when will the university shortlists be ready?`, isBot: false, time: '10:15 AM' },
            { text: "Thanks for uploading. I have verified your transcript. I'm finalising your university shortlists now. I will upload them shortly!", isBot: true, time: '10:20 AM' },
            { text: "Awesome! Let know when they are ready. I am keen on Canada universities.", isBot: false, time: '10:22 AM' }
          ];
        } else if (st.id === 'st-02') {
          initialMsgs = [
            { text: `Hi Aanya! Let me know if you need help with your Stanford application SOP.`, isBot: true, time: '09:00 AM' },
            { text: `Hi ${agentName}! Yes, I just updated my SOP draft. Can you review the career goals section?`, isBot: false, time: '09:30 AM' }
          ];
        } else if (st.id === 'st-03') {
          initialMsgs = [
            { text: "Hey Ethan, congratulations on your London Business School offer!", isBot: true, time: 'Yesterday' },
            { text: "Thank you so much! My visa appointment is booked for July 10.", isBot: false, time: 'Yesterday' }
          ];
        } else if (st.id === 'st-04') {
          initialMsgs = [
            { text: "Hello Vikram, I saw you registered. Have you taken the GRE yet?", isBot: true, time: '2 days ago' },
            { text: "No, scheduling it next month. Can we shortlist universities without it?", isBot: false, time: '2 days ago' }
          ];
        } else {
          initialMsgs = [
            { text: `Hi ${st.name}, welcome to Fly & Flourish! Do you have any destinations in mind?`, isBot: true, time: '3 days ago' }
          ];
        }
        localStorage.setItem(chatKey, JSON.stringify(initialMsgs));
      }
    });
    
    // Initial chat load
    loadChatForStudent(activeChatStudentId);
  }, []);

  // ─── Helper Functions ──────────────────────────────────────────────────────────
  const triggerNotification = (text: string, isError = false) => {
    setNotification({ text, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadChatForStudent = (studentId: string) => {
    const chatKey = `ff_agent_messages_${studentId}`;
    const saved = localStorage.getItem(chatKey);
    if (saved) {
      try {
        setChatMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setChatMessages([]);
    }
  };

  const loadStagesForStudent = (studentId: string): PipelineStage[] => {
    if (studentId === 'demo-student-id') {
      const saved = localStorage.getItem('ff_application_stages');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    const saved = localStorage.getItem(`ff_stages_${studentId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return JSON.parse(JSON.stringify(DEFAULT_STAGES));
  };

  const saveStagesForStudent = async (studentId: string, updatedStages: PipelineStage[]) => {
    if (studentId === 'demo-student-id') {
      localStorage.setItem('ff_application_stages', JSON.stringify(updatedStages));
    }
    
    localStorage.setItem(`ff_stages_${studentId}`, JSON.stringify(updatedStages));
    
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storage_sync'));

    // Backend database synchronization
    const app = applications.find(a => a.studentId === studentId);
    const token = localStorage.getItem('ff_agent_token');
    if (app && token) {
      const updatedMetadata = {
        ...(app.metadata || {}),
        milestones: updatedStages
      };

      try {
        const backendStatus = app.status === 'Applied' ? 'submitted' : app.status.toLowerCase();
        const res = await fetch(`/api/applications/${app.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            university_id: 1, // default placeholder
            university_name: app.universityName,
            course_name: app.program,
            degree_level: 'Masters', // default placeholder
            status: backendStatus,
            metadata: updatedMetadata
          })
        });

        if (res.ok) {
          // Update the local applications state so metadata is updated
          setApplications(prev => prev.map(a => a.id === app.id ? { ...a, metadata: updatedMetadata } : a));
        } else {
          console.error('Failed to save stages to application metadata', await res.text());
        }
      } catch (e) {
        console.error('Failed to save stages to application metadata:', e);
      }
    }
  };

  // ─── Chat Actions ─────────────────────────────────────────────────────────────
  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    if (activeChatStudentId === 'demo-student-id') {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: ChatMessage = {
        text: chatInput.trim(),
        isBot: true,
        time
      };
      const updated = [...chatMessages, newMsg];
      setChatMessages(updated);
      localStorage.setItem(`ff_agent_messages_${activeChatStudentId}`, JSON.stringify(updated));
      setChatInput('');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('storage_sync'));
      triggerNotification('Reply sent successfully.');
      return;
    }

    if (agentSocketRef.current && agentSocketRef.current.readyState === WebSocket.OPEN && activeRoomId) {
      agentSocketRef.current.send(JSON.stringify({
        type: 'SendMessage',
        payload: {
          room_id: activeRoomId,
          content: chatInput.trim(),
          attachments: null
        }
      }));
      setChatInput('');
      triggerNotification('Reply sent successfully.');
    } else {
      console.warn("Agent WebSocket connection not open. Cannot send message.");
      triggerNotification('WebSocket offline. Failed to send message.', true);
    }
  };

  // ─── Student Profile Actions ──────────────────────────────────────────────────
  const handleSaveProfile = async (studentId: string, updatedFields: Partial<StudentRecord>) => {
    const token = localStorage.getItem('ff_agent_token');
    if (!token) {
      triggerNotification('Session expired. Please log in again.', true);
      return;
    }

    const st = students.find(s => s.id === studentId);
    if (!st) return;

    try {
      const res = await fetch(`/api/agents/students/${studentId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: updatedFields.name !== undefined ? updatedFields.name : st.name,
          phone: updatedFields.phone !== undefined ? updatedFields.phone : st.phone,
          country: null,
          preferred_destination: updatedFields.targetDestination !== undefined ? updatedFields.targetDestination : st.targetDestination,
          preferred_degree_level: updatedFields.targetDegree !== undefined ? updatedFields.targetDegree : st.targetDegree,
          preferred_intake: updatedFields.interestedIntake !== undefined ? updatedFields.interestedIntake : st.interestedIntake,
          profile_data: {
            targetUniversity: updatedFields.targetUniversity !== undefined ? updatedFields.targetUniversity : st.targetUniversity,
            targetCourse: updatedFields.targetCourse !== undefined ? updatedFields.targetCourse : st.targetCourse,
            specificCourses: updatedFields.specificCourses !== undefined ? updatedFields.specificCourses : st.specificCourses,
            interestedIntake: updatedFields.interestedIntake !== undefined ? updatedFields.interestedIntake : st.interestedIntake,
            remarks: updatedFields.remarks !== undefined ? updatedFields.remarks : st.remarks,
            eduGradeAverage: updatedFields.gpa !== undefined ? (updatedFields.gpa === null ? '' : updatedFields.gpa.toString()) : (st.gpa === null ? '' : st.gpa.toString())
          }
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.detail || 'Failed to update student profile.');
      }

      const updatedStudents = students.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            ...updatedFields
          };
        }
        return s;
      });

      setStudents(updatedStudents);
      triggerNotification('Student profile database updated.');
    } catch (err: any) {
      console.error(err);
      triggerNotification(err.message || 'Failed to update student profile.', true);
    }
  };

  const handleUpdateStudentStatus = async (studentId: string, newStatus: 'lead' | 'in_progress' | 'completed' | 'inactive') => {
    const token = localStorage.getItem('ff_agent_token');
    if (!token) {
      triggerNotification('Session expired. Please log in again.', true);
      return;
    }

    try {
      const res = await fetch(`/api/admin/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          is_active: newStatus === 'in_progress'
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.detail || 'Failed to update student status.');
      }

      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          return { ...s, status: newStatus };
        }
        return s;
      }));
      triggerNotification(`Student status updated to: ${newStatus}`);
    } catch (err: any) {
      console.error(err);
      triggerNotification(err.message || 'Failed to update student status.', true);
    }
  };

  const handleCreateStudent = async (studentData: { email: string; password_hash: string; full_name: string; phone: string }) => {
    const token = localStorage.getItem('ff_agent_token');
    if (!token) {
      triggerNotification('Session expired. Please log in again.', true);
      return;
    }

    try {
      const res = await fetch('/api/agents/me/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: studentData.email,
          password: studentData.password_hash,
          full_name: studentData.full_name,
          phone: studentData.phone || null
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.detail || 'Failed to create student.');
      }

      const newStudent = await res.json();
      const mappedNewStudent: StudentRecord = {
        id: newStudent.id,
        name: newStudent.full_name,
        email: newStudent.email,
        phone: newStudent.phone || '',
        targetDestination: newStudent.preferred_destination || null,
        targetDegree: newStudent.preferred_degree_level || null,
        targetUniversity: newStudent.profile_data?.targetUniversity || null,
        targetCourse: newStudent.profile_data?.targetCourse || null,
        specificCourses: newStudent.profile_data?.specificCourses || null,
        interestedIntake: newStudent.profile_data?.interestedIntake || null,
        remarks: newStudent.profile_data?.remarks || '',
        status: newStudent.is_active ? 'in_progress' : 'inactive',
        gpa: newStudent.profile_data?.eduGradeAverage ? parseFloat(newStudent.profile_data.eduGradeAverage) : null
      };

      setStudents(prev => [...prev, mappedNewStudent]);
      triggerNotification('Student created successfully.');
    } catch (err: any) {
      console.error(err);
      triggerNotification(err.message || 'Failed to create student.', true);
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this student record? This cannot be undone.')) {
      const updated = students.filter(s => s.id !== studentId);
      setStudents(updated);
      triggerNotification('Student record removed from database.', true);
    }
  };


  // Inbox messaging selector: lists active student conversations
  const getInboxConversations = () => {
    return students.map(st => {
      const chatKey = `ff_agent_messages_${st.id}`;
      const saved = localStorage.getItem(chatKey);
      let msgs: ChatMessage[] = [];
      if (saved) {
        try { msgs = JSON.parse(saved); } catch (err) {}
      }
      
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : { text: 'No messages yet.', time: '', isBot: false };
      
      let unread = false;
      if (msgs.length > 0 && !msgs[msgs.length - 1].isBot) {
        unread = true;
      }
      
      return {
        student: st,
        lastMessage: lastMsg.text,
        time: lastMsg.time,
        unread
      };
    });
  };

  const getTabColorStyles = (key: string) => {
    switch (key) {
      case 'overview':
        return {
          activeBg: 'bg-indigo-50/60 text-indigo-700 border-l-4 border-indigo-600 rounded-l-none',
          dotBg: 'bg-indigo-500',
          textColor: 'text-indigo-600',
          borderColor: 'border-indigo-100',
          glow: 'shadow-indigo-500/10'
        };
      case 'students':
        return {
          activeBg: 'bg-emerald-50/60 text-emerald-700 border-l-4 border-emerald-600 rounded-l-none',
          dotBg: 'bg-emerald-500',
          textColor: 'text-emerald-600',
          borderColor: 'border-emerald-100',
          glow: 'shadow-emerald-500/10'
        };
      case 'chat':
        return {
          activeBg: 'bg-sky-50/60 text-sky-700 border-l-4 border-sky-600 rounded-l-none',
          dotBg: 'bg-sky-500',
          textColor: 'text-sky-600',
          borderColor: 'border-sky-100',
          glow: 'shadow-sky-500/10'
        };
      case 'applications':
        return {
          activeBg: 'bg-amber-50/60 text-amber-700 border-l-4 border-amber-600 rounded-l-none',
          dotBg: 'bg-amber-500',
          textColor: 'text-amber-600',
          borderColor: 'border-amber-100',
          glow: 'shadow-amber-500/10'
        };
      case 'documents':
        return {
          activeBg: 'bg-teal-50/60 text-teal-700 border-l-4 border-teal-600 rounded-l-none',
          dotBg: 'bg-teal-500',
          textColor: 'text-teal-600',
          borderColor: 'border-teal-100',
          glow: 'shadow-teal-500/10'
        };
      case 'universities':
        return {
          activeBg: 'bg-rose-50/60 text-rose-700 border-l-4 border-rose-600 rounded-l-none',
          dotBg: 'bg-rose-500',
          textColor: 'text-rose-600',
          borderColor: 'border-rose-100',
          glow: 'shadow-rose-500/10'
        };
      case 'health':
        return {
          activeBg: 'bg-violet-50/60 text-violet-700 border-l-4 border-violet-600 rounded-l-none',
          dotBg: 'bg-violet-500',
          textColor: 'text-violet-600',
          borderColor: 'border-violet-100',
          glow: 'shadow-violet-500/10'
        };
      default:
        return {
          activeBg: 'bg-slate-100/60 text-[#001F3F] border-l-4 border-[#001F3F] rounded-l-none',
          dotBg: 'bg-[#001F3F]',
          textColor: 'text-[#001F3F]',
          borderColor: 'border-slate-100',
          glow: 'shadow-slate-500/10'
        };
    }
  };

  const dynamicColors = getTabColorStyles(activeTab);

  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans selection:bg-[#001F3F]/5 selection:text-[#001F3F] pb-10 flex flex-col lg:flex-row w-full transition-colors duration-500 relative">
      {backendOffline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white px-6 py-3 flex items-center justify-between text-xs font-bold font-mono tracking-wider shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
            <span>CRITICAL ERROR: AGY BACKEND OFFLINE (502 BAD GATEWAY). SYSTEM DISCONNECTED.</span>
          </div>
          <button 
            type="button"
            onClick={() => window.location.reload()} 
            className="px-3 py-1 bg-white/20 hover:bg-white/35 rounded-lg border border-white/10 transition cursor-pointer text-[9px]"
          >
            RECONNECT
          </button>
        </div>
      )}
      
      {/* Dynamic notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl border flex items-center gap-3 shadow-lg backdrop-blur-md bg-white ${
              notification.isError 
                ? 'border-red-200 text-red-800' 
                : 'border-emerald-200 text-emerald-800'
            }`}
          >
            <CheckCircle2 size={16} className={notification.isError ? 'text-red-500' : 'text-emerald-500'} />
            <span className="text-xs font-semibold font-mono tracking-wide">{notification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between shrink-0 shadow-[2px_0_15px_rgba(0,0,0,0.003)]">
        <div className="flex flex-col w-full">
          {/* Top bar (brand + profile + logout on mobile) */}
          <div className="flex flex-row lg:flex-col items-center lg:items-stretch justify-between lg:justify-start border-b border-slate-100 w-full">
            {/* Brand Branding Banner */}
            <div className="px-6 py-4 lg:py-6 flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm border border-slate-150">
                <img src="/logo.svg" className="w-full h-full object-contain" alt="Fly & Flourish Logo" />
              </div>
              <div>
                <h2 className="text-[#001F3F] font-black text-xs lg:text-sm tracking-tight leading-none">Fly & Flourish</h2>
                <p className="text-[7px] lg:text-[8px] font-mono text-slate-400 tracking-[0.2em] uppercase leading-none mt-1 font-bold">AGENT COMMAND</p>
              </div>
            </div>

            {/* Agent profile detail summary (hidden on mobile, shown on lg) */}
            {agentProfile && (
              <div className="hidden lg:flex px-6 py-4 border-t border-slate-100 bg-slate-50/30 items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-[#001F3F] font-mono select-none">
                  PS
                </div>
                <div className="min-w-0">
                  <p className="text-[#001F3F] text-xs font-bold truncate leading-none">{agentProfile.name}</p>
                  <p className="text-[9px] font-mono text-slate-450 truncate leading-none mt-1.5 uppercase tracking-wider font-semibold">{agentProfile.role}</p>
                </div>
              </div>
            )}

            {/* Logout panel on mobile */}
            <div className="lg:hidden px-6 py-4">
              <button
                onClick={onLogout}
                className="flex items-center justify-center p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all border border-red-100 cursor-pointer"
                title="Terminate Session"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Sidebar Action tabs */}
          <nav className="p-3 lg:p-4 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible whitespace-nowrap scrollbar-none border-b lg:border-b-0 border-slate-100/50">
            {[
              { key: 'overview', label: 'Agent Dashboard', icon: LayoutDashboard },
              { key: 'students', label: 'Students Directory', icon: Users },
              { key: 'chat', label: 'Counselor Chat', icon: MessageSquare },
              { key: 'applications', label: 'Applications Hub', icon: TrendingUp },
              { key: 'documents', label: 'Document Audits', icon: FileText },
              { key: 'universities', label: 'Universities Manager', icon: Building2 }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              const itemColors = getTabColorStyles(item.key);
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key as any); }}
                  className={`relative flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ease-out active:scale-[0.97] cursor-pointer shrink-0 lg:w-full ${
                    isActive 
                      ? itemColors.activeBg 
                      : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                  }`}
                >
                  <Icon size={14} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout panel on desktop */}
        <div className="hidden lg:block p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50/50 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-100 cursor-pointer"
          >
            <LogOut size={14} />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONFIGURATION PANEL */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 space-y-6 overflow-y-auto bg-white">
        {/* Global Dashboard Header & Breadcrumbs */}
        <div className="flex items-center justify-between border-b border-slate-100/80 pb-5 mb-2">
          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            <span>Agent Console</span>
            <span>/</span>
            <span className="text-slate-700">{activeTab}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full ${dynamicColors.dotBg} animate-pulse`} />
            <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>

        {/* ───── TAB 1: AGENT DASHBOARD OVERVIEW (HOME SCREEN) ───── */}
        {activeTab === 'overview' && (
          <OverviewTab
            students={students}
            applications={applications}
            documents={documents}
            getInboxConversations={getInboxConversations}
            setActiveTab={setActiveTab}
            setActiveChatStudentId={setActiveChatStudentId}
          />
        )}

        {/* ───── TAB 2: STUDENTS DIRECTORY PAGE ───── */}
        {activeTab === 'students' && (
          <StudentsTab
            students={students}
            handleUpdateStudentStatus={handleUpdateStudentStatus}
            handleRemoveStudent={handleRemoveStudent}
            handleSaveProfile={handleSaveProfile}
            loadStagesForStudent={loadStagesForStudent}
            saveStagesForStudent={saveStagesForStudent}
            triggerNotification={triggerNotification}
            handleCreateStudent={handleCreateStudent}
          />
        )}

        {/* ───── TAB 3: DEDICATED COUNSELOR CHAT ───── */}
        {activeTab === 'chat' && (
          <ChatTab
            students={students}
            activeChatStudentId={activeChatStudentId}
            setActiveChatStudentId={setActiveChatStudentId}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendReply={handleSendReply}
            getInboxConversations={getInboxConversations}
            chatUpdateTrigger={chatUpdateTrigger}
            refreshChat={initAgentChatRoom}
          />
        )}

        {/* ───── TAB 4: APPLICATIONS HUB ───── */}
        {activeTab === 'applications' && (
          <ApplicationsTab
            applications={applications}
            setApplications={setApplications}
            triggerNotification={triggerNotification}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsTab
            documents={documents}
            setDocuments={setDocuments}
            students={students}
            triggerNotification={triggerNotification}
          />
        )}

        {/* ───── TAB 6: UNIVERSITIES MANAGER ───── */}
        {activeTab === 'universities' && (
          <UniversitiesTab
            universities={universities}
            setUniversities={setUniversities}
            triggerNotification={triggerNotification}
          />
        )}
      </main>
    </div>
  );
}
