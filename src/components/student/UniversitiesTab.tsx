'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  Search, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Clock, 
  Compass, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Star,
  Plus,
  Minus,
  Sparkles,
  Info,
  MessageSquare
} from 'lucide-react';
import { University } from './types';
import { Flag } from './Flag';

interface UniversitiesTabProps {
  countryFilter: string;
  setCountryFilter: (country: string) => void;
  filteredUniversities: University[];
  setActiveTab?: (tab: any) => void;
}

interface CourseItem {
  id: string;
  courseName: string;
  field: string;
  duration: string;
  tuition: string;
  scholarship: string;
  intake: string;
  ieltsScore: string;
  greRequired: string;
  acceptanceRate: string;
  university: University;
}

export const UniversitiesTab: React.FC<UniversitiesTabProps> = ({
  countryFilter,
  setCountryFilter,
  filteredUniversities,
  setActiveTab,
}) => {
  // 1. Tab Modes: 'explore' (Explore Courses) vs 'shortlisted' (My Shortlist)
  const [viewMode, setViewMode] = useState<'explore' | 'shortlisted'>('explore');

  // 2. States for Shortlist & Comparison
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [infoRequestSentId, setInfoRequestSentId] = useState<string | null>(null);

  // 3. Search & Basic Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('All');

  // 4. Advanced Filters Panel State (Replicating Main Catalog filters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFeeRange, setSelectedFeeRange] = useState('All');
  const [selectedMinRanking, setSelectedMinRanking] = useState('All');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState('All');
  const [selectedIeltsScore, setSelectedIeltsScore] = useState('All');
  const [sortByOption, setSortByOption] = useState('rank');

  // Load initial shortlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ff_shortlisted_courses');
      if (saved) {
        try {
          setShortlistedIds(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Sync shortlist to localStorage
  const toggleShortlist = (courseId: string) => {
    setShortlistedIds(prev => {
      const next = prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId];
      localStorage.setItem('ff_shortlisted_courses', JSON.stringify(next));
      return next;
    });
  };

  // Toggle comparison selection (max 3 courses)
  const toggleCompare = (courseId: string) => {
    setCompareIds(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      }
      if (prev.length >= 3) {
        // Can't select more than 3
        return prev;
      }
      return [...prev, courseId];
    });
  };

  // Fields category list
  const fieldsList = [
    'All',
    'Computer Science & AI',
    'Business & Economics',
    'Engineering & Science',
    'Medicine & Biology',
    'Law & Policy'
  ];

  // Helpers to parse Tuition, Rankings, and Acceptance values for filters & sorting
  const parseTuition = (feeStr: string): number => {
    const clean = feeStr.replace(/[$,]/g, '');
    const match = clean.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const parseRanking = (rankStr: string): number => {
    const match = rankStr.match(/\d+/);
    return match ? parseInt(match[0]) : 9999;
  };

  const parseAcceptance = (accStr: string): number => {
    const clean = accStr.replace(/%/g, '');
    const match = clean.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Active filter count count (excluding 'All' defaults)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedFeeRange !== 'All') count++;
    if (selectedMinRanking !== 'All') count++;
    if (selectedDegreeLevel !== 'All') count++;
    if (selectedIeltsScore !== 'All') count++;
    if (sortByOption !== 'rank') count++;
    return count;
  }, [selectedFeeRange, selectedMinRanking, selectedDegreeLevel, selectedIeltsScore, sortByOption]);

  // 5. Generate Course Data from Universities List
  const courses: CourseItem[] = useMemo(() => {
    const list: CourseItem[] = [];
    filteredUniversities.forEach((uni) => {
      uni.programs.forEach((prog) => {
        // Classify program names into field categories
        let field = 'Other';
        const name = prog.toLowerCase();
        if (
          name.includes('computer') || 
          name.includes('eecs') || 
          name.includes('data science') || 
          name.includes('ai') || 
          name.includes('machine learning') ||
          name.includes('computing') ||
          name.includes('informatics')
        ) {
          field = 'Computer Science & AI';
        } else if (
          name.includes('engineer') || 
          name.includes('physics') || 
          name.includes('natural') ||
          name.includes('math')
        ) {
          field = 'Engineering & Science';
        } else if (
          name.includes('business') || 
          name.includes('finance') || 
          name.includes('economics') || 
          name.includes('commerce') ||
          name.includes('analytics') ||
          name.includes('mba') ||
          name.includes('ppe')
        ) {
          field = 'Business & Economics';
        } else if (
          name.includes('medicine') || 
          name.includes('bio') || 
          name.includes('neuro') ||
          name.includes('music') ||
          name.includes('kinesiology') ||
          name.includes('design') ||
          name.includes('architecture')
        ) {
          field = 'Medicine & Biology';
        } else if (
          name.includes('law') ||
          name.includes('journalism') ||
          name.includes('relation') ||
          name.includes('policy') ||
          name.includes('education')
        ) {
          field = 'Law & Policy';
        }

        // Determine course duration
        let duration = '2 Years';
        if (uni.country === 'UK') duration = '1 Year';
        else if (name.includes('mba') || name.includes('analytics')) duration = '1.5 Years';

        // Requirements mapping
        let ielts = '7.0';
        if (
          uni.ranking.includes('#1') || 
          uni.ranking.includes('#2') || 
          uni.ranking.includes('#3') || 
          uni.ranking.includes('#4') || 
          uni.ranking.includes('#5')
        ) {
          ielts = '7.5';
        } else if (uni.country === 'Germany') {
          ielts = '6.5';
        }

        let gre = 'Optional';
        if (
          uni.country === 'USA' && 
          (uni.name.includes('MIT') || uni.name.includes('Stanford') || uni.name.includes('Harvard') || uni.name.includes('Berkeley'))
        ) {
          gre = 'Required (315+)';
        }

        list.push({
          id: `${uni.name.replace(/\s+/g, '-').toLowerCase()}-${prog.replace(/\s+/g, '-').toLowerCase()}`,
          courseName: prog,
          field: field,
          duration: duration,
          tuition: uni.tuition,
          scholarship: uni.scholarship,
          intake: 'Fall 2026',
          ieltsScore: ielts,
          greRequired: gre,
          acceptanceRate: uni.acceptanceRate,
          university: uni
        });
      });
    });
    return list;
  }, [filteredUniversities]);

  // 6. Filtering & Sorting logic
  const filteredCourses = useMemo(() => {
    let list = courses.filter((course) => {
      // Search matches
      const matchesSearch = 
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.university.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Domain matches
      const matchesField = selectedField === 'All' || course.field === selectedField;
      
      // Shortlisted mode filtering
      const matchesShortlistMode = viewMode === 'explore' || shortlistedIds.includes(course.id);

      // Tuition Fee Range Filtering
      let matchesTuition = true;
      if (selectedFeeRange !== 'All') {
        const fee = parseTuition(course.tuition);
        if (selectedFeeRange === 'Under $15k') {
          matchesTuition = fee < 15000;
        } else if (selectedFeeRange === '$15k - $30k') {
          matchesTuition = fee >= 15000 && fee <= 30000;
        } else if (selectedFeeRange === '$30k - $50k') {
          matchesTuition = fee >= 30000 && fee <= 50000;
        } else if (selectedFeeRange === 'Over $50k') {
          matchesTuition = fee > 50000;
        }
      }

      // QS Ranking Filtering
      let matchesRanking = true;
      if (selectedMinRanking !== 'All') {
        const rank = parseRanking(course.university.ranking);
        if (selectedMinRanking === 'Top 50') {
          matchesRanking = rank <= 50;
        } else if (selectedMinRanking === 'Top 100') {
          matchesRanking = rank <= 100;
        } else if (selectedMinRanking === 'Top 200') {
          matchesRanking = rank <= 200;
        } else if (selectedMinRanking === 'Top 500') {
          matchesRanking = rank <= 500;
        }
      }

      // Degree Level Filtering
      let matchesDegree = true;
      if (selectedDegreeLevel !== 'All') {
        const isMaster = 
          course.courseName.toLowerCase().includes('master') || 
          course.courseName.toLowerCase().includes('mba') ||
          course.courseName.toLowerCase().includes('postgraduate');
        if (selectedDegreeLevel === 'Master') {
          matchesDegree = isMaster;
        } else if (selectedDegreeLevel === 'Bachelor') {
          matchesDegree = !isMaster;
        }
      }

      // IELTS Score Filtering
      let matchesIelts = true;
      if (selectedIeltsScore !== 'All') {
        const score = parseFloat(course.ieltsScore);
        if (selectedIeltsScore === '6.5 or under') {
          matchesIelts = score <= 6.5;
        } else if (selectedIeltsScore === '7.0') {
          matchesIelts = score === 7.0;
        } else if (selectedIeltsScore === '7.5+') {
          matchesIelts = score >= 7.5;
        }
      }
      
      return matchesSearch && matchesField && matchesShortlistMode && matchesTuition && matchesRanking && matchesDegree && matchesIelts;
    });

    // Apply Sorting Option
    if (sortByOption === 'rank') {
      list.sort((a, b) => parseRanking(a.university.ranking) - parseRanking(b.university.ranking));
    } else if (sortByOption === 'tuition-asc') {
      list.sort((a, b) => parseTuition(a.tuition) - parseTuition(b.tuition));
    } else if (sortByOption === 'tuition-desc') {
      list.sort((a, b) => parseTuition(b.tuition) - parseTuition(a.tuition));
    } else if (sortByOption === 'acceptance-desc') {
      list.sort((a, b) => parseAcceptance(b.acceptanceRate) - parseAcceptance(a.acceptanceRate));
    }

    return list;
  }, [courses, searchQuery, selectedField, viewMode, shortlistedIds, selectedFeeRange, selectedMinRanking, selectedDegreeLevel, selectedIeltsScore, sortByOption]);

  // Courses selected for comparison
  const compareCourses = useMemo(() => {
    return courses.filter(course => compareIds.includes(course.id));
  }, [courses, compareIds]);

  return (
    <motion.div
      key="universities"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-20 relative text-[#001F3F]"
    >
      
      {/* ─── Top Dashboard Nav & View Toggle ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[#001F3F] font-extrabold text-xl sm:text-2xl tracking-tight uppercase">
            {viewMode === 'explore' ? 'Explore Programs' : 'My Selected Shortlist'}
          </h2>
          <p className="text-xs text-slate-450 font-medium">
            {viewMode === 'explore' 
              ? 'Find and shortlist your target courses. Compare eligibility requirements side-by-side.'
              : `Review and refine your shortlisted programs. You have selected ${shortlistedIds.length} courses.`}
          </p>
        </div>

        {/* View Mode Switcher Buttons */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/40 select-none">
          <button
            onClick={() => setViewMode('explore')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition duration-200 cursor-pointer ${
              viewMode === 'explore'
                ? 'bg-[#001F3F] text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Programs
          </button>
          <button
            onClick={() => setViewMode('shortlisted')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition duration-200 cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'shortlisted'
                ? 'bg-[#001F3F] text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star size={13} className={viewMode === 'shortlisted' ? 'fill-white' : ''} />
            Shortlist ({shortlistedIds.length})
          </button>
        </div>
      </div>

      {/* ─── Search & Filters Panel ─── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xl shadow-slate-900/2 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by course name, university, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3.5 text-xs text-[#001F3F] placeholder-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* All Filters Toggle Button (shows count of active filters) */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`px-4.5 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all duration-200 border cursor-pointer flex items-center gap-2 select-none active:scale-95 ${
                isFiltersOpen
                  ? 'bg-[#001F3F] text-white border-transparent shadow-md'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-350 hover:bg-slate-100'
              }`}
            >
              <Filter size={14} />
              <span>All Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-black leading-none shrink-0">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Region / Country Filter Quick Selection */}
            <div className="flex gap-1 overflow-x-auto scrollbar-hide py-0.5 max-w-full">
              {['All', 'USA', 'UK', 'Canada', 'Australia', 'Germany'].map((country) => (
                <button
                  key={country}
                  onClick={() => setCountryFilter(country)}
                  className={`px-3.5 py-3 rounded-xl text-[10.5px] font-bold tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    countryFilter === country
                      ? 'bg-[#001F3F] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-500 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Advanced Filters Modal Overlay (Replicating Main Catalog filters) ─── */}
        <AnimatePresence>
          {isFiltersOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFiltersOpen(false)}
                className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-xs"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 relative overflow-hidden z-10 space-y-6"
              >
                
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-[#001F3F] text-lg uppercase tracking-tight flex items-center gap-2">
                      <Filter size={18} />
                      Filter Programs
                    </h3>
                    <p className="text-xs text-slate-455 font-semibold">Select your preferences to filter target courses.</p>
                  </div>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    aria-label="Close filters"
                    className="material-symbols-outlined p-2 hover:bg-slate-50 text-slate-450 hover:text-[#001F3F] rounded-full cursor-pointer transition active:scale-95"
                  >
                    close
                  </button>
                </div>

                {/* Filter Columns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2">
                  
                  {/* Tuition Fee Range */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Tuition Fee</span>
                    <div className="flex flex-col gap-2">
                      {['All', 'Under $15k', '$15k - $30k', '$30k - $50k', 'Over $50k'].map((range) => (
                        <label key={range} className="flex items-center gap-2 text-xs font-semibold text-slate-650 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="tuitionRange"
                            checked={selectedFeeRange === range}
                            onChange={() => setSelectedFeeRange(range)}
                            className="accent-[#001F3F] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{range === 'All' ? 'Any Tuition' : range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Ranking Filter */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">QS World Ranking</span>
                    <div className="flex flex-col gap-2">
                      {['All', 'Top 50', 'Top 100', 'Top 200', 'Top 500'].map((rank) => (
                        <label key={rank} className="flex items-center gap-2 text-xs font-semibold text-slate-650 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="ranking"
                            checked={selectedMinRanking === rank}
                            onChange={() => setSelectedMinRanking(rank)}
                            className="accent-[#001F3F] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{rank === 'All' ? 'Any Ranking' : rank}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Degree Level Filter */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Degree Level</span>
                    <div className="flex flex-col gap-2">
                      {['All', 'Bachelor', 'Master'].map((lvl) => (
                        <label key={lvl} className="flex items-center gap-2 text-xs font-semibold text-slate-650 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="degreeLevel"
                            checked={selectedDegreeLevel === lvl}
                            onChange={() => setSelectedDegreeLevel(lvl)}
                            className="accent-[#001F3F] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{lvl === 'All' ? 'Any Degree' : lvl}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                {/* IELTS Requirement & Sort By Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">English IELTS score</span>
                    <select
                      value={selectedIeltsScore}
                      onChange={(e) => setSelectedIeltsScore(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-[#001F3F] focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F] cursor-pointer"
                    >
                      <option value="All">Any IELTS score</option>
                      <option value="6.5 or under">6.5 or under</option>
                      <option value="7.0">7.0 minimum</option>
                      <option value="7.5+">7.5 or higher</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Sort Results By</span>
                    <select
                      value={sortByOption}
                      onChange={(e) => setSortByOption(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-[#001F3F] focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F] cursor-pointer"
                    >
                      <option value="rank">QS Ranking (Highest First)</option>
                      <option value="tuition-asc">Tuition: Low to High</option>
                      <option value="tuition-desc">Tuition: High to Low</option>
                      <option value="acceptance-desc">Acceptance Rate (Highest First)</option>
                    </select>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedFeeRange('All');
                      setSelectedMinRanking('All');
                      setSelectedDegreeLevel('All');
                      setSelectedIeltsScore('All');
                      setSortByOption('rank');
                    }}
                    className="px-4 py-2.5 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition cursor-pointer select-none"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="px-6 py-2.5 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white rounded-xl text-xs font-bold transition active:scale-97 cursor-pointer shadow-md shadow-[#001F3F]/15"
                  >
                    Apply Filters
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ─── Domain/Field Pills list ─── */}
        <div className="border-t border-slate-50 pt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mr-2">Domain:</span>
          {fieldsList.map((field) => (
            <button
              key={field}
              onClick={() => setSelectedField(field)}
              className={`px-3.5 py-1.5 rounded-xl text-[10.5px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                selectedField === field
                  ? 'bg-[#001F3F]/5 text-[#001F3F] border border-[#001F3F]/15 font-extrabold'
                  : 'bg-white text-slate-455 border border-slate-100 hover:border-slate-250 hover:text-slate-600'
              }`}
            >
              {field === 'All' ? 'All Domains' : field}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Active Filter Meta Info ─── */}
      <div className="flex items-center justify-between px-2">
        <span className="text-[10.5px] text-slate-405 font-mono font-bold uppercase tracking-widest">
          {filteredCourses.length} MATCHING PROGRAMS FOUND
        </span>
        {compareIds.length > 0 && (
          <button 
            onClick={() => setCompareIds([])}
            className="text-[10px] text-slate-400 font-bold hover:text-[#001F3F] uppercase tracking-wider cursor-pointer underline decoration-dotted"
          >
            Clear Selected Compare ({compareIds.length})
          </button>
        )}
      </div>

      {/* ─── Course Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, idx) => {
            const isShortlisted = shortlistedIds.includes(course.id);
            const isComparing = compareIds.includes(course.id);
            const isSent = infoRequestSentId === course.id;

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                className="bg-white rounded-3xl p-5 border border-slate-100/90 hover:border-slate-250/80 hover:shadow-2xl transition-all duration-350 flex flex-col justify-between group relative overflow-hidden h-[390px]"
              >
                {/* Visual Accent top strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#001F3F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  
                  {/* Category Field Pill & Shortlist Button */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#001F3F] bg-[#001F3F]/5 border border-[#001F3F]/10 rounded-lg px-2 py-0.5">
                      {course.field}
                    </span>
                    <button
                      onClick={() => toggleShortlist(course.id)}
                      aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                      className={`p-1.5 rounded-full border transition duration-200 cursor-pointer active:scale-90 ${
                        isShortlisted 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-500 hover:bg-amber-500/20' 
                          : 'bg-slate-50 border-slate-200/60 text-slate-400 hover:text-slate-650 hover:bg-slate-100'
                      }`}
                    >
                      <Star size={14} className={isShortlisted ? 'fill-amber-500' : ''} />
                    </button>
                  </div>

                  {/* Course Name & University Details */}
                  <div className="space-y-1.5 mb-4 min-w-0">
                    <h3 className="font-extrabold text-[#001F3F] text-base leading-tight group-hover:text-amber-600 transition-colors duration-200 line-clamp-1">
                      {course.courseName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Flag country={course.university.flag} className="w-4.5 h-3 rounded shadow-xs shrink-0" />
                      <span className="text-[10.5px] font-bold text-slate-450 truncate flex items-center gap-1">
                        {course.university.name}
                      </span>
                    </div>
                  </div>

                  {/* Course Details Info Box */}
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-150/40 space-y-2.5 mb-4 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-450">
                        <Clock size={13} />
                        <span className="font-bold uppercase font-mono text-[9px] tracking-wider">Duration</span>
                      </div>
                      <span className="font-bold text-slate-700">{course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100/60 pt-2.5">
                      <div className="flex items-center gap-2 text-slate-455">
                        <GraduationCap size={13} />
                        <span className="font-bold uppercase font-mono text-[9px] tracking-wider">Fees</span>
                      </div>
                      <span className="font-bold text-slate-700">{course.tuition}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100/60 pt-2.5">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Award size={13} />
                        <span className="font-bold uppercase font-mono text-[9px] tracking-wider">Scholarships</span>
                      </div>
                      <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/30">
                        {course.scholarship}
                      </span>
                    </div>
                  </div>

                  {/* Requirements Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 border border-slate-200/50 text-slate-500 rounded-md">
                      IELTS: {course.ieltsScore}
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 border border-slate-200/50 text-slate-500 rounded-md">
                      GRE: {course.greRequired}
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 border border-slate-200/50 text-slate-500 rounded-md">
                      Intake: {course.intake}
                    </span>
                  </div>

                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-50 mt-auto">
                  {/* Compare Checkbox Trigger */}
                  <button
                    onClick={() => toggleCompare(course.id)}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isComparing
                        ? 'bg-[#001F3F] text-white border-transparent shadow-md'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    {isComparing ? <Minus size={11} /> : <Plus size={11} />}
                    {isComparing ? 'Comparing' : 'Compare'}
                  </button>

                  {/* Info request button */}
                  <button
                    onClick={() => {
                      if (!isSent) {
                        setInfoRequestSentId(course.id);
                        setTimeout(() => setInfoRequestSentId(null), 3000);
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSent
                        ? 'bg-emerald-500 text-white border-transparent'
                        : 'bg-slate-50 border border-transparent text-[#001F3F] hover:bg-[#001F3F] hover:text-white'
                    }`}
                  >
                    {isSent ? <CheckCircle2 size={11} /> : <ExternalLink size={11} />}
                    {isSent ? 'Sent!' : 'Request Info'}
                  </button>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredCourses.length === 0 && (
          <div className="col-span-full py-16 bg-white border border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-full text-slate-400">
              <Info size={32} />
            </div>
            <div className="max-w-xs space-y-1">
              <h4 className="font-extrabold text-[#001F3F] text-sm">No courses matching filters</h4>
              <p className="text-xs text-slate-455 leading-relaxed">
                We couldn't find any courses matching your search query or region/domain selection. Try clearing filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedField('All');
                setCountryFilter('All');
                setSelectedFeeRange('All');
                setSelectedMinRanking('All');
                setSelectedDegreeLevel('All');
                setSelectedIeltsScore('All');
                setSortByOption('rank');
              }}
              className="px-4.5 py-2.5 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white text-xs font-bold rounded-xl transition duration-200 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* ─── Floating Compare Bar Drawer ─── */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#001F3F] border border-white/10 text-white px-5 py-4 rounded-3xl shadow-2xl flex items-center gap-6 max-w-lg w-[90%] md:w-auto"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white/10 text-emerald-400 rounded-xl animate-pulse">
                <TrendingUp size={16} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider">Compare Programs</p>
                <p className="text-[10px] text-slate-300">
                  {compareIds.length} of 3 selected.
                </p>
              </div>
            </div>

            {/* List of selected course names as initials */}
            <div className="hidden md:flex gap-1.5">
              {compareCourses.map(course => (
                <span 
                  key={course.id}
                  className="px-2.5 py-1 bg-white/10 text-[9px] font-bold rounded-lg border border-white/5 truncate max-w-[120px]"
                >
                  {course.courseName}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => setIsCompareOpen(true)}
                disabled={compareIds.length < 2}
                className={`px-4.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition ${
                  compareIds.length >= 2
                    ? 'bg-emerald-500 text-white hover:scale-102 active:scale-97 cursor-pointer'
                    : 'bg-white/10 text-slate-400 cursor-not-allowed'
                }`}
              >
                Compare Now
              </button>
              <button 
                onClick={() => setCompareIds([])}
                className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Compare Modal Overlay ─── */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompareOpen(false)}
              className="absolute inset-0 bg-[#0f172a]/65 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full p-6 relative overflow-hidden z-10 space-y-6"
            >
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-[#001F3F] text-lg uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={18} />
                    Program Comparison
                  </h3>
                  <p className="text-xs text-slate-450">Compare duration, fees, eligibility, and success statistics.</p>
                </div>
                <button
                  onClick={() => setIsCompareOpen(false)}
                  aria-label="Close comparison"
                  className="material-symbols-outlined p-2 hover:bg-slate-50 text-slate-450 hover:text-[#001F3F] rounded-full cursor-pointer transition active:scale-95"
                >
                  close
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto scrollbar-hide border border-slate-100 rounded-2xl bg-slate-50/20">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] uppercase tracking-widest text-slate-400">
                      <th className="p-4 font-bold">Parameters</th>
                      {compareCourses.map(course => (
                        <th key={course.id} className="p-4 font-bold border-l border-slate-100 min-w-[200px]">
                          {course.courseName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    
                    {/* University */}
                    <tr>
                      <td className="p-4 font-mono font-bold text-[9px] uppercase text-slate-455">University</td>
                      {compareCourses.map(course => (
                        <td key={course.id} className="p-4 border-l border-slate-100">
                          <p className="font-bold text-[#001F3F]">{course.university.name}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-[10.5px] text-slate-400 font-semibold">
                            <Flag country={course.university.flag} className="w-3.5 h-2.5 rounded shrink-0" />
                            {course.university.country}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Global Ranking */}
                    <tr>
                      <td className="p-4 font-mono font-bold text-[9px] uppercase text-slate-455">QS Rank</td>
                      {compareCourses.map(course => (
                        <td key={course.id} className="p-4 border-l border-slate-100">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg font-bold border border-amber-100 text-[10.5px]">
                            {course.university.ranking}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Course Duration */}
                    <tr>
                      <td className="p-4 font-mono font-bold text-[9px] uppercase text-slate-455">Duration</td>
                      {compareCourses.map(course => (
                        <td key={course.id} className="p-4 border-l border-slate-100 font-semibold text-[#001F3F]">
                          {course.duration}
                        </td>
                      ))}
                    </tr>

                    {/* Tuition Fees */}
                    <tr>
                      <td className="p-4 font-mono font-bold text-[9px] uppercase text-slate-455">Tuition</td>
                      {compareCourses.map(course => (
                        <td key={course.id} className="p-4 border-l border-slate-100 font-semibold text-slate-700">
                          {course.tuition}
                        </td>
                      ))}
                    </tr>

                    {/* Scholarships */}
                    <tr>
                      <td className="p-4 font-mono font-bold text-[9px] uppercase text-slate-455">Scholarship</td>
                      {compareCourses.map(course => (
                        <td key={course.id} className="p-4 border-l border-slate-100 font-bold text-emerald-600 bg-emerald-50/20">
                          {course.scholarship}
                        </td>
                      ))}
                    </tr>

                    {/* Eligibility Requirements */}
                    <tr>
                      <td className="p-4 font-mono font-bold text-[9px] uppercase text-slate-455">English Score</td>
                      {compareCourses.map(course => (
                        <td key={course.id} className="p-4 border-l border-slate-100 text-[10.5px] font-semibold text-slate-650">
                          Minimum IELTS {course.ieltsScore}
                        </td>
                      ))}
                    </tr>

                    {/* GRE/GMAT Requirements */}
                    <tr>
                      <td className="p-4 font-mono font-bold text-[9px] uppercase text-slate-455">GRE Exam</td>
                      {compareCourses.map(course => (
                        <td key={course.id} className="p-4 border-l border-slate-100 text-[10.5px] font-semibold text-slate-650">
                          {course.greRequired}
                        </td>
                      ))}
                    </tr>

                    {/* Acceptance Rate */}
                    <tr>
                      <td className="p-4 font-mono font-bold text-[9px] uppercase text-slate-455">Acceptance Rate</td>
                      {compareCourses.map(course => (
                        <td key={course.id} className="p-4 border-l border-slate-100 text-[10.5px] font-semibold text-slate-650">
                          {course.acceptanceRate}
                        </td>
                      ))}
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Actions footer */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition active:scale-97 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsCompareOpen(false);
                    // Open Chat tab for counseling support regarding these comparison details
                    if (setActiveTab) setActiveTab('chat');
                  }}
                  className="px-5 py-3 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white rounded-xl text-xs font-bold transition active:scale-97 flex items-center gap-2 cursor-pointer shadow-md shadow-[#001F3F]/15"
                >
                  <MessageSquare size={13} />
                  Discuss comparison with Expert
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
