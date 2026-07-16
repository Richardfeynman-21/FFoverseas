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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Plus,
  Minus,
  Sparkles,
  Info,
  MessageSquare,
  X
} from 'lucide-react';
import { University } from './types';
import { Flag } from './Flag';
import { COUNTRY_SHORT_NAMES, CURRENCY_SYMBOLS } from '../../lib/constants';

interface UniversitiesTabProps {
  countryFilter: string;
  setCountryFilter: (country: string) => void;
  filteredUniversities: University[];
  setActiveTab?: (tab: any) => void;
  onApplySuccess?: () => void;
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
  onApplySuccess,
}) => {
  // 1. Tab Modes: 'explore' (Explore Courses) vs 'shortlisted' (My Shortlist)
  const [viewMode, setViewMode] = useState<'explore' | 'shortlisted'>('explore');

  // 2. States for Shortlist & Comparison
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [backendShortlist, setBackendShortlist] = useState<any[]>([]);
  const [fetchedCourses, setFetchedCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [appliedList, setAppliedList] = useState<any[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // 3. Search & Basic Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('All');

  // 4. Advanced Filters Panel State (Redesigned Direct Grid Filters)
  const [selectedFeeRange, setSelectedFeeRange] = useState('All');
  const [selectedMinRanking, setSelectedMinRanking] = useState('All');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState('All');
  const [selectedIeltsScore, setSelectedIeltsScore] = useState('All');
  const [selectedUniversity, setSelectedUniversity] = useState('All');
  const [selectedIntake, setSelectedIntake] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [trendingCourses, setTrendingCourses] = useState<CourseItem[]>([]);
  const [sortByOption, setSortByOption] = useState('rank');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [allUniversities, setAllUniversities] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 12;

  const isFiltersEmpty = useMemo(() => {
    return !appliedSearchQuery && 
      countryFilter === 'All' && 
      selectedDegreeLevel === 'All' && 
      selectedIntake === 'All' && 
      selectedDuration === 'All' && 
      selectedUniversity === 'All';
  }, [appliedSearchQuery, countryFilter, selectedDegreeLevel, selectedIntake, selectedDuration, selectedUniversity]);

  // 4.1 Temporary draft state hooks for advanced filters inside UniversitiesTab
  const [draftFeeRange, setDraftFeeRange] = useState('All');
  const [draftMinRanking, setDraftMinRanking] = useState('All');
  const [draftDegreeLevel, setDraftDegreeLevel] = useState('All');
  const [draftIeltsScore, setDraftIeltsScore] = useState('All');
  const [draftUniversity, setDraftUniversity] = useState('All');
  const [draftSortByOption, setDraftSortByOption] = useState('rank');

  // Initialize or reset draft states to match active states when the modal is opened
  useEffect(() => {
    if (isFiltersOpen) {
      setDraftFeeRange(selectedFeeRange);
      setDraftMinRanking(selectedMinRanking);
      setDraftDegreeLevel(selectedDegreeLevel);
      setDraftIeltsScore(selectedIeltsScore);
      setDraftSortByOption(sortByOption);
      setDraftUniversity(selectedUniversity);
    }
  }, [isFiltersOpen, selectedFeeRange, selectedMinRanking, selectedDegreeLevel, selectedIeltsScore, sortByOption, selectedUniversity]);

  // Helpers for formatting and calculations
  const formatTuition = (fee: number | null | undefined, currency: string) => {
    if (fee === null || fee === undefined || fee === 0) {
      if (currency === 'EUR') return '€250 semester fee';
      return 'Free / Nominal';
    }
    const symbol = currency === 'GBP' ? '£' : currency === 'CAD' ? 'CAD $' : currency === 'AUD' ? 'AUD $' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${fee.toLocaleString()}/yr`;
  };

  const formatScholarship = (u: any) => {
    if (u.country === 'Germany') return 'DAAD up to €12,000/yr';
    if (u.country === 'USA') return 'Up to $30,000/yr';
    if (u.country === 'UK') return 'Up to £15,000/yr';
    if (u.country === 'Canada') return 'Up to CAD $20,000/yr';
    if (u.country === 'Australia') return 'Up to AUD $15,000/yr';
    return 'Merit Based';
  };

  const getAcceptanceRate = (ranking: string | null) => {
    if (!ranking) return '15%';
    const rank = parseInt(ranking.replace(/[^\d]/g, ''));
    if (isNaN(rank)) return '15%';
    if (rank <= 5) return '3.5%';
    if (rank <= 20) return '8%';
    if (rank <= 50) return '12%';
    if (rank <= 100) return '25%';
    return '45%';
  };

  const fetchShortlist = async () => {
    try {
      const token = localStorage.getItem('ff_student_token');
      if (!token) return;
      const res = await fetch('/api/students/shortlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBackendShortlist(data);
        const ids = data.map((item: any) => {
          const uName = item.university_name.replace(/\s+/g, '-').toLowerCase();
          const cName = item.course_name.replace(/\s+/g, '-').toLowerCase();
          return `${uName}-${cName}`;
        });
        setShortlistedIds(ids);
      }
    } catch (err) {
      console.error('Error fetching shortlist:', err);
    }
  };

  const fetchAppliedApplications = async () => {
    try {
      const token = localStorage.getItem('ff_student_token');
      if (!token) return;
      const res = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAppliedList(data);
      }
    } catch (err) {
      console.error('Error fetching applied list:', err);
    }
  };

  const handleApply = async (course: CourseItem) => {
    const token = localStorage.getItem('ff_student_token');
    if (!token) return;

    setApplyingId(course.id);
    
    const isMaster = 
      course.courseName.toLowerCase().includes('master') || 
      course.courseName.toLowerCase().includes('mba') ||
      course.courseName.toLowerCase().includes('postgraduate');
    const degreeLevel = isMaster ? 'Master' : 'Bachelor';

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          university_id: course.university.id || 0,
          university_name: course.university.name,
          course_name: course.courseName,
          degree_level: degreeLevel,
          metadata: null
        })
      });

      if (res.ok) {
        await fetchAppliedApplications();
        if (onApplySuccess) onApplySuccess();
        alert(`Successfully applied to ${course.courseName} at ${course.university.name}!`);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setApplyingId(null);
    }
  };

  // Fetch student data on mount
  useEffect(() => {
    fetchShortlist();
    fetchAppliedApplications();
  }, []);

  // Fetch list of all universities to populate select filters and fetch trending courses
  useEffect(() => {
    const fetchAllUnis = async () => {
      try {
        const token = localStorage.getItem('ff_student_token');
        const res = await fetch('/api/universities?page_size=100', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.universities.map((u: any) => ({
            id: u.id,
            name: u.name,
            country: u.country
          }));
          setAllUniversities(mapped);
        }
      } catch (err) {
        console.error("Failed to load university options:", err);
      }
    };

    const fetchTrending = async () => {
      try {
        const token = localStorage.getItem('ff_student_token');
        const res = await fetch('/api/universities/courses?sort_by=rank&page=1&page_size=15', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const mapped: CourseItem[] = data.courses.map((item: any) => {
            const uni = item.university;
            const shortCountry = COUNTRY_SHORT_NAMES[uni.country] || uni.country;
            const tuitionVal = formatTuition(item.tuition_fee, item.currency || uni.currency || 'USD');
            const rankingStr = uni.qs_rank_2026 ? `#${uni.qs_rank_2026.replace('#', '')}` : 'N/A';
            const acceptanceRate = getAcceptanceRate(uni.qs_rank_2026);
            let field = 'Other';
            const name = item.course_name.toLowerCase();
            if (name.includes('computer') || name.includes('data science') || name.includes('ai')) field = 'Computer Science & AI';
            else if (name.includes('engineer') || name.includes('physics')) field = 'Engineering & Science';
            else if (name.includes('business') || name.includes('finance')) field = 'Business & Management';

            return {
              id: item.id || item.course_id || Math.random().toString(),
              courseName: item.course_name,
              field,
              duration: item.country === 'UK' ? '1 Year' : '2 Years',
              tuition: tuitionVal,
              scholarship: formatScholarship(uni),
              intake: 'Fall 2026',
              ieltsScore: '7.0',
              greRequired: 'Optional',
              acceptanceRate,
              university: uni
            };
          });
          setTrendingCourses(mapped);
        }
      } catch (err) {
        console.error("Failed to load trending courses:", err);
      }
    };

    fetchAllUnis();
    fetchTrending();
  }, []);

  // Fetch courses dynamically from backend global courses catalog when filter criteria changes
  useEffect(() => {
    if (isFiltersEmpty) {
      setLoading(false);
      return;
    }
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('ff_student_token');
        const params = new URLSearchParams();

        if (appliedSearchQuery) {
          params.append('search', appliedSearchQuery);
        }
        if (countryFilter && countryFilter !== 'All') {
          const apiCountry = 
            countryFilter === 'USA' ? 'United States' :
            countryFilter === 'UK' ? 'United Kingdom' :
            countryFilter;
          params.append('countries', apiCountry);
        }
        if (selectedDegreeLevel && selectedDegreeLevel !== 'All') {
          params.append('degree_levels', selectedDegreeLevel);
        }
        if (selectedFeeRange && selectedFeeRange !== 'All') {
          let feeParam = '';
          if (selectedFeeRange === 'Under $15k') feeParam = 'under18k';
          else if (selectedFeeRange === '$15k - $30k') feeParam = '18kto35k';
          else if (selectedFeeRange === '$30k - $50k') feeParam = '35kto55k';
          else if (selectedFeeRange === 'Over $50k') feeParam = 'over55k';
          if (feeParam) params.append('fee_range', feeParam);
        }
        if (selectedMinRanking && selectedMinRanking !== 'All') {
          let rankParam = '';
          if (selectedMinRanking === 'Top 50') rankParam = 'top50';
          else if (selectedMinRanking === 'Top 100') rankParam = 'top100';
          else if (selectedMinRanking === 'Top 200' || selectedMinRanking === 'Top 500') rankParam = 'top500';
          if (rankParam) params.append('min_ranking', rankParam);
        }
        if (selectedUniversity && selectedUniversity !== 'All') {
          params.append('university_ids', selectedUniversity);
        }
        
        // Sorting parameter
        const apiSortBy = 
          sortByOption === 'tuition-asc' ? 'tuition_asc' :
          sortByOption === 'tuition-desc' ? 'tuition_desc' :
          sortByOption === 'acceptance-desc' ? 'acceptance_desc' :
          'rank';
        params.append('sort_by', apiSortBy);
        
        // Pagination parameters
        params.append('page', String(currentPage));
        params.append('page_size', String(itemsPerPage));

        const url = `/api/universities/courses?${params.toString()}`;
        console.log("Fetching matching courses from backend:", url);
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTotalResults(data.total || 0);
          setTotalPages(data.total_pages || 1);
          const mapped: CourseItem[] = data.courses.map((item: any) => {
            const uni = item.university;
            const shortCountry = COUNTRY_SHORT_NAMES[uni.country] || uni.country;
            const tuitionVal = formatTuition(item.tuition_fee, item.currency || uni.currency || 'USD');
            const rankingStr = uni.qs_rank_2026 ? `#${uni.qs_rank_2026.replace('#', '')}` : 'N/A';
            const acceptanceRate = getAcceptanceRate(uni.qs_rank_2026);

            // Classify program names into field categories
            let field = 'Other';
            const name = item.course_name.toLowerCase();
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
            let duration = `${item.duration_years || 2} Years`;
            if (uni.country === 'UK' || uni.country === 'United Kingdom') duration = '1 Year';
            else if (name.includes('mba') || name.includes('analytics')) duration = '1.5 Years';

            // Requirements mapping
            let ielts = '7.0';
            if (
              (uni.qs_rank_2026 && parseInt(uni.qs_rank_2026.replace(/[^\d]/g, '')) <= 5) || 
              uni.name.includes('Harvard') || uni.name.includes('Stanford') || uni.name.includes('MIT')
            ) {
              ielts = '7.5';
            } else if (uni.country === 'Germany') {
              ielts = '6.5';
            }

            let gre = 'Optional';
            if (
              (uni.country === 'USA' || uni.country === 'United States') && 
              (uni.name.includes('MIT') || uni.name.includes('Stanford') || uni.name.includes('Harvard') || uni.name.includes('Berkeley'))
            ) {
              gre = 'Required (315+)';
            }

            return {
              id: `${uni.name.replace(/\s+/g, '-').toLowerCase()}-${item.course_name.replace(/\s+/g, '-').toLowerCase()}`,
              courseName: item.course_name,
              field: field,
              duration: duration,
              tuition: tuitionVal,
              scholarship: formatScholarship(uni),
              intake: 'Fall 2026',
              ieltsScore: ielts,
              greRequired: gre,
              acceptanceRate: acceptanceRate,
              university: {
                id: uni.id,
                name: uni.name,
                country: shortCountry,
                flag: uni.alpha_two_code,
                ranking: rankingStr,
                tuition: tuitionVal,
                scholarship: formatScholarship(uni),
                programs: [],
                acceptanceRate: acceptanceRate
              }
            };
          });
          setFetchedCourses(mapped);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [countryFilter, appliedSearchQuery, selectedDegreeLevel, selectedFeeRange, selectedMinRanking, sortByOption, selectedUniversity, selectedIntake, selectedDuration, currentPage, isFiltersEmpty]);

  const toggleShortlist = async (courseId: string) => {
    const token = localStorage.getItem('ff_student_token');
    if (!token) return;

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const isCurrentlyShortlisted = shortlistedIds.includes(courseId);

    try {
      if (isCurrentlyShortlisted) {
        const itemToDelete = backendShortlist.find(item => 
          item.university_id === course.university.id && 
          item.course_name.toLowerCase() === course.courseName.toLowerCase()
        );

        if (itemToDelete) {
          const res = await fetch(`/api/students/shortlist/${itemToDelete.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            await fetchShortlist();
          }
        }
      } else {
        const res = await fetch('/api/students/shortlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            university_id: course.university.id,
            course_name: course.courseName,
            degree_level: course.courseName.toLowerCase().includes('master') || course.courseName.toLowerCase().includes('mba') ? 'Master' : 'Bachelor'
          })
        });
        if (res.ok) {
          await fetchShortlist();
        }
      }
    } catch (err) {
      console.error('Error toggling shortlist:', err);
    }
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
    if (selectedUniversity !== 'All') count++;
    if (sortByOption !== 'rank') count++;
    return count;
  }, [selectedFeeRange, selectedMinRanking, selectedDegreeLevel, selectedIeltsScore, sortByOption, selectedUniversity]);

  // 5. Generate Course Data from Fetched Courses & backend shortlist
  const courses: CourseItem[] = useMemo(() => {
    const list: CourseItem[] = [...fetchedCourses];

    // Append items from backendShortlist if they are not already in the list
    backendShortlist.forEach((item: any) => {
      const uName = item.university_name.replace(/\s+/g, '-').toLowerCase();
      const cName = item.course_name.replace(/\s+/g, '-').toLowerCase();
      const id = `${uName}-${cName}`;

      const exists = list.some(c => c.id === id);
      if (!exists) {
        let field = 'Other';
        const name = item.course_name.toLowerCase();
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

        const uni: University = {
          id: item.university_id,
          name: item.university_name,
          country: item.country,
          flag: '',
          ranking: item.ranking || 'N/A',
          tuition: item.tuition || 'N/A',
          scholarship: item.scholarship || 'None',
          programs: [],
          acceptanceRate: item.acceptance_rate || 'N/A'
        };

        list.push({
          id,
          courseName: item.course_name,
          field,
          duration: item.country === 'UK' ? '1 Year' : '2 Years',
          tuition: item.tuition || 'N/A',
          scholarship: item.scholarship || 'None',
          intake: 'Fall 2026',
          ieltsScore: '7.0',
          greRequired: 'Optional',
          acceptanceRate: item.acceptance_rate || 'N/A',
          university: uni
        });
      }
    });

    // Append items from appliedList if they are not already in the list
    appliedList.forEach((item: any) => {
      const uName = item.university_name.replace(/\s+/g, '-').toLowerCase();
      const cName = item.course_name.replace(/\s+/g, '-').toLowerCase();
      const id = `${uName}-${cName}`;

      const exists = list.some(c => c.id === id);
      if (!exists) {
        let field = 'Other';
        const name = item.course_name.toLowerCase();
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

        const uni: University = {
          id: item.university_id || 0,
          name: item.university_name,
          country: item.metadata?.country || 'Unknown',
          flag: '',
          ranking: 'N/A',
          tuition: 'N/A',
          scholarship: 'None',
          programs: [],
          acceptanceRate: 'N/A'
        };

        list.push({
          id,
          courseName: item.course_name,
          field,
          duration: '2 Years',
          tuition: 'N/A',
          scholarship: 'None',
          intake: 'Fall 2026',
          ieltsScore: '7.0',
          greRequired: 'Optional',
          acceptanceRate: 'N/A',
          university: uni
        });
      }
    });

    return list;
  }, [fetchedCourses, backendShortlist, appliedList]);

  const filteredCourses = useMemo(() => {
    let list = (isFiltersEmpty ? trendingCourses : courses).filter((course) => {
      // 1. Search matches
      const matchesSearch = 
        course.courseName.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
        course.university.name.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
        course.university.country.toLowerCase().includes(appliedSearchQuery.toLowerCase());
      
      // 2. Domain matches
      const matchesField = selectedField === 'All' || course.field === selectedField;
      
      // 3. Shortlisted mode filtering
      const isApplied = appliedList.some(
        (app: any) =>
          app.university_name === course.university.name &&
          app.course_name === course.courseName
      );
      const matchesShortlistMode = viewMode === 'explore' || shortlistedIds.includes(course.id) || isApplied;

      // 4. IELTS Score Filtering (Backend doesn't have an IELTS filter parameter)
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
      
      // 5. Intake Filtering (Client-side fallback)
      const matchesIntake = selectedIntake === 'All' || course.intake.toLowerCase().includes(selectedIntake.toLowerCase());

      // 6. Duration Filtering (Client-side fallback)
      const matchesDuration = selectedDuration === 'All' || course.duration.toLowerCase().includes(selectedDuration.toLowerCase());

      return matchesSearch && matchesField && matchesShortlistMode && matchesIelts && matchesIntake && matchesDuration;
    });

    return list;
  }, [courses, trendingCourses, isFiltersEmpty, appliedSearchQuery, selectedField, viewMode, shortlistedIds, selectedIeltsScore, selectedIntake, selectedDuration, appliedList]);

  // Courses selected for comparison
  const compareCourses = useMemo(() => {
    return courses.filter(course => compareIds.includes(course.id));
  }, [courses, compareIds]);

  // Total courses matching shortlist view mode
  const shortlistedCount = useMemo(() => {
    return courses.filter(course => {
      const isApplied = appliedList.some(
        (app: any) =>
          app.university_name === course.university.name &&
          app.course_name === course.courseName
      );
      return shortlistedIds.includes(course.id) || isApplied;
    }).length;
  }, [courses, shortlistedIds, appliedList]);

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
              : `Review and refine your shortlisted programs. You have selected ${shortlistedCount} courses.`}
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
            Shortlist ({shortlistedCount})
          </button>
        </div>
      </div>

      {/* ─── Search & Filters Panel (Redesigned Direct Grid Filters) ─── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
        
        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* 1. University Country Dropdown */}
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase mb-1">University Country</label>
            <select
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#001F3F] transition cursor-pointer"
            >
              <option value="All">All Countries</option>
              <option value="USA">United States (USA)</option>
              <option value="UK">United Kingdom (UK)</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          {/* 2. Course Type Dropdown */}
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase mb-1">Course Type</label>
            <select
              value={selectedDegreeLevel}
              onChange={(e) => {
                setSelectedDegreeLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#001F3F] transition cursor-pointer"
            >
              <option value="All">All Course Types</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          {/* 3. Course Intake Dropdown */}
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase mb-1">Course Intake</label>
            <select
              value={selectedIntake}
              onChange={(e) => {
                setSelectedIntake(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#001F3F] transition cursor-pointer"
            >
              <option value="All">All Intakes</option>
              <option value="September">September Intake</option>
              <option value="January">January Intake</option>
              <option value="May">May Intake</option>
            </select>
          </div>

          {/* 4. Duration Dropdown */}
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase mb-1">Duration</label>
            <select
              value={selectedDuration}
              onChange={(e) => {
                setSelectedDuration(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#001F3F] transition cursor-pointer"
            >
              <option value="All">All Durations</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="4 Years">4 Years</option>
            </select>
          </div>

          {/* 5. University Name Dropdown */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase mb-1">University Name</label>
            <select
              value={selectedUniversity}
              onChange={(e) => {
                setSelectedUniversity(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#001F3F] transition cursor-pointer"
            >
              <option value="All">All Universities</option>
              {allUniversities.map((uni) => (
                <option key={uni.id} value={uni.id}>{uni.name} ({uni.country})</option>
              ))}
            </select>
          </div>

          {/* 6. Search by Course Name Input */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase mb-1">Search by Course Name</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-9 pr-24 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#001F3F] transition"
              />
              <button
                onClick={() => {
                  setAppliedSearchQuery(searchQuery);
                  setCurrentPage(1);
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white rounded-lg text-[10px] font-bold tracking-wider transition active:scale-95 cursor-pointer"
              >
                APPLY
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Row (if any filters are selected) */}
        {!isFiltersEmpty && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              {countryFilter !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-bold rounded-lg select-none">
                  <span>{countryFilter}</span>
                  <button onClick={() => { setCountryFilter('All'); setCurrentPage(1); }} className="text-amber-600 hover:text-amber-800 transition cursor-pointer"><X size={10} /></button>
                </span>
              )}
              {selectedDegreeLevel !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-bold rounded-lg select-none">
                  <span>{selectedDegreeLevel}</span>
                  <button onClick={() => { setSelectedDegreeLevel('All'); setCurrentPage(1); }} className="text-amber-600 hover:text-amber-800 transition cursor-pointer"><X size={10} /></button>
                </span>
              )}
              {selectedIntake !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-bold rounded-lg select-none">
                  <span>{selectedIntake}</span>
                  <button onClick={() => { setSelectedIntake('All'); setCurrentPage(1); }} className="text-amber-600 hover:text-amber-800 transition cursor-pointer"><X size={10} /></button>
                </span>
              )}
              {selectedDuration !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-bold rounded-lg select-none">
                  <span>{selectedDuration}</span>
                  <button onClick={() => { setSelectedDuration('All'); setCurrentPage(1); }} className="text-amber-600 hover:text-amber-800 transition cursor-pointer"><X size={10} /></button>
                </span>
              )}
              {selectedUniversity !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-bold rounded-lg max-w-[200px] truncate select-none">
                  <span>{allUniversities.find(u => String(u.id) === selectedUniversity)?.name || 'University'}</span>
                  <button onClick={() => { setSelectedUniversity('All'); setCurrentPage(1); }} className="text-amber-600 hover:text-amber-800 transition shrink-0 cursor-pointer"><X size={10} /></button>
                </span>
              )}
              {appliedSearchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-bold rounded-lg select-none">
                  <span>"{appliedSearchQuery}"</span>
                  <button onClick={() => { setSearchQuery(''); setAppliedSearchQuery(''); setCurrentPage(1); }} className="text-amber-600 hover:text-amber-800 transition cursor-pointer"><X size={10} /></button>
                </span>
              )}
            </div>
            
            {/* Clear All button */}
            <button
              onClick={() => {
                setCountryFilter('All');
                setSelectedDegreeLevel('All');
                setSelectedIntake('All');
                setSelectedDuration('All');
                setSelectedUniversity('All');
                setSearchQuery('');
                setAppliedSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-[10.5px] font-bold text-[#001F3F] hover:text-[#001F3F]/80 uppercase tracking-wider cursor-pointer active:scale-95 select-none"
            >
              CLEAR ALL
            </button>
          </div>
        )}
      </div>

      {/* ─── Active Filter Meta Info ─── */}
      <div className="flex items-center justify-between px-2">
        {loading ? (
          <span className="text-[10.5px] text-amber-600 font-mono font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            CONNECTED: RETRIEVING LIVE UNIVERSITY CATALOG DATA...
          </span>
        ) : (
          <span className="text-[10.5px] text-slate-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
            {isFiltersEmpty && viewMode === 'explore' ? (
              <>
                <TrendingUp size={12} className="text-amber-500 shrink-0" />
                <span>15 TRENDING PROGRAMS FOUND</span>
              </>
            ) : (
              <span>{viewMode === 'explore' ? totalResults : filteredCourses.length} MATCHING PROGRAMS FOUND</span>
            )}
          </span>
        )}
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
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-white/60 border border-slate-200/50 rounded-3xl p-6 h-[440px] flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-4">
                  {/* Category Field Pill & Star Placeholder */}
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-24 bg-slate-200 rounded-md"></div>
                    <div className="h-7 w-7 bg-slate-100 rounded-full"></div>
                  </div>
                  {/* Course Title & Uni details placeholders */}
                  <div className="space-y-2.5 pt-2">
                    <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                    <div className="h-4 w-1/2 bg-slate-150 rounded-md"></div>
                  </div>
                  {/* Info Row placeholders */}
                  <div className="h-28 bg-slate-100/50 rounded-2xl border border-slate-150/30"></div>
                </div>
                {/* Buttons placeholders */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <div className="h-9 flex-1 bg-slate-200 rounded-xl"></div>
                  <div className="h-9 flex-1 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ))
          ) : (
            filteredCourses.map((course, idx) => {
              const isShortlisted = shortlistedIds.includes(course.id);
              const isComparing = compareIds.includes(course.id);
              const isApplied = appliedList.some(
                (app) => 
                  app.university_name.toLowerCase() === course.university.name.toLowerCase() &&
                  app.course_name.toLowerCase() === course.courseName.toLowerCase()
              );
              const isApplying = applyingId === course.id;

              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                  className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 hover:border-slate-350 hover:shadow-[0_20px_40px_rgba(0,31,63,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group relative overflow-hidden min-h-[440px] h-auto cursor-default"
                >
                  {/* Visual Accent top strip */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#001F3F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    
                    {/* Category Field Pill & Shortlist Button */}
                    <div className="flex justify-between items-center mb-4">
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
                        <Star size={13} className={isShortlisted ? 'fill-amber-500' : ''} />
                      </button>
                    </div>

                    {/* Course Name & University Details */}
                    <div className="space-y-2 mb-4 min-w-0">
                      <h3 className="font-extrabold text-[#001F3F] text-base leading-tight group-hover:text-[#001F3F]/80 transition-colors duration-250 line-clamp-2" title={course.courseName}>
                        {course.courseName}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-700 block truncate" title={course.university.name}>
                          {course.university.name}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Flag country={course.university.country || course.university.flag} className="w-4.5 h-3 rounded shadow-xs shrink-0" />
                            <span>{course.university.country}</span>
                          </div>
                          {course.university.ranking && course.university.ranking !== 'N/A' && (
                            <div className="flex items-center gap-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 text-amber-700 text-[9.5px] font-extrabold rounded-md shadow-xs shrink-0">
                              <Award size={10} className="text-amber-600 shrink-0" />
                              <span>QS Rank: #{course.university.ranking.replace('#', '')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Course Details Info Box */}
                    <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-150/45 space-y-3 mb-4 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={14} className="text-slate-400 shrink-0" />
                          <span className="font-bold">Duration</span>
                        </div>
                        <span className="font-extrabold text-slate-800">{course.duration}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/40 pt-3">
                        <div className="flex items-center gap-2 text-slate-500">
                          <GraduationCap size={14} className="text-slate-400 shrink-0" />
                          <span className="font-bold">Tuition Fees</span>
                        </div>
                        <span className="font-extrabold text-slate-800">{course.tuition}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/40 pt-3">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Award size={14} className="text-amber-500 shrink-0" />
                          <span className="font-bold">Scholarship</span>
                        </div>
                        <span className="font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/15">
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
                  <div className="flex items-center gap-2.5 pt-3.5 border-t border-slate-100/60 mt-auto">
                    {/* Compare Button */}
                    <button
                      onClick={() => toggleCompare(course.id)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-sm hover:shadow-md ${
                        isComparing
                          ? 'bg-[#001F3F] text-white border border-transparent hover:bg-[#001F3F]/90 hover:border-transparent'
                          : 'bg-white text-slate-650 border border-slate-200/80 hover:border-slate-350 hover:text-slate-800 hover:bg-slate-50/50'
                      }`}
                    >
                      {isComparing ? <Minus size={11} className="stroke-[3]" /> : <Plus size={11} className="stroke-[3]" />}
                      <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                    </button>
                    {/* Apply Button */}
                    <button
                      disabled={isApplied || isApplying}
                      onClick={() => handleApply(course)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-sm hover:shadow-md disabled:opacity-85 disabled:cursor-not-allowed ${
                        isApplied
                          ? 'bg-emerald-600 text-white border border-transparent hover:bg-emerald-600'
                          : isApplying
                          ? 'bg-[#001F3F]/20 text-[#001F3F] border border-transparent'
                          : 'bg-[#001F3F] text-white border border-transparent hover:bg-red-600 hover:text-white hover:border-transparent'
                      }`}
                    >
                      {isApplied ? (
                        <CheckCircle2 size={11} className="stroke-[3]" />
                      ) : isApplying ? (
                        <span className="w-3 h-3 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <ExternalLink size={11} className="stroke-[2.5]" />
                      )}
                      <span>{isApplied ? 'Applied!' : isApplying ? 'Applying...' : 'Apply Now'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* PAGINATION CONTROLS */}
        {viewMode === 'explore' && !isFiltersEmpty && totalPages > 1 && (
          <div className="bg-gradient-to-r from-white/95 via-slate-50/98 to-white/95 backdrop-blur-lg rounded-[2rem] p-5 border border-slate-200/80 shadow-lg shadow-slate-200/35 flex flex-col lg:flex-row items-center justify-between gap-4 mt-8 w-full transition-all duration-300">
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-500 flex items-center gap-2 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>
                Showing <span className="text-[#001F3F] font-extrabold font-sans">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalResults)}</span> of <span className="text-[#001F3F] font-extrabold font-sans">{totalResults}</span> course offerings
              </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl border border-slate-250 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-slate-250 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-90"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              
              <div className="w-[180px] sm:w-[320px] overflow-x-auto whitespace-nowrap block px-0.5 pb-2 pt-1.5 custom-scrollbar scroll-smooth">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  const isActive = currentPage === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setCurrentPage(pNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-11 h-11 rounded-xl text-xs font-black transition-all duration-250 cursor-pointer inline-flex items-center justify-center border shrink-0 mx-[3px] hover:scale-105 active:scale-95 ${
                        isActive
                          ? 'bg-[#001F3F] border-[#001F3F] text-white shadow-md shadow-[#001F3F]/15 hover:shadow-lg hover:shadow-[#001F3F]/25'
                          : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50 hover:border-slate-350 hover:text-slate-800'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl border border-slate-250 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-slate-250 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-90"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        )}

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
                setAppliedSearchQuery('');
                setSelectedField('All');
                setCountryFilter('All');
                setSelectedFeeRange('All');
                setSelectedMinRanking('All');
                setSelectedDegreeLevel('All');
                setSelectedIeltsScore('All');
                setSelectedUniversity('All');
                setSortByOption('rank');
                setCurrentPage(1);
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

      {/* ─── Advanced Filters Modal Overlay (Replicating Main Catalog filters) ─── */}
      <AnimatePresence>
        {isFiltersOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            {/* Backdrop with dark overlay covering everything */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFiltersOpen(false)}
              className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-[2rem] border border-slate-200/80 shadow-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 relative overflow-hidden z-10"
            >
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-[#001F3F] text-lg uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={18} />
                    Filter Programs
                  </h3>
                  <p className="text-xs text-slate-455 font-medium">Narrow down target courses by fees, ranking, degree level, and score.</p>
                </div>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="material-symbols-outlined p-2 hover:bg-slate-50 text-slate-455 hover:text-[#001F3F] rounded-full cursor-pointer transition active:scale-95"
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
                          checked={draftFeeRange === range}
                          onChange={() => setDraftFeeRange(range)}
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
                          checked={draftMinRanking === rank}
                          onChange={() => setDraftMinRanking(rank)}
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
                          checked={draftDegreeLevel === lvl}
                          onChange={() => setDraftDegreeLevel(lvl)}
                          className="accent-[#001F3F] w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>{lvl === 'All' ? 'Any Degree' : lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* IELTS Requirement, Sort By, and University Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">English IELTS score</span>
                  <select
                    value={draftIeltsScore}
                    onChange={(e) => setDraftIeltsScore(e.target.value)}
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
                    value={draftSortByOption}
                    onChange={(e) => setDraftSortByOption(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-[#001F3F] focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F] cursor-pointer"
                  >
                    <option value="rank">QS World Rank</option>
                    <option value="tuition-asc">Tuition: Low to High</option>
                    <option value="tuition-desc">Tuition: High to Low</option>
                    <option value="acceptance-desc">Acceptance: High to Low</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">University Campuses</span>
                  <select
                    value={draftUniversity}
                    onChange={(e) => setDraftUniversity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-[#001F3F] focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F] cursor-pointer"
                  >
                    <option value="All">All Universities</option>
                    {allUniversities.map((uni) => (
                      <option key={uni.id} value={String(uni.id)}>
                        {uni.name} ({uni.country})
                      </option>
                    ))}
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
                    setSelectedUniversity('All');
                    setSortByOption('rank');
                    setDraftFeeRange('All');
                    setDraftMinRanking('All');
                    setDraftDegreeLevel('All');
                    setDraftIeltsScore('All');
                    setDraftUniversity('All');
                    setDraftSortByOption('rank');
                    setCurrentPage(1);
                    setIsFiltersOpen(false);
                  }}
                  className="px-4 py-2.5 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition cursor-pointer select-none"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => {
                    setSelectedFeeRange(draftFeeRange);
                    setSelectedMinRanking(draftMinRanking);
                    setSelectedDegreeLevel(draftDegreeLevel);
                    setSelectedIeltsScore(draftIeltsScore);
                    setSelectedUniversity(draftUniversity);
                    setSortByOption(draftSortByOption);
                    setCurrentPage(1);
                    setIsFiltersOpen(false);
                  }}
                  className="px-6 py-2.5 bg-[#001F3F] hover:bg-[#001F3F]/90 text-white rounded-xl text-xs font-bold transition active:scale-97 cursor-pointer shadow-md shadow-[#001F3F]/15"
                >
                  Apply Filters
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
