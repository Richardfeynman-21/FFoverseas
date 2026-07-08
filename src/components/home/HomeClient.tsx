'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '../layout/Navbar';
import FlyFlourishLogo from '../ui/FlyFlourishLogo';
import LoadingScreen from './LoadingScreen';
import { AnimatePresence, motion } from 'motion/react';
import AnimatedCounter from '../ui/AnimatedCounter';

import { 
  ArrowUpRight, 
  MapPin, 
  ChevronRight,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

// Skeletons for client-heavy components to improve LCP/CLS
const GlobeSkeleton = () => (
  <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-slate-100 animate-pulse border border-slate-200 flex items-center justify-center">
    <div className="text-slate-400 font-mono text-[10px]">LOADING 3D GEOMETRY...</div>
  </div>
);

const SectionSkeleton = () => (
  <div className="w-full h-96 bg-slate-50 border border-dashed border-slate-200 rounded-3xl animate-pulse flex items-center justify-center">
    <div className="text-slate-400 font-mono text-[10px]">LOADING COMPONENT...</div>
  </div>
);

// Dynamic import for WebGL and client-heavy components — entirely disables server-side rendering (ssr: false)
const InteractiveGlobe = dynamic(() => import('./InteractiveGlobe'), { 
  ssr: false, 
  loading: () => <GlobeSkeleton /> 
});
const DestinationCarousel = dynamic(() => import('./DestinationCarousel'), { 
  ssr: false,
  loading: () => <SectionSkeleton />
});
const FlourishRoadmap = dynamic(() => import('./FlourishRoadmap'), { 
  ssr: false,
  loading: () => <SectionSkeleton />
});
const FloatingBubbles = dynamic(() => import('./FloatingBubbles'), { 
  ssr: false,
  loading: () => <SectionSkeleton />
});
const ConsultationForm = dynamic(() => import('./ConsultationForm'), { 
  ssr: false,
  loading: () => <SectionSkeleton />
});
const PublicChatWidget = dynamic(() => import('../chat/PublicChatWidget'), { 
  ssr: false 
});
const UniversityPartners = dynamic(() => import('./UniversityPartners'), { 
  ssr: false 
});

const revealVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.96, 
    y: 35 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 45,
      damping: 15,
      mass: 0.8,
      duration: 0.95
    }
  }
} as const;

let hasLoadedOnce = false;

// Component to handle parameter-driven scrolling safely in Next.js
function ScrollManager() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!searchParams) return;
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      const target = document.getElementById(scrollTo);
      if (target) {
        const timer = setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams]);
  return null;
}

export default function HomeClient() {
  const worldTimeRef = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(!hasLoadedOnce);
  const [selectedDestId, setSelectedDestId] = useState<string>('usa');
  const [assetsReady, setAssetsReady] = useState(false);

  const handleSelectCountry = (destId: string) => {
    setSelectedDestId(destId);
    const target = document.getElementById('showcase-destinations');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Prevent scroll during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  // Preload globe components + fonts during loading screen (removes redundant/duplicate texture Image loads)
  useEffect(() => {
    Promise.all([
      document.fonts.ready,
      import('./InteractiveGlobe'),
    ]).then(() => setAssetsReady(true));
  }, []);

  // Update dynamic World Grid Clock — direct DOM write avoids re-rendering the entire App every second
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
    <div className="relative min-h-screen w-full bg-[#fdfdfd] text-[#001F3F] selection:bg-[#FF0000]/10 selection:text-[#001F3F] overflow-x-hidden" id="app-canvas">
      
      <Suspense fallback={null}>
        <ScrollManager />
      </Suspense>

      {/* Dynamic Brand Loading Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="brand-portal-loader" onComplete={() => {
            setIsLoading(false);
            hasLoadedOnce = true;
          }} assetsReady={assetsReady} />
        )}
      </AnimatePresence>
      
      {/* Brand aesthetic dynamic mesh glow backgrounds */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#001F3F] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.05] pointer-events-none z-0" />
      <div className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] bg-[#FF0000] rounded-full mix-blend-multiply filter blur-[130px] opacity-[0.03] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[15%] w-[300px] h-[300px] bg-[#001F3F] rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.04] pointer-events-none z-0" />
      <div className="absolute top-[50%] left-[-10%] w-[450px] h-[450px] bg-[#FF0000] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.02] pointer-events-none z-0" />

      {/* Absolute background matrix geometry lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute left-1/10 top-0 bottom-0 w-px bg-slate-200/20" />
        <div className="absolute right-1/10 top-0 bottom-0 w-px bg-slate-200/20" />
        <div className="absolute left-0 right-0 top-1/6 h-px bg-slate-200/15" />
        <div className="absolute left-0 right-0 top-3/5 h-px bg-slate-200/15" />
      </div>

      {/* Global Header Navigation */}
      {!isLoading && <Navbar />}

      {/* 1.5 Dynamic chatbot buttons */}
      {!isLoading && <PublicChatWidget />}

      {/* 2. Hero Section */}
      <motion.section 
        className="relative pt-20 pb-20 sm:pt-24 lg:pt-28 xl:pt-32 2xl:pt-36 2xl:pb-32 overflow-hidden" 
        id="hero-landing"
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={isLoading ? { opacity: 0, y: 25, scale: 0.97 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 45,
          damping: 15,
          delay: 0.1
        }}
      >
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 2xl:gap-28 items-center">
            
            {/* Hero Editorial Headlines Panel */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div>
                <h1 className="text-fluid-6xl font-black text-[#001F3F] tracking-tighter leading-tight md:leading-none font-sans">
                  Study at Your <br />
                  <span className="text-[#FF0000] relative inline-block">
                    Dream Destination
                    <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF0000]/20 rounded-full" />
                  </span>
                </h1>

                <p className="text-fluid-base text-gray-500 leading-relaxed mt-4 max-w-lg">
                  Break away from boring consultancies. Elevate your global transitions with our ultra-precise 3D application profiling, direct Ivy League shorts, and direct-to-visa success records.
                </p>
              </div>

              {/* High-Contrast Interactive CTA button pairing */}
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/universities"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#001F3F] to-[#FF0000] text-white rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-lg hover:shadow-red-500/20 active:scale-97 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>APPLY TO YOUR UNIVERSITY</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <a
                  href="#showcase-destinations"
                  className="px-6 py-3.5 bg-white/40 backdrop-blur-md hover:bg-white/60 border border-white/80 text-[#001F3F] rounded-xl text-xs font-bold uppercase tracking-widest active:scale-97 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>EXPLORE DESTINATIONS</span>
                  <ArrowUpRight className="w-4 h-4 text-[#FF0000]" />
                </a>
              </div>

              {/* Key Quick Metrics Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/80 max-w-lg">
                <div>
                  <p className="text-[#FF0000] text-2xl font-black font-mono">
                    <AnimatedCounter target={98.4} decimals={1} suffix="%" trigger={!isLoading} minStart={60.0} maxStart={80.0} />
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono font-medium mt-0.5">VISA APPROVAL RATE</p>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <p className="text-[#001F3F] text-2xl font-black font-mono">
                    <AnimatedCounter target={500} decimals={0} suffix="+" trigger={!isLoading} minStart={250} maxStart={380} />
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono font-medium mt-0.5">SCHOLARS DEPLOYED</p>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <p className="text-[#001F3F] text-2xl font-black font-mono">
                    <AnimatedCounter target={1.5} decimals={1} prefix="$" suffix="M" trigger={!isLoading} minStart={0.3} maxStart={0.8} />
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono font-medium mt-0.5">GRANTS SECURED</p>
                </div>
              </div>

            </div>

            {/* Hero Interactive 3D Sculpture Wrap */}
            <div className="lg:col-span-5 flex items-center justify-center relative min-h-[420px] xl:min-h-[520px] 2xl:min-h-[700px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#FF0000]/4 blur-3xl" />
              <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/3 blur-3xl" />

              <div className="relative z-10">
                <InteractiveGlobe onSelectCountry={handleSelectCountry} />
              </div>
            </div>

          </div>

        </div>
      </motion.section>

      {/* 2.5 About Us Section */}
      <motion.section 
        className="relative py-24 bg-[#fdfdfd]" 
        id="about-us"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-[#001F3F]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-80 h-80 rounded-full bg-[#FF0000]/3 blur-3xl pointer-events-none" />

        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 2xl:gap-28 items-center">
            
            {/* Left side: Official Brand Seal */}
            <div className="lg:col-span-5 aspect-square flex flex-col items-center justify-center bg-white/40 backdrop-blur-md p-8 rounded-full border border-white/60 shadow-xl relative overflow-hidden group max-w-[280px] sm:max-w-[340px] 2xl:max-w-[400px] mx-auto w-full select-none">
              <div className="absolute inset-0 bg-radial from-[#001F3F]/2 to-transparent opacity-60 rounded-full pointer-events-none" />
              <div className="relative w-full max-w-[140px] xs:max-w-[170px] md:max-w-[200px] aspect-square transition-transform duration-700 group-hover:scale-[1.03]">
                <FlyFlourishLogo showGlobeBg={true} size="100%" />
              </div>
              <p className="text-[9px] text-gray-400 font-mono tracking-wider uppercase mt-3 z-10">OFFICIAL BRAND SEAL</p>
            </div>

            {/* Right side: Editorial text copy and values details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#001F3F]/5 border border-[#001F3F]/15 rounded-full text-xs text-[#001F3F] font-mono shadow-xs backdrop-blur-xs">
                  <span className="text-[#FF0000]">✈️</span>
                  <span>WHO WE ARE</span>
                </div>
                
                <h2 className="text-fluid-5xl font-black text-[#001F3F] tracking-tight leading-tight md:leading-none">
                  Sovereign Guidance for <br />
                  <span className="text-[#FF0000] relative inline-block">
                    Your Academic Flight Path
                    <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FF0000]/20 rounded-full" />
                  </span>
                </h2>
              </div>

              <p className="text-fluid-base text-gray-500 leading-relaxed font-medium">
                At <strong>Fly & Flourish</strong>, we are more than educational advisors. We are architects of global human potential, pioneering strategic admissions blueprints that bridge elite ambitious talents with world-tier universities across the United States, United Kingdom, Canada, and beyond.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2 bg-white/45 p-5 rounded-2xl border border-white/50 backdrop-blur-xs shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-[#001F3F]/5 flex items-center justify-center text-[#001F3F] font-bold">1</div>
                  <h4 className="font-bold text-[#001F3F] text-sm">Targeted Profiles</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">Precision diagnostics matching your distinct academic GPA, transcripts, and aspirations with the absolute highest probability admissions orbits.</p>
                </div>

                <div className="space-y-2 bg-white/45 p-5 rounded-2xl border border-white/50 backdrop-blur-xs shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-[#FF0000]/5 flex items-center justify-center text-[#FF0000] font-bold">2</div>
                  <h4 className="font-bold text-[#001F3F] text-sm">Ironclad Visa Dossier</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">Our elite, zero-friction pre-visa vetting protocols secure a 98.4% success rate under stringent international immigration filters.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
                <div className="flex -space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#001F3F] text-white flex items-center justify-center text-xs font-mono font-bold border-2 border-white">US</div>
                  <div className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-xs font-mono font-bold border-2 border-white">UK</div>
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-mono font-bold border-2 border-white">CA</div>
                  <div className="w-9 h-9 rounded-full bg-indigo-900 text-white flex items-center justify-center text-xs font-mono font-bold border-2 border-white">EU</div>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  Direct channels established to over <strong>200+ partner universities</strong> and ivy circles.
                </p>
              </div>

            </div>

          </div>
        </div>
      </motion.section>

      {/* 4. Admissions Roadmap blueprint */}
      <motion.section 
        className="relative py-20 2xl:py-28 bg-[#fdfdfd]" 
        id="roadmap-flow"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <FlourishRoadmap />
        </div>
      </motion.section>

      {/* 3. Global Destinations panel */}
      <motion.section 
        className="relative py-20 2xl:py-28 bg-slate-50/20 border-t border-b border-dashed border-slate-200/40" 
        id="showcase-destinations"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <DestinationCarousel selectedDestId={selectedDestId} onSelectDest={setSelectedDestId} />
        </div>
      </motion.section>

      {/* 5. Success Stories bubble drift */}
      <motion.section 
        className="relative py-20 2xl:py-28 bg-slate-50/20 border-t border-b border-dashed border-slate-200/40" 
        id="stories-drift"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <FloatingBubbles />
        </div>
      </motion.section>

      {/* University partnership slides */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <UniversityPartners />
      </motion.div>

      {/* 6. Consultation evaluation hub */}
      <motion.section 
        className="relative py-24 2xl:py-32 bg-[#fdfdfd]" 
        id="consultation-hub"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <ConsultationForm />
        </div>
      </motion.section>

      {/* 7. Immersive Creative Footer */}
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
                    Home (Current Page)
                  </Link>
                </li>
                <li>
                  <Link href="/?scrollTo=about-us" className="hover:text-white transition-colors">
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
    </div>
  );
}
