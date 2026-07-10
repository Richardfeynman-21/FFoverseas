'use client';

import React from 'react';
import { TabKey, Student } from './types';

interface HeaderProps {
  activeTab: TabKey;
  setSidebarOpen?: (open: boolean) => void;
  sidebarOpen?: boolean;
  student: Student;
  getInitials: (name: string) => string;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  getInitials,
  setSidebarOpen,
  sidebarOpen,
}) => {
  return (
    <header className="flex justify-between items-center px-3 sm:px-6 md:px-margin-desktop w-full sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-outline-variant h-14 sm:h-16 lg:h-[4.5rem]">
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        {setSidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="material-symbols-outlined hidden lg:block p-1.5 sm:p-2 text-on-surface-variant hover:bg-slate-50/80 hover:shadow-sm transition-all rounded-full cursor-pointer active:scale-95 border border-transparent hover:border-outline text-lg sm:text-xl lg:text-2xl shrink-0"
          >
            {sidebarOpen ? 'menu_open' : 'menu'}
          </button>
        )}
        <span className="text-base sm:text-lg lg:text-xl font-display font-bold tracking-tight text-primary whitespace-nowrap">Fly &amp; Flourish</span>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
        <button className="material-symbols-outlined p-1.5 sm:p-2 text-on-surface-variant hover:bg-white hover:shadow-sm transition-all rounded-full cursor-pointer active:scale-95 border border-transparent hover:border-outline text-lg sm:text-xl lg:text-2xl">
          notifications
        </button>
        <button className="material-symbols-outlined p-1.5 sm:p-2 text-on-surface-variant hover:bg-white hover:shadow-sm transition-all rounded-full cursor-pointer active:scale-95 border border-transparent hover:border-outline text-lg sm:text-xl lg:text-2xl">
          settings
        </button>
        
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 lg:pl-4 border-l border-outline ml-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-white ring-1 ring-outline cursor-pointer active:scale-95 flex items-center justify-center bg-primary text-white text-[10px] sm:text-xs font-bold shrink-0">
            {student.avatar_url ? (
              <img 
                className="w-full h-full object-cover" 
                alt={student.name} 
                src={student.avatar_url} 
              />
            ) : (
              <span>{getInitials(student.name)}</span>
            )}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-primary leading-tight">{student.name}</p>
            <p className="text-[10px] text-on-surface-variant font-label-caps mt-0.5">UNDERGRADUATE</p>
          </div>
        </div>
      </div>
    </header>
  );
};
