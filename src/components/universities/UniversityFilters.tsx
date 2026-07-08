import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  X, 
  Check, 
  DollarSign, 
  Award, 
  Filter 
} from 'lucide-react';
import { Flag } from '../ui/Flag';

interface UniversityFiltersProps {
  // Active Dropdown
  activeDropdown: 'destination' | 'intake' | 'type' | 'level' | 'program' | 'fees' | 'ranking' | null;
  setActiveDropdown: (val: 'destination' | 'intake' | 'type' | 'level' | 'program' | 'fees' | 'ranking' | null) => void;
  
  // Selections
  pendingSelectedCountries: string[];
  toggleCountry: (country: string) => void;
  pendingSelectedIntakes: string[];
  toggleIntake: (intake: string) => void;
  pendingSelectedCourseTypes: string[];
  toggleCourseType: (type: string) => void;
  pendingSelectedDegreeLevels: string[];
  toggleDegreeLevel: (level: string) => void;
  
  // Search Program Dropdown
  pendingCourseInput: string;
  setPendingCourseInput: (val: string) => void;
  pendingSelectedCourse: string;
  setPendingSelectedCourse: (val: string) => void;
  pendingIsCourseDropdownOpen: boolean;
  setPendingIsCourseDropdownOpen: (val: boolean) => void;
  courseOptions: string[];
  
  // Selects
  pendingFeeRange: string;
  setPendingFeeRange: (val: string) => void;
  pendingMinRanking: string;
  setPendingMinRanking: (val: string) => void;
  
  // Actions
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
  hasUnappliedChanges: boolean;
  
  // Mobile drawer state
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (val: boolean) => void;
  activeFilterTagsCount: number;
}

export default function UniversityFilters({
  activeDropdown,
  setActiveDropdown,
  pendingSelectedCountries,
  toggleCountry,
  pendingSelectedIntakes,
  toggleIntake,
  pendingSelectedCourseTypes,
  toggleCourseType,
  pendingSelectedDegreeLevels,
  toggleDegreeLevel,
  pendingCourseInput,
  setPendingCourseInput,
  pendingSelectedCourse,
  setPendingSelectedCourse,
  pendingIsCourseDropdownOpen,
  setPendingIsCourseDropdownOpen,
  courseOptions,
  pendingFeeRange,
  setPendingFeeRange,
  pendingMinRanking,
  setPendingMinRanking,
  handleApplyFilters,
  handleResetFilters,
  hasUnappliedChanges,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  activeFilterTagsCount,
}: UniversityFiltersProps) {
  return (
    <>
      {/* Click outside closer for desktop dropdowns */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-20 cursor-default bg-transparent" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* Desktop Custom Horizontal Filters */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-3 max-w-6xl mx-auto pt-5 relative z-35">
        {/* 1. Destination Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'destination' ? null : 'destination')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              pendingSelectedCountries.length > 0
                ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            {pendingSelectedCountries.length > 0 ? (
              <Flag country={pendingSelectedCountries[0]} className="w-3.5 h-2.5 rounded shrink-0 inline-block" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>
              {pendingSelectedCountries.length === 0
                ? 'Destinations'
                : pendingSelectedCountries.length === 1
                ? pendingSelectedCountries[0]
                : `Destinations (${pendingSelectedCountries.length})`}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'destination' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'destination' && (
            <div className="absolute left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 min-w-[240px] z-45 space-y-2 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block mb-1">Study Destination</label>
              {['UK', 'USA', 'Canada', 'Australia', 'Germany'].map(country => (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                    pendingSelectedCountries.includes(country)
                      ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Flag country={country} className="w-4 h-2.5 rounded" />
                    <span>{country === 'UK' ? 'United Kingdom (UK)' : country === 'USA' ? 'United States (USA)' : country}</span>
                  </div>
                  {pendingSelectedCountries.includes(country) && <Check className="w-3.5 h-3.5 text-[#001F3F] stroke-[2.5]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Target Intake Period Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'intake' ? null : 'intake')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              pendingSelectedIntakes.length > 0
                ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {pendingSelectedIntakes.length === 0
                ? 'Intakes'
                : pendingSelectedIntakes.length === 1
                ? pendingSelectedIntakes[0]
                : `Intakes (${pendingSelectedIntakes.length})`}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'intake' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'intake' && (
            <div className="absolute left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 min-w-[200px] z-45 space-y-2 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block mb-1">Target Intake</label>
              {['September', 'January', 'May'].map(intake => (
                <button
                  key={intake}
                  onClick={() => toggleIntake(intake)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                    pendingSelectedIntakes.includes(intake)
                      ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{intake}</span>
                  {pendingSelectedIntakes.includes(intake) && <Check className="w-3.5 h-3.5 text-[#001F3F] stroke-[2.5]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Course Type Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              pendingSelectedCourseTypes.length > 0
                ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {pendingSelectedCourseTypes.length === 0
                ? 'Course Types'
                : pendingSelectedCourseTypes.length === 1
                ? pendingSelectedCourseTypes[0]
                : `Types (${pendingSelectedCourseTypes.length})`}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'type' && (
            <div className="absolute left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 min-w-[240px] z-45 space-y-2 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block mb-1">Course Type</label>
              {['STEM', 'Business', 'Arts', 'Medicine'].map(type => (
                <button
                  key={type}
                  onClick={() => toggleCourseType(type)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                    pendingSelectedCourseTypes.includes(type)
                      ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{type === 'STEM' ? 'STEM & Technology' : type === 'Business' ? 'Business & Management' : type === 'Arts' ? 'Arts, Humanities & Law' : 'Health & Medicine'}</span>
                  {pendingSelectedCourseTypes.includes(type) && <Check className="w-3.5 h-3.5 text-[#001F3F] stroke-[2.5]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Course Level Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'level' ? null : 'level')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              pendingSelectedDegreeLevels.length > 0
                ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {pendingSelectedDegreeLevels.length === 0
                ? 'Levels'
                : pendingSelectedDegreeLevels.length === 1
                ? pendingSelectedDegreeLevels[0]
                : `Levels (${pendingSelectedDegreeLevels.length})`}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'level' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'level' && (
            <div className="absolute left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 min-w-[200px] z-45 space-y-2 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block mb-1">Course Level</label>
              {["Bachelor's", "Master's", "PG Diploma", "PhD"].map(level => (
                <button
                  key={level}
                  onClick={() => toggleDegreeLevel(level)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                    pendingSelectedDegreeLevels.includes(level)
                      ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{level}</span>
                  {pendingSelectedDegreeLevels.includes(level) && <Check className="w-3.5 h-3.5 text-[#001F3F] stroke-[2.5]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Course Program (Searchable dropdown) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setActiveDropdown(activeDropdown === 'program' ? null : 'program');
            }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              pendingSelectedCourse !== ''
                ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[120px]">
              {pendingSelectedCourse === '' ? 'Program' : pendingSelectedCourse}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'program' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'program' && (
            <div className="absolute left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl p-4.5 min-w-[280px] max-w-sm z-45 space-y-3 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Course Program</label>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search or select course..."
                  value={pendingCourseInput}
                  onChange={(e) => {
                    setPendingCourseInput(e.target.value);
                    setPendingSelectedCourse(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setActiveDropdown(null);
                      handleApplyFilters();
                    }
                  }}
                  className="w-full pl-8.5 pr-8 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-[#001F3F] placeholder-slate-400 focus:outline-none focus:border-[#FF0000]/40 bg-slate-50 focus:bg-white transition-all"
                />
                {pendingCourseInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setPendingCourseInput('');
                      setPendingSelectedCourse('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#001F3F]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="border border-slate-100 rounded-xl bg-white p-1 space-y-0.5">
                {courseOptions.length === 0 ? (
                  <div className="text-[10px] text-slate-400 text-center py-3">
                    No courses match
                  </div>
                ) : (
                  courseOptions.slice(0, 10).map(course => {
                    const isSelected = pendingSelectedCourse === course;
                    return (
                      <button
                        key={course}
                        type="button"
                        onClick={() => {
                          setPendingCourseInput(course);
                          setPendingSelectedCourse(course);
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                          isSelected 
                            ? 'bg-[#001F3F]/5 text-[#001F3F] border-l-2 border-[#FF0000]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate pr-2">{course}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#001F3F] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 6. Tuition Fees Range Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'fees' ? null : 'fees')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              pendingFeeRange !== 'All'
                ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {pendingFeeRange === 'All'
                ? 'Fees'
                : pendingFeeRange === 'under18k'
                ? 'Under £18k'
                : pendingFeeRange === '18kto35k'
                ? '£18k - £35k'
                : pendingFeeRange === '35kto55k'
                ? '£35k - £55k'
                : 'Over £55k'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'fees' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'fees' && (
            <div className="absolute left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 min-w-[220px] z-45 space-y-1.5 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block mb-1">Annual Tuition Fees</label>
              {[
                { val: 'All', label: 'Show All Fees' },
                { val: 'under18k', label: 'Under £18,000 / $20,000' },
                { val: '18kto35k', label: '£18,000 - £35,000 / $20k - $35k' },
                { val: '35kto55k', label: '£35,000 - £55,000 / $35k - $55k' },
                { val: 'over55k', label: 'Over £55,000 / $55,000' }
              ].map(option => {
                const isSelected = pendingFeeRange === option.val;
                return (
                  <button
                    key={option.val}
                    onClick={() => {
                      setPendingFeeRange(option.val);
                      setActiveDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#001F3F]/5 text-[#001F3F] border-l-2 border-[#FF0000]'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#001F3F]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. QS Ranking Range Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'ranking' ? null : 'ranking')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              pendingMinRanking !== 'All'
                ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {pendingMinRanking === 'All'
                ? 'Rankings'
                : pendingMinRanking === 'top10'
                ? 'Top 10'
                : pendingMinRanking === 'top50'
                ? 'Top 50'
                : pendingMinRanking === 'top100'
                ? 'Top 100'
                : 'Top 500'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'ranking' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'ranking' && (
            <div className="absolute left-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 min-w-[220px] z-45 space-y-1.5 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block mb-1">QS / Global Ranking</label>
              {[
                { val: 'All', label: 'Show All Ranks' },
                { val: 'top10', label: 'Top 10 Global' },
                { val: 'top50', label: 'Top 50 Global' },
                { val: 'top100', label: 'Top 100 Global' },
                { val: 'top500', label: 'Top 500 Global' }
              ].map(option => {
                const isSelected = pendingMinRanking === option.val;
                return (
                  <button
                    key={option.val}
                    onClick={() => {
                      setPendingMinRanking(option.val);
                      setActiveDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#001F3F]/5 text-[#001F3F] border-l-2 border-[#FF0000]'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#001F3F]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={handleApplyFilters}
          className={`px-4 py-2.5 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-md shrink-0 ${
            hasUnappliedChanges
              ? 'bg-[#FF0000] hover:bg-[#FF0000]/90 shadow-lg shadow-red-500/20'
              : 'bg-[#001F3F] hover:bg-[#001F3F]/90'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>
      </div>

      {/* MOBILE OVERLAY FILTERS DRAWER */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#001F3F]/40 backdrop-blur-md lg:hidden">
            <div className="absolute inset-0" onClick={() => setMobileFiltersOpen(false)} />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-[32px] w-full max-h-[85vh] overflow-y-auto p-6 relative z-10 flex flex-col space-y-6 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                <h3 className="font-extrabold text-sm text-[#001F3F] font-mono uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filters ({activeFilterTagsCount})</span>
                </h3>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="text-xs font-bold text-red-500 cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Scrollable Filters Container */}
              <div className="space-y-6 overflow-y-auto pr-1">
                
                {/* Country */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Study Destination</span>
                  <div className="flex flex-wrap gap-2">
                    {['UK', 'USA', 'Canada', 'Australia', 'Germany'].map(country => (
                      <button
                        key={country}
                        onClick={() => toggleCountry(country)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          pendingSelectedCountries.includes(country)
                            ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <Flag country={country} className="w-4 h-2.5 rounded" />
                        <span>{country}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intake */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Target Intake</span>
                  <div className="flex flex-wrap gap-2">
                    {['September', 'January', 'May'].map(intake => (
                      <button
                        key={intake}
                        onClick={() => toggleIntake(intake)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          pendingSelectedIntakes.includes(intake)
                            ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                            : 'border-slate-200 text-slate-505'
                        }`}
                      >
                        {intake}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course Type */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Course Type</span>
                  <div className="flex flex-wrap gap-2">
                    {['STEM', 'Business', 'Arts', 'Medicine'].map(type => (
                      <button
                        key={type}
                        onClick={() => toggleCourseType(type)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          pendingSelectedCourseTypes.includes(type)
                            ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search & Select Course Searchable Dropdown */}
                <div className="space-y-2 relative">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Course Program</span>
                  
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Type or select a course..."
                      value={pendingCourseInput}
                      onFocus={() => setPendingIsCourseDropdownOpen(true)}
                      onChange={(e) => {
                        setPendingCourseInput(e.target.value);
                        setPendingSelectedCourse(e.target.value);
                        setPendingIsCourseDropdownOpen(true);
                      }}
                      className="w-full pl-9.5 pr-10 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-[#001F3F] placeholder-slate-400 focus:outline-none focus:border-[#FF0000]/40 bg-slate-55 focus:bg-white transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setPendingIsCourseDropdownOpen(!pendingIsCourseDropdownOpen)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#001F3F] p-1 rounded-lg cursor-pointer"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${pendingIsCourseDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {pendingIsCourseDropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown on click outside */}
                      <div className="fixed inset-0 z-20 cursor-default" onClick={() => setPendingIsCourseDropdownOpen(false)} />
                      
                      {/* Dropdown Options List */}
                      <div className="absolute left-0 right-0 top-full mt-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-2xl bg-white shadow-xl z-35 p-2 space-y-1 custom-scrollbar text-left">
                        {courseOptions.length === 0 ? (
                          <div className="text-[11px] text-slate-400 text-center py-4 font-medium">
                            No courses match your search
                          </div>
                        ) : (
                          courseOptions.map(course => {
                            const isSelected = pendingSelectedCourse === course;
                            return (
                              <button
                                key={course}
                                type="button"
                                onClick={() => {
                                  setPendingCourseInput(course);
                                  setPendingSelectedCourse(course);
                                  setPendingIsCourseDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#001F3F]/5 text-[#001F3F] border-l-2 border-[#FF0000]'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <span>{course}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#001F3F]" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Course Level */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Course Level</span>
                  <div className="flex flex-wrap gap-2">
                    {["Bachelor's", "Master's", "PG Diploma", "PhD"].map(level => (
                      <button
                        key={level}
                        onClick={() => toggleDegreeLevel(level)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          pendingSelectedDegreeLevels.includes(level)
                            ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tuition Fee Selection */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Annual Tuition Fees</span>
                  <select
                    value={pendingFeeRange}
                    onChange={(e) => setPendingFeeRange(e.target.value)}
                    className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50"
                  >
                    <option value="All">Show All Fees</option>
                    <option value="under18k">Under £18,000 / $20,000</option>
                    <option value="18kto35k">£18,000 - £35,000 / $20k - $35k</option>
                    <option value="35kto55k">£35,000 - £55,000 / $35k - $55k</option>
                    <option value="over55k">Over £55,000 / $55,000</option>
                  </select>
                </div>

                {/* Ranking */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">QS / Global Ranking</span>
                  <select
                    value={pendingMinRanking}
                    onChange={(e) => setPendingMinRanking(e.target.value)}
                    className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50"
                  >
                    <option value="All">Show All Ranks</option>
                    <option value="top10">Top 10 Global Universities</option>
                    <option value="top50">Top 50 Global Universities</option>
                    <option value="top100">Top 100 Global Universities</option>
                    <option value="top500">Top 500 Global Universities</option>
                  </select>
                </div>
              </div>

              {/* Apply button */}
              <button
                onClick={() => {
                  handleApplyFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full py-4.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest cursor-pointer shadow-md text-center shrink-0"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
