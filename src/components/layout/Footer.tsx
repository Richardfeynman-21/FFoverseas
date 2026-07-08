'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import FlyFlourishLogo from '../ui/FlyFlourishLogo';

export default function Footer() {
  const worldTimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(now);
      const year = parts.find(p => p.type === 'year')?.value || '';
      const month = parts.find(p => p.type === 'month')?.value || '';
      const day = parts.find(p => p.type === 'day')?.value || '';
      const hour = parts.find(p => p.type === 'hour')?.value || '';
      const minute = parts.find(p => p.type === 'minute')?.value || '';
      const second = parts.find(p => p.type === 'second')?.value || '';

      const timeStr = `${year}-${month}-${day} ${hour}:${minute}:${second} IST`;
      if (worldTimeRef.current) {
        worldTimeRef.current.textContent = timeStr;
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-[#001F3F] text-white pt-20 pb-8 overflow-hidden" id="luxury-footer">
      <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-[#FF0000]/10 blur-[130px] pointer-events-none" />
      <div className="absolute left-10 top-0 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Bio */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-11 h-11 bg-white rounded-full p-0.5 flex items-center justify-center shadow-xs">
                <FlyFlourishLogo iconOnly={true} size="100%" showGlobeBg={false} />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight font-sans block leading-none">FLY & FLOURISH</span>
                <span className="text-[9px] font-mono tracking-widest text-[#FF0000] uppercase font-bold">Overseas Careers</span>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed max-w-sm font-medium">
              Premier university admissions, immigration routing, and direct academic advisors. Bridging global aspirants to dream destinations with full compliance verification.
            </p>
            
            <div className="pt-2 text-white/50 text-[10px] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SERVER ACTIVE: <span ref={worldTimeRef} className="font-black text-white/80" /></span>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#FF0000] uppercase">Strategic Portals</h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-semibold font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Candidate Hub</Link></li>
              <li><Link href="/aboutus" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/universities" className="hover:text-white transition-colors">Campuses Directory</Link></li>
              <li><a href="https://student.ffoverseas.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Applicant Login</a></li>
              <li><a href="https://admin.ffoverseas.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Counselor Console</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#FF0000] uppercase">Advisory Head Office</h4>
            <ul className="space-y-3 text-xs text-white/70 font-semibold font-medium">
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 shrink-0 font-mono text-[10px] pt-0.5">HQ:</span>
                <span>Flat No 102, 1st Floor, Oasis Plaza, Tilak Road, Abids, Hyderabad, Telangana - 500001</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#FF0000]" />
                <a href="tel:+918374740505" className="hover:text-white transition-colors">+91 8374740505</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#FF0000]" />
                <a href="mailto:admin@ffoverseas.in" className="hover:text-white transition-colors">admin@ffoverseas.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/40 font-mono font-bold uppercase tracking-wider gap-4">
          <div>© 2026 Fly & Flourish Overseas. All rights reserved.</div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Shield</Link>
            <Link href="#" className="hover:text-white transition-colors">Service Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
