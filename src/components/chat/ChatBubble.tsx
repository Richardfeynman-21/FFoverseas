'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import FlyFlourishLogo from '../ui/FlyFlourishLogo';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const NAVY = '#001F3F';

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    setTimeStr(timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [timestamp]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center bg-white p-0.5 border border-slate-100 shadow-sm"
        >
          <FlyFlourishLogo iconOnly={true} size="100%" showGlobeBg={false} />
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[86%]`}>
        <div
          className="px-[15px] py-3"
          style={{
            background: isUser ? NAVY : '#ffffff',
            color: isUser ? '#ffffff' : '#374151',
            border: isUser ? 'none' : '1px solid #e8ecf0',
            borderRadius: 16,
            borderTopLeftRadius: isUser ? 16 : 4,
            borderTopRightRadius: isUser ? 4 : 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <p className="text-[13px] leading-relaxed m-0 whitespace-pre-wrap font-sans">
            {content}
          </p>
        </div>
        <p className="text-[9px] font-mono mt-1.5 m-0" style={{ color: '#cbd5e1' }}>
          {timeStr}
        </p>
      </div>
    </motion.div>
  );
}

export default ChatBubble;
