import React, { useState, useEffect } from 'react';
import { Plane, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OriginalLogo from './OriginalLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'py-3.5 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm'
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Brand logo featuring OriginalLogo icon and elegant title details */}
        <a href="#" className="flex items-center space-x-2 group cursor-pointer" id="brand-logo">
          <div className="relative w-11 h-11 transition-transform duration-500 group-hover:scale-105">
            <OriginalLogo iconOnly={true} size="100%" showGlobeBg={false} />
          </div>

          <div className="text-left select-none">
            <div className="flex items-center">
              <span className="font-extrabold text-base text-[#001F3F] tracking-tight transition-colors duration-300 group-hover:text-[#FF0000]">
                Fly & Flourish
              </span>
              <Plane className="w-3.5 h-3.5 text-[#FF0000] rotate-45 -ml-0.5 -mt-2 transition-transform duration-700 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            <p className="text-[9px] font-mono font-medium text-gray-400 leading-none tracking-wider">OVERSEAS CONSULTANTS</p>
          </div>
        </a>

        {/* Navigation Middle (Desktop) */}
        <nav className="hidden md:flex items-center space-x-7">
          <a
            href="#"
            className="text-xs font-bold text-[#001F3F] hover:text-[#FF0000] tracking-wider transition-colors uppercase"
          >
            Home
          </a>
          <a
            href="#about-us"
            className="text-xs font-semibold text-gray-500 hover:text-[#001F3F] tracking-wider transition-colors uppercase"
          >
            About us
          </a>
          <a
            href="#showcase-destinations"
            className="text-xs font-semibold text-gray-500 hover:text-[#001F3F] tracking-wider transition-colors uppercase"
          >
            Study Destinations
          </a>
          <a
            href="#consultation-hub"
            className="text-xs font-mono font-bold text-[#FF0000] hover:text-[#001F3F] tracking-wider transition-colors flex items-center gap-1.5 bg-[#FF0000]/5 hover:bg-[#FF0000]/10 px-3.5 py-1.5 rounded-full border border-[#FF0000]/15"
          >
            <Sparkles className="w-3 h-3 text-[#FF0000] animate-pulse" />
            <span>CONTACT US</span>
          </a>
        </nav>

        {/* Right Action (Desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          <a
            href="#consultation-hub"
            style={{
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="px-5 py-2.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-97 cursor-pointer hover:shadow-red-500/10"
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
            className="md:hidden border-b border-slate-100 bg-white/95 backdrop-blur-xl overflow-hidden"
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
              <div className="pt-2">
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
