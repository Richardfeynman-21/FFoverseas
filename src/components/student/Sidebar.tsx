'use client';

import React from 'react';
import { TabKey, Student } from './types';

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (key: TabKey) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  student: Student;
  handleLogout: () => void;
  getInitials: (name: string) => string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  student,
  handleLogout,
  getInitials,
}) => {
  const menuItems = [
    { key: 'dashboard' as TabKey, label: 'Dashboard Overview', icon: 'dashboard' },
    { key: 'progress' as TabKey, label: 'My Applications', icon: 'description' },
    { key: 'universities' as TabKey, label: 'University Shortlist', icon: 'list_alt' },
    { key: 'vault' as TabKey, label: 'Document Vault', icon: 'folder_shared' },
    { key: 'visa' as TabKey, label: 'Visa Tracking', icon: 'airplane_ticket' },
    { key: 'chat' as TabKey, label: 'Chat', icon: 'chat' },
    { key: 'profile' as TabKey, label: 'Profile Settings', icon: 'person' },
  ];

  return (
    <nav className={`hidden lg:flex flex-col py-4 xl:py-6 bg-white border-r border-outline-variant shrink-0 transition-all duration-300 ${
      sidebarOpen ? 'w-56 xl:w-72 2xl:w-80' : 'w-0 !border-r-0 !py-0 !px-0 overflow-hidden'
    }`}>
      {/* Menu items - scrollable area */}
      <div className="flex flex-col gap-1 px-3 xl:px-4 min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const isReallyActive = activeTab === item.key;

          return (
            <button
              key={`${item.key}-${index}`}
              onClick={() => setActiveTab(item.key)}
              className={`relative flex items-center gap-3 xl:gap-4 px-4 xl:px-5 py-2.5 xl:py-3 rounded-xl font-medium transition duration-200 ease-out active:scale-95 w-full text-left cursor-pointer ${
                isReallyActive
                  ? 'shadow-sm bg-primary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] xl:text-[22px] relative z-10">{item.icon}</span>
              <span className="text-xs xl:text-sm truncate relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom section - always visible, never overlapping */}
      <div className="px-4 xl:px-6 space-y-3 xl:space-y-4 pt-4 xl:pt-6 shrink-0 mt-auto border-t border-outline-variant mx-3 xl:mx-4">
        <button className="w-full bg-secondary text-white py-2 xl:py-3 rounded-xl font-mono text-[9px] xl:text-[10.5px] hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95 tracking-widest cursor-pointer">
          BOOK CONSULTATION
        </button>
        <div className="flex flex-col gap-0.5">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('chat'); }} 
            className="flex items-center gap-3 xl:gap-4 px-3 xl:px-6 py-2 text-on-surface-variant hover:text-primary transition-all group"
          >
            <span className="material-symbols-outlined text-[18px] xl:text-[20px] group-hover:rotate-12 transition-transform">help_outline</span>
            <span className="text-xs xl:text-sm font-medium">Support Center</span>
          </a>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 xl:gap-4 px-3 xl:px-6 py-2 text-on-surface-variant hover:text-error transition-all w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] xl:text-[20px]">logout</span>
            <span className="text-xs xl:text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
