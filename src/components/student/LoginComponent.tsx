'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, TargetAndTransition } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Plane,
  Globe,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  TrendingUp,
  CheckCircle2,
  Code, // Added for demo mode UI indicator
} from 'lucide-react';


// ─── Animation Variants ────────────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

const panelVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      damping: 18,
      mass: 0.9,
      delay: 0.15,
    },
  },
} as const;

const formContainerVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      damping: 18,
      mass: 0.9,
      delay: 0.25,
    },
  },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.4,
    },
  },
} as const;

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 14,
    },
  },
} as const;

const floatAnimation: TargetAndTransition = {
  y: [0, -14, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

const floatAnimationSlow: TargetAndTransition = {
  y: [0, -10, 0],
  x: [0, 6, 0],
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

const planeAnimation: TargetAndTransition = {
  x: [0, 8, 0],
  y: [0, -6, 0],
  rotate: [0, 5, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

// ─── Stats Data ─────────────────────────────────────────────────────────────────

const brandStats = [
  { value: '500+', label: 'STUDENTS PLACED', icon: Users },
  { value: '98.4%', label: 'VISA SUCCESS', icon: Shield },
  { value: '$1.5M', label: 'GRANTS SECURED', icon: TrendingUp },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function Login() {
  const router = useRouter();

  const [portalMode, setPortalMode] = useState<'student' | 'agent'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ─── Demo Mode Setup ───
  // Demo mode is completely disabled for production security
  const isDemoMode = false;

  useEffect(() => {
    if (portalMode === 'student') {
      const token = localStorage.getItem('ff_student_token');
      if (token) router.replace('/student/dashboard');
    } else {
      const token = localStorage.getItem('ff_agent_token');
      if (token) router.replace('/agent');
    }
  }, [router, portalMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    if (portalMode === 'student') {


      // ─── Standard Production/API Logic ───
      try {
        const response = await fetch('/api/auth/student/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.detail || 'Incorrect email or password.');
        }

        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;

        localStorage.setItem('ff_student_token', accessToken);
        localStorage.setItem('ff_student_refresh_token', refreshToken);

        // Fetch student profile details from /api/students/me
        const profileResponse = await fetch('/api/students/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (profileResponse.ok) {
          const studentData = await profileResponse.json();
          localStorage.setItem(
            'ff_student',
            JSON.stringify({
              id: studentData.id,
              name: studentData.full_name,
              email: studentData.email,
              avatar_url: studentData.avatar_url || null,
            })
          );
        } else {
          localStorage.setItem(
            'ff_student',
            JSON.stringify({
              id: '',
              name: 'Student User',
              email: email.trim(),
              avatar_url: null,
            })
          );
        }

        router.push('/student/dashboard');
      } catch (err: any) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // ─── Admin/Agent Login ───
      try {
        let loginUrl = '/api/auth/agent/login';
        if (email.trim().toLowerCase() === 'admin@ffoverseas.in') {
          loginUrl = '/api/auth/admin/login';
        }

        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (loginUrl === '/api/auth/agent/login') {
            const adminResponse = await fetch('/api/auth/admin/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email.trim(),
                password: password.trim(),
              }),
            });
            const adminData = await adminResponse.json();
            if (adminResponse.ok) {
              await handleAgentAdminSuccess(adminData, true);
              return;
            }
          }
          throw new Error(data.error || data.detail || 'Access denied.');
        }

        await handleAgentAdminSuccess(data, loginUrl === '/api/auth/admin/login');

        async function handleAgentAdminSuccess(loginData: any, isAdmin: boolean) {
          const accessToken = loginData.access_token;
          const refreshToken = loginData.refresh_token;

          localStorage.setItem('ff_agent_token', accessToken);
          localStorage.setItem('ff_agent_refresh_token', refreshToken);

          if (isAdmin) {
            let adminId = 'superadmin-id';
            try {
              const decoded = JSON.parse(atob(accessToken.split('.')[1]));
              if (decoded && decoded.sub) {
                adminId = decoded.sub;
              }
            } catch (err) {
              console.error("Failed to decode token claims:", err);
            }
            localStorage.setItem(
              'ff_agent_profile',
              JSON.stringify({
                id: adminId,
                name: 'System Super Admin',
                role: 'superadmin',
              })
            );
          } else {
            const profileResponse = await fetch('/api/agents/me', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });

            if (profileResponse.ok) {
              const agentData = await profileResponse.json();
              localStorage.setItem(
                'ff_agent_profile',
                JSON.stringify({
                  id: agentData.id,
                  name: agentData.full_name,
                  role: 'agent',
                })
              );
            } else {
              localStorage.setItem(
                'ff_agent_profile',
                JSON.stringify({
                  id: '',
                  name: 'Agent User',
                  role: 'agent',
                })
              );
            }
          }

          setIsLoading(false);
          router.push('/agent');
        }
      } catch (err: any) {
        setError(
          err.message ||
            'Connection failed. Please check your credentials.'
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      className="relative min-h-[100dvh] flex flex-col lg:flex-row bg-[#fdfdfd] selection:bg-[#FF0000]/10 selection:text-[#001F3F] overflow-y-auto"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >


      {/* ═══════════════════════════════════════════════════════════════════════
          LEFT BRAND PANEL — Hidden on mobile, visible lg+
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="hidden lg:flex lg:w-[48%] xl:w-[45%] relative bg-[#001F3F] overflow-hidden flex-col justify-between p-10 xl:p-14"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glowing orbs */}
        <motion.div
          className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-[#FF0000]/15 blur-[100px] pointer-events-none"
          animate={floatAnimationSlow}
        />
        <motion.div
          className="absolute bottom-[20%] right-[5%] w-96 h-96 rounded-full bg-blue-500/8 blur-[120px] pointer-events-none"
          animate={floatAnimation}
        />
        <motion.div
          className="absolute top-[55%] left-[40%] w-48 h-48 rounded-full bg-[#FF0000]/10 blur-[80px] pointer-events-none"
          animate={{
            y: [0, 12, 0],
            x: [0, -8, 0],
            transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Subtle grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/[0.04]" />
          <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white/[0.04]" />
          <div className="absolute left-0 right-0 top-1/3 h-px bg-white/[0.04]" />
          <div className="absolute left-0 right-0 bottom-1/4 h-px bg-white/[0.04]" />
        </div>

        {/* Top — Brand Identity */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
              <img src="/logo.svg" className="w-full h-full object-contain" alt="Fly & Flourish Logo" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-lg tracking-tight leading-none">
                Fly & Flourish
              </h2>
              <p className="text-[9px] font-mono font-medium text-[#FF0000] tracking-[0.2em] uppercase leading-none mt-0.5">
                STUDENT PORTAL
              </p>
            </div>
          </div>

          <div className="space-y-3 max-w-sm">
            <h1 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
              Your Academic
              <br />
              <span className="text-[#FF0000] relative inline-block">
                Mission Control
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF0000]/30 rounded-full" />
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Access your personalised admissions dashboard, track visa progress, and connect with your dedicated counsellor — all in one command centre.
            </p>
          </div>
        </div>

        {/* Middle — Animated Plane + Globe */}
        <div className="relative z-10 flex items-center justify-center py-8">
          <div className="relative">
            {/* Orbit ring */}
            <motion.div
              className="w-40 h-40 xl:w-48 xl:h-48 rounded-full border border-dashed border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            {/* Globe centre */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Globe className="w-10 h-10 xl:w-12 xl:h-12 text-white/30" />
              </div>
            </div>
            {/* Orbiting Plane */}
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={planeAnimation}
            >
              <div className="w-10 h-10 rounded-full bg-[#FF0000]/20 backdrop-blur-sm border border-[#FF0000]/30 flex items-center justify-center">
                <Plane className="w-5 h-5 text-[#FF0000]" />
              </div>
            </motion.div>
            {/* Sparkle accent */}
            <motion.div
              className="absolute bottom-2 right-0"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-5 h-5 text-[#FF0000]/60" />
            </motion.div>
          </div>
        </div>

        {/* Bottom — Stats + Testimonial */}
        <div className="relative z-10 space-y-6">
          {/* Stat metrics */}
          <div className="grid grid-cols-3 gap-3">
            {brandStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-3 text-center"
              >
                <stat.icon className="w-4 h-4 text-[#FF0000]/70 mx-auto mb-1.5" />
                <p className="text-white font-black font-mono text-lg leading-none">
                  {stat.value}
                </p>
                <p className="text-[8px] font-mono text-slate-500 tracking-widest uppercase mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5">
            <p className="text-slate-300 text-xs leading-relaxed italic">
              "Fly & Flourish turned my dream of studying at University of Toronto into reality. The visa process was seamless and my counsellor was available 24/7."
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FF0000]/20 flex items-center justify-center text-[10px] font-bold text-[#FF0000] font-mono">
                AK
              </div>
              <div>
                <p className="text-white text-[11px] font-semibold">Aarav K.</p>
                <p className="text-[9px] font-mono text-slate-500 tracking-wider uppercase">
                  MS CS — UNIVERSITY OF TORONTO
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-[9px] font-mono text-slate-600 tracking-wider">
            © 2026 FLY & FLOURISH OVERSEAS CONSULTANTS
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          RIGHT LOGIN FORM PANEL
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 py-6 sm:py-10 relative overflow-y-auto"
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background decorative glows for the form side */}
        <div className="absolute top-[-8%] right-[-10%] w-[400px] h-[400px] bg-[#001F3F]/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-[#FF0000]/[0.02] rounded-full blur-[80px] pointer-events-none" />

        {/* Subtle grid lines on form panel */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/6 top-0 bottom-0 w-px bg-slate-200/20" />
          <div className="absolute right-1/6 top-0 bottom-0 w-px bg-slate-200/20" />
        </div>

        <motion.div
          className="w-full max-w-md relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="lg:hidden mb-5 sm:mb-10" variants={staggerItem}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 border border-slate-200 shadow-sm">
                <img src="/logo.svg" className="w-full h-full object-contain" alt="Fly & Flourish Logo" />
              </div>
              <div>
                <h2 className="text-[#001F3F] font-extrabold text-base tracking-tight leading-none">
                  Fly & Flourish
                </h2>
                <p className="text-[8px] font-mono font-medium text-[#FF0000] tracking-[0.2em] uppercase leading-none mt-0.5">
                  STUDENT PORTAL
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form heading */}
          <motion.div className="space-y-2 mb-4 sm:mb-8" variants={staggerItem}>
            <h1 className="text-2xl sm:text-3xl font-black text-[#001F3F] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">
              {portalMode === 'student'
                ? 'Sign in to your student dashboard to track applications and progress.'
                : 'Sign in to your admissions dashboard to manage student applications.'}
            </p>
          </motion.div>

          {/* Portal Switch Segmented Control */}
          <motion.div 
            variants={staggerItem}
            className="flex p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl mb-6 border border-slate-200/50"
          >
            <button
              type="button"
              onClick={() => setPortalMode('student')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                portalMode === 'student'
                  ? 'text-[#001F3F] bg-white shadow-sm'
                  : 'text-slate-500 hover:text-[#001F3F]'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => setPortalMode('agent')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                portalMode === 'agent'
                  ? 'text-[#001F3F] bg-white shadow-sm'
                  : 'text-slate-500 hover:text-[#001F3F]'
              }`}
            >
              Agent Portal
            </button>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-5 px-4 py-3 bg-red-50 border border-red-200/60 rounded-xl flex items-start gap-2.5"
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 60, damping: 14 }}
              >
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#FF0000] text-xs font-bold">!</span>
                </div>
                <p className="text-xs text-red-600 font-medium leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">


            {/* Email field */}
            <motion.div className="space-y-1.5" variants={staggerItem}>
              <label className="text-[10px] font-mono font-bold text-[#001F3F]/70 tracking-widest uppercase">
                EMAIL ADDRESS
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-300 group-focus-within:text-[#001F3F] transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder={portalMode === 'student' ? 'student@email.com' : 'admin@ffoverseas.in'}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/60 backdrop-blur-sm border border-slate-200/80 rounded-xl text-sm text-[#001F3F] placeholder:text-gray-300 font-medium outline-none transition-all duration-300 focus:border-[#001F3F]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,31,63,0.06)] hover:border-slate-300"
                  autoComplete="email"
                />
              </div>
            </motion.div>

            {/* Password field */}
            <motion.div className="space-y-1.5" variants={staggerItem}>
              <label className="text-[10px] font-mono font-bold text-[#001F3F]/70 tracking-widest uppercase">
                PASSWORD
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-300 group-focus-within:text-[#001F3F] transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 bg-white/60 backdrop-blur-sm border border-slate-200/80 rounded-xl text-sm text-[#001F3F] placeholder:text-gray-300 font-medium outline-none transition-all duration-300 focus:border-[#001F3F]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,31,63,0.06)] hover:border-slate-300"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#001F3F] transition-colors duration-200 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Remember me + Forgot password row */}
            <motion.div
              className="flex items-center justify-between"
              variants={staggerItem}
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-slate-200 bg-white/60 peer-checked:bg-[#001F3F] peer-checked:border-[#001F3F] transition-all duration-200 flex items-center justify-center">
                    {rememberMe && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium group-hover:text-gray-600 transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="text-xs text-[#FF0000]/70 hover:text-[#FF0000] font-semibold transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={staggerItem}>
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-3.5 bg-gradient-to-r text-white rounded-xl text-xs font-extrabold uppercase tracking-[0.15em] shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group ${
                  isDemoMode 
                    ? 'from-amber-500 to-orange-600 hover:shadow-orange-500/20' 
                    : 'from-[#001F3F] to-[#FF0000] hover:shadow-[#FF0000]/20'
                }`}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                {isLoading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span>{isDemoMode ? 'BYPASSING API...' : 'AUTHENTICATING...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isDemoMode ? 'DEMO LOGIN' : 'ACCESS DASHBOARD'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-4 my-4 sm:my-7"
            variants={staggerItem}
          >
            <div className="flex-1 h-px bg-slate-200/60" />
            <span className="text-[9px] font-mono text-gray-300 tracking-widest uppercase">
              OR
            </span>
            <div className="flex-1 h-px bg-slate-200/60" />
          </motion.div>

          {/* Contact admin */}
          <motion.div className="text-center space-y-4" variants={staggerItem}>
            <p className="text-xs text-gray-400">
              Don't have an account?{' '}
              <a
                href="mailto:admin@ffoverseas.in"
                className="text-[#001F3F] font-bold hover:text-[#FF0000] transition-colors duration-200"
              >
                Contact Admin
              </a>
            </p>

            {/* Back to main site */}
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-gray-300 hover:text-[#001F3F] transition-colors duration-200 tracking-widest uppercase"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              BACK TO MAIN SITE
            </a>
          </motion.div>

          {/* Bottom security badge */}
          <motion.div
            className="mt-5 sm:mt-10 flex items-center justify-center gap-2 text-[9px] font-mono text-gray-300 tracking-wider"
            variants={staggerItem}
          >
            <Shield className="w-3 h-3" />
            <span>256-BIT SSL ENCRYPTED · SECURE SESSION</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}