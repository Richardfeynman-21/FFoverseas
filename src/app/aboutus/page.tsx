'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Compass,
  Target,
  Brain,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Mail,
  Linkedin,
  Globe,
  Award,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// Leaders details with real image paths and detailed biographies
const leaders = [
  {
    name: 'Abhinove Reddy Survi',
    role: 'CEO & Chairman',
    image: '/images/Abhinove.jpeg',
    bio: 'Pioneering global education access with dynamic matching tech and strategic institutional partnerships. Driving the vision to make international education borderless.',
    initials: 'AR'
  },
  {
    name: 'Abhilash Reddy Survi',
    role: 'Co-Founder',
    image: '/images/Abhilash.jpeg',
    bio: 'Designing cutting-edge EdTech frameworks to simplify and optimize student admissions workflows. Leading the technological innovations that empower counselors.',
    initials: 'AB'
  },
  {
    name: 'Aakanksha Reddy',
    role: 'Managing Director',
    image: '/images/Aakanksha.jpeg',
    bio: 'Orchestrating operational excellence and building trusted networks of counselors across global markets. Ensuring student success through quality support.',
    initials: 'AK'
  },
  {
    name: 'Durga Prasad Bothsa',
    role: 'Executive Director',
    image: '/images/Durga%20Prasad.jpeg',
    bio: 'Strengthening university ties and streamlining compliance across key destinations globally. Navigating international regulations to secure student futures.',
    initials: 'DP'
  },
];

function Reveal({
  children,
  delay = 0,
  className = '',
  yOffset = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  yOffset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#001F3F] flex flex-col font-sans selection:bg-[#FF0000]/10 selection:text-[#001F3F]">
      <Navbar />

      <main className="overflow-hidden">
        {/* 1. HERO - ARCHITECTING YOUR GLOBAL FUTURE */}
        <section className="relative min-h-[95vh] xl:min-h-screen flex items-center pt-[92px] pb-12 xl:pb-20 bg-white overflow-hidden select-none">
          {/* Blueprint dot pattern */}
          <div className="absolute inset-0 opacity-[0.06] -z-20 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(#001F3F 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />

          {/* Interactive floating glowing meshes */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
              opacity: [0.08, 0.12, 0.08]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#FF0000] rounded-full blur-[100px] -z-10" 
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              scale: [1, 0.95, 1],
              opacity: [0.06, 0.09, 0.06]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#001F3F] rounded-full blur-[120px] -z-10" 
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Text Content */}
              <div className="lg:col-span-7 text-left space-y-6">
                <div className="w-16 h-1 bg-[#FF0000] rounded-full mb-6" />

                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2"
                >
                  <span className="flex items-center gap-2 text-[#001F3F]/60 font-mono text-[10px] tracking-[0.3em] uppercase">
                    <span className="w-8 h-px bg-[#FF0000]/40" />
                    Global Edu-Architects
                  </span>
                </motion.div>

                <div className="flex gap-4 items-stretch">
                  <div className="w-1.5 bg-[#FF0000] rounded-full shrink-0" />
                  <Reveal yOffset={30}>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#001F3F] leading-[1.08] tracking-tight">
                      Architecting Your <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#001F3F] via-[#bc0100] to-[#FF0000]">
                        Global Future.
                      </span>
                    </h1>
                  </Reveal>
                </div>

                <Reveal delay={0.15}>
                  <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium max-w-xl">
                    More than placement. We align your academic journey with long-term career ROI and legal residency pathways through institutional transparency.
                  </p>
                </Reveal>

                <Reveal delay={0.25} className="flex flex-wrap gap-4 items-center pt-4">
                  <button className="bg-[#001F3F] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#FF0000] hover:shadow-xl hover:shadow-[#FF0000]/10 transition-all duration-300 flex items-center gap-2 group cursor-pointer shadow-lg">
                    Start Consultation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  {/* Frosted badge */}
                  <div className="flex items-center gap-2.5 px-4 py-3.5 bg-white/65 backdrop-blur-md border border-[#001F3F]/10 rounded-xl shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-[#14B8A6] fill-[#14B8A6]/10" />
                    <span className="text-[10px] font-mono font-bold tracking-wider text-[#001F3F] uppercase">
                      Fraud-Free Verified
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Hero Image Card with 3D Float effect */}
              <div className="lg:col-span-5 relative">
                {/* Visual grid backplate */}
                <div className="absolute -inset-4 rounded-3xl border border-dashed border-[#FF0000]/20 -z-10 scale-95" />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8 }}
                  className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative z-10 border border-[#001F3F]/10 group cursor-pointer"
                >
                  <img
                    src="/images/students-walking.jpg"
                    alt="Students walking on campus"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Glass shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </motion.div>
                
                {/* Floating tags */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-6 top-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3 z-20"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FF0000]/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#FF0000]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">SUCCESS RATE</p>
                    <p className="text-sm font-extrabold text-[#001F3F]">99% Visa Approval</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE FF OVERSEAS DIFFERENCE - BENTO GRID DESIGN */}
        <section className="py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto relative">
          <div className="space-y-12">
            <Reveal className="text-left max-w-2xl space-y-3">
              <span className="text-[#bc0100] font-mono text-xs font-bold uppercase tracking-widest block">
                Our Blueprint
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#001F3F] tracking-tight leading-tight">
                The FF Overseas Difference
              </h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">
                In an industry often clouded by ambiguity, FF Overseas stands as a beacon of institutional transparency. We are life-path architects.
              </p>
            </Reveal>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Main Statement & Partner Counter (Spans 2 columns on md+) */}
              <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10 flex flex-col justify-between group hover:border-[#FF0000]/20 hover:shadow-xl transition-all duration-500 min-h-[350px]">
                <div className="space-y-4 max-w-xl">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF0000] uppercase bg-[#FF0000]/5 px-2.5 py-1 rounded-full border border-[#FF0000]/10 w-fit block">
                    Direct Alliances
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#001F3F] leading-snug">
                    Over 500+ direct university partnerships across top global destinations.
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Our direct ties with institutions in the US, UK, Canada, and Australia remove agents from the middle, ensuring direct admissions, transparent fee structures, and faster application review.
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-6">
                  <div className="flex -space-x-3">
                    {['USA', 'UK', 'CAN', 'AUS'].map((country, idx) => (
                      <div key={country} className="w-10 h-10 rounded-full border-2 border-white bg-[#001F3F] text-white flex items-center justify-center text-[9px] font-bold font-mono shadow-sm">
                        {country}
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-[#FF0000] text-3xl font-black leading-none">500+</p>
                    <p className="text-gray-400 text-[10px] font-mono font-bold mt-1 uppercase">PARTNERED SCHOOLS</p>
                  </div>
                </div>
              </div>

              {/* Card 2: ROI Focus */}
              <div className="rounded-[2rem] border border-slate-200/60 bg-white p-8 flex flex-col justify-between group hover:border-[#FF0000]/20 hover:shadow-xl transition-all duration-500 min-h-[350px]">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200/40">
                    <Award className="w-6 h-6 text-[#D97706]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#001F3F]">ROI-First Planning</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    We map every degree against placement reports, average salaries, and visa work permits, ensuring your education returns immediate financial value.
                  </p>
                </div>
                
                <div className="pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:underline cursor-pointer group/link">
                    Explore ROI Modeling
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Card 3: Integrity & Verification */}
              <div className="rounded-[2rem] border border-slate-200/60 bg-white p-8 flex flex-col justify-between group hover:border-[#FF0000]/20 hover:shadow-xl transition-all duration-500 min-h-[350px]">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/5 flex items-center justify-center border border-[#14B8A6]/10">
                    <ShieldCheck className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#001F3F]">Absolute Integrity</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Zero commission traps, zero side-deals. Every scholarship goes directly to the student’s fee structure, documented transparently in our dashboard.
                  </p>
                </div>
                
                <div className="pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14B8A6] hover:underline cursor-pointer group/link">
                    View Verification Policy
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Card 4: Interactive counseling image card (Spans 2 columns on md+) */}
              <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white group hover:border-[#FF0000]/20 hover:shadow-xl transition-all duration-500 min-h-[350px]">
                <div className="grid grid-cols-1 sm:grid-cols-12 h-full">
                  <div className="sm:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F]/60 uppercase">
                        Physical Support
                      </span>
                      <h3 className="text-2xl font-bold text-[#001F3F]">Expert counselors in physical branches</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        Step in for personal attention. We conduct physical profile assessments, verify documents directly, and conduct mock visa interviews.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {['Profile Audit', 'Mock Visa', 'Essay Reviews'].map((badge) => (
                        <span key={badge} className="text-[10px] font-bold text-[#001F3F] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/40">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-5 relative h-full min-h-[200px] sm:min-h-0 overflow-hidden">
                    <img
                      src="/images/counseling-session.jpg"
                      alt="Modern Education Consultancy Office"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DIGITAL SPEED. PHYSICAL TRUST */}
        <section className="bg-slate-50/50 py-28 border-y border-slate-100 relative">
          {/* Blueprint dot pattern */}
          <div className="absolute inset-0 opacity-[0.04] -z-20 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(#001F3F 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-16 relative z-10">
            <Reveal className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-[#FF0000] font-mono text-xs font-bold uppercase tracking-widest block">
                Phygital Integration
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#001F3F] leading-tight">
                Digital Speed. Physical Trust.
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed">
                The &ldquo;Phygital&rdquo; approach ensures that while your process is accelerated by AI matching, every credential is verified by physical branch audits for total security.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'AI Course Matching',
                  colorClass: 'text-[#001F3F] bg-[#001F3F]/5 border-[#001F3F]/10',
                  description: 'Our proprietary algorithms scan thousands of courses to find the perfect ROI fit based on your profile and career goals.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Physical Audit',
                  colorClass: 'text-[#14B8A6] bg-[#14B8A6]/5 border-[#14B8A6]/15',
                  description: 'Unlike digital-only platforms, our branch network physically verifies all credentials, creating a zero-fraud environment.',
                },
                {
                  icon: BookOpen,
                  title: 'Life-Path Design',
                  colorClass: 'text-[#D97706] bg-[#D97706]/5 border-[#D97706]/15',
                  description: 'We map out your journey from Day 1 of education to residency, ensuring every step adds measurable value to your career.',
                },
              ].map((card, idx) => (
                <Reveal key={card.title} delay={idx * 0.1}>
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-[#FF0000]/10 transition-all duration-500 h-full flex flex-col justify-between group">
                    <div className="space-y-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.colorClass}`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-[#001F3F] group-hover:text-[#FF0000] transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        {card.description}
                      </p>
                    </div>

                    <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F]/40 uppercase">
                        STAGE 0{idx + 1}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#FF0000] transition-all duration-300" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. STATS COUNTERS - Frosted Ribbon */}
        <section className="py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto relative">
          <div className="rounded-[2.5rem] bg-slate-50 border border-slate-200/60 p-10 md:p-12 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { stat: '10+', label: 'Years Experience', colorClass: 'text-[#001F3F]' },
                { stat: '500+', label: 'Partner Schools', colorClass: 'text-[#FF0000]' },
                { stat: '12k+', label: 'Success Stories', colorClass: 'text-[#001F3F]' },
                { stat: '99%', label: 'Visa Success Rate', colorClass: 'text-[#FF0000]' },
              ].map((statItem, idx) => (
                <Reveal key={statItem.label} delay={idx * 0.08} className="p-4 space-y-1">
                  <p className={`text-4xl md:text-5xl font-black tracking-tight ${statItem.colorClass}`}>{statItem.stat}</p>
                  <p className="font-mono text-[9px] tracking-widest text-gray-400 uppercase font-bold">{statItem.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. EXECUTIVE STEWARDSHIP - LUXURY REDESIGN WITH REAL PORTRAITS */}
        <section className="py-28 bg-[#fdfdfd] border-t border-slate-100 relative">
          {/* Spatial Grid Backplate */}
          <div className="absolute inset-0 opacity-[0.03] -z-10 pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-20 relative z-10">
            {/* Header section with side text */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[#FF0000] font-bold tracking-[0.4em] text-[10px] uppercase block">
                  The Stewards
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-[#001F3F] tracking-tight leading-none">
                  Executive Stewardship
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium border-l-2 border-[#FF0000] pl-6 py-2">
                  Our leadership brings decades of collective operational excellence and strategic vision, directing student placements into premier institutions worldwide.
                </p>
              </div>
            </div>

            {/* Team Portrait Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {leaders.map((leader, index) => (
                <Reveal key={leader.name} delay={index * 0.1}>
                  <div className="group relative overflow-hidden rounded-[2rem] aspect-[3/4.2] bg-slate-950 border border-slate-200/10 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-500">
                    {/* Leader Image */}
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] filter brightness-95 contrast-[1.02] group-hover:brightness-100 group-hover:contrast-100"
                    />

                    {/* Gradient Overlay Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />

                    {/* Decorative elegant framing border */}
                    <div className="absolute inset-4 rounded-[1.5rem] border border-white/10 pointer-events-none transition-all duration-500 group-hover:inset-3 group-hover:border-white/20" />

                    {/* Initials Badge at Top Right */}
                    <div className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[10px] font-black font-mono tracking-widest shadow-sm">
                      {leader.initials}
                    </div>

                    {/* Card Content Details */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end min-h-[40%] bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-12">
                      
                      {/* Name & Role */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold tracking-widest text-white bg-[#bc0100] px-2.5 py-0.5 rounded-full shadow-sm w-fit block mb-1.5">
                          {leader.role}
                        </span>
                        <h4 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
                          {leader.name}
                        </h4>
                      </div>

                      {/* Bio revealed on hover using smooth grid-rows transition */}
                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                        <div className="overflow-hidden">
                          <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-3 line-clamp-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                            {leader.bio}
                          </p>

                          {/* Social Actions / Connections */}
                          <div className="flex gap-2.5 mt-4 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                            <a 
                              href="#" 
                              onClick={(e) => e.stopPropagation()}
                              className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF0000] border border-white/10 hover:border-transparent transition-all duration-300 flex items-center justify-center text-white"
                              title="LinkedIn Profile"
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                            </a>
                            <a 
                              href={`mailto:contact@ffoverseas.com?subject=Inquiry to ${leader.name}`}
                              onClick={(e) => e.stopPropagation()}
                              className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF0000] border border-white/10 hover:border-transparent transition-all duration-300 flex items-center justify-center text-white"
                              title="Contact Executive"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. BOTTOM CTA SECTION */}
        <section className="py-24 bg-slate-50 border-t border-slate-100 relative">
          <div className="absolute inset-0 opacity-[0.01] -z-10 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <Reveal className="space-y-3 text-left max-w-xl">
              <h2 className="text-4xl font-black text-[#001F3F] tracking-tight">
                Start Your Fraud-Free Journey
              </h2>
              <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed">
                Schedule a personal profile blueprint mapping with our ROI path specialists.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <button className="bg-[#001F3F] text-white px-8 py-4.5 rounded-xl font-bold hover:bg-[#FF0000] hover:shadow-xl hover:shadow-[#FF0000]/10 transition-all duration-300 shadow-md flex items-center gap-2 group whitespace-nowrap cursor-pointer">
                Book a Free Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
