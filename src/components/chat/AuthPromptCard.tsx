import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPromptCard() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-[16px] bg-[#f8fafc] border border-[#e8ecf0] shadow-sm mt-2 w-full"
    >
      <p className="text-[13px] font-medium text-[#374151] mb-3 leading-relaxed text-center">
        Ready for personalized guidance? Sign up or log in to keep chatting and get tailored advice!
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/student/login')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#001F3F] text-white text-[12px] font-semibold transition-transform hover:scale-[1.02]"
        >
          <UserPlus size={14} /> Sign Up
        </button>
        <button
          onClick={() => navigate('/student/login')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-[#001F3F] border border-[#001F3F] text-[12px] font-semibold transition-transform hover:scale-[1.02]"
        >
          <LogIn size={14} /> Log In
        </button>
      </div>
    </motion.div>
  );
}
