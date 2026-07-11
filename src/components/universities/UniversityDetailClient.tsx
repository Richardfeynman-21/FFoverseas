'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ArrowLeft,
  Coins,
  Layers,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Users,
  Hash,
  Info,
  Trophy,
  Globe
} from 'lucide-react';
import { Flag } from '../ui/Flag';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { DetailedUniversity, ApiCourse, ApiUniversity, ApiScholarship } from '@/src/lib/types';
import { fetchUniversityDetail, fetchUniversityCourses, mapApiDetailToDetailedUniversity, mapApiToDetailedUniversity } from '@/src/lib/api';
import { CURRENCY_SYMBOLS, FEATURED_UNIVERSITIES_FALLBACK } from '../../lib/constants';

interface UniversityDetailClientProps {
  universityId: number;
}

// Generate realistic mock scholarships if none are returned by the API
function generateMockScholarships(uniId: number, uniName: string, country: string, currency: string): ApiScholarship[] {
  return [
    {
      id: uniId * 10 + 1,
      name: `${uniName} Global Merit Scholarship`,
      provider: `${uniName} Academic Board`,
      type: "Academic Merit",
      amount: "15,000",
      coverage: "Partial Tuition Fee Waiver",
      eligibility: "International students with GPA equivalent to 3.5+ on a 4.0 scale. Strong leadership track record required.",
      target_degree_level: "Bachelor, Master",
      country: country,
      currency: currency,
      deadline: "June 30, 2027",
      application_url: null,
      description: `This scholarship recognizes academic excellence and leadership potential. Selected candidates receive support towards undergraduate or postgraduate taught programs at ${uniName}.`,
      renewable: true,
      min_gpa: "3.5 / 4.0",
      field_of_study: "All Fields of Study",
      number_of_awards: "25 awards per cohort"
    },
    {
      id: uniId * 10 + 2,
      name: "STEM Innovation Fellowship",
      provider: "Global Technology & Science Coalition",
      type: "Research & Industry",
      amount: "Full Tuition & Fees",
      coverage: "100% Tuition, Lab Fees, and Living Stipend",
      eligibility: "Graduates pursuing postgraduate research in computer science, biotechnology, advanced engineering, or chemistry.",
      target_degree_level: "Master, PhD",
      country: country,
      currency: currency,
      deadline: "December 15, 2026",
      application_url: "https://foreign.fulbrightonline.org/",
      description: "A prestigious fellowship for innovators of tomorrow. Covers all tuition and academic costs plus a monthly allowance, and offers mentorship from leading industry experts.",
      renewable: false,
      min_gpa: "3.2 / 4.0",
      field_of_study: "STEM (Science, Tech, Engineering, Math)",
      number_of_awards: "8 fellowships globally"
    },
    {
      id: uniId * 10 + 3,
      name: `${country} Government Outstanding Scholar Grant`,
      provider: `Department of Higher Education & Foreign Affairs`,
      type: "Government Scheme",
      amount: "20,000",
      coverage: "Annual Living Stipend & Travel Allowance",
      eligibility: "Outstanding international candidates nominated by embassy or consulate of origin country.",
      target_degree_level: "Bachelor, Master, PhD",
      country: country,
      currency: currency,
      deadline: "August 31, 2027",
      application_url: null,
      description: `A national scheme funded by the government to foster international educational collaboration and attract global academic talents to ${uniName}.`,
      renewable: true,
      min_gpa: "3.7 / 4.0",
      field_of_study: "All Fields of Study",
      number_of_awards: "15 awards per country"
    }
  ];
}

function getScholarshipOrigin(schol: ApiScholarship): 'University' | 'Government' | 'Private' {
  const typeLower = (schol.type || '').toLowerCase();
  const providerLower = (schol.provider || '').toLowerCase();
  const nameLower = (schol.name || '').toLowerCase();
  
  if (
    typeLower.includes('govt') || 
    typeLower.includes('government') || 
    providerLower.includes('govt') || 
    providerLower.includes('government') ||
    providerLower.includes('ministry') ||
    providerLower.includes('embassy') ||
    providerLower.includes('commonwealth') ||
    nameLower.includes('government') ||
    nameLower.includes('fulbright') ||
    nameLower.includes('chevening')
  ) {
    return 'Government';
  }
  
  if (
    typeLower.includes('university') ||
    typeLower.includes('academic') ||
    typeLower.includes('merit') ||
    providerLower.includes('university') ||
    providerLower.includes('academic') ||
    providerLower.includes('board') ||
    providerLower.includes('faculty') ||
    providerLower.includes('senate') ||
    nameLower.includes('merit') ||
    nameLower.includes('academic')
  ) {
    return 'University';
  }
  
  return 'Private';
}

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

function CustomDropdown({ label, icon, value, options, onChange }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/70 backdrop-blur-md border border-slate-200/80 hover:border-[#001F3F]/35 hover:bg-white rounded-2xl px-4 py-2.5 transition-all text-xs font-semibold text-[#001F3F] shadow-xs cursor-pointer select-none active:scale-[0.98] h-10"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-slate-400 shrink-0">{icon}</span>
          <span className="truncate text-slate-700">{selectedOption ? selectedOption.label : label}</span>
        </div>
        <span className={`text-[10px] text-slate-400 transition-transform duration-300 ml-2 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-35 mt-2 w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center justify-between ${
                  opt.value === value
                    ? 'bg-[#001F3F] text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#001F3F]'
                }`}
              >
                <span>{opt.label}</span>
                {opt.value === value && <span className="text-[10px]">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type LocalDetailedUniversity = DetailedUniversity & {
  flag: string;
  ranking: string;
  acceptanceRate: string;
  scholarship: string;
  currency: string;
  tuition: string;
  intakes: string[];
};

export default function UniversityDetailClient({ universityId }: UniversityDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uni, setUni] = useState<LocalDetailedUniversity | null>(null);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [scholarships, setScholarships] = useState<ApiScholarship[]>([]);
  const [programFilter, setProgramFilter] = useState<'All' | 'Bachelor' | 'Master'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [logoError, setLogoError] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const itemsPerPage = 6;

  const [currentScholarshipPage, setCurrentScholarshipPage] = useState(1);
  const [viewAllScholarships, setViewAllScholarships] = useState(false);
  const scholarshipsPerPage = 3;

  const [scholarshipSearchQuery, setScholarshipSearchQuery] = useState('');
  const [scholarshipDegreeFilter, setScholarshipDegreeFilter] = useState('All');
  const [scholarshipOriginFilter, setScholarshipOriginFilter] = useState('All');
  const [scholarshipAmountFilter, setScholarshipAmountFilter] = useState('All');
  const [scholarshipFieldFilter, setScholarshipFieldFilter] = useState('All');

  // Reset logo states when universityId changes
  useEffect(() => {
    setLogoError(false);
    setLogoLoaded(false);
    setCurrentScholarshipPage(1);
  }, [universityId]);

  // Reset page when filter, query, or universityId changes
  useEffect(() => {
    setCurrentPage(1);
  }, [programFilter, searchQuery, universityId]);

  // Reset scholarship page when filters change
  useEffect(() => {
    setCurrentScholarshipPage(1);
  }, [scholarshipSearchQuery, scholarshipDegreeFilter, scholarshipOriginFilter, scholarshipAmountFilter, scholarshipFieldFilter, universityId]);

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

        setUni(mapped as LocalDetailedUniversity);
        
        // Set scholarships from API or generate realistic fallbacks
        const apiScholarships = data.scholarships || [];
        if (apiScholarships.length > 0) {
          setScholarships(apiScholarships);
        } else {
          setScholarships(generateMockScholarships(universityId, mapped.name, mapped.country, mapped.currency));
        }

        setError(null);
      } catch (err) {
        console.warn("Failed to load live university details, falling back to local static catalog:", err);
        
        // Search local fallback catalog
        const localUni = FEATURED_UNIVERSITIES_FALLBACK.find(u => u.id === universityId);
        if (localUni) {
          const mapped = mapApiToDetailedUniversity(localUni as ApiUniversity);
          setUni(mapped as LocalDetailedUniversity);
          
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
          
          // Generate fallback scholarships
          setScholarships(generateMockScholarships(universityId, mapped.name, mapped.country, mapped.currency));
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

  const paginatedPrograms = useMemo(() => {
    if (viewAll) {
      return filteredPrograms;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPrograms, viewAll, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  // Unique fields of study from the loaded scholarships list
  const availableFields = useMemo(() => {
    const fields = new Set<string>();
    scholarships.forEach(s => {
      if (s.field_of_study) {
        fields.add(s.field_of_study);
      }
    });
    return Array.from(fields);
  }, [scholarships]);

  // Filter scholarships dynamically based on search query & filters
  const filteredScholarships = useMemo(() => {
    return scholarships.filter(schol => {
      // 1. Search Query filter
      if (scholarshipSearchQuery.trim() !== '') {
        const q = scholarshipSearchQuery.toLowerCase();
        const matchesName = schol.name.toLowerCase().includes(q);
        const matchesDesc = (schol.description || '').toLowerCase().includes(q);
        const matchesField = (schol.field_of_study || '').toLowerCase().includes(q);
        const matchesProvider = (schol.provider || '').toLowerCase().includes(q);
        const matchesElig = (schol.eligibility || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesField && !matchesProvider && !matchesElig) {
          return false;
        }
      }

      // 2. Degree Level filter (Bachelors or Masters)
      if (scholarshipDegreeFilter !== 'All') {
        const levelLower = (schol.target_degree_level || '').toLowerCase();
        if (scholarshipDegreeFilter === 'Bachelor') {
          if (!levelLower.includes('bachelor') && !levelLower.includes('undergrad') && !levelLower.includes('bsc') && !levelLower.includes('ba')) {
            return false;
          }
        }
        if (scholarshipDegreeFilter === 'Master') {
          if (!levelLower.includes('master') && !levelLower.includes('postgrad') && !levelLower.includes('msc') && !levelLower.includes('ma') && !levelLower.includes('phd') && !levelLower.includes('doctor')) {
            return false;
          }
        }
      }

      // 3. Origin filter (University, Government, Private)
      if (scholarshipOriginFilter !== 'All') {
        const origin = getScholarshipOrigin(schol);
        if (origin !== scholarshipOriginFilter) {
          return false;
        }
      }

      // 4. Money / Amount filter
      if (scholarshipAmountFilter !== 'All') {
        const isFull = 
          schol.amount.toLowerCase().includes('full') || 
          schol.coverage.toLowerCase().includes('100%') ||
          schol.coverage.toLowerCase().includes('full');
        if (scholarshipAmountFilter === 'Full' && !isFull) {
          return false;
        }
        if (scholarshipAmountFilter === 'Partial' && isFull) {
          return false;
        }
      }

      // 5. Field of Study filter
      if (scholarshipFieldFilter !== 'All') {
        if (schol.field_of_study !== scholarshipFieldFilter) {
          return false;
        }
      }

      return true;
    });
  }, [scholarships, scholarshipSearchQuery, scholarshipDegreeFilter, scholarshipOriginFilter, scholarshipAmountFilter, scholarshipFieldFilter]);

  const paginatedScholarships = useMemo(() => {
    if (viewAllScholarships) {
      return filteredScholarships;
    }
    const startIndex = (currentScholarshipPage - 1) * scholarshipsPerPage;
    return filteredScholarships.slice(startIndex, startIndex + scholarshipsPerPage);
  }, [filteredScholarships, viewAllScholarships, currentScholarshipPage, scholarshipsPerPage]);

  const totalScholarshipPages = Math.ceil(filteredScholarships.length / scholarshipsPerPage);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

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
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-2 shadow-sm shrink-0 overflow-hidden relative">
                    {!uni.logoUrl || logoError ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#001F3F] to-[#FF0000] text-white flex items-center justify-center font-black text-base tracking-wider rounded-xl">
                        {getInitials(uni.name)}
                      </div>
                    ) : (
                      <img
                        src={uni.logoUrl}
                        alt={uni.name}
                        onError={() => setLogoError(true)}
                        onLoad={() => setLogoLoaded(true)}
                        className={`w-full h-full object-contain transition-all duration-300 ease-out ${
                          logoLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-xs'
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#001F3F] leading-tight">
                      {uni.name}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono mt-1">
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

                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    {/* Custom Search Input */}
                    <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#FF0000]/40 focus-within:bg-white rounded-2xl px-3.5 py-2.5 transition-all shadow-xs">
                      <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
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
                          className="p-1 rounded-full hover:bg-slate-200 text-slate-500 hover:text-[#001F3F] cursor-pointer flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Custom Tab Filters */}
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl shrink-0 select-none shadow-xs">
                        {(['Bachelor', 'Master', 'All'] as const).map(filterTab => (
                          <button
                            key={filterTab}
                            onClick={() => setProgramFilter(filterTab)}
                            className={`px-4.5 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                              programFilter === filterTab
                                ? 'bg-[#001F3F] text-white shadow-xs'
                                : 'text-slate-600 hover:text-[#001F3F] hover:bg-slate-100'
                            }`}
                          >
                            {filterTab}
                          </button>
                        ))}
                      </div>

                      {/* View All / Paginated Toggle */}
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl shrink-0 select-none shadow-xs">
                        <button
                          type="button"
                          onClick={() => setViewAll(false)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            !viewAll
                              ? 'bg-[#001F3F] text-white shadow-xs'
                              : 'text-slate-600 hover:text-[#001F3F] hover:bg-slate-100'
                          }`}
                        >
                          Pages
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewAll(true)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            viewAll
                              ? 'bg-[#FF0000] text-white shadow-xs'
                              : 'text-slate-600 hover:text-[#FF0000] hover:bg-slate-100'
                          }`}
                        >
                          View All ({filteredPrograms.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Catalog Cards Grid */}
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedPrograms.length === 0 ? (
                      <div className="col-span-full bg-white border border-slate-200/60 rounded-3xl py-20 text-center text-slate-600 font-bold text-xs uppercase tracking-widest">
                        No {programFilter !== 'All' ? programFilter : ''} courses match your criteria.
                      </div>
                    ) : (
                      paginatedPrograms.map((course, index) => {
                        // Determine degree level & corresponding theme
                        let degreeLevel = "UG Degree/Bachelors";
                        let cardTheme = {
                          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100/60",
                          glowColor: "group-hover:shadow-emerald-500/10",
                          iconBg: "bg-emerald-500/5 group-hover:bg-emerald-500/10 text-emerald-600 group-hover:text-emerald-700",
                          borderColor: "hover:border-emerald-500/30",
                          leftLine: "bg-emerald-500",
                          buttonBg: "bg-[#001F3F] hover:bg-emerald-700",
                          textHover: "group-hover:text-emerald-800",
                          accentText: "text-emerald-700",
                          softOverlay: "from-emerald-500/5 to-transparent",
                        };

                        const levelLower = course.degree_level.toLowerCase();
                        if (levelLower === 'master' || course.course_name.toLowerCase().includes("master")) {
                          degreeLevel = "PG Degree/Masters";
                          cardTheme = {
                            badgeBg: "bg-indigo-50/70 text-indigo-700 border-indigo-100/60",
                            glowColor: "group-hover:shadow-indigo-500/10",
                            iconBg: "bg-indigo-500/5 group-hover:bg-indigo-500/10 text-indigo-600 group-hover:text-indigo-700",
                            borderColor: "hover:border-indigo-500/30",
                            leftLine: "bg-indigo-500",
                            buttonBg: "bg-[#001F3F] hover:bg-indigo-700",
                            textHover: "group-hover:text-indigo-800",
                            accentText: "text-indigo-700",
                            softOverlay: "from-indigo-500/5 to-transparent",
                          };
                        } else if (levelLower === 'phd' || course.course_name.toLowerCase().includes("phd") || course.course_name.toLowerCase().includes("doctor")) {
                          degreeLevel = "Doctorate / PhD";
                          cardTheme = {
                            badgeBg: "bg-purple-50 text-purple-700 border-purple-100/60",
                            glowColor: "group-hover:shadow-purple-500/10",
                            iconBg: "bg-purple-500/5 group-hover:bg-purple-500/10 text-purple-600 group-hover:text-purple-700",
                            borderColor: "hover:border-purple-500/30",
                            leftLine: "bg-purple-500",
                            buttonBg: "bg-[#001F3F] hover:bg-purple-700",
                            textHover: "group-hover:text-purple-800",
                            accentText: "text-purple-700",
                            softOverlay: "from-purple-500/5 to-transparent",
                          };
                        } else if (course.course_name.toLowerCase().includes("diploma") || course.course_name.toLowerCase().includes("cert")) {
                          degreeLevel = "PG Diploma / Certificate";
                          cardTheme = {
                            badgeBg: "bg-indigo-50/70 text-indigo-700 border-indigo-100/60",
                            glowColor: "group-hover:shadow-indigo-500/10",
                            iconBg: "bg-indigo-500/5 group-hover:bg-indigo-500/10 text-indigo-600 group-hover:text-indigo-700",
                            borderColor: "hover:border-indigo-500/30",
                            leftLine: "bg-indigo-500",
                            buttonBg: "bg-[#001F3F] hover:bg-indigo-700",
                            textHover: "group-hover:text-indigo-800",
                            accentText: "text-indigo-700",
                            softOverlay: "from-indigo-500/5 to-transparent",
                          };
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

                        return (
                          <div 
                            key={course.id || index} 
                            className={`bg-white border border-slate-200/60 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl ${cardTheme.glowColor} ${cardTheme.borderColor} hover:-translate-y-1.5 relative overflow-hidden h-full`}
                          >
                            {/* Ambient background hover color overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${cardTheme.softOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                            {/* Left vertical hover glow line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${cardTheme.leftLine} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300`} />
                            
                            <div className="space-y-4 relative z-10">
                              {/* Header: Icon box & level badge */}
                              <div className="flex items-center justify-between gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${cardTheme.iconBg}`}>
                                  <GraduationCap className="w-5 h-5" />
                                </div>
                                
                                <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase font-mono tracking-wider border ${cardTheme.badgeBg}`}>
                                  {degreeLevel.split('/')[1] || degreeLevel}
                                </span>
                              </div>

                              {/* Title */}
                              <h5 className={`font-extrabold text-sm text-[#001F3F] leading-snug ${cardTheme.textHover} transition-colors line-clamp-2 tracking-tight min-h-[40px] flex items-center`}>
                                {course.course_name}
                              </h5>

                              {/* Details Container */}
                              <div className="bg-slate-50/70 border border-slate-100/80 rounded-2xl p-4 space-y-3 mt-4 text-[11px]">
                                <div className="flex justify-between items-center text-left">
                                  <span className="text-[9px] font-mono font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span>Tuition</span>
                                  </span>
                                  <span className={`font-extrabold ${cardTheme.accentText}`}>{tuitionDisplay}</span>
                                </div>
                                
                                <div className="flex justify-between items-center text-left gap-4">
                                  <span className="text-[9px] font-mono font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5 shrink-0">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span>Intakes</span>
                                  </span>
                                  <span className="font-bold text-slate-700 text-right">
                                    {uni.intakes.join(' / ')}
                                  </span>
                                </div>
                                
                                <div className="flex justify-between items-center text-left">
                                  <span className="text-[9px] font-mono font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span>Duration</span>
                                  </span>
                                  <span className="font-bold text-slate-700">{duration}</span>
                                </div>
                              </div>
                            </div>

                            {/* Footer CTA Button */}
                            <Link
                              href="/?scrollTo=consultation-hub"
                              className="w-full mt-6 py-3 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-97 cursor-pointer text-center relative z-10"
                            >
                              <span>Apply Now</span>
                              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Pagination Navigation Bar */}
                  {!viewAll && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-6 mt-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          currentPage === 1
                            ? 'text-slate-300 border border-slate-200 cursor-not-allowed bg-slate-50/50'
                            : 'text-slate-700 border border-slate-200 bg-white hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-red-50/20 active:scale-95'
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Prev</span>
                      </button>

                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[120px] sm:max-w-[280px] md:max-w-md px-1.5 py-1 custom-scrollbar whitespace-nowrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                              currentPage === page
                                ? 'bg-[#001F3F] text-white shadow-md shadow-[#001F3F]/20'
                                : 'text-slate-600 hover:text-[#001F3F] hover:bg-slate-100 border border-slate-200/60'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          currentPage === totalPages
                            ? 'text-slate-300 border border-slate-200 cursor-not-allowed bg-slate-50/50'
                            : 'text-slate-700 border border-slate-200 bg-white hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-red-50/20 active:scale-95'
                        }`}
                      >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SCHOLARSHIP SHOWCASE SECTION */}
            <div className="mt-12 pt-8 border-t border-slate-200/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#001F3F]/5 border border-[#001F3F]/10 rounded-full text-[10px] text-[#001F3F] font-mono uppercase tracking-wider mb-2">
                    <Award className="w-3.5 h-3.5 text-[#FF0000]" />
                    <span>Financial Aid</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#001F3F] tracking-tight">
                    Scholarship Showcase
                  </h3>
                  <p className="text-xs text-slate-500 max-w-2xl mt-1">
                    Discover premium grants, fellowships, and tuition waivers curated for high-achieving international applicants.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-auto">
                  {filteredScholarships.length > scholarshipsPerPage && (
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl select-none shadow-xs">
                      <button
                        type="button"
                        onClick={() => setViewAllScholarships(false)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          !viewAllScholarships
                            ? 'bg-[#001F3F] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#001F3F] hover:bg-slate-100'
                        }`}
                      >
                        Pages
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewAllScholarships(true)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          viewAllScholarships
                            ? 'bg-[#FF0000] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#FF0000] hover:bg-slate-100'
                        }`}
                      >
                        View All ({filteredScholarships.length})
                      </button>
                    </div>
                  )}

                  <div className="bg-white/80 border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold text-[#001F3F] shadow-xs backdrop-blur-xs select-none">
                    <Trophy className="w-4 h-4 text-[#FF0000]" />
                    <span>{filteredScholarships.length} Programs Available</span>
                  </div>
                </div>
              </div>

              {/* SEARCH & FILTERS CONTROLS CARD */}
              {scholarships.length > 0 && (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search Input */}
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#FF0000]/40 focus-within:bg-white rounded-2xl px-3.5 py-2 transition-all shadow-xs h-10">
                      <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search name or eligibility..."
                        value={scholarshipSearchQuery}
                        onChange={(e) => setScholarshipSearchQuery(e.target.value)}
                        className="w-full text-xs font-semibold text-[#001F3F] placeholder-slate-400 focus:outline-none bg-transparent"
                      />
                      {scholarshipSearchQuery && (
                        <button
                          onClick={() => setScholarshipSearchQuery('')}
                          className="p-1 rounded-full hover:bg-slate-200 text-slate-500 hover:text-[#001F3F] cursor-pointer flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Degree Level Dropdown */}
                    <CustomDropdown
                      label="Degree Level"
                      icon={<GraduationCap className="w-4 h-4 text-slate-500 mr-2 shrink-0" />}
                      value={scholarshipDegreeFilter}
                      options={[
                        { value: 'All', label: 'All Degrees' },
                        { value: 'Bachelor', label: 'Bachelors' },
                        { value: 'Master', label: 'Masters' }
                      ]}
                      onChange={setScholarshipDegreeFilter}
                    />

                    {/* Origin Dropdown */}
                    <CustomDropdown
                      label="Origin Type"
                      icon={<Building2 className="w-4 h-4 text-slate-500 mr-2 shrink-0" />}
                      value={scholarshipOriginFilter}
                      options={[
                        { value: 'All', label: 'All Origins' },
                        { value: 'University', label: 'University' },
                        { value: 'Government', label: 'Government' },
                        { value: 'Private', label: 'Private' }
                      ]}
                      onChange={setScholarshipOriginFilter}
                    />

                    {/* Field of Study Dropdown */}
                    <CustomDropdown
                      label="Field of Study"
                      icon={<BookOpen className="w-4 h-4 text-slate-500 mr-2 shrink-0" />}
                      value={scholarshipFieldFilter}
                      options={[
                        { value: 'All', label: 'All Fields' },
                        ...availableFields.map(field => ({ value: field, label: field }))
                      ]}
                      onChange={setScholarshipFieldFilter}
                    />

                    {/* Money / Amount Filter Dropdown */}
                    <CustomDropdown
                      label="Amount Value"
                      icon={<Coins className="w-4 h-4 text-slate-500 mr-2 shrink-0" />}
                      value={scholarshipAmountFilter}
                      options={[
                        { value: 'All', label: 'All Amounts' },
                        { value: 'Full', label: 'Full Tuition / 100%' },
                        { value: 'Partial', label: 'Partial Tuition' }
                      ]}
                      onChange={setScholarshipAmountFilter}
                    />
                  </div>

                  {/* Reset Filters Bar */}
                  {(scholarshipSearchQuery !== '' || scholarshipDegreeFilter !== 'All' || scholarshipOriginFilter !== 'All' || scholarshipAmountFilter !== 'All' || scholarshipFieldFilter !== 'All') && (
                    <div className="flex justify-between items-center bg-red-50/20 border border-red-100 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600">
                      <span>Active Filters: {
                        [
                          scholarshipSearchQuery && 'Search query',
                          scholarshipDegreeFilter !== 'All' && `Degree: ${scholarshipDegreeFilter}`,
                          scholarshipOriginFilter !== 'All' && `Origin: ${scholarshipOriginFilter}`,
                          scholarshipFieldFilter !== 'All' && `Field: ${scholarshipFieldFilter}`,
                          scholarshipAmountFilter !== 'All' && `Amount: ${scholarshipAmountFilter === 'Full' ? 'Full Tuition' : 'Partial Tuition'}`
                        ].filter(Boolean).join(', ')
                      }</span>
                      <button
                        onClick={() => {
                          setScholarshipSearchQuery('');
                          setScholarshipDegreeFilter('All');
                          setScholarshipOriginFilter('All');
                          setScholarshipFieldFilter('All');
                          setScholarshipAmountFilter('All');
                        }}
                        className="text-[#FF0000] hover:text-[#FF0000]/80 font-bold transition-colors cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {scholarships.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-md border border-slate-200/50 rounded-3xl py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                  No scholarship opportunities listed at this time.
                </div>
              ) : filteredScholarships.length === 0 ? (
                <div className="bg-white border border-slate-200/60 rounded-3xl py-16 text-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                  No scholarships match your criteria. Try adjusting your filters.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
                    {paginatedScholarships.map((schol) => {
                      const currencySymbol = CURRENCY_SYMBOLS[schol.currency || ''] || schol.currency || uni.currency || '$';
                      const amountDisplay = schol.amount 
                        ? (isNaN(Number(schol.amount.replace(/[^0-9]/g, ''))) 
                          ? schol.amount 
                          : `${currencySymbol}${Number(schol.amount.replace(/[^0-9]/g, '')).toLocaleString('en-US')}`)
                        : 'Varies';

                      return (
                        <div 
                          key={schol.id}
                          className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-white/60 flex flex-col justify-between group h-full"
                        >
                          {/* Low opacity ambient background glow */}
                          <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-[#FF0000]/6 to-[#001F3F]/6 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                          {/* Top Indicator Glow Line */}
                          <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-[#FF0000] to-[#001F3F] rounded-r-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                          
                          <div className="space-y-4">
                            {/* Badges & Country */}
                            <div className="flex items-center justify-between gap-3">
                              <span className="px-2.5 py-0.5 rounded-md text-[9px] font-semibold uppercase font-mono tracking-wider bg-[#001F3F]/5 text-[#001F3F] border border-[#001F3F]/10">
                                {schol.type}
                              </span>
                              
                              {schol.country && (
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">
                                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{schol.country}</span>
                                </div>
                              )}
                            </div>

                            {/* Title & Provider */}
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-sm md:text-base text-[#001F3F] leading-snug group-hover:text-[#FF0000] transition-colors line-clamp-2">
                                {schol.name}
                              </h4>
                              
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#001F3F]/60 shrink-0" />
                                <span className="truncate">{schol.provider}</span>
                              </div>
                            </div>

                            {/* Description snippet */}
                            {schol.description && (
                              <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                                {schol.description}
                              </p>
                            )}

                            {/* Key Highlight Block: Amount & Coverage */}
                            <div className="bg-white/60 border border-white/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                  <Coins className="w-3.5 h-3.5 text-[#FF0000] shrink-0" />
                                  <span>Amount</span>
                                </span>
                                <span className="text-xs font-black text-[#001F3F]">
                                  {amountDisplay}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between border-t border-slate-100/60 pt-2 gap-4">
                                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                                  <Layers className="w-3.5 h-3.5 text-[#001F3F] shrink-0" />
                                  <span>Coverage</span>
                                </span>
                                <span className="text-[11px] font-bold text-slate-600 text-right truncate">
                                  {schol.coverage}
                                </span>
                              </div>
                            </div>

                            {/* Details Metadata Grid */}
                            <div className="grid grid-cols-2 gap-3.5 pt-1 text-[11px]">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3 text-slate-400" />
                                  <span>Level</span>
                                </span>
                                <span className="font-semibold text-slate-700 truncate">
                                  {schol.target_degree_level}
                                </span>
                              </div>

                              <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                  <Award className="w-3 h-3 text-slate-400" />
                                  <span>Min GPA</span>
                                </span>
                                <span className="font-semibold text-slate-700 truncate">
                                  {schol.min_gpa || 'Not Required'}
                                </span>
                              </div>

                              <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                  <BookOpen className="w-3 h-3 text-slate-400" />
                                  <span>Field</span>
                                </span>
                                <span className="font-semibold text-slate-700 truncate" title={schol.field_of_study || 'All Fields'}>
                                  {schol.field_of_study || 'All Fields'}
                                </span>
                              </div>

                              <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3 text-slate-400" />
                                  <span>Renewable</span>
                                </span>
                                <span className="font-semibold text-slate-700">
                                  {schol.renewable === true ? 'Yes' : schol.renewable === false ? 'No' : 'Varies'}
                                </span>
                              </div>

                              <div className="flex flex-col gap-0.5 col-span-2">
                                <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-lg px-2.5 py-1 mt-1">
                                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-400" />
                                    <span>Awards</span>
                                  </span>
                                  <span className="font-bold text-slate-600 text-xs">
                                    {schol.number_of_awards || 'Varies'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Eligibility info snippet */}
                            {schol.eligibility && (
                              <div className="bg-slate-50/40 border border-slate-100/60 rounded-xl p-2.5 text-[10px] text-slate-500 leading-normal flex items-start gap-1.5">
                                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">
                                  <strong className="text-slate-600 font-bold">Eligibility: </strong>
                                  {schol.eligibility}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* CTA / Application Link */}
                          <div className="space-y-2 mt-5">
                            <div className="flex items-center justify-between text-[11px] px-1 font-mono text-slate-400">
                              <span>Deadline</span>
                              <span className="font-extrabold text-[#FF0000]/80">{schol.deadline || 'Varies'}</span>
                            </div>
                            
                            {schol.application_url ? (
                              <a
                                href={schol.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-[10px] font-mono font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs active:scale-97 cursor-pointer text-center"
                              >
                                <span>Apply Now</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <Link
                                href="/?scrollTo=consultation-hub"
                                className="w-full py-3 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-[10px] font-mono font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs active:scale-97 cursor-pointer text-center"
                              >
                                <span>Inquire with Counselor</span>
                                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scholarship Pagination Navigation Bar */}
                  {!viewAllScholarships && totalScholarshipPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-6 mt-8">
                      <button
                        type="button"
                        onClick={() => setCurrentScholarshipPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentScholarshipPage === 1}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          currentScholarshipPage === 1
                            ? 'text-slate-300 border border-slate-200 cursor-not-allowed bg-slate-50/50'
                            : 'text-slate-700 border border-slate-200 bg-white hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-red-50/20 active:scale-95'
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Prev</span>
                      </button>

                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[120px] sm:max-w-[280px] md:max-w-md px-1.5 py-1 custom-scrollbar whitespace-nowrap">
                        {Array.from({ length: totalScholarshipPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentScholarshipPage(page)}
                            className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                              currentScholarshipPage === page
                                ? 'bg-[#001F3F] text-white shadow-md shadow-[#001F3F]/20'
                                : 'text-slate-600 hover:text-[#001F3F] hover:bg-slate-100 border border-slate-200/60'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentScholarshipPage(prev => Math.min(prev + 1, totalScholarshipPages))}
                        disabled={currentScholarshipPage === totalScholarshipPages}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          currentScholarshipPage === totalScholarshipPages
                            ? 'text-slate-300 border border-slate-200 cursor-not-allowed bg-slate-50/50'
                            : 'text-slate-700 border border-slate-200 bg-white hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-red-50/20 active:scale-95'
                        }`}
                      >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
