'use client';

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetDestination: string | null;
  targetDegree: string | null;
  targetUniversity: string | null;
  targetCourse: string | null;
  specificCourses: string | null;
  interestedIntake: string | null;
  remarks: string;
  status: 'lead' | 'in_progress' | 'completed' | 'inactive';
  gpa: number | null;
  assignedAgentId?: string | null;
}

export interface ApplicationRecord {
  id: string;
  studentId: string;
  studentName: string;
  universityName: string;
  program: string;
  status: 'Applied' | 'Offered' | 'Accepted' | 'Rejected';
  appliedDate: string;
  metadata?: any;
}

export interface DocumentRecord {
  id: string;
  studentName: string;
  documentType: 'Passport' | 'Transcript' | 'SOP' | 'LOR' | 'Financial' | 'English' | 'Photos';
  fileName: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
  uploadedAt: string;
}

export interface UniversityRecord {
  id: string;
  name: string;
  country: string;
  qsRanking: string;
  tuitionRange: string;
  acceptanceRate: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'pending';
  date: string;
  description: string;
  dbStageId?: string;
}

export interface ChatMessage {
  text: string;
  isBot: boolean; // true = counselor (agent), false = student
  time: string;
}
