import React, { useState, useEffect } from 'react';
import { Plane, Sparkles, Menu, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import FlyFlourishLogo from './FlyFlourishLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 20;
        if (isScrolled !== lastScrolled) {
          lastScrolled = isScrolled;
          setScrolled(isScrolled);
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled || isOpen
          ? 'py-[clamp(0.55rem,0.45rem+0.4vw,0.95rem)] bg-white/90 backdrop-blur-xl border-b border-white/60 shadow-md'
          : 'py-[clamp(0.7rem,0.5rem+0.8vw,1.4rem)] bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        
        {/* Brand logo featuring OriginalLogo icon and elegant title details */}
        <a href="#" className="flex items-center space-x-2 group cursor-pointer" id="brand-logo">
          <div className="relative w-[clamp(2.25rem,2rem+0.8vw,3rem)] h-[clamp(2.25rem,2rem+0.8vw,3rem)] transition-transform duration-500 group-hover:scale-105">
            <FlyFlourishLogo iconOnly={true} size="100%" showGlobeBg={false} />
          </div>

          <div className="text-left select-none">
            <div className="flex items-center">
              <span className="font-extrabold text-[clamp(0.85rem,0.75rem+0.4vw,1.2rem)] text-[#001F3F] tracking-tight transition-colors duration-300 group-hover:text-[#FF0000]">
                Fly & Flourish
              </span>
              <Plane className="w-[clamp(0.7rem,0.6rem+0.2vw,0.95rem)] h-[clamp(0.7rem,0.6rem+0.2vw,0.95rem)] text-[#FF0000] rotate-45 -ml-0.5 -mt-1 sm:-mt-1.5 transition-transform duration-700 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            <p className="text-[clamp(7px,6px+0.1vw,10px)] font-mono font-medium text-gray-400 leading-none tracking-wider">OVERSEAS CONSULTANTS</p>
          </div>
        </a>

        {/* Navigation Middle (Desktop) */}
        <nav className="hidden md:flex items-center gap-[clamp(0.6rem,0.3rem+1vw,2.2rem)]">
          <a
            href="#"
            className="text-[clamp(0.72rem,0.65rem+0.15vw,0.88rem)] font-bold text-[#001F3F] hover:text-[#FF0000] tracking-wider transition-colors uppercase"
          >
            Home
          </a>
          <a
            href="#about-us"
            className="text-[clamp(0.72rem,0.65rem+0.15vw,0.88rem)] font-semibold text-gray-500 hover:text-[#001F3F] tracking-wider transition-colors uppercase"
          >
            About us
          </a>
          <a
            href="#showcase-destinations"
            className="text-[clamp(0.72rem,0.65rem+0.15vw,0.88rem)] font-semibold text-gray-500 hover:text-[#001F3F] tracking-wider transition-colors uppercase"
          >
            Study Destinations
          </a>
          <a
            href="#consultation-hub"
            className="text-[clamp(0.68rem,0.6rem+0.1vw,0.82rem)] font-mono font-bold text-[#FF0000] hover:text-[#001F3F] tracking-wider transition-colors flex items-center gap-1 bg-[#FF0000]/5 hover:bg-[#FF0000]/10 px-2.5 py-1.5 rounded-full border border-[#FF0000]/15"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#FF0000] animate-pulse" />
            <span>CONTACT US</span>
          </a>
        </nav>

        {/* Right Action (Desktop) */}
        <div className="hidden md:flex items-center gap-[clamp(0.4rem,0.2rem+0.6vw,1.25rem)]">
          <Link
            to="/student/login"
            style={{
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="px-[clamp(0.7rem,0.5rem+0.8vw,1.15rem)] py-[clamp(0.45rem,0.35rem+0.4vw,0.65rem)] border border-[#001F3F]/20 hover:border-[#FF0000]/30 hover:bg-[#FF0000]/5 text-[#001F3F] hover:text-[#FF0000] rounded-xl text-[clamp(0.68rem,0.6rem+0.1vw,0.82rem)] font-extrabold uppercase tracking-wider active:scale-97 cursor-pointer flex items-center gap-1"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </Link>
          <a
            href="#consultation-hub"
            style={{
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="px-[clamp(0.8rem,0.6rem+1vw,1.4rem)] py-[clamp(0.45rem,0.35rem+0.4vw,0.65rem)] bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-[clamp(0.68rem,0.6rem+0.1vw,0.82rem)] font-bold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-97 cursor-pointer hover:shadow-red-500/10"
          >
            BOOK SEMINAR
          </a>
        </div>

        {/* Hamburger Menu Trigger Button (Mobile Only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl bg-white/55 border border-white/80 text-[#001F3F] hover:text-[#FF0000] hover:bg-white transition-all cursor-pointer focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
        </button>

      </div>

      {/* Mobile Menu Overlay Dropwdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-b border-slate-100 bg-white/95 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-80px)]"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <a
                href="#"
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-[#001F3F] hover:text-[#FF0000] py-2 border-b border-slate-100/60 transition-colors block"
              >
                Home (Current Page)
              </a>
              <a
                href="#about-us"
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-gray-600 hover:text-[#001F3F] py-2 border-b border-slate-100/60 transition-colors block"
              >
                About us
              </a>
              <a
                href="#showcase-destinations"
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-gray-600 hover:text-[#001F3F] py-2 border-b border-slate-100/60 transition-colors block"
              >
                Study Destinations
              </a>
              <a
                href="#consultation-hub"
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono font-bold text-[#FF0000] hover:text-[#001F3F] py-2 px-3 bg-[#FF0000]/5 rounded-xl border border-[#FF0000]/15 flex items-center justify-between"
              >
                <span>Contact us</span>
                <Sparkles className="w-4 h-4 text-[#FF0000] animate-pulse" />
              </a>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/student/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center block px-5 py-3 border border-slate-200 text-slate-700 hover:text-white hover:bg-[#001F3F] hover:border-[#001F3F] rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
                >
                  STUDENT PORTAL
                </Link>
                <a
                  href="#consultation-hub"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center block px-5 py-3 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  BOOK SEMINAR
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
