import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  X, 
  CheckCircle2, 
  BookOpen, 
  Search, 
  DollarSign, 
  Building2,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Award,
  ArrowRight
} from 'lucide-react';
import { Flag } from '../ui/Flag';
import { DetailedUniversity, ApiCourse } from '../../lib/types';

interface DetailsModalProps {
  detailsUni: DetailedUniversity;
  modalCoursesLoading: boolean;
  filteredPrograms: ApiCourse[];
  modalSearchQuery: string;
  setModalSearchQuery: (val: string) => void;
  programFilter: 'All' | 'Bachelor' | 'Master';
  setProgramFilter: (val: 'All' | 'Bachelor' | 'Master') => void;
  handleCloseDetailsModal: () => void;
  currencySymbols: Record<string, string>;
}

export default function DetailsModal({
  detailsUni,
  modalCoursesLoading,
  filteredPrograms,
  modalSearchQuery,
  setModalSearchQuery,
  programFilter,
  setProgramFilter,
  handleCloseDetailsModal,
  currencySymbols,
}: DetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001F3F]/40 backdrop-blur-md">
      <div className="absolute inset-0" onClick={handleCloseDetailsModal} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-6xl overflow-hidden relative z-10 text-left flex flex-col h-[90vh] md:h-[85vh]"
      >
        {/* Top luxury header accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#001F3F] via-[#FF0000] to-[#001F3F] z-20" />
        
        {/* Close Button overlay */}
        <button
          onClick={handleCloseDetailsModal}
          className="absolute top-5 right-6 p-2 rounded-xl bg-black/25 hover:bg-[#FF0000]/80 border border-transparent text-white/90 hover:text-white transition-all cursor-pointer z-30 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. HERO HEADER AREA */}
        <div className="relative h-48 md:h-56 shrink-0 bg-slate-100 select-none overflow-hidden">
          <img
            src={detailsUni.imageUrl}
            alt={`${detailsUni.name} campus`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
          
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col md:flex-row md:items-end justify-between right-6 md:right-8 z-10 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Flag country={detailsUni.flag} className="w-6 h-4 rounded shadow-xs" />
                <span className="text-[10px] text-white/80 font-extrabold uppercase tracking-widest font-mono">
                  {detailsUni.country}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight pr-10">
                {detailsUni.name}
              </h3>
              <p className="text-xs text-white/70 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF0000] shrink-0" />
                <span>Palo Alto, California</span>
              </p>
            </div>
            
            {/* Quick action to consult */}
            <Link
              href="/?scrollTo=consultation-hub"
              onClick={handleCloseDetailsModal}
              className="px-5 py-2.5 bg-[#FF0000] hover:bg-[#FF0000]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 self-start md:self-auto shrink-0 shadow-md active:scale-97 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply for Consultation</span>
            </Link>
          </div>
        </div>

        {/* 2. SPLIT LAYOUT BODY */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-0">
          
          {/* LEFT SIDEBAR: PROFILE & FACTS */}
          <div className="w-full md:w-[32%] p-6 md:p-8 space-y-6 md:border-r md:border-slate-100 overflow-y-auto custom-scrollbar flex flex-col justify-between shrink-0 bg-slate-50/20">
            <div className="space-y-6">
              
              {/* University Logo & Accent */}
              <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                <div className="w-16 h-16 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center p-2.5 shadow-sm shrink-0">
                  <img
                    src={detailsUni.logo}
                    alt={detailsUni.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#001F3F] leading-tight">
                    {detailsUni.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono mt-1">
                    Partner Institution
                  </p>
                </div>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/50 p-3.5 rounded-2xl flex flex-col gap-1 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Award className="w-3.5 h-3.5 text-[#FF0000] shrink-0" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider">QS Rank</span>
                  </div>
                  <span className="text-base font-black text-[#001F3F] mt-0.5">
                    #{detailsUni.ranking}
                  </span>
                </div>
                
                <div className="bg-white border border-slate-200/50 p-3.5 rounded-2xl flex flex-col gap-1 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Acceptance</span>
                  </div>
                  <span className="text-base font-black text-[#001F3F] mt-0.5">
                    {detailsUni.acceptanceRate || '4.4%'}
                  </span>
                </div>
              </div>

              {/* About University */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F] uppercase flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#001F3F] shrink-0" />
                  <span>Overview</span>
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {detailsUni.name} is a premier educational institution located in {detailsUni.country}. Offering comprehensive globally-aligned programs, it caters to international students with world-class facilities and top-tier career placements.
                </p>
              </div>

              {/* Destination Overview facts table */}
              <div className="space-y-3.5 pt-2">
                <h5 className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F] uppercase border-b border-slate-100 pb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#001F3F] shrink-0" />
                  <span>Destination Facts</span>
                </h5>
                
                <div className="space-y-2.5 text-xs font-medium leading-relaxed text-slate-600">
                  <p className="flex justify-between">
                    <strong className="text-slate-400">Tuition Budget:</strong> 
                    <span className="font-extrabold text-[#001F3F]">{detailsUni.tuition}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-slate-400">Intakes:</strong> 
                    <span className="font-bold text-slate-700">{detailsUni.intakes.join(' & ')}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-slate-400">Scholarship:</strong> 
                    <span className="text-emerald-600 font-extrabold">{detailsUni.scholarship}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-slate-400">Work Visa:</strong> 
                    <span className="text-slate-700 font-semibold">{detailsUni.country === 'UK' ? '2 Years PSW Route' : detailsUni.country === 'USA' ? '12-36 mos OPT' : 'Up to 3 years PGWP'}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-slate-400">Living Cost:</strong> 
                    <span className="text-slate-700">{detailsUni.country === 'UK' ? '£1,000 - £1,300/mo' : detailsUni.country === 'USA' ? '$1,200 - $1,500/mo' : '€930/mo'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Badge */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Verified Partner Portal
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: SEARCHABLE / FILTERABLE COURSE CATALOG GRID */}
          <div className="w-full md:w-[68%] p-6 md:p-8 flex flex-col space-y-4 overflow-hidden bg-slate-50/30">
            
            {/* Header, Search bar and filter tabs */}
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 shrink-0">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-[#001F3F] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#FF0000]" />
                  <span>Available Programs ({filteredPrograms.length})</span>
                </h4>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Custom Search Input */}
                <div className="relative flex-1 flex items-center bg-white border border-slate-200 focus-within:border-[#FF0000]/40 rounded-2xl px-3.5 py-2.5 transition-all shadow-sm">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search courses (e.g., Computer Science, Business)..."
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full text-xs font-semibold text-[#001F3F] placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  {modalSearchQuery && (
                    <button
                      onClick={() => setModalSearchQuery('')}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#001F3F] cursor-pointer flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                {/* Custom Tab Filters */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-2xl shrink-0 select-none shadow-sm">
                  {(['Bachelor', 'Master', 'All'] as const).map(filterTab => (
                    <button
                      key={filterTab}
                      onClick={() => setProgramFilter(filterTab)}
                      className={`px-4.5 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        programFilter === filterTab
                          ? 'bg-[#001F3F] text-white shadow-xs'
                          : 'text-slate-500 hover:text-[#001F3F] hover:bg-slate-50'
                      }`}
                    >
                      {filterTab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Course Cards Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-5 md:content-start custom-scrollbar pb-6">
              {modalCoursesLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 space-y-3">
                  <div className="w-9 h-9 border-4 border-[#001F3F]/10 border-t-[#FF0000] rounded-full animate-spin" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 animate-pulse">Loading all programs...</span>
                </div>
              ) : filteredPrograms.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  No {programFilter !== 'All' ? programFilter : ''} courses listed for this university.
                </div>
              ) : (
                filteredPrograms.map((course, index) => {
                  // Determine degree level
                  let degreeLevel = "UG Degree/Bachelors";
                  if (course.degree_level.toLowerCase() === 'master') {
                    degreeLevel = "PG Degree/Masters";
                  } else if (course.degree_level.toLowerCase() === 'phd') {
                    degreeLevel = "Doctorate / PhD";
                  } else if (course.course_name.toLowerCase().includes("diploma") || course.course_name.toLowerCase().includes("cert")) {
                    degreeLevel = "PG Diploma / Certificate";
                  }
                  
                  // Determine tuition fee
                  const currencySymbol = currencySymbols[course.currency || ''] || course.currency || detailsUni.currency || '$';
                  const tuitionDisplay = course.tuition_fee !== null && course.tuition_fee !== undefined
                    ? (course.tuition_fee === 0 ? 'Free' : `${currencySymbol}${Math.round(Number(course.tuition_fee)).toLocaleString('en-US')}/yr`)
                    : detailsUni.tuition;

                  // Determine duration
                  const duration = course.duration_years > 0 
                    ? `${course.duration_years} year${course.duration_years > 1 ? 's' : ''}`
                    : (['Bachelor'].includes(course.degree_level) ? "3-4 years" : "1-2 years");

                  return (
                    <div 
                      key={course.id || index} 
                      className="bg-white hover:bg-slate-50 border border-slate-200/50 rounded-3xl p-5.5 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-1 relative overflow-hidden h-fit"
                    >
                      {/* Left vertical hover glow line */}
                      <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#FF0000] rounded-r-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                      
                      <div className="space-y-4">
                        {/* Header: Icon box & level badge */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="w-10 h-10 bg-[#001F3F]/5 rounded-xl flex items-center justify-center text-[#001F3F] shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-semibold uppercase font-mono tracking-wider">
                            {degreeLevel.split('/')[1] || degreeLevel}
                          </span>
                        </div>

                        {/* Title */}
                        <h5 className="font-semibold text-sm text-[#001F3F] leading-snug group-hover:text-[#FF0000] transition-colors line-clamp-2">
                          {course.course_name}
                        </h5>

                        {/* Details Table */}
                        <div className="space-y-2 border-t border-slate-100 pt-4 text-[11px]">
                          <div className="flex justify-between items-center text-left">
                            <span className="text-[9px] font-mono font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-[#001F3F]" />
                              <span>Tuition</span>
                            </span>
                            <span className="font-semibold text-[#001F3F]">{tuitionDisplay}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-left">
                            <span className="text-[9px] font-mono font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#001F3F]" />
                              <span>Intakes</span>
                            </span>
                            <span className="font-medium text-slate-600 truncate max-w-[120px]">
                              {detailsUni.intakes.join(' / ')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-left">
                            <span className="text-[9px] font-mono font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#001F3F]" />
                              <span>Duration</span>
                            </span>
                            <span className="font-medium text-slate-600">{duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer CTA Button */}
                      <Link
                        href="/?scrollTo=consultation-hub"
                        onClick={handleCloseDetailsModal}
                        className="w-full mt-6 py-3 bg-[#001F3F] group-hover:bg-[#FF0000] text-white rounded-xl text-[10px] font-mono font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-97 cursor-pointer"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
