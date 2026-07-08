import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  X, 
  CheckCircle2, 
  BookOpen, 
  Search, 
  DollarSign, 
  Building2 
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
          className="absolute top-5.5 right-6 p-2 rounded-xl bg-black/25 hover:bg-black/40 border border-transparent text-white/90 hover:text-white transition-all cursor-pointer z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero banner section */}
        <div className="relative h-44 md:h-56 shrink-0 bg-slate-100 select-none">
          <img
            src={detailsUni.imageUrl}
            alt={`${detailsUni.name} campus`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col gap-1.5 z-10">
            <div className="flex items-center gap-2">
              <Flag country={detailsUni.flag} className="w-6 h-4 rounded shadow-xs" />
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest font-mono">
                {detailsUni.country}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight pr-10">
              {detailsUni.name}
            </h3>
          </div>
        </div>

        {/* Split screen body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-0">
          
          {/* Left Column: Quick facts, general overview, links (1/3 width) */}
          <div className="w-full md:w-[32%] p-6 md:p-8 space-y-6 md:border-r md:border-slate-100 overflow-y-auto custom-scrollbar flex flex-col justify-between">
            <div className="space-y-6">
              {/* Highlight Stats grid */}
              <div className="grid grid-cols-3 gap-2 pb-5 border-b border-slate-100">
                <div className="text-center space-y-1">
                  <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">QS Rank</span>
                  <span className="text-[11px] font-black text-[#001F3F] bg-slate-50 px-1.5 py-1 rounded-xl border border-slate-200 block truncate">
                    {detailsUni.ranking}
                  </span>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Programs</span>
                  <span className="text-[11px] font-black text-[#001F3F] bg-slate-50 px-1.5 py-1 rounded-xl border border-slate-200 block truncate">
                    {detailsUni.courseCount} Courses
                  </span>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Acceptance</span>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-1 rounded-xl border border-emerald-100 block truncate">
                    {detailsUni.acceptanceRate}
                  </span>
                </div>
              </div>

              {/* Overview Text */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F] uppercase">About University</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {detailsUni.name} is a premier educational institution located in {detailsUni.country}. Offering comprehensive globally-aligned programs, it caters to international students with world-class facilities and top-tier career placements.
                </p>
              </div>

              {/* Destination Overview quick facts */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F] uppercase border-b border-slate-100 pb-1.5">Destination Overview</h4>
                
                <div className="space-y-2.5 text-xs font-medium leading-relaxed text-slate-600">
                  <p className="flex justify-between"><strong>Tuition Budget:</strong> <span>{detailsUni.tuition}</span></p>
                  <p className="flex justify-between"><strong>Intake Slots:</strong> <span>{detailsUni.intakes.join(' & ')}</span></p>
                  <p className="flex justify-between"><strong>Scholarship:</strong> <span className="text-emerald-600 font-bold">{detailsUni.scholarship}</span></p>
                  <p className="flex justify-between"><strong>Work Visa:</strong> <span>{detailsUni.country === 'UK' ? '2 Years PSW Route' : detailsUni.country === 'USA' ? '12-36 months OPT' : 'Up to 3 years PGWP'}</span></p>
                  <p className="flex justify-between"><strong>Living Cost:</strong> <span>{detailsUni.country === 'UK' ? '£1,000 - £1,300/mo' : detailsUni.country === 'USA' ? '$1,200 - $1,500/mo' : '€930/mo'}</span></p>
                  <p className="flex justify-between"><strong>Housing:</strong> <span>Guaranteed allotment</span></p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/?scrollTo=consultation-hub"
                onClick={handleCloseDetailsModal}
                className="w-full py-3.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md font-semibold"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply for Consultation</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Top Programs List with 3 Filters (2/3 width) */}
          <div className="w-full md:w-[68%] p-6 md:p-8 flex flex-col space-y-4 overflow-hidden bg-slate-50/20">
            
            {/* The Filters (Search input + Bachelor, Master, All tabs) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 shrink-0 gap-3">
              <h4 className="text-xs font-mono font-bold tracking-widest text-[#FF0000] uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Programs ({filteredPrograms.length})</span>
              </h4>
              
              {/* Course Search Bar */}
              <div className="relative flex items-center bg-slate-50/70 border border-slate-200 focus-within:border-[#FF0000]/40 rounded-xl px-2.5 py-1.5 w-full sm:w-60 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full text-[10px] font-semibold text-[#001F3F] placeholder-slate-400 focus:outline-none bg-transparent"
                />
                {modalSearchQuery && (
                  <button
                    onClick={() => setModalSearchQuery('')}
                    className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-[#001F3F] cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              {/* Buttons Group */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 p-1 rounded-2xl shrink-0 select-none">
                {(['Bachelor', 'Master', 'All'] as const).map(filterTab => (
                  <button
                    key={filterTab}
                    onClick={() => setProgramFilter(filterTab)}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      programFilter === filterTab
                        ? 'bg-[#001F3F] text-white shadow-sm'
                        : 'text-slate-500 hover:text-[#001F3F]'
                    }`}
                  >
                    {filterTab}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Course Tiles List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              {modalCoursesLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <div className="w-8 h-8 border-4 border-[#001F3F]/10 border-t-[#FF0000] rounded-full animate-spin" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 animate-pulse">Loading all programs...</span>
                </div>
              ) : filteredPrograms.length === 0 ? (
                <div className="text-center py-16 text-slate-400 font-medium text-xs">
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
                      className="bg-white hover:bg-slate-50 border border-slate-200/60 rounded-3xl p-5.5 transition-all duration-200 flex flex-col justify-between gap-4 group/course shadow-sm hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        
                        {/* Left Logo / Icon Section */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-2.5 shadow-xs shrink-0 select-none">
                            {/* Dynamic logo initials placeholder */}
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#001F3F] to-[#FF0000] flex items-center justify-center text-white text-[9px] font-black font-mono">
                              {detailsUni.name.split(' ').map(n => n[0]).join('').slice(0, 3)}
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-left">
                            <h5 className="font-extrabold text-sm text-[#001F3F] leading-snug group-hover/course:text-[#FF0000] transition-colors font-sans">
                              {course.course_name}
                            </h5>
                            <span className="inline-block px-2.5 py-0.5 bg-[#001F3F]/5 text-[#001F3F] rounded-md text-[9px] font-bold uppercase font-mono tracking-wider">
                              {degreeLevel}
                            </span>
                          </div>
                        </div>

                        <Link
                          href="/?scrollTo=consultation-hub"
                          onClick={handleCloseDetailsModal}
                          className="self-start sm:self-center shrink-0 px-4 py-2.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-colors shadow-sm text-center font-semibold"
                        >
                          Apply Now
                        </Link>
                      </div>

                      {/* Tiling grid values */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-slate-100 text-[11px] text-left">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Course Fees</span>
                          <span className="font-extrabold text-[#001F3F]">{tuitionDisplay}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Intakes</span>
                          <span className="font-bold text-slate-700">{detailsUni.intakes.join(' / ')}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Application Fees</span>
                          <span className="font-bold text-slate-500">-</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Duration</span>
                          <span className="font-bold text-slate-700">{duration}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">CRICOS Code</span>
                          <span className="font-bold text-slate-500">-</span>
                        </div>
                      </div>
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
