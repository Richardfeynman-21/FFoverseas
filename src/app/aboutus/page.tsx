'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'motion/react';
import {
  Compass,
  Target,
  Brain,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// Leaders details preserved for company consistency
const leaders = [
  {
    name: 'S Abhinover Reddy',
    role: 'CEO & Chairman',
    avatar: 'AR',
    bio: 'Pioneering global education access with dynamic matching tech and strategic institutional partnerships.',
  },
  {
    name: 'S Aakanksha Reddy',
    role: 'Managing Director',
    avatar: 'AK',
    bio: 'Orchestrating operational excellence and building trusted networks of counselors across global markets.',
  },
  {
    name: 'S Abhilash Redy',
    role: 'Co-Founder',
    avatar: 'AB',
    bio: 'Designing cutting-edge EdTech frameworks to simplify and optimize student admissions workflows.',
  },
  {
    name: 'Bothsa Durga Prasad',
    role: 'Executive Director',
    avatar: 'DP',
    bio: 'Strengthening university ties and streamlining compliance across key destinations globally.',
  },
];

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#001F3F] flex flex-col font-sans">
      <Navbar />

      <main className="overflow-hidden">
        {/* 1. HERO - ARCHITECTING YOUR GLOBAL FUTURE */}
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-white select-none overflow-hidden">
          {/* Decorative Glowing Red & Blue Background Blobs */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#FF0000]/8 rounded-full blur-[90px] -z-10" />
          <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#001F3F]/5 rounded-full blur-[110px] -z-10" />

          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Text Content */}
              <div className="lg:col-span-7 text-left space-y-6">
                {/* Red top line accent */}
                <div className="w-20 h-1 bg-[#FF0000] rounded-full mb-6" />

                {/* Pill label */}
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  <span className="flex items-center gap-2 text-[#001F3F]/60 font-mono text-[10px] tracking-[0.3em] uppercase">
                    <span className="w-12 h-px bg-[#FF0000]/40" />
                    Since 2012
                  </span>
                </motion.div>

                {/* Heading with left vertical red accent line */}
                <div className="flex gap-4 items-stretch">
                  <div className="w-1.5 bg-[#FF0000] rounded-full shrink-0" />
                  <Reveal>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#001F3F] leading-[1.08] tracking-tight">
                      Architecting Your <br />Global Future.
                    </h1>
                  </Reveal>
                </div>

                <Reveal delay={0.1}>
                  <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium max-w-xl">
                    More than placement. We align your academic journey with long-term career ROI and legal residency pathways through institutional transparency.
                  </p>
                </Reveal>
                <Reveal delay={0.2} className="flex flex-wrap gap-4 items-center pt-4">
                  <button className="bg-[#001F3F] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#FF0000] transition-all flex items-center gap-2 group cursor-pointer shadow-lg">
                    Start Consultation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-full">
                    <ShieldCheck className="w-5 h-5 text-[#14B8A6] fill-[#14B8A6]/20" />
                    <span className="text-xs font-mono font-bold tracking-wider text-[#001F3F] uppercase">
                      Fraud-Free Verified
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Hero Image Card */}
              <div className="lg:col-span-5 relative">
                {/* Red decorative border outline behind the image card */}
                <div className="absolute -inset-3 rounded-3xl border border-dashed border-[#FF0000]/25 -z-10 scale-95" />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-[#001F3F]/10"
                >
                  <img
                    src="/images/students-walking.jpg"
                    alt="Students walking on campus"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                {/* Decorative blurs */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF0000]/10 rounded-full -z-10 blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#001F3F]/5 rounded-full -z-10 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE FF OVERSEAS DIFFERENCE */}
        <section className="py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Reveal>
                <span className="text-[#D97706] font-mono text-xs font-bold uppercase tracking-widest block">
                  Our Identity
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-[#001F3F] mt-2 tracking-tight leading-tight">
                  The FF Overseas Difference
                </h2>
              </Reveal>
              
              <Reveal delay={0.1} className="text-base md:text-lg text-gray-500 space-y-4 leading-relaxed font-medium">
                <p>
                  In an industry often clouded by ambiguity, FF Overseas stands as a beacon of institutional transparency. We don't just process applications; we serve as life-path architects, ensuring your international education is a strategic investment in your future.
                </p>
                <p>
                  With over 500+ direct university partnerships across Tier-1 destinations—including the UK, Canada, Australia, and the USA—our counseling is rooted in integrity and data-driven insights.
                </p>
              </Reveal>

              <Reveal delay={0.2} className="grid grid-cols-2 gap-4 pt-4 text-[#001F3F]">
                {[
                  'Institutional Integrity',
                  '500+ Partnerships',
                  'Tier-1 Destinations',
                  'ROI-First Approach',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />
                    <span className="text-sm font-bold">{item}</span>
                  </div>
                ))}
              </Reveal>
            </div>

            <Reveal delay={0.15} className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-slate-50 rounded-3xl -z-10 group-hover:bg-slate-100/80 transition-colors" />
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-200/50">
                <img
                  src="/images/counseling-session.jpg"
                  alt="Modern Education Consultancy Office"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block max-w-[200px]">
                <p className="text-[#D97706] text-4xl font-black leading-none">500+</p>
                <p className="text-[#001F3F] text-xs font-bold mt-2">Partnered Institutions Worldwide</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. DIGITAL SPEED. PHYSICAL TRUST */}
        <section className="bg-slate-50/50 py-24 border-y border-slate-100 relative">
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto">
            <Reveal className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-[#001F3F] tracking-tight">
                Digital Speed. Physical Trust.
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
                The &ldquo;Phygital&rdquo; approach ensures that while your process is accelerated by AI matching, every document is verified by physical branch audits for total security.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'AI Course Matching',
                  colorClass: 'text-[#001F3F] bg-[#001F3F]/5',
                  description: 'Our proprietary algorithms scan thousands of courses to find the perfect ROI fit based on your profile and career goals.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Physical Audit',
                  colorClass: 'text-[#14B8A6] bg-[#14B8A6]/10',
                  description: 'Unlike digital-only platforms, our branch network physically verifies all credentials, creating a zero-fraud environment.',
                },
                {
                  icon: BookOpen,
                  title: 'Life-Path Design',
                  colorClass: 'text-[#D97706] bg-[#D97706]/10',
                  description: 'We map out your journey from Day 1 of education to residency, ensuring every step adds measurable value to your career.',
                },
              ].map((card, idx) => (
                <Reveal key={card.title} delay={idx * 0.1}>
                  <div className="bg-white p-8 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${card.colorClass}`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#001F3F] mb-3">{card.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{card.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>



        {/* 5. STATS COUNTERS */}
        <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '10+', label: 'Years Experience', colorClass: 'text-[#001F3F]' },
              { stat: '500+', label: 'Universities', colorClass: 'text-[#14B8A6]' },
              { stat: '12k+', label: 'Success Stories', colorClass: 'text-[#001F3F]' },
              { stat: '99%', label: 'Visa Success', colorClass: 'text-[#14B8A6]' },
            ].map((statItem, idx) => (
              <Reveal key={statItem.label} delay={idx * 0.08} className="p-4">
                <p className={`text-4xl md:text-5xl font-black ${statItem.colorClass}`}>{statItem.stat}</p>
                <p className="font-mono text-[10px] tracking-wider text-gray-500 uppercase font-bold mt-2">{statItem.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 6. EXECUTIVE STEWARDSHIP */}
        <section className="py-24 bg-white border-t border-slate-100 relative">
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto space-y-16">
            <Reveal className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-[#FF0000] font-bold tracking-[0.4em] text-[10px] uppercase block">
                The Experts
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#001F3F] tracking-tight">
                Executive Stewardship
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium">
                Our leadership brings decades of collective experience from top-tier academic institutions and international policy boards.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {leaders.map((leader, index) => (
                <div key={leader.name}>
                  <Reveal delay={index * 0.1}>
                    <div className="group bg-slate-50 rounded-3xl border border-slate-200/60 p-8 flex flex-col items-center text-center justify-between hover:border-[#FF0000]/20 hover:bg-white hover:shadow-xl transition-all duration-300 min-h-[320px]">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#001F3F] to-[#FF0000] flex items-center justify-center text-white text-xl font-black tracking-widest shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {leader.avatar}
                      </div>

                      <div className="space-y-1 mt-5">
                        <h4 className="text-sm font-black text-[#001F3F] group-hover:text-[#FF0000] transition-colors">
                          {leader.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF0000] block">
                          {leader.role}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 font-semibold mt-4 leading-relaxed line-clamp-4 flex-1">
                        {leader.bio}
                      </p>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CTA SECTION */}
        <section className="py-24 bg-slate-50/50 border-t border-slate-100 relative">
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <Reveal className="space-y-3 text-left max-w-xl">
              <h2 className="text-4xl font-black text-[#001F3F] tracking-tight">
                Start Your Fraud-Free Journey
              </h2>
              <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed">
                Schedule a one-on-one session with our ROI architects to map your future.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <button className="bg-[#001F3F] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#FF0000] transition-all duration-300 shadow-md flex items-center gap-2 group whitespace-nowrap cursor-pointer">
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
