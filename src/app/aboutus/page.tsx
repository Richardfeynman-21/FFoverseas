'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Building2, Mail, Phone, MapPin, Target, Compass, Users } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Leader {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

const leaders: Leader[] = [
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

interface Office {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
}

const offices: Office[] = [
  {
    city: 'Nagpur (Mihan SEZ)',
    country: 'India',
    address: 'Plot No. 9C, Sector 17, MIHAN SEZ, Khapri, MIHAN, Nagpur – 441108',
    phone: '+91 98902 17999',
    email: 'zubin@kcoverseas.com',
  },
  {
    city: 'Nagpur (IT Park)',
    country: 'India',
    address: '"Krishna", Plot No. 10/2, I.T. Park, Opp. V.N.I.T, Parsodi Nagpur, Maharashtra – 440022',
    phone: '+91 86696 02483',
    email: 'ningale@kcoverseas.com',
  },
  {
    city: 'Kathmandu',
    country: 'Nepal',
    address: 'Ahead from VOTO Nepal, Kamal Pokhari, Kathmandu 44600, Remwork Building 2nd Floor',
    phone: '+977 98282 70462',
    email: 'kathmandu@kcoverseas.com',
  },
  {
    city: 'Colombo',
    country: 'Sri Lanka',
    address: '541, 1/1 Nawala Road, Koswatta, Rajagiriya, Greater Colombo',
    phone: '+94 77775 6314',
    email: 'colombo@kcoverseas.com',
  },
  {
    city: 'Dhaka',
    country: 'Bangladesh',
    address: '5th Floor, House no.: 19 (Concord Morning Glory), Road no.: 13/C, Block no.: E, Banani, Dhaka – 1213',
    phone: '+880 17210 16158',
    email: 'info.kcbd@kcoverseas.com',
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 text-[#001F3F] flex flex-col font-sans">
      <Navbar />

      {/* 1. HERO HEADER */}
      <section className="relative pt-36 pb-20 bg-gradient-to-br from-[#001F3F] via-[#001f3f]/95 to-[#FF0000]/10 overflow-hidden text-white flex-shrink-0 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.12),transparent_40%)]" />
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-[#FF0000]/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold tracking-widest text-[#FF0000] uppercase shadow-md"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>OUR IDENTITY</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white"
          >
            Empowering <span className="text-[#FF0000]">Global</span> Ambitions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium"
          >
            We connect aspiring international students, recruitment partners, and world-class universities through next-generation matching technology.
          </motion.p>
        </div>
      </section>

      {/* 2. CORE VALUES (VISION & MISSION) */}
      <section className="relative py-20 z-10 -mt-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/85 shadow-lg hover:shadow-xl hover:border-[#FF0000]/25 transition-all duration-350 flex flex-col gap-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#001F3F]/5 border border-[#001F3F]/10 flex items-center justify-center text-[#FF0000] shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase font-mono tracking-wider text-[#001F3F]">Our Vision</h3>
              <p className="text-slate-650 text-xs md:text-sm font-semibold leading-relaxed">
                Our vision is to make a transformative impact on the Study Abroad Service Sector through continual innovation in student services by connecting institutions, recruiters, and students across the globe.
              </p>
            </div>
          </motion.div>

          {/* Mission card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/85 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/85 shadow-lg hover:shadow-xl hover:border-[#FF0000]/25 transition-all duration-350 flex flex-col gap-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#001F3F]/5 border border-[#001F3F]/10 flex items-center justify-center text-[#FF0000] shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase font-mono tracking-wider text-[#001F3F]">Our Mission</h3>
              <p className="text-slate-650 text-xs md:text-sm font-semibold leading-relaxed">
                Our mission is to create a global EdTech ecosystem wherein our universities can showcase the best they have to offer and partners and students can choose what suits them the most. We are bringing global education within everyone’s reach and we are accomplishing it in a very unique way – by using our ultra-efficient online platform employing high-end technology, but with a human touch that sets us apart.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. LEADERSHIP TEAM */}
      <section className="py-20 bg-white px-4 md:px-8 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001F3F]/5 text-[10px] font-mono font-bold tracking-wider text-[#001F3F] uppercase border border-[#001F3F]/10">
              <Users className="w-3.5 h-3.5" />
              <span>THE LEADERSHIP</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#001F3F]">Our Leadership</h2>
            <p className="text-slate-400 text-xs font-semibold max-w-md mx-auto uppercase tracking-wide">
              Driving strategic expansions and EdTech integrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-3xl border border-slate-200/60 p-6 flex flex-col items-center text-center justify-between hover:border-[#FF0000]/20 hover:bg-white hover:shadow-xl transition-all duration-300 group min-h-[320px]"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#001F3F] to-[#FF0000] flex items-center justify-center text-white text-lg font-black tracking-widest shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {leader.avatar}
                </div>
                
                <div className="space-y-1 mt-4">
                  <h4 className="text-sm font-black text-[#001F3F]">{leader.name}</h4>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF0000]">{leader.role}</span>
                </div>
                
                <p className="text-[11px] text-slate-500 font-semibold mt-3.5 leading-relaxed line-clamp-4 flex-1">
                  {leader.bio}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. GLOBAL OFFICES */}
      <section className="py-20 bg-slate-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001F3F]/5 text-[10px] font-mono font-bold tracking-wider text-[#001F3F] uppercase border border-[#001F3F]/10">
              <MapPin className="w-3.5 h-3.5" />
              <span>GLOBAL PRESENCE</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#001F3F]">Our Offices</h2>
            <p className="text-slate-400 text-xs font-semibold max-w-md mx-auto uppercase tracking-wide">
              Connecting you locally, supporting you globally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white rounded-3xl p-6.5 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#FF0000] px-2 py-0.5 bg-red-50 rounded-md border border-red-100/60 inline-block">
                    {office.country}
                  </span>
                  <h4 className="text-base font-black text-[#001F3F]">{office.city}</h4>
                </div>

                <div className="space-y-3.5 text-xs font-semibold text-slate-650 flex-1 pt-2.5">
                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-4 h-4 text-slate-450 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-[11px]">{office.address}</span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <Phone className="w-4 h-4 text-slate-450 shrink-0" />
                    <span className="text-[11px]">{office.phone}</span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <Mail className="w-4 h-4 text-slate-450 shrink-0" />
                    <span className="text-[11px] truncate">{office.email}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
