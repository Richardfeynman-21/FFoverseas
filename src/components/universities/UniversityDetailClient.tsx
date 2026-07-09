'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Flag } from '../ui/Flag';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { DetailedUniversity, ApiCourse, ApiUniversity } from '../../lib/types';
import { fetchUniversityDetail, fetchUniversityCourses, mapApiDetailToDetailedUniversity, mapApiToDetailedUniversity } from '../../lib/api';
import { CURRENCY_SYMBOLS, FEATURED_UNIVERSITIES_FALLBACK } from '../../lib/constants';

interface UniversityDetailClientProps {
  universityId: number;
}

export default function UniversityDetailClient({ universityId }: UniversityDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uni, setUni] = useState<DetailedUniversity | null>(null);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [programFilter, setProgramFilter] = useState<'All' | 'Bachelor' | 'Master'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchUniversityDetail(universityId);
        const mapped = mapApiDetailToDetailedUniversity(data);
        
        // Fetch full course catalog (up to 1000 courses) to ensure Masters/PhDs are loaded
        try {
          const coursesData = await fetchUniversityCourses(universityId, 1000);
          setCourses(coursesData.courses || []);
        } catch (cErr) {
          console.warn("Failed to load full course catalog, using detail sample:", cErr);
          setCourses(data.courses || []);
        }

        setUni(mapped);
        setError(null);
      } catch (err) {
        console.warn("Failed to load live university details, falling back to local static catalog:", err);
        
        // Search local fallback catalog
        const localUni = FEATURED_UNIVERSITIES_FALLBACK.find(u => u.id === universityId);
        if (localUni) {
          const mapped = mapApiToDetailedUniversity(localUni as ApiUniversity);
          setUni(mapped);
          
          // Generate dummy courses matching local uni sample programs
          const dummyCourses: ApiCourse[] = mapped.programs.map((name, idx) => ({
            id: idx,
            course_name: name,
            degree_level: name.toLowerCase().includes("master") ? "Master" : name.toLowerCase().includes("phd") ? "PhD" : "Bachelor",
            duration_years: 3,
            language: "English",
            tuition_fee: mapped.tuitionValue,
            currency: mapped.currency
          }));
          setCourses(dummyCourses);
          setError(null);
        } else {
          setError("University profile not found. Please verify the URL or try searching in our catalog.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [universityId]);

  // Filter programs dynamically based on search query & tabs
  const filteredPrograms = useMemo(() => {
    if (!uni) return [];
    
    let result = courses;

    // Apply degree level tab filter
    if (programFilter !== 'All') {
      result = result.filter(course => {
        const level = course.degree_level.toLowerCase();
        if (programFilter === 'Bachelor') return level === 'bachelor';
        if (programFilter === 'Master') return level === 'master' || level === 'phd';
        return true;
      });
    }

    // Apply search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.course_name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [uni, courses, programFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8">
        
        {/* Back navigation */}
        <div className="mb-6">
          <button 
            onClick={() => router.push('/universities')}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#001F3F] transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#001F3F]/10 border-t-[#FF0000] rounded-full animate-spin" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 animate-pulse">Loading University Profile...</span>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !uni && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-md space-y-6 my-16">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <X className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#001F3F]">An Error Occurred</h3>
            <p className="text-sm text-slate-500">{error}</p>
            <button 
              onClick={() => router.push('/universities')}
              className="px-6 py-3 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>
        )}

        {/* PROFILE CONTENT */}
        {uni && !loading && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* HERO BANNER SECTION */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-3xl shadow-lg bg-slate-100 select-none">
              <img
                src={uni.imageUrl}
                alt={`${uni.name} campus`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              
              <div className="absolute bottom-8 left-6 md:left-10 flex flex-col md:flex-row md:items-end justify-between right-6 md:right-10 z-10 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Flag country={uni.flag} className="w-7.5 h-5 rounded shadow-xs" />
                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest font-mono">
                      {uni.country}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                    {uni.name}
                  </h2>
                  <p className="text-xs md:text-sm text-white/70 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FF0000] shrink-0" />
                    <span>Global Partner Campus</span>
                  </p>
                </div>
                
                <Link
                  href="/?scrollTo=consultation-hub"
                  className="px-6 py-3 bg-[#FF0000] hover:bg-[#FF0000]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 self-start md:self-auto shrink-0 shadow-md active:scale-97 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply for Consultation</span>
                </Link>
              </div>
            </div>

            {/* SPLIT LAYOUT BODY */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* LEFT SIDEBAR: PROFILE & QUICK FACTS */}
              <div className="md:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6.5 md:p-8 space-y-6.5 shadow-sm">
                
                {/* University Logo Badge & Name */}
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-2.5 shadow-sm shrink-0">
                    <img
                      src={uni.logoUrl}
                      alt={uni.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#001F3F] leading-tight">
                      {uni.name}
                    </h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-mono mt-1">
                      Verified Institution
                    </p>
                  </div>
                </div>

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl flex flex-col gap-1 shadow-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Award className="w-4 h-4 text-[#FF0000] shrink-0" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider">QS Rank</span>
                    </div>
                    <span className="text-base font-black text-[#001F3F] mt-0.5">
                      #{uni.ranking.replace('QS #', '')}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl flex flex-col gap-1 shadow-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Acceptance</span>
                    </div>
                    <span className="text-base font-black text-[#001F3F] mt-0.5">
                      {uni.acceptanceRate}
                    </span>
                  </div>
                </div>

                {/* About Profile */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F] uppercase flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#001F3F]" />
                    <span>Institution Profile</span>
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {uni.name} is a premier educational institution located in {uni.country}. Offering comprehensive globally-aligned programs, it caters to international students with world-class facilities and top-tier career placements.
                  </p>
                </div>

                {/* Facts Table */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <h5 className="text-[10px] font-mono font-bold tracking-widest text-[#001F3F] uppercase pb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#001F3F]" />
                    <span>Destination Guide</span>
                  </h5>
                  
                  <div className="space-y-3 text-xs font-medium leading-relaxed text-slate-600">
                    <p className="flex justify-between">
                      <strong className="text-slate-400">Tuition Range:</strong> 
                      <span className="font-extrabold text-[#001F3F]">{uni.tuition}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-400">Intakes:</strong> 
                      <span className="font-bold text-slate-700">{uni.intakes.join(' & ')}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-400">Scholarships:</strong> 
                      <span className="text-emerald-600 font-extrabold">{uni.scholarship}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-400">PSW Work Visa:</strong> 
                      <span className="text-slate-700 font-semibold">{uni.country === 'UK' ? '2 Years PSW Route' : uni.country === 'USA' ? '12-36 mos OPT' : 'Up to 3 years PGWP'}</span>
                    </p>
                    <p className="flex justify-between">
                      <strong className="text-slate-400">Living Budget:</strong> 
                      <span className="text-slate-700">{uni.country === 'UK' ? '£1,000 - £1,300/mo' : uni.country === 'USA' ? '$1,200 - $1,500/mo' : '€930/mo'}</span>
                    </p>
                  </div>
                </div>

                {/* Back to catalog button inside sidebar */}
                <button
                  onClick={() => router.push('/universities')}
                  className="w-full py-3.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#001F3F] hover:bg-slate-100 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  Browse Other Universities
                </button>
              </div>

              {/* RIGHT MAIN AREA: COURSE SEARCH & CATALOG GRID */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Search & Tabs Controls Card */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h4 className="text-base font-extrabold text-[#001F3F] flex items-center gap-2">
                      <GraduationCap className="w-5.5 h-5.5 text-[#FF0000]" />
                      <span>Academic Catalog ({filteredPrograms.length} programs)</span>
                    </h4>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Custom Search Input */}
                    <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#FF0000]/40 focus-within:bg-white rounded-2xl px-3.5 py-2.5 transition-all shadow-xs">
                      <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search courses (e.g., Computer Science, Business)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs font-semibold text-[#001F3F] placeholder-slate-400 focus:outline-none bg-transparent"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-[#001F3F] cursor-pointer flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Custom Tab Filters */}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl shrink-0 select-none shadow-xs">
                      {(['Bachelor', 'Master', 'All'] as const).map(filterTab => (
                        <button
                          key={filterTab}
                          onClick={() => setProgramFilter(filterTab)}
                          className={`px-4.5 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            programFilter === filterTab
                              ? 'bg-[#001F3F] text-white shadow-xs'
                              : 'text-slate-500 hover:text-[#001F3F] hover:bg-slate-100'
                          }`}
                        >
                          {filterTab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Course Catalog Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.length === 0 ? (
                    <div className="col-span-full bg-white border border-slate-200/60 rounded-3xl py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                      No {programFilter !== 'All' ? programFilter : ''} courses match your criteria.
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
                      const currencySymbol = CURRENCY_SYMBOLS[course.currency || ''] || course.currency || uni.currency || '$';
                      const tuitionDisplay = course.tuition_fee !== null && course.tuition_fee !== undefined
                        ? (course.tuition_fee === 0 ? 'Free' : `${currencySymbol}${Math.round(Number(course.tuition_fee)).toLocaleString('en-US')}/yr`)
                        : uni.tuition;

                      // Determine duration
                      const duration = course.duration_years > 0 
                        ? `${course.duration_years} year${course.duration_years > 1 ? 's' : ''}`
                        : (['Bachelor'].includes(course.degree_level) ? "3-4 years" : "1-2 years");

                      // Determine academic level badge colors
                      let levelColorClass = "bg-slate-100 text-slate-600 border border-slate-200/40";
                      const lowerLevel = degreeLevel.toLowerCase();
                      if (lowerLevel.includes("bachelor") || lowerLevel.includes("ug")) {
                        levelColorClass = "bg-emerald-50 text-emerald-700 border border-emerald-100/60";
                      } else if (lowerLevel.includes("master") || lowerLevel.includes("pg") || lowerLevel.includes("postgraduate")) {
                        levelColorClass = "bg-indigo-50/70 text-indigo-700 border border-indigo-100/60";
                      } else if (lowerLevel.includes("phd") || lowerLevel.includes("doctorate")) {
                        levelColorClass = "bg-purple-50 text-purple-700 border border-purple-100/60";
                      }

                      return (
                        <div 
                          key={course.id || index} 
                          className="bg-white hover:bg-slate-50 border border-slate-200/50 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-1 relative overflow-hidden h-full"
                        >
                          {/* Left vertical hover glow line */}
                          <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#FF0000] rounded-r-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                          
                          <div className="space-y-4">
                            {/* Header: Icon box & level badge */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="w-10 h-10 bg-[#001F3F]/5 rounded-xl flex items-center justify-center text-[#001F3F] group-hover:bg-[#FF0000]/5 group-hover:text-[#FF0000] transition-colors shrink-0">
                                <GraduationCap className="w-5 h-5" />
                              </div>
                              
                              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase font-mono tracking-wider ${levelColorClass}`}>
                                {degreeLevel.split('/')[1] || degreeLevel}
                              </span>
                            </div>

                            {/* Title */}
                            <h5 className="font-extrabold text-sm text-[#001F3F] leading-snug group-hover:text-[#FF0000] transition-colors line-clamp-2 tracking-tight min-h-[40px] flex items-center">
                              {course.course_name}
                            </h5>

                            {/* Details Container */}
                            <div className="bg-slate-50/60 border border-slate-100/80 rounded-2xl p-4 space-y-3 mt-4 text-[11px]">
                              <div className="flex justify-between items-center text-left">
                                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                  <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Tuition</span>
                                </span>
                                <span className="font-black text-[#001F3F]">{tuitionDisplay}</span>
                              </div>
                              
                              <div className="flex justify-between items-center text-left gap-4">
                                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1.5 shrink-0">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Intakes</span>
                                </span>
                                <span className="font-extrabold text-slate-600 text-right">
                                  {uni.intakes.join(' / ')}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center text-left">
                                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Duration</span>
                                </span>
                                <span className="font-extrabold text-slate-600">{duration}</span>
                              </div>
                            </div>
                          </div>

                          {/* Footer CTA Button */}
                          <Link
                            href="/?scrollTo=consultation-hub"
                            className="w-full mt-6 py-3.5 bg-[#001F3F] group-hover:bg-[#FF0000] text-white rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-97 cursor-pointer text-center"
                          >
                            <span>Apply Now</span>
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
