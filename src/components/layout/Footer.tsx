'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import FlyFlourishLogo from '../ui/FlyFlourishLogo';

export default function Footer() {
  const worldTimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateTime = () => {
      if (worldTimeRef.current) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
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

      <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 2xl:gap-16 pb-16 border-b border-white/10">
          {/* Company Bio */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-11 h-11 bg-white rounded-full p-0.5 flex items-center justify-center shadow-xs">
                <FlyFlourishLogo iconOnly={true} size="100%" showGlobeBg={false} />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">Fly & Flourish</span>
                <p className="text-[9px] font-mono font-medium text-[#FF0000] leading-none tracking-wider">OVERSEAS CONSULTANTS</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
              A premier global education catalyst engineering frictionless admissions, custom-aligned visa dossiers, and departure networking orbits for Tomorrow's Leaders.
            </p>

            <div className="flex items-center gap-2.5 text-xs text-slate-355 font-medium">
              <Clock className="w-4 h-4 text-[#FF0000]" />
              <span className="font-mono text-[11px] tracking-wide uppercase">GRID CLOCK: <span ref={worldTimeRef} className="font-bold text-white/80" /></span>
            </div>
          </div>

          {/* Quick Navigation links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#FF0000] uppercase">ORBIT SECTORS</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-sans font-semibold font-medium">
              <li>
                <Link href="/?scrollTo=hero-landing" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/aboutus" className="hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/?scrollTo=showcase-destinations" className="hover:text-white transition-colors">
                  Study Destinations
                </Link>
              </li>
              <li>
                <Link href="/?scrollTo=consultation-hub" className="hover:text-white transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">OFFICE COORDINATES</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-medium">
              Reach our admissions desk for immediate immigration profile validation, shortlists, or seminar requests.
            </p>
            
            <div className="space-y-2.5 text-xs text-slate-355 font-mono font-bold font-medium">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#FF0000]" />
                <a href="tel:+918374740505" className="hover:text-white transition-colors">+91 8374740505</a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#FF0000]" />
                <a href="mailto:admin@ffoverseas.in" className="hover:text-white transition-colors">admin@ffoverseas.in</a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#FF0000] shrink-0 mt-0.5" />
                <a 
                  href="https://maps.app.goo.gl/FsZWwDxLYhFju7ou7" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors leading-relaxed"
                >
                  Opposite to Miracle Hospitals, Om Vihar Colony, Alwal, Secunderabad, Telangana 500010
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright credentials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500 font-bold">
          <p>© 2026 FLY & FLOURISH OVERSEAS CONSULTANTS. REGULATED UNDER ICCRC & ACG CODES.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">PRIVACY MANIFEST</a>
            <span>・</span>
            <a href="#" className="hover:text-white transition-colors">ADMISSIONS SECURITY RULES</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
