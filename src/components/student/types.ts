'use client';

import React from 'react';

export interface University {
  id?: number;
  name: string;
  country: string;
  flag: string;
  ranking: string;
  tuition: string;
  scholarship: string;
  programs: string[];
  acceptanceRate: string;
}

export type StageStatus = 'completed' | 'current' | 'pending';

export interface ApplicationStage {
  id: number;
  name: string;
  status: StageStatus;
  date: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  uploaded: boolean;
}

export type TabKey = 'dashboard' | 'universities' | 'progress' | 'vault' | 'visa' | 'chat' | 'agent-chat' | 'profile' | 'refer';

export interface ChatMessage {
  text: string;
  isBot: boolean;
  time: string;
}

export interface Student {
  name: string;
  email: string;
  id: string;
  avatar_url?: string | null;
  assignedAgentName?: string | null;
  assignedAgentId?: string | null;
}

export interface NavItem {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}

export interface UploadedFile {
  id: string;
  documentId: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export interface StudentApplication {
  id: string;
  universityName: string;
  programName: string;
  country: string;
  flag: string;
  logoColor: string;
  stages: ApplicationStage[];
  status?: string;
}

