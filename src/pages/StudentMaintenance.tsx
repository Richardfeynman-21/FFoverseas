import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wrench, Sparkles, Plane, Home, ShieldAlert } from 'lucide-react';
import FlyFlourishLogo from '../components/FlyFlourishLogo';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 50,
      damping: 15,
      mass: 0.9,
      delay: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 12,
    },
  },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
} as const;

export default function StudentMaintenance() {
  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center bg-[#001F3F] selection:bg-[#FF0000]/10 selection:text-[#001F3F] overflow-hidden px-4 py-12"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Glowing Orbs ─── */}
      <motion.div
        className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full bg-[#FF0000]/15 blur-[100px] pointer-events-none"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid line overlays to match main theme */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/[0.08]" />
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-white/[0.08]" />
        <div className="absolute left-0 right-0 top-1/3 h-px bg-white/[0.08]" />
        <div className="absolute left-0 right-0 bottom-1/3 h-px bg-white/[0.08]" />
      </div>

      {/* ─── Main Glassmorphic Card ─── */}
      <motion.div
        className="w-full max-w-xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 text-center relative z-10"
        variants={cardVariants}
      >
        {/* Animated plane flying from bottom left to top right behind the header */}
        <motion.div
          className="absolute -top-6 -right-6 text-[#FF0000]/10 pointer-events-none"
          animate={{
            x: [-100, 100],
            y: [100, -100],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Plane className="w-24 h-24 rotate-45" />
        </motion.div>

        {/* Logo container */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 relative">
            <FlyFlourishLogo iconOnly={true} showGlobeBg={true} size="100%" />
          </div>
        </div>

        {/* Maintenance Indicator Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/25 text-[#FF0000] text-xs xl:text-sm font-mono font-bold uppercase tracking-wider mb-6"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wrench className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>System Maintenance</span>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#001F3F] tracking-tight mb-4">
          Student Portal <span className="text-[#FF0000]">Upgrading</span>
        </h1>

        <p className="text-sm md:text-base xl:text-lg 2xl:text-xl text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
          We are currently deployment-configuring the student portal services. Our backend integrations are getting set up to bring you the best-in-class visa and university application dashboard.
        </p>

        {/* Upcoming features preview list */}
        <div className="bg-[#001F3F]/5 rounded-2xl p-5 border border-[#001F3F]/10 text-left mb-8">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3 font-mono">
            Upcoming Portal Features
          </span>
          <motion.ul 
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.li className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-[#001F3F]" variants={itemVariants}>
              <Sparkles className="w-4 h-4 text-[#FF0000] shrink-0" />
              <span>Real-time Visa Tracker</span>
            </motion.li>
            <motion.li className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-[#001F3F]" variants={itemVariants}>
              <Sparkles className="w-4 h-4 text-[#FF0000] shrink-0" />
              <span>Direct Counselor Chat</span>
            </motion.li>
            <motion.li className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-[#001F3F]" variants={itemVariants}>
              <Sparkles className="w-4 h-4 text-[#FF0000] shrink-0" />
              <span>Secure Document Vault</span>
            </motion.li>
            <motion.li className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-[#001F3F]" variants={itemVariants}>
              <Sparkles className="w-4 h-4 text-[#FF0000] shrink-0" />
              <span>Step-by-step Roadmap</span>
            </motion.li>
          </motion.ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#001F3F] hover:bg-[#FF0000] text-white font-bold rounded-xl text-xs xl:text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-97 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go Back Home</span>
          </Link>
          <a
            href="mailto:support@flyandflourish.com"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#001F3F]/20 hover:border-[#FF0000]/30 hover:bg-[#FF0000]/5 text-[#001F3F] hover:text-[#FF0000] font-bold rounded-xl text-xs xl:text-sm uppercase tracking-wider transition-all duration-300 active:scale-97 cursor-pointer"
          >
            <span>Contact Support</span>
          </a>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[10px] font-mono text-gray-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Need immediate assistance? Click Contact Support above.</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
