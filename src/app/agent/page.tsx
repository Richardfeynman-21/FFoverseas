'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import AgentPanel from '@/src/components/agent/AgentPanel';

export default function AgentPage() {
  const router = useRouter();

  // Authentication & Guard States
  const [isAgent, setIsAgent] = useState(false);
  const [agentProfile, setAgentProfile] = useState<{ id: string; name: string; role: string } | null>(null);
  const [notification, setNotification] = useState<{ text: string; isError: boolean } | null>(null);

  // Check auth on mount — if not authenticated, redirect to login
  useEffect(() => {
    const token = localStorage.getItem('ff_agent_token');
    const profile = localStorage.getItem('ff_agent_profile');
    if (token && profile) {
      setIsAgent(true);
      setAgentProfile(JSON.parse(profile));
    } else {
      router.replace('/student/login');
    }
  }, [router]);

  const triggerNotification = (text: string, isError = false) => {
    setNotification({ text, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAgentLogout = async () => {
    const refreshToken = localStorage.getItem('ff_agent_refresh_token');
    if (refreshToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (e) {
        console.error('Logout request failed', e);
      }
    }

    localStorage.removeItem('ff_agent_token');
    localStorage.removeItem('ff_agent_refresh_token');
    localStorage.removeItem('ff_agent_profile');

    setIsAgent(false);
    setAgentProfile(null);
    triggerNotification('Logged out successfully.');
    
    setTimeout(() => {
      router.replace('/student/login');
    }, 500);
  };

  if (!isAgent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-slate-200 border-t-[#FF0000] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans selection:bg-[#FF0000]/10 selection:text-[#001F3F] pb-10">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl border flex items-center gap-3 shadow-xl backdrop-blur-md ${
              notification.isError
                ? 'bg-red-55/90 border-red-200 text-red-800'
                : 'bg-emerald-55/90 border-emerald-200 text-emerald-800'
            }`}
          >
            <CheckCircle2
              size={16}
              className={notification.isError ? 'text-red-500' : 'text-emerald-500'}
            />
            <span className="text-xs font-semibold font-mono tracking-wide">
              {notification.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AgentPanel agentProfile={agentProfile} onLogout={handleAgentLogout} />
    </div>
  );
}
