'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Copy, Check, Gift, Users, Award } from 'lucide-react';
import { Student } from './types';

interface ReferTabProps {
  student: Student | null;
}

export const ReferTab: React.FC<ReferTabProps> = ({ student }) => {
  const referrerName = student?.name || 'your friend';
  const referralLink = `https://ffoverseas.com/register?ref=${encodeURIComponent(referrerName)}`;
  const defaultMessage = `Hey! I am using FFoverseas to apply for my studies abroad, and it has been an amazing experience. They have customized milestones, AI assistance, and direct support. You should check them out! Sign up here: ${referralLink}`;

  const [message, setMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-20 relative text-[#001F3F] max-w-4xl mx-auto"
    >
      <div>
        <h2 className="text-[#001F3F] font-extrabold text-xl sm:text-2xl tracking-tight uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">card_giftcard</span>
          Refer & Earn Rewards
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Invite your friends to FFoverseas. Once they register and begin their application journey, you both earn exciting rewards!
        </p>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100/50 p-6 rounded-3xl shadow-xl shadow-slate-900/2 flex items-start gap-4">
          <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
            <Gift size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#001F3F] text-sm">Earn $100 Cash</h4>
            <p className="text-xs text-slate-400 mt-1 font-semibold">For every friend who successfully submits their first university application.</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-100/50 p-6 rounded-3xl shadow-xl shadow-slate-900/2 flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#001F3F] text-sm">Free Visa Consultation</h4>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Your referee gets an immediate free elite visa guidance session with our top consultants.</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-100/50 p-6 rounded-3xl shadow-xl shadow-slate-900/2 flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shrink-0">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#001F3F] text-sm">Priority Shortlisting</h4>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Unlock priority profiling tools and fast-track processing for your own applications.</p>
          </div>
        </div>
      </div>

      {/* Sharing Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="font-bold text-[#001F3F] text-lg">Your Personalized Referral Message</h3>
          <p className="text-xs font-semibold text-slate-400">Feel free to customize the message below before sharing it with your network.</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all resize-none leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 px-5 border border-slate-200 hover:bg-slate-50 text-[#001F3F] rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Message
                </>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-3 px-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/10 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              Share via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
