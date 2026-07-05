import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  DollarSign, 
  Award, 
  Users, 
  ChevronRight, 
  X,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Plane,
  ChevronLeft,
  ChevronDown,
  Filter,
  RotateCcw,
  BookOpen,
  Calendar,
  Sparkles,
  Info,
  Percent,
  Check,
  Building2,
  ListFilter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Flag } from '../components/Flag';
import FlyFlourishLogo from '../components/FlyFlourishLogo';
import {
  DetailedUniversity,
  fetchUniversities,
  fetchCourseAutocomplete,
  mapApiToDetailedUniversity,
  FEATURED_UNIVERSITIES_FALLBACK,
  fetchUniversityCourses,
  ApiCourse
} from '../data/universitiesData';
import { ROUTES } from '../routes';

const COMMON_COURSES = [
  "Computer Science",
  "Business Management",
  "Engineering",
  "Data Science",
  "Economics",
  "Law",
  "Medicine",
  "Finance",
  "Mechanical Engineering"
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  USD: '$',
  CAD: 'CAD $',
  AUD: 'AUD $',
  EUR: '€',
};

export default function Universities() {
  const worldTimeRef = useRef<HTMLSpanElement>(null);
  
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
  const [pendingCourseInput, setPendingCourseInput] = useState<string>('');
  const [pendingSelectedCourse, setPendingSelectedCourse] = useState<string>('');
  const [pendingIsCourseDropdownOpen, setPendingIsCourseDropdownOpen] = useState<boolean>(false);
  const [pendingFeeRange, setPendingFeeRange] = useState<string>('All');
  const [pendingMinRanking, setPendingMinRanking] = useState<string>('All');
  
  // API State
  const [universities, setUniversities] = useState<DetailedUniversity[]>(() =>
    FEATURED_UNIVERSITIES_FALLBACK.map(mapApiToDetailedUniversity)
  );
  const [totalResults, setTotalResults] = useState(FEATURED_UNIVERSITIES_FALLBACK.length);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const handleRetry = () => {
    setError(null);
    setRetryTrigger(prev => prev + 1);
  };


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
  const [eligibilityMatchScore, setEligibilityMatchScore] = useState(0);
  const [eligibilityMessage, setEligibilityMessage] = useState('');

  // Clock Update Effect (Direct DOM update to match App.tsx)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(now);
      const year = parts.find(p => p.type === 'year')?.value || '';
      const month = parts.find(p => p.type === 'month')?.value || '';
      const day = parts.find(p => p.type === 'day')?.value || '';
      const hour = parts.find(p => p.type === 'hour')?.value || '';
      const minute = parts.find(p => p.type === 'minute')?.value || '';
      const second = parts.find(p => p.type === 'second')?.value || '';

      const timeStr = `${year}-${month}-${day} ${hour}:${minute}:${second} IST`;
      if (worldTimeRef.current) {
        worldTimeRef.current.textContent = timeStr;
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle individual filter toggle in pending states
  const toggleCountry = (country: string) => {
    setPendingSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleIntake = (intake: string) => {
    setPendingSelectedIntakes(prev => 
      prev.includes(intake) ? prev.filter(i => i !== intake) : [...prev, intake]
    );
  };

  const toggleDegreeLevel = (level: string) => {
    setPendingSelectedDegreeLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleCourseType = (type: string) => {
    setPendingSelectedCourseTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
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
  };

  const handleResetFilters = () => {
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
  };

  // Remove specific active filter tag (instantly clears both active and pending filter states)
  const removeFilterTag = (type: string, value: string) => {
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
  };

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

  // Filter programs inside the details modal dynamically based on 3 filters (Bachelor, Master, All) + course search query
  const filteredPrograms = useMemo(() => {
    if (!detailsUni) return [];
    
    // Fallback: If modalCourses is still loading or empty, use detailsUni.programs as immediate fallback
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

  // Check if there are changes made in the sidebar filters that haven't been applied yet
  const hasUnappliedChanges = useMemo(() => {
    return pendingSearchQuery !== searchQuery ||
      JSON.stringify(pendingSelectedCountries.slice().sort()) !== JSON.stringify(selectedCountries.slice().sort()) ||
      JSON.stringify(pendingSelectedIntakes.slice().sort()) !== JSON.stringify(selectedIntakes.slice().sort()) ||
      JSON.stringify(pendingSelectedDegreeLevels.slice().sort()) !== JSON.stringify(selectedDegreeLevels.slice().sort()) ||
      JSON.stringify(pendingSelectedCourseTypes.slice().sort()) !== JSON.stringify(selectedCourseTypes.slice().sort()) ||
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
    selectedIntakes,
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
  const handleOpenEligibilityModal = (uni: DetailedUniversity) => {
    setEligibilityUni(uni);
    setEligibilityStep(1);
    setFormSuccess(false);
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
  };

  const handleCloseEligibilityModal = () => {
    setEligibilityUni(null);
  };

  const handleOpenDetailsModal = async (uni: DetailedUniversity) => {
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
  };

  const handleCloseDetailsModal = () => {
    setDetailsUni(null);
    setModalCourses([]);
    setModalSearchQuery('');
  };

  // Eligibility Multi-step Form Handlers
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEligibilityData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setEligibilityStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setEligibilityStep(prev => prev - 1);
  };

  const handleEligibilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    // Calculate dynamic eligibility score based on GPA and test score
    const gpaNum = parseFloat(eligibilityData.gpa);
    const scoreNum = parseFloat(eligibilityData.englishScore) || 0;
    
    let match = 50; // base score
    let msg = '';

    // Calculate match
    if (gpaNum >= 8.5 || gpaNum >= 3.6) {
      match += 30;
    } else if (gpaNum >= 7.0 || gpaNum >= 3.0) {
      match += 20;
    } else {
      match += 5;
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

    // Limit to 98%
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
      // POST enquiry to backend
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
      setFormSuccess(true);
    } catch (err) {
      console.error(err);
      // fallback to success offline anyway to keep user flow happy
      setFormSuccess(true);
    } finally {
      setFormLoading(false);
    }
  };

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

      {/* 1. HERO HEADER HEADER */}
      <section className="relative pt-36 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#001F3F]/5 border border-[#001F3F]/12 rounded-full text-xs text-[#001F3F] font-mono font-semibold shadow-xs backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-[#FF0000] animate-pulse" />
            <span>AI-POWERED GLOBAL COURSE MATCHING</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-[#001F3F] tracking-tight leading-none">
            Find & Match Your <br className="hidden sm:inline" />
            <span className="text-[#FF0000] relative inline-block">
              Dream UK & Global University
              <span className="absolute -bottom-2.5 left-0 right-0 h-1 bg-[#FF0000]/20 rounded-full" />
            </span>
          </h1>
          
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Explore 150,000+ course programs across prestigious UK and international partner campuses. Run instant eligibility evaluations, verify rankings, and lock in direct counselor advisories.
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
                  onChange={(e) => {
                    setPendingSearchQuery(e.target.value);
                  }}
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
        </div>
      </section>

      {/* 2. MAIN CATALOG DASHBOARD */}
      <section className="relative pb-24 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Main layout grid: Sidebar on left (desktop), Content on right */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* LEFT SIDEBAR FILTERS (Desktop Only) */}
            <aside className="hidden lg:block bg-white rounded-3xl p-6.5 border border-slate-100 shadow-md space-y-7 sticky top-28">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-[#001F3F]" />
                  <h3 className="font-extrabold text-[#001F3F] text-xs font-mono uppercase tracking-wider">Search Filters</h3>
                </div>
                <button
                  onClick={handleResetFilters}
                  disabled={!hasActiveFilters}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-[#FF0000] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              </div>

              {/* Country Selection */}
              <div className="space-y-3">
                <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Study Destination</label>
                <div className="space-y-2 text-left">
                  {['UK', 'USA', 'Canada', 'Australia', 'Germany'].map(country => (
                    <button
                      key={country}
                      onClick={() => toggleCountry(country)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                        pendingSelectedCountries.includes(country)
                          ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F] shadow-xs'
                          : 'border-slate-200/80 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Flag country={country} className="w-4 h-2.5 rounded" />
                        <span>{country === 'UK' ? 'United Kingdom (UK)' : country === 'USA' ? 'United States (USA)' : country}</span>
                      </div>
                      {pendingSelectedCountries.includes(country) && <Check className="w-4 h-4 text-[#001F3F] stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Intake */}
              <div className="space-y-3">
                <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Target Intake Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {['September', 'January', 'May'].map(intake => (
                    <button
                      key={intake}
                      onClick={() => toggleIntake(intake)}
                      className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold text-center transition-all duration-200 cursor-pointer ${
                        pendingSelectedIntakes.includes(intake)
                          ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                          : 'border-slate-200/80 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      {intake}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Type */}
              <div className="space-y-3">
                <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Course Type</label>
                <div className="space-y-2 text-left">
                  {['STEM', 'Business', 'Arts', 'Medicine'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleCourseType(type)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                        pendingSelectedCourseTypes.includes(type)
                          ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                          : 'border-slate-200/80 hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      <span>{type === 'STEM' ? 'STEM & Technology' : type === 'Business' ? 'Business & Management' : type === 'Arts' ? 'Arts, Humanities & Law' : 'Health & Medicine'}</span>
                      {pendingSelectedCourseTypes.includes(type) && <Check className="w-3.5 h-3.5 text-[#001F3F] stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Select Course Searchable Dropdown */}
              <div className="space-y-3 relative">
                <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Course Program</label>
                
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setPendingIsCourseDropdownOpen(false);
                        handleApplyFilters();
                      }
                    }}
                    className="w-full pl-9.5 pr-10 py-3 border border-slate-200/90 rounded-xl text-xs font-semibold text-[#001F3F] placeholder-slate-400 focus:outline-none focus:border-[#FF0000]/40 bg-slate-50/50 focus:bg-white transition-all font-medium"
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
                    <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto border border-slate-150 rounded-2xl bg-white shadow-xl z-35 p-2 space-y-1 custom-scrollbar text-left">
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

              {/* Course Level / Degree */}
              <div className="space-y-3">
                <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Course Level</label>
                <div className="space-y-2 text-left">
                  {["Bachelor's", "Master's", "PG Diploma", "PhD"].map(level => (
                    <button
                      key={level}
                      onClick={() => toggleDegreeLevel(level)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                        pendingSelectedDegreeLevels.includes(level)
                          ? 'border-[#001F3F] bg-[#001F3F]/5 text-[#001F3F]'
                          : 'border-slate-200/80 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span>{level}</span>
                      </div>
                      {pendingSelectedDegreeLevels.includes(level) && <Check className="w-3.5 h-3.5 text-[#001F3F] stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tuition Fees Range */}
              <div className="space-y-3">
                <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">Annual Tuition Fees</label>
                <select
                  value={pendingFeeRange}
                  onChange={(e) => {
                    setPendingFeeRange(e.target.value);
                  }}
                  className="w-full px-3.5 py-3 border border-slate-200/90 rounded-xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 cursor-pointer bg-slate-50/50"
                >
                  <option value="All">Show All Fees</option>
                  <option value="under18k">Under £18,000 / $20,000</option>
                  <option value="18kto35k">£18,000 - £35,000 / $20k - $35k</option>
                  <option value="35kto55k">£35,000 - £55,000 / $35k - $55k</option>
                  <option value="over55k">Over £55,000 / $55,000</option>
                </select>
              </div>

              {/* Ranking Range */}
              <div className="space-y-3">
                <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase block">QS / Global Ranking</label>
                <select
                  value={pendingMinRanking}
                  onChange={(e) => {
                    setPendingMinRanking(e.target.value);
                  }}
                  className="w-full px-3.5 py-3 border border-slate-200/90 rounded-xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 cursor-pointer bg-slate-50/50"
                >
                  <option value="All">Show All Ranks</option>
                  <option value="top10">Top 10 Global Universities</option>
                  <option value="top50">Top 50 Global Universities</option>
                  <option value="top100">Top 100 Global Universities</option>
                  <option value="top500">Top 500 Global Universities</option>
                </select>
              </div>

              {/* Desktop Apply Filters Button */}
              <div className="pt-2 border-t border-slate-100/80">
                <button
                  onClick={handleApplyFilters}
                  className={`w-full py-4 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 active:scale-97 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md ${
                    hasUnappliedChanges
                      ? 'bg-[#FF0000] hover:bg-[#FF0000]/90 hover:shadow-red-500/25 shadow-lg animate-pulse'
                      : 'bg-[#001F3F] hover:bg-[#001F3F]/90'
                  }`}
                >
                   <Filter className="w-4 h-4" />
                   <span>Apply Filters ({pendingCount})</span>
                </button>
              </div>

            </aside>

            {/* RIGHT MAIN CATALOG CONTENT AREA */}
            <main className="col-span-1 lg:col-span-3 space-y-6 text-left">
              
              {/* Dynamic Header Controls Bar */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  {/* Result count & active details */}
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 text-center md:text-left shrink-0">
                    {totalResults === 0 ? (
                      <span className="text-red-500 font-mono">0 match results found</span>
                    ) : (
                      <span>
                        Found {totalResults} Universities matching criteria
                      </span>
                    )}
                  </div>

                  {/* Featured / All Toggle Tabs */}
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
                            : 'text-slate-450 hover:text-[#001F3F]'
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
                            : 'text-slate-450 hover:text-[#001F3F]'
                        }`}
                      >
                        All Campuses
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Filter toggle button (hidden on desktop) */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden px-4.5 py-3 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md w-full sm:w-auto justify-center"
                  >
                    <Filter className="w-4 h-4" />
                    <span>FILTERS ({activeFilterTags.length})</span>
                  </button>

                  {/* Sort By Dropdown */}
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/90 text-slate-600 rounded-xl text-xs font-bold select-none shadow-2xs hover:border-[#FF0000]/30 hover:text-[#FF0000] transition-colors"
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
                {loading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-20 rounded-3xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#001F3F] border-t-[#FF0000] rounded-full animate-spin" />
                      <span className="text-xs font-mono font-bold text-[#001F3F] tracking-widest uppercase animate-pulse">Syncing catalog...</span>
                    </div>
                  </div>
                )}
                
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-red-100 shadow-md max-w-lg mx-auto my-8 gap-5"
                  >
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
                  </motion.div>
                ) : universities.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center p-16 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-md mx-auto my-8 gap-5"
                  >
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
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <AnimatePresence mode="popLayout">
                      {universities.map((uni, idx) => (
                        <motion.article
                          key={uni.id || uni.name}
                          layout
                          initial={{ opacity: 0, y: 30, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, y: 15 }}
                          transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.25) }}
                          onClick={() => handleOpenDetailsModal(uni)}
                          className="bg-white rounded-3xl border border-slate-100/90 hover:border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group cursor-pointer"
                        >
                          {/* Hover top border gradient glow */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#FF0000]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                          {/* Header image section */}
                          <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
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

                            {/* Location bottom-left overlay */}
                            <div className="absolute bottom-4 left-5 flex items-center gap-2">
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
                              <img
                                src={uni.logoUrl}
                                alt={`${uni.name} Badge`}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  // If image fails, replace with dynamic initial crest
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const placeholder = document.createElement('div');
                                    placeholder.className = "w-full h-full rounded-full bg-gradient-to-br from-[#001F3F] to-[#FF0000] flex items-center justify-center text-white text-[11px] font-black font-mono";
                                    placeholder.textContent = uni.name.split(' ').map(n => n[0]).join('').slice(0, 3);
                                    parent.appendChild(placeholder);
                                  }
                                }}
                              />
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-extrabold text-[#001F3F] text-base md:text-lg leading-snug tracking-tight hover:text-[#FF0000] transition-colors duration-250 min-h-[48px] flex items-center">
                                {uni.name}
                              </h3>

                              {/* Quick Tag Badges (Intake & courses count) */}
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
                                  <div className="flex items-center gap-2 text-slate-450">
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
                                  <div className="flex items-center gap-2 text-slate-450">
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
                                to="/"
                                state={{ scrollTo: 'consultation-hub' }}
                                className="w-full py-3.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider hover:shadow-lg active:scale-97 transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Apply Now</span>
                              </Link>
                            </div>

                          </div>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-sm flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-slate-450">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} results
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-350 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9.5 h-9.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                            currentPage === pageNum
                              ? 'bg-[#001F3F] border-[#001F3F] text-white shadow-md'
                              : 'border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-350 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all cursor-pointer disabled:cursor-not-allowed"
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

      {/* 3. MULTI-STEP ELIGIBILITY EVALUATOR MODAL */}
      <AnimatePresence>
        {eligibilityUni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001F3F]/40 backdrop-blur-md">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={handleCloseEligibilityModal} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl p-6 md:p-8 relative z-10 overflow-hidden text-left"
            >
              {/* Top luxury header accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#001F3F] via-[#FF0000] to-[#001F3F]" />
              
              {/* Close Button */}
              <button
                onClick={handleCloseEligibilityModal}
                className="absolute top-5.5 right-5.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-150 text-slate-400 hover:text-[#001F3F] transition-all cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                
                {/* Modal Title header */}
                <div>
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#FF0000] uppercase block mb-1">
                    PROFILE EVALUATION ENGINE v1.2
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-[#001F3F] leading-tight">
                    Evaluate Eligibility
                  </h3>
                  <p className="text-slate-450 text-xs mt-1">
                    Calculate your match score for <strong className="text-[#001F3F]">{eligibilityUni.name}</strong>.
                  </p>
                </div>

                {/* Progress bar steps */}
                {!formSuccess && (
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-150/50 p-1.5 rounded-2xl select-none">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-2 flex-1 rounded-lg transition-all duration-300 ${
                          eligibilityStep >= step
                            ? 'bg-[#001F3F]'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* FORM WRAPPERS */}
                <AnimatePresence mode="wait">
                  {!formSuccess ? (
                    <div className="min-h-[290px] flex flex-col justify-between">
                      
                      {/* Step 1: Course & Timing */}
                      {eligibilityStep === 1 && (
                        <motion.form
                          key="eligibility-step-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleNextStep}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-450 font-mono font-bold tracking-wider uppercase pl-2">Desired Course Level</label>
                            <select
                              name="courseLevel"
                              value={eligibilityData.courseLevel}
                              onChange={handleFormInputChange}
                              className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="bachelor">Bachelor's Degree (UG)</option>
                              <option value="master">Master's Degree (MS / MBA / PG)</option>
                              <option value="diploma">Postgraduate Diploma (PGD)</option>
                              <option value="phd">PhD / Research Doctorate</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-450 font-mono font-bold tracking-wider uppercase pl-2">Preferred Intake Period</label>
                            <select
                              name="targetIntake"
                              value={eligibilityData.targetIntake}
                              onChange={handleFormInputChange}
                              className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all cursor-pointer"
                            >
                              {eligibilityUni.intakes.map(month => (
                                <option key={month} value={`${month} 2027`}>{month} 2027</option>
                              ))}
                            </select>
                          </div>

                          <div className="pt-6">
                            <button
                              type="submit"
                              className="w-full py-4.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                            >
                              <span>Next: Academic Profile</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.form>
                      )}

                      {/* Step 2: Academic & Language Scores */}
                      {eligibilityStep === 2 && (
                        <motion.form
                          key="eligibility-step-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleNextStep}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-450 font-mono font-bold tracking-wider uppercase pl-2">Current CGPA / Percentage</label>
                              <input
                                type="text"
                                name="gpa"
                                required
                                placeholder="e.g. 8.5/10 or 3.6/4.0"
                                value={eligibilityData.gpa}
                                onChange={handleFormInputChange}
                                className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-450 font-mono font-bold tracking-wider uppercase pl-2">English Proficiency Exam</label>
                              <select
                                name="englishTest"
                                value={eligibilityData.englishTest}
                                onChange={handleFormInputChange}
                                className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all cursor-pointer"
                              >
                                <option value="IELTS">IELTS Academic</option>
                                <option value="TOEFL">TOEFL iBT</option>
                                <option value="Duolingo">Duolingo Test (DET)</option>
                                <option value="Waived">Waived (MOI Document)</option>
                              </select>
                            </div>

                          </div>

                          {eligibilityData.englishTest !== 'Waived' && (
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-450 font-mono font-bold tracking-wider uppercase pl-2">Test Score Obtained</label>
                              <input
                                type="text"
                                name="englishScore"
                                required
                                placeholder={eligibilityData.englishTest === 'IELTS' ? 'e.g. 7.0' : eligibilityData.englishTest === 'TOEFL' ? 'e.g. 100' : 'e.g. 125'}
                                value={eligibilityData.englishScore}
                                onChange={handleFormInputChange}
                                className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-3 gap-3 pt-6">
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="col-span-1 py-4.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                            >
                              Back
                            </button>
                            
                            <button
                              type="submit"
                              className="col-span-2 py-4.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                            >
                              <span>Next: Contact Details</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.form>
                      )}

                      {/* Step 3: Contact details & Submit */}
                      {eligibilityStep === 3 && (
                        <motion.form
                          key="eligibility-step-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleEligibilitySubmit}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-450 font-mono font-bold tracking-wider uppercase pl-2">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              required
                              placeholder="Enter your name"
                              value={eligibilityData.name}
                              onChange={handleFormInputChange}
                              className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-450 font-mono font-bold tracking-wider uppercase pl-2">Email Address</label>
                              <input
                                type="email"
                                name="email"
                                required
                                placeholder="name@example.com"
                                value={eligibilityData.email}
                                onChange={handleFormInputChange}
                                className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-450 font-mono font-bold tracking-wider uppercase pl-2">Contact Phone</label>
                              <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="+91 98765 43210"
                                value={eligibilityData.phone}
                                onChange={handleFormInputChange}
                                className="w-full px-4.5 py-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-[#001F3F] focus:outline-none focus:border-[#FF0000]/40 focus:bg-white transition-all"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 pt-6">
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="col-span-1 py-4.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                            >
                              Back
                            </button>
                            
                            <button
                              type="submit"
                              disabled={formLoading}
                              className="col-span-2 py-4.5 bg-gradient-to-r from-[#001F3F] to-[#FF0000] hover:shadow-red-500/20 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                              {formLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <span>CALCULATE ELIGIBILITY</span>
                                  <ChevronRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.form>
                      )}

                    </div>
                  ) : (
                    /* SUCCESS SCREEN WITH ELIGIBILITY ANALYSIS */
                    <motion.div
                      key="eligibility-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6 space-y-6"
                    >
                      {/* Score gauge */}
                      <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="54"
                            stroke="#f1f5f9"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="54"
                            stroke="#10b981"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 54}
                            initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - eligibilityMatchScore / 100) }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-[#001F3F]">{eligibilityMatchScore}%</span>
                          <span className="text-[9px] font-mono font-bold text-slate-450 uppercase tracking-widest">Match Score</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-extrabold text-[#001F3F] text-lg">Evaluation Generated</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                          {eligibilityMessage}
                        </p>
                      </div>

                      <div className="bg-slate-50/70 border border-slate-150 rounded-2xl p-4 text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto text-left space-y-2">
                        <div className="font-bold text-[#001F3F] uppercase font-mono tracking-wider text-xs border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#FF0000]" />
                          <span>Admissions Dossier Registered</span>
                        </div>
                        <p><strong>Candidate:</strong> {eligibilityData.name} ({eligibilityData.phone})</p>
                        <p><strong>Selected Target:</strong> {eligibilityUni.name} ({eligibilityUni.country})</p>
                        <p><strong>Verification:</strong> Google Sheets synced. Outbound email alert routed to counselor.</p>
                      </div>

                      <button
                        onClick={handleCloseEligibilityModal}
                        className="px-6 py-3 bg-slate-50 border border-slate-200 hover:text-[#001F3F] hover:bg-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. DETAILS DRAWER / MODAL */}
      <AnimatePresence>
        {detailsUni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001F3F]/40 backdrop-blur-md">
            <div className="absolute inset-0" onClick={handleCloseDetailsModal} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-6xl overflow-hidden relative z-10 text-left flex flex-col h-[90vh] md:h-[85vh]"
            >
              {/* Banner image with overlay */}
              <div className="relative h-48 overflow-hidden shrink-0">
                <img
                  src={detailsUni.imageUrl}
                  alt={`${detailsUni.name} campus`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                
                <button
                  onClick={handleCloseDetailsModal}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-white/20 hover:bg-white/35 backdrop-blur-xs border border-white/20 text-white transition-all cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-5 left-6 space-y-1.5 z-10">
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
                        <span className="text-[11px] font-black text-[#001F3F] bg-slate-50 px-1.5 py-1 rounded-xl border border-slate-150 block truncate">
                          {detailsUni.ranking}
                        </span>
                      </div>
                      <div className="text-center space-y-1">
                        <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Programs</span>
                        <span className="text-[11px] font-black text-[#001F3F] bg-slate-50 px-1.5 py-1 rounded-xl border border-slate-150 block truncate">
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
                        <p className="flex justify-between"><strong>Scholarship:</strong> <span className="text-emerald-605 font-bold">{detailsUni.scholarship}</span></p>
                        <p className="flex justify-between"><strong>Work Visa:</strong> <span>{detailsUni.country === 'UK' ? '2 Years PSW Route' : detailsUni.country === 'USA' ? '12-36 months OPT' : 'Up to 3 years PGWP'}</span></p>
                        <p className="flex justify-between"><strong>Living Cost:</strong> <span>{detailsUni.country === 'UK' ? '£1,000 - £1,300/mo' : detailsUni.country === 'USA' ? '$1,200 - $1,500/mo' : '€930/mo'}</span></p>
                        <p className="flex justify-between"><strong>Housing:</strong> <span>Guaranteed allotment</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      to="/"
                      state={{ scrollTo: 'consultation-hub' }}
                      onClick={handleCloseDetailsModal}
                      className="w-full py-3.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md"
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
                              : 'text-slate-450 hover:text-[#001F3F]'
                          }`}
                        >
                          {filterTab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable Course Tiles List (Tiling style exactly matching Azent) */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                    {modalCoursesLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <div className="w-8 h-8 border-4 border-[#001F3F]/10 border-t-[#FF0000] rounded-full animate-spin" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 animate-pulse">Loading all programs...</span>
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
                        const currencySymbol = CURRENCY_SYMBOLS[course.currency || ''] || course.currency || detailsUni.currency || '$';
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
                                  <h5 className="font-extrabold text-sm text-[#001F3F] leading-snug group-hover/course:text-[#FF0000] transition-colors">
                                    {course.course_name}
                                  </h5>
                                  <span className="inline-block px-2.5 py-0.5 bg-[#001F3F]/5 text-[#001F3F] rounded-md text-[9px] font-bold uppercase font-mono tracking-wider">
                                    {degreeLevel}
                                  </span>
                                </div>
                              </div>

                              <Link
                                to="/"
                                state={{ scrollTo: 'consultation-hub' }}
                                onClick={handleCloseDetailsModal}
                                className="self-start sm:self-center shrink-0 px-4 py-2.5 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-colors shadow-sm text-center font-semibold"
                              >
                                Apply Now
                              </Link>

                            </div>

                            {/* Tiling grid values (Matches Azent: Course Fees, Intakes, Application Fees, Duration, CRICOS/Alternative) */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-slate-100 text-[11px] text-left">
                              <div className="space-y-0.5">
                                <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Course Fees</span>
                                <span className="font-extrabold text-[#001F3F]">{tuitionDisplay}</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Intakes</span>
                                <span className="font-bold text-slate-705">{detailsUni.intakes.join(' / ')}</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Application Fees</span>
                                <span className="font-bold text-slate-500">-</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider block">Duration</span>
                                <span className="font-bold text-slate-705">{duration}</span>
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
        )}
      </AnimatePresence>

      {/* 5. MOBILE OVERLAY FILTERS DRAWER */}
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
                  <span>Filters ({activeFilterTags.length})</span>
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
                            : 'border-slate-200 text-slate-650'
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
                            : 'border-slate-200 text-slate-500'
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
                            : 'border-slate-200 text-slate-650'
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
                      <div className="absolute left-0 right-0 top-full mt-1.5 max-h-48 overflow-y-auto border border-slate-150 rounded-2xl bg-white shadow-xl z-35 p-2 space-y-1 custom-scrollbar text-left">
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
                Apply Filters ({pendingCount} Results)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LUXURIOUS FOOTER */}
      <footer className="relative bg-[#001F3F] text-white pt-20 pb-8 overflow-hidden" id="luxury-footer">
        <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-[#FF0000]/10 blur-[130px] pointer-events-none" />
        <div className="absolute left-10 top-0 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            
            {/* Bio */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center space-x-2.5">
                <div className="w-11 h-11 bg-white rounded-full p-0.5 flex items-center justify-center shadow-xs">
                  <FlyFlourishLogo iconOnly={true} size="100%" showGlobeBg={false} />
                </div>
                <div>
                  <span className="font-extrabold text-lg text-white tracking-tight">Fly & Flourish</span>
                  <p className="text-[9px] font-mono font-medium text-[#FF0000] leading-none tracking-wider">OVERSEAS CONSULTANTS</p>
                </div>
              </div>
 
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm">
                A premier global education catalyst engineering frictionless admissions, custom-aligned visa dossiers, and departure networking orbits for Tomorrow's Leaders.
              </p>
 
              <div className="flex items-center gap-2.5 text-xs text-slate-350">
                <Clock className="w-4 h-4 text-[#FF0000]" />
                <span className="font-mono text-[11px] tracking-wide uppercase">GRID CLOCK: <span ref={worldTimeRef} /></span>
              </div>
            </div>
 
            {/* Quick Links */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-[#FF0000] uppercase">ORBIT SECTORS</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-sans font-medium">
                <li>
                  <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
                    Home Page
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.HOME} state={{ scrollTo: 'about-us' }} className="hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.HOME} state={{ scrollTo: 'showcase-destinations' }} className="hover:text-white transition-colors">
                    Study Destinations
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.HOME} state={{ scrollTo: 'consultation-hub' }} className="hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Office Info */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">OFFICE COORDINATES</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Reach our admissions desk for immediate immigration profile validation, shortlists, or seminar requests.
              </p>
              
              <div className="space-y-2.5 text-xs text-slate-350 font-mono">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#FF0000]" />
                  <a href="tel:+918374740505" className="hover:text-white transition-colors">+91 8374740505</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#FF0000]" />
                  <a href="mailto:admin@ffoverseas.in" className="hover:text-white transition-colors">admin@ffoverseas.in</a>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#FF0000] shrink-0 mt-0.5" />
                  <a 
                    href="https://maps.app.goo.gl/FsZWwDxLYhFju7ou7" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors leading-relaxed"
                  >
                    Opposite to Miracle Hospitals, Om Vihar Colony, Alwal, Secunderabad, Telangana 500010
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Copyrights */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
            <p>© 2026 FLY & FLOURISH OVERSEAS CONSULTANTS. REGULATED UNDER ICCRC & ACG CODES.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">PRIVACY MANIFEST</a>
              <span>・</span>
              <a href="#" className="hover:text-white transition-colors">ADMISSIONS SECURITY RULES</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
