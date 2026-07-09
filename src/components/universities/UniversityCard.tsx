'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  MapPin, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  Award, 
  Percent, 
  CheckCircle2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Flag } from '../ui/Flag';
import { DetailedUniversity } from '../../lib/types';

interface UniversityCardProps {
  uni: DetailedUniversity;
  idx: number;
  handleOpenDetailsModal?: (uni: DetailedUniversity) => void;
}

const UniversityCardComponent = React.forwardRef<HTMLElement, UniversityCardProps>(({
  uni,
  idx,
  handleOpenDetailsModal,
}, ref) => {
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: 'spring',
        stiffness: 55,
        damping: 15,
        mass: 0.8,
        delay: Math.min(idx * 0.05, 0.25)
      }}
      onClick={() => router.push(`/universities/${uni.id}`)}
      className="group bg-white/70 backdrop-blur-md border border-slate-200 hover:border-[#001F3F]/35 hover:bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 flex flex-col cursor-pointer"
      style={{ willChange: 'transform' }}
    >
      
      {/* Editorial Banner */}
      <div className="relative h-44 w-full overflow-hidden select-none bg-slate-100 shrink-0">
        <img
          src={uni.imageUrl}
          alt={`${uni.name} Campus`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        
        {/* QS Ranking Tag top-right overlay */}
        <div className="absolute top-4.5 right-4.5 px-3 py-1.5 bg-white/90 backdrop-blur-xs border border-white/30 rounded-xl text-[10px] font-mono font-black text-[#001F3F] shadow-sm select-none">
          {uni.ranking}
        </div>

        {/* Location bottom-right overlay */}
        <div className="absolute bottom-4 right-5 flex items-center gap-2">
          <Flag country={uni.flag} className="w-5.5 h-3.5 rounded shadow-xs shrink-0" />
          <span className="text-[10px] text-white font-black uppercase tracking-wider font-mono drop-shadow-sm flex items-center gap-1">
            <MapPin size={11} className="text-white/80" />
            {uni.country}
          </span>
        </div>
      </div>

      {/* Content details section */}
      <div className="p-6.5 flex-1 flex flex-col justify-between relative pt-8.5">
        
        {/* Float-overlapping circular logo */}
        <div className="absolute -top-7 left-6.5 w-14 h-14 bg-white rounded-full p-1.5 shadow-md border border-slate-100 flex items-center justify-center overflow-hidden">
          {logoError || !uni.logoUrl ? (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#001F3F] to-[#FF0000] flex items-center justify-center text-white text-[11px] font-black font-mono">
              {uni.name.split(' ').map(n => n[0]).join('').slice(0, 3)}
            </div>
          ) : (
            <img
              src={uni.logoUrl}
              alt={`${uni.name} Badge`}
              className="w-full h-full object-cover rounded-full"
              onError={() => setLogoError(true)}
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-extrabold text-[#001F3F] text-base md:text-lg leading-snug tracking-tight hover:text-[#FF0000] transition-colors duration-250 min-h-[48px] flex items-center">
            {uni.name}
          </h3>

          {/* Quick Tag Badges */}
          <div className="flex flex-wrap gap-2 select-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/50 rounded-lg text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              <Calendar size={11} className="text-slate-400" />
              {uni.intakes.join('/')} Intake
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/50 rounded-lg text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              <BookOpen size={11} className="text-slate-400" />
              {uni.courseCount} Courses
            </span>
          </div>

          {/* Stats specifications table */}
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/60 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-400">
                <DollarSign size={13.5} strokeWidth={2.5} className="text-slate-400" />
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Tuition Fees</span>
              </div>
              <span className="font-bold text-slate-700">{uni.tuition}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-100/80 pt-3 text-xs font-medium">
              <div className="flex items-center gap-2 text-emerald-500">
                <Award size={13.5} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Scholarships</span>
              </div>
              <span className="font-black text-emerald-600 bg-emerald-50/90 px-2.5 py-0.5 rounded-lg border border-emerald-100/60">
                {uni.scholarship}
              </span>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-100/80 pt-3 text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-400">
                <Percent size={13.5} strokeWidth={2.5} className="text-slate-400" />
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Acceptance Rate</span>
              </div>
              <span className="font-bold text-slate-700">{uni.acceptanceRate}</span>
            </div>
          </div>
        </div>

        {/* Actions buttons */}
        <div className="mt-6" onClick={(e) => e.stopPropagation()}>
          <Link
            href="/?scrollTo=consultation-hub"
            className="w-full py-3.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider hover:shadow-lg active:scale-97 transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Now</span>
          </Link>
        </div>

      </div>
    </motion.article>
  );
});

export default React.memo(UniversityCardComponent);
