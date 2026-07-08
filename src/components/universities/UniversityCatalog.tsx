'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  X 
} from 'lucide-react';

import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import UniversityCard from './UniversityCard';
import UniversityFilters from './UniversityFilters';
import DetailsModal from './DetailsModal';
import EligibilityModal from './EligibilityModal';

import { DetailedUniversity, ApiCourse } from '../../lib/types';
import { fetchUniversities, fetchUniversityCourses, fetchCourseAutocomplete, mapApiToDetailedUniversity } from '../../lib/api';
import { COMMON_COURSES, CURRENCY_SYMBOLS, FEATURED_UNIVERSITIES_FALLBACK } from '../../lib/constants';

interface UniversityCatalogProps {
  initialUniversities?: DetailedUniversity[];
  initialTotal?: number;
}

const isArrayEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
};

const CardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between overflow-hidden relative animate-pulse select-none min-h-[400px]">
    {/* Image section skeleton */}
    <div className="relative h-44 bg-slate-100 w-full overflow-hidden shrink-0 flex items-center justify-center">
      <div className="w-12 h-12 bg-slate-200/70 rounded-full" />
    </div>
    
    {/* Content details section skeleton */}
    <div className="p-6.5 flex-1 flex flex-col justify-between relative pt-8.5 space-y-4">
      <div className="space-y-2">
        {/* Title */}
        <div className="h-5 bg-slate-200/80 rounded-xl w-5/6" />
        <div className="h-5 bg-slate-200/80 rounded-xl w-3/5" />
      </div>
      
      {/* Location */}
      <div className="h-3.5 bg-slate-200/60 rounded-xl w-2/5" />
      
      {/* Key stats row */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="h-10 bg-slate-50 rounded-xl border border-slate-200/40" />
        <div className="h-10 bg-slate-50 rounded-xl border border-slate-200/40" />
        <div className="h-10 bg-slate-50 rounded-xl border border-slate-200/40" />
      </div>
      
      {/* Button */}
      <div className="h-12 bg-slate-200/80 rounded-xl w-full mt-4" />
    </div>
  </div>
);

export default function UniversityCatalog({ initialUniversities, initialTotal }: UniversityCatalogProps) {
  const paginationRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);
  
  // Active Filter States (applied to the main list)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedIntakes, setSelectedIntakes] = useState<string[]>([]);
  const [selectedDegreeLevels, setSelectedDegreeLevels] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [feeRange, setFeeRange] = useState<string>('All');
  const [minRanking, setMinRanking] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('rank'); // rank, courseCount, tuitionAsc, acceptanceDesc

  // Pending Filter States (temporary changes in sidebar)
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  const [pendingSelectedCountries, setPendingSelectedCountries] = useState<string[]>([]);
  const [pendingSelectedIntakes, setPendingSelectedIntakes] = useState<string[]>([]);
  const [pendingSelectedDegreeLevels, setPendingSelectedDegreeLevels] = useState<string[]>([]);
  const [pendingSelectedCourseTypes, setPendingSelectedCourseTypes] = useState<string[]>([]);
  const [pendingSelectedCourse, setPendingSelectedCourse] = useState<string>('');
  const [pendingCourseInput, setPendingCourseInput] = useState('');
  const [pendingFeeRange, setPendingFeeRange] = useState<string>('All');
  const [pendingMinRanking, setPendingMinRanking] = useState<string>('All');
  const [pendingIsCourseDropdownOpen, setPendingIsCourseDropdownOpen] = useState(false);

  // Layout UI State
  const [activeDropdown, setActiveDropdown] = useState<'destination' | 'intake' | 'type' | 'level' | 'program' | 'fees' | 'ranking' | null>(null);
  
  // API State
  const [universities, setUniversities] = useState<DetailedUniversity[]>(() =>
    initialUniversities || FEATURED_UNIVERSITIES_FALLBACK.map(mapApiToDetailedUniversity)
  );
  const [totalResults, setTotalResults] = useState(initialTotal ?? FEATURED_UNIVERSITIES_FALLBACK.length);
  const [totalPages, setTotalPages] = useState(() => {
    const total = initialTotal ?? FEATURED_UNIVERSITIES_FALLBACK.length;
    return Math.ceil(total / 12);
  });
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const handleRetry = useCallback(() => {
    setError(null);
    setRetryTrigger(prev => prev + 1);
  }, []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Paginated list from real database
  
  const [eligibilityUni, setEligibilityUni] = useState<DetailedUniversity | null>(null);
  const [detailsUni, setDetailsUni] = useState<DetailedUniversity | null>(null);
  const [programFilter, setProgramFilter] = useState<'All' | 'Bachelor' | 'Master'>('All');
  const [modalCourses, setModalCourses] = useState<ApiCourse[]>([]);
  const [modalCoursesLoading, setModalCoursesLoading] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  
  // Mobile Filter Sidebar Overlay State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounced course options fetching
  useEffect(() => {
    if (pendingCourseInput.trim().length === 0) {
      setCourseOptions(COMMON_COURSES);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await fetchCourseAutocomplete(pendingCourseInput);
        setCourseOptions(results);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pendingCourseInput]);

  // Eligibility Form Multi-step State
  const [eligibilityStep, setEligibilityStep] = useState(1);
  const [eligibilityData, setEligibilityData] = useState({
    courseLevel: 'master',
    targetIntake: 'September 2027',
    gpa: '',
    englishTest: 'IELTS',
    englishScore: '',
    name: '',
    email: '',
    phone: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [eligibilityMatchScore, setEligibilityMatchScore] = useState(0);
  const [eligibilityMessage, setEligibilityMessage] = useState('');

  // Sync scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Center the active page button in the scrollable pagination container
  useEffect(() => {
    if (paginationRef.current) {
      const container = paginationRef.current;
      const activeBtn = container.querySelector('[data-active="true"]');
      if (activeBtn) {
        const containerWidth = container.offsetWidth;
        const buttonLeft = (activeBtn as HTMLElement).offsetLeft;
        const buttonWidth = (activeBtn as HTMLElement).offsetWidth;
        container.scrollTo({
          left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentPage]);

  // Handle individual filter toggle in pending states
  const toggleCountry = useCallback((country: string) => {
    setPendingSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  }, []);

  const toggleIntake = useCallback((intake: string) => {
    setPendingSelectedIntakes(prev => 
      prev.includes(intake) ? prev.filter(i => i !== intake) : [...prev, intake]
    );
  }, []);

  const toggleDegreeLevel = useCallback((level: string) => {
    setPendingSelectedDegreeLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  }, []);

  const toggleCourseType = useCallback((type: string) => {
    setPendingSelectedCourseTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  const handleApplyFilters = useCallback(() => {
    const willHaveFilters = pendingSearchQuery.trim() !== '' || 
      pendingSelectedCountries.length > 0 || 
      pendingSelectedIntakes.length > 0 || 
      pendingSelectedDegreeLevels.length > 0 || 
      pendingSelectedCourseTypes.length > 0 || 
      pendingSelectedCourse !== '' || 
      pendingFeeRange !== 'All' || 
      pendingMinRanking !== 'All';
      
    setIsFeatured(!willHaveFilters);
    setSearchQuery(pendingSearchQuery);
    setSelectedCountries(pendingSelectedCountries);
    setSelectedIntakes(pendingSelectedIntakes);
    setSelectedDegreeLevels(pendingSelectedDegreeLevels);
    setSelectedCourseTypes(pendingSelectedCourseTypes);
    setSelectedCourse(pendingSelectedCourse);
    setFeeRange(pendingFeeRange);
    setMinRanking(pendingMinRanking);
    setCurrentPage(1);
    setActiveDropdown(null);
  }, [
    pendingSearchQuery,
    pendingSelectedCountries,
    pendingSelectedIntakes,
    pendingSelectedDegreeLevels,
    pendingSelectedCourseTypes,
    pendingSelectedCourse,
    pendingFeeRange,
    pendingMinRanking
  ]);

  const handleResetFilters = useCallback(() => {
    setIsFeatured(true);
    setSearchQuery('');
    setSelectedCountries([]);
    setSelectedIntakes([]);
    setSelectedDegreeLevels([]);
    setSelectedCourseTypes([]);
    setSelectedCourse('');
    setFeeRange('All');
    setMinRanking('All');
    setSortBy('rank');

    setPendingSearchQuery('');
    setPendingSelectedCountries([]);
    setPendingSelectedIntakes([]);
    setPendingSelectedDegreeLevels([]);
    setPendingSelectedCourseTypes([]);
    setPendingSelectedCourse('');
    setPendingCourseInput('');
    setPendingFeeRange('All');
    setPendingMinRanking('All');

    setCurrentPage(1);
    setActiveDropdown(null);
  }, []);

  // Remove specific active filter tag
  const removeFilterTag = useCallback((type: string, value: string) => {
    let nextSearchQuery = searchQuery;
    let nextSelectedCountries = selectedCountries;
    let nextSelectedIntakes = selectedIntakes;
    let nextSelectedDegreeLevels = selectedDegreeLevels;
    let nextSelectedCourseTypes = selectedCourseTypes;
    let nextSelectedCourse = selectedCourse;
    let nextFeeRange = feeRange;
    let nextMinRanking = minRanking;

    if (type === 'country') {
      nextSelectedCountries = selectedCountries.filter(c => c !== value);
      setSelectedCountries(nextSelectedCountries);
      setPendingSelectedCountries(prev => prev.filter(c => c !== value));
    }
    if (type === 'intake') {
      nextSelectedIntakes = selectedIntakes.filter(i => i !== value);
      setSelectedIntakes(nextSelectedIntakes);
      setPendingSelectedIntakes(prev => prev.filter(i => i !== value));
    }
    if (type === 'degree') {
      nextSelectedDegreeLevels = selectedDegreeLevels.filter(d => d !== value);
      setSelectedDegreeLevels(nextSelectedDegreeLevels);
      setPendingSelectedDegreeLevels(prev => prev.filter(d => d !== value));
    }
    if (type === 'courseType') {
      nextSelectedCourseTypes = selectedCourseTypes.filter(t => t !== value);
      setSelectedCourseTypes(nextSelectedCourseTypes);
      setPendingSelectedCourseTypes(prev => prev.filter(t => t !== value));
    }
    if (type === 'course') {
      nextSelectedCourse = '';
      setSelectedCourse('');
      setPendingSelectedCourse('');
      setPendingCourseInput('');
    }
    if (type === 'fee') {
      nextFeeRange = 'All';
      setFeeRange('All');
      setPendingFeeRange('All');
    }
    if (type === 'rank') {
      nextMinRanking = 'All';
      setMinRanking('All');
      setPendingMinRanking('All');
    }
    if (type === 'search') {
      nextSearchQuery = '';
      setSearchQuery('');
      setPendingSearchQuery('');
    }

    const hasFiltersLeft = nextSearchQuery !== '' ||
      nextSelectedCountries.length > 0 ||
      nextSelectedIntakes.length > 0 ||
      nextSelectedDegreeLevels.length > 0 ||
      nextSelectedCourseTypes.length > 0 ||
      nextSelectedCourse !== '' ||
      nextFeeRange !== 'All' ||
      nextMinRanking !== 'All';

    setIsFeatured(!hasFiltersLeft);
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCountries,
    selectedIntakes,
    selectedDegreeLevels,
    selectedCourseTypes,
    selectedCourse,
    feeRange,
    minRanking
  ]);

  // Check if any filter is active in applied states
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || 
      selectedCountries.length > 0 || 
      selectedIntakes.length > 0 || 
      selectedDegreeLevels.length > 0 || 
      selectedCourseTypes.length > 0 || 
      selectedCourse !== '' || 
      feeRange !== 'All' || 
      minRanking !== 'All';
  }, [searchQuery, selectedCountries, selectedIntakes, selectedDegreeLevels, selectedCourseTypes, selectedCourse, feeRange, minRanking]);

  // Check if there are changes made in the sidebar filters that haven't been applied yet
  const hasUnappliedChanges = useMemo(() => {
    return pendingSearchQuery !== searchQuery ||
      !isArrayEqual(pendingSelectedCountries, selectedCountries) ||
      !isArrayEqual(pendingSelectedIntakes, selectedIntakes) ||
      !isArrayEqual(pendingSelectedDegreeLevels, selectedDegreeLevels) ||
      !isArrayEqual(pendingSelectedCourseTypes, selectedCourseTypes) ||
      pendingSelectedCourse !== selectedCourse ||
      pendingFeeRange !== feeRange ||
      pendingMinRanking !== minRanking;
  }, [
    pendingSearchQuery, searchQuery,
    pendingSelectedCountries, selectedCountries,
    pendingSelectedIntakes, selectedIntakes,
    pendingSelectedDegreeLevels, selectedDegreeLevels,
    pendingSelectedCourseTypes, selectedCourseTypes,
    pendingSelectedCourse, selectedCourse,
    pendingFeeRange, feeRange,
    pendingMinRanking, minRanking
  ]);

  // Debounced effect to fetch pending count for sidebar button badge
  useEffect(() => {
    if (!hasUnappliedChanges) {
      setPendingCount(totalResults);
      return;
    }

    const timer = setTimeout(async () => {
      const mappedCountries = pendingSelectedCountries.map(c => 
        c === 'UK' ? 'United Kingdom' : c === 'USA' ? 'United States' : c
      );
      
      const mappedDegrees = pendingSelectedDegreeLevels
        .map(d => {
          if (d === "Bachelor's") return "Bachelor";
          if (d === "Master's") return "Master";
          if (d === "PhD") return "PhD";
          return "";
        })
        .filter(Boolean);

      const hasPendingFilters = pendingSearchQuery.trim() !== '' || 
        pendingSelectedCountries.length > 0 || 
        pendingSelectedIntakes.length > 0 || 
        pendingSelectedDegreeLevels.length > 0 || 
        pendingSelectedCourseTypes.length > 0 || 
        pendingSelectedCourse !== '' || 
        pendingFeeRange !== 'All' || 
        pendingMinRanking !== 'All';

      const params = {
        search: pendingSearchQuery || undefined,
        countries: mappedCountries.length > 0 ? mappedCountries.join(',') : undefined,
        degree_levels: mappedDegrees.length > 0 ? mappedDegrees.join(',') : undefined,
        course_search: pendingSelectedCourse || undefined,
        course_types: pendingSelectedCourseTypes.length > 0 ? pendingSelectedCourseTypes.join(',') : undefined,
        fee_range: pendingFeeRange !== 'All' ? pendingFeeRange : undefined,
        min_ranking: pendingMinRanking !== 'All' ? pendingMinRanking : undefined,
        page: 1,
        page_size: 1,
        featured: (!hasPendingFilters && sortBy === 'rank') ? true : undefined,
      };

      try {
        const data = await fetchUniversities(params);
        setPendingCount(data.total);
      } catch (err) {
        console.error("Pending count fetch error:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    pendingSearchQuery,
    pendingSelectedCountries,
    pendingSelectedIntakes,
    pendingSelectedDegreeLevels,
    pendingSelectedCourseTypes,
    pendingSelectedCourse,
    pendingFeeRange,
    pendingMinRanking,
    sortBy,
    hasUnappliedChanges,
    totalResults
  ]);

  // Load universities when applied filters or page changes
  useEffect(() => {
    if (isFirstMount.current && initialUniversities) {
      isFirstMount.current = false;
      return;
    }
    const loadData = async () => {
      setLoading(true);
      try {
        const mappedCountries = selectedCountries.map(c => 
          c === 'UK' ? 'United Kingdom' : c === 'USA' ? 'United States' : c
        );
        
        const mappedDegrees = selectedDegreeLevels
          .map(d => {
            if (d === "Bachelor's") return "Bachelor";
            if (d === "Master's") return "Master";
            if (d === "PhD") return "PhD";
            return "";
          })
          .filter(Boolean);

        const params = {
          search: searchQuery || undefined,
          countries: mappedCountries.length > 0 ? mappedCountries.join(',') : undefined,
          degree_levels: mappedDegrees.length > 0 ? mappedDegrees.join(',') : undefined,
          course_search: selectedCourse || undefined,
          course_types: selectedCourseTypes.length > 0 ? selectedCourseTypes.join(',') : undefined,
          fee_range: feeRange !== 'All' ? feeRange : undefined,
          min_ranking: minRanking !== 'All' ? minRanking : undefined,
          sort_by: sortBy === 'acceptanceDesc' ? 'rank' : sortBy,
          page: currentPage,
          page_size: itemsPerPage,
          featured: (isFeatured && sortBy === 'rank') ? true : undefined,
        };

        const data = await fetchUniversities(params);
        const mappedUnis = data.universities.map(mapApiToDetailedUniversity);
        
        setUniversities(mappedUnis);
        setTotalResults(data.total);
        setTotalPages(data.total_pages);
        setError(null);
      } catch (err) {
        console.error("Failed to load universities:", err);
        setError("Unable to connect to the database. Please check your internet connection or try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    searchQuery,
    selectedCountries,
    selectedDegreeLevels,
    selectedCourseTypes,
    selectedCourse,
    feeRange,
    minRanking,
    sortBy,
    currentPage,
    isFeatured,
    retryTrigger
  ]);

  // Filter programs inside the details modal dynamically based on tab + course search query
  const filteredPrograms = useMemo(() => {
    if (!detailsUni) return [];
    
    // Fallback: If modalCourses is still loading or empty, use detailsUni.programs
    const coursesToFilter = modalCourses.length > 0 
      ? modalCourses 
      : detailsUni.programs.map((name, idx) => ({
          id: idx,
          course_name: name,
          degree_level: name.toLowerCase().includes("master") ? "Master" : name.toLowerCase().includes("phd") ? "PhD" : "Bachelor",
          duration_years: 3,
          language: "English",
          tuition_fee: detailsUni.tuitionValue,
          currency: detailsUni.currency
        }));

    let result = coursesToFilter;

    // Apply degree level tab filter
    if (programFilter !== 'All') {
      result = result.filter(course => {
        const level = course.degree_level.toLowerCase();
        if (programFilter === 'Bachelor') return level === 'bachelor';
        if (programFilter === 'Master') return level === 'master' || level === 'phd';
        return true;
      });
    }

    // Apply modal search query filter
    if (modalSearchQuery.trim() !== '') {
      const q = modalSearchQuery.toLowerCase();
      result = result.filter(course => 
        course.course_name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [detailsUni, modalCourses, programFilter, modalSearchQuery]);

  // Active filter helper array for rendering tags
  const activeFilterTags = useMemo(() => {
    const tags: { type: string; value: string; label: string }[] = [];
    if (searchQuery) tags.push({ type: 'search', value: searchQuery, label: `Search: "${searchQuery}"` });
    selectedCountries.forEach(c => tags.push({ type: 'country', value: c, label: c }));
    selectedIntakes.forEach(i => tags.push({ type: 'intake', value: i, label: `${i} Intake` }));
    selectedDegreeLevels.forEach(d => tags.push({ type: 'degree', value: d, label: d }));
    selectedCourseTypes.forEach(t => tags.push({ type: 'courseType', value: t, label: t }));
    if (selectedCourse !== '') tags.push({ type: 'course', value: selectedCourse, label: `Course: ${selectedCourse}` });
    
    if (feeRange !== 'All') {
      let label = '';
      if (feeRange === 'under18k') label = 'Tuition: Under £18k/$20k';
      if (feeRange === '18kto35k') label = 'Tuition: £18k-£35k/$20k-$35k';
      if (feeRange === '35kto55k') label = 'Tuition: £35k-£55k/$35k-$55k';
      if (feeRange === 'over55k') label = 'Tuition: Over £55k/$55k';
      tags.push({ type: 'fee', value: feeRange, label });
    }

    if (minRanking !== 'All') {
      let label = '';
      if (minRanking === 'top10') label = 'QS Rank: Top 10';
      if (minRanking === 'top50') label = 'QS Rank: Top 50';
      if (minRanking === 'top100') label = 'QS Rank: Top 100';
      if (minRanking === 'top500') label = 'QS Rank: Top 500';
      tags.push({ type: 'rank', value: minRanking, label });
    }

    return tags;
  }, [searchQuery, selectedCountries, selectedIntakes, selectedDegreeLevels, selectedCourseTypes, selectedCourse, feeRange, minRanking]);

  // Modal Open Handlers
  const handleOpenEligibilityModal = useCallback((uni: DetailedUniversity) => {
    setEligibilityUni(uni);
    setEligibilityStep(1);
    setFormSuccess(false);
    setSubmissionError(false);
    setEligibilityData({
      courseLevel: 'master',
      targetIntake: uni.intakes[0] ? `${uni.intakes[0]} 2027` : 'September 2027',
      gpa: '',
      englishTest: 'IELTS',
      englishScore: '',
      name: '',
      email: '',
      phone: ''
    });
  }, []);

  const handleCloseEligibilityModal = useCallback(() => {
    setEligibilityUni(null);
  }, []);

  const handleOpenDetailsModal = useCallback(async (uni: DetailedUniversity) => {
    setDetailsUni(uni);
    setProgramFilter('All');
    setModalSearchQuery('');
    setModalCourses([]);
    setModalCoursesLoading(true);
    try {
      const data = await fetchUniversityCourses(uni.id, 1000);
      setModalCourses(data.courses);
    } catch (err) {
      console.error("Failed to load university courses:", err);
      const fallback = uni.programs.map((name, idx) => ({
        id: idx,
        course_name: name,
        degree_level: name.toLowerCase().includes("master") ? "Master" : name.toLowerCase().includes("phd") ? "PhD" : "Bachelor",
        duration_years: 3,
        language: "English",
        tuition_fee: uni.tuitionValue,
        currency: uni.currency
      }));
      setModalCourses(fallback);
    } finally {
      setModalCoursesLoading(false);
    }
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setDetailsUni(null);
    setModalCourses([]);
    setModalSearchQuery('');
  }, []);

  // Eligibility Multi-step Form Handlers
  const handleFormInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEligibilityData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNextStep = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setEligibilityStep(prev => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setEligibilityStep(prev => prev - 1);
  }, []);

  const handleEligibilitySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const gpaNum = parseFloat(eligibilityData.gpa);
    const scoreNum = parseFloat(eligibilityData.englishScore) || 0;
    
    let match = 50; 
    let msg = '';

    const is10PointScale = gpaNum > 4.0;
    if (is10PointScale) {
      if (gpaNum >= 8.5) {
        match += 30;
      } else if (gpaNum >= 7.0) {
        match += 20;
      } else {
        match += 5;
      }
    } else {
      if (gpaNum >= 3.6) {
        match += 30;
      } else if (gpaNum >= 3.0) {
        match += 20;
      } else {
        match += 5;
      }
    }

    if (eligibilityData.englishTest === 'Waived') {
      match += 15;
    } else if (eligibilityData.englishTest === 'IELTS' && scoreNum >= 6.5) {
      match += 15;
    } else if (eligibilityData.englishTest === 'TOEFL' && scoreNum >= 90) {
      match += 15;
    } else if (eligibilityData.englishTest === 'Duolingo' && scoreNum >= 115) {
      match += 15;
    }

    match = Math.min(match, 98);

    if (match >= 90) {
      msg = `Excellent Academic Fit! You have a ${match}% profile match for ${eligibilityUni?.name}. You qualify for premier scholarship schemes up to £10,000 / $15,000. Ms. Priya Sharma is assigned as your Admissions Counselor and will follow up with direct application fee waivers.`;
    } else if (match >= 75) {
      msg = `Strong Admission Potential! You have a ${match}% match for ${eligibilityUni?.name}. You fulfill the base requirements for almost all programs. We will assist you in draft development (SOP & Letters of Recommendation) to ensure approval.`;
    } else {
      msg = `Favorable Pathway Available! You have a ${match}% match. While direct admission is competitive, you qualify for integrated international year or specialized pathway programs. An advisor will contact you to lay out options.`;
    }

    setEligibilityMatchScore(match);
    setEligibilityMessage(msg);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: eligibilityData.name,
          email: eligibilityData.email,
          phone: eligibilityData.phone,
          destination: eligibilityUni?.country || 'uk',
          degree: `${eligibilityData.courseLevel} (Inquiry Match: ${match}%, GPA: ${eligibilityData.gpa}, English: ${eligibilityData.englishTest} - ${eligibilityData.englishScore || 'Waived'}, Intake: ${eligibilityData.targetIntake}, Target Uni: ${eligibilityUni?.name})`
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit admissions inquiry.');
      }
      setSubmissionError(false);
      setFormSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmissionError(true);
      setFormSuccess(true); // Show the gauge screen with error message in verification
    } finally {
      setFormLoading(false);
    }
  }, [eligibilityData, eligibilityUni]);

  return (
    <div className="relative min-h-screen bg-[#fdfdfd] text-[#001F3F] selection:bg-[#FF0000]/10 selection:text-[#001F3F] overflow-x-hidden font-sans">
      
      {/* Dynamic ambient background glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#001F3F] rounded-full mix-blend-multiply filter blur-[140px] opacity-[0.04] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-5%] w-[700px] h-[700px] bg-[#FF0000] rounded-full mix-blend-multiply filter blur-[150px] opacity-[0.03] pointer-events-none z-0" />
      
      {/* Decorative Matrix Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute left-1/12 top-0 bottom-0 w-px bg-slate-200/20" />
        <div className="absolute right-1/12 top-0 bottom-0 w-px bg-slate-200/20" />
      </div>

      <Navbar />

      {/* LUXURIOUS HERO BANNER HEADER */}
      <section className="relative pt-32 pb-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center space-y-6">
          
          <h1 className="text-4xl md:text-6xl font-black text-[#001F3F] tracking-tight leading-none">
            Find & Match Your <br className="hidden sm:inline" />
            <span className="text-[#FF0000] relative inline-block">
              Dream University With Us
              <span className="absolute -bottom-2.5 left-0 right-0 h-1 bg-[#FF0000]/20 rounded-full" />
            </span>
          </h1>
          
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Explore 150,000+ course programs across prestigious international partner campuses. Run instant eligibility evaluations, verify rankings, and lock in direct counselor advisories.
          </p>

          {/* Large Hero Search Widget */}
          <div className="max-w-xl mx-auto pt-4 relative">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#001F3F]/10 to-[#FF0000]/10 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-md focus-within:border-[#FF0000]/50 focus-within:shadow-xl transition-all duration-300 px-4 py-1.5 gap-2">
                <Search className="text-slate-400 w-5 h-5 ml-1 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by university name, country, or course program..."
                  value={pendingSearchQuery}
                  onChange={(e) => setPendingSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyFilters();
                  }}
                  className="w-full py-3.5 text-xs font-semibold text-[#001F3F] placeholder-slate-400 focus:outline-none bg-transparent"
                />
                {pendingSearchQuery && (
                  <button 
                    onClick={() => {
                      setPendingSearchQuery('');
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#001F3F] cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Extracted filters component for desktop and mobile */}
          <UniversityFilters
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            pendingSelectedCountries={pendingSelectedCountries}
            toggleCountry={toggleCountry}
            pendingSelectedIntakes={pendingSelectedIntakes}
            toggleIntake={toggleIntake}
            pendingSelectedCourseTypes={pendingSelectedCourseTypes}
            toggleCourseType={toggleCourseType}
            pendingSelectedDegreeLevels={pendingSelectedDegreeLevels}
            toggleDegreeLevel={toggleDegreeLevel}
            pendingCourseInput={pendingCourseInput}
            setPendingCourseInput={setPendingCourseInput}
            pendingSelectedCourse={pendingSelectedCourse}
            setPendingSelectedCourse={setPendingSelectedCourse}
            pendingIsCourseDropdownOpen={pendingIsCourseDropdownOpen}
            setPendingIsCourseDropdownOpen={setPendingIsCourseDropdownOpen}
            courseOptions={courseOptions}
            pendingFeeRange={pendingFeeRange}
            setPendingFeeRange={setPendingFeeRange}
            pendingMinRanking={pendingMinRanking}
            setPendingMinRanking={setPendingMinRanking}
            handleApplyFilters={handleApplyFilters}
            handleResetFilters={handleResetFilters}
            hasUnappliedChanges={hasUnappliedChanges}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            activeFilterTagsCount={activeFilterTags.length}
          />
        </div>
      </section>

      {/* 2. MAIN CATALOG DASHBOARD */}
      <section className="relative pb-24 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="w-full">
            <main className="w-full space-y-6 text-left">
              
              {/* Dynamic Header Controls Bar */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-center md:text-left shrink-0">
                    {totalResults === 0 ? (
                      <span className="text-red-500 font-mono">0 match results found</span>
                    ) : (
                      <span>
                        Found {totalResults} Universities matching criteria
                      </span>
                    )}
                  </div>

                  {!hasActiveFilters && sortBy === 'rank' && (
                    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shrink-0">
                      <button
                        onClick={() => {
                          setIsFeatured(true);
                          setCurrentPage(1);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          isFeatured 
                            ? 'bg-[#001F3F] text-white shadow-md' 
                            : 'text-slate-400 hover:text-[#001F3F]'
                        }`}
                      >
                        🌟 Featured
                      </button>
                      <button
                        onClick={() => {
                          setIsFeatured(false);
                          setCurrentPage(1);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          !isFeatured 
                            ? 'bg-[#001F3F] text-white shadow-md' 
                            : 'text-slate-400 hover:text-[#001F3F]'
                        }`}
                      >
                        All Campuses
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden px-4.5 py-3 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md w-full sm:w-auto justify-center"
                  >
                    <Filter className="w-4 h-4" />
                    <span>FILTERS ({activeFilterTags.length})</span>
                  </button>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <span className="text-xs font-extrabold text-slate-400 font-mono hidden sm:inline">SORTBY:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSortBy(val);
                        if (val !== 'rank') {
                          setIsFeatured(false);
                        }
                        setCurrentPage(1);
                      }}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 cursor-pointer bg-slate-50/50"
                    >
                      <option value="rank">QS Ranking (High to Low)</option>
                      <option value="courseCount">Courses Count (High to Low)</option>
                      <option value="tuitionAsc">Tuition Cost (Low to High)</option>
                      <option value="acceptanceDesc">Acceptance Rate (High to Low)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Tags display */}
              {activeFilterTags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mr-1.5 pl-1.5">Active Filters:</span>
                  {activeFilterTags.map(tag => (
                    <span
                      key={`${tag.type}-${tag.value}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/90 text-slate-600 rounded-xl text-xs font-bold select-none shadow-xs hover:border-[#FF0000]/30 hover:text-[#FF0000] transition-colors"
                    >
                      <span>{tag.label}</span>
                      <button
                        onClick={() => removeFilterTag(tag.type, tag.value)}
                        className="text-slate-400 hover:text-[#FF0000] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] font-extrabold text-[#FF0000] hover:text-[#001F3F] cursor-pointer ml-auto px-2 py-1 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* CATALOG GRID */}
              <div className="relative min-h-[400px]">
                {error ? (
                  <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-red-100 shadow-md max-w-lg mx-auto my-8 gap-5">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 text-[#FF0000] shadow-xs">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-extrabold text-[#001F3F]">Database Connection Offline</h4>
                      <p className="text-xs text-gray-500 font-medium max-w-sm">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="px-6 py-2.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-md active:scale-97 cursor-pointer"
                    >
                      Retry Connection
                    </button>
                  </div>
                ) : loading && universities.length === 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <CardSkeleton key={idx} />
                    ))}
                  </div>
                ) : universities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-16 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-md mx-auto my-8 gap-5">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-slate-400">
                      <Search className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-extrabold text-[#001F3F]">No Universities Found</h4>
                      <p className="text-xs text-gray-500 font-medium max-w-xs">
                        We couldn't find any campus listings matching your current filter settings. Try adjusting your search query or studies filter.
                      </p>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="px-6 py-2.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 active:scale-97 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 relative">
                    {loading && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xs flex items-center justify-center z-20 rounded-3xl animate-in fade-in duration-200">
                        <div className="flex flex-col items-center gap-3 bg-white/80 p-5 rounded-2xl shadow-lg border border-slate-100">
                          <div className="w-8 h-8 border-4 border-[#001F3F] border-t-[#FF0000] rounded-full animate-spin" />
                          <span className="text-[10px] font-mono font-bold text-[#001F3F] tracking-widest uppercase animate-pulse">Updating...</span>
                        </div>
                      </div>
                    )}
                    <AnimatePresence mode="popLayout">
                      {universities.map((uni, idx) => (
                        <UniversityCard
                          key={uni.id || uni.name}
                          uni={uni}
                          idx={idx}
                          handleOpenDetailsModal={handleOpenDetailsModal}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-sm flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-slate-400">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} results
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-350 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div 
                      ref={paginationRef}
                      className="w-[126px] sm:w-[214px] overflow-x-auto flex items-center gap-1.5 custom-scrollbar scroll-smooth px-0.5 pb-2 pt-1"
                    >
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            data-active={currentPage === pageNum}
                            className={`w-9.5 h-9.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center border shrink-0 ${
                              currentPage === pageNum
                                ? 'bg-[#001F3F] border-[#001F3F] text-white shadow-md'
                                : 'border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-350 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      </section>

      {/* 3. MODALS */}
      <AnimatePresence>
        {eligibilityUni && (
          <EligibilityModal
            eligibilityUni={eligibilityUni}
            eligibilityStep={eligibilityStep}
            eligibilityData={eligibilityData}
            formLoading={formLoading}
            formSuccess={formSuccess}
            eligibilityMatchScore={eligibilityMatchScore}
            eligibilityMessage={eligibilityMessage}
            handleCloseEligibilityModal={handleCloseEligibilityModal}
            handleFormInputChange={handleFormInputChange}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            handleEligibilitySubmit={handleEligibilitySubmit}
            submissionError={submissionError}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailsUni && (
          <DetailsModal
            detailsUni={detailsUni}
            modalCoursesLoading={modalCoursesLoading}
            filteredPrograms={filteredPrograms}
            modalSearchQuery={modalSearchQuery}
            setModalSearchQuery={setModalSearchQuery}
            programFilter={programFilter}
            setProgramFilter={setProgramFilter}
            handleCloseDetailsModal={handleCloseDetailsModal}
            currencySymbols={CURRENCY_SYMBOLS}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
