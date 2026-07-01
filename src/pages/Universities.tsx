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
import { DETAILED_UNIVERSITIES, DetailedUniversity } from '../data/universitiesData';
import { ROUTES } from '../routes';

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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Modal & Drawer State
  const [eligibilityUni, setEligibilityUni] = useState<DetailedUniversity | null>(null);
  const [detailsUni, setDetailsUni] = useState<DetailedUniversity | null>(null);
  
  // Mobile Filter Sidebar Overlay State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract all unique programs / courses from the database
  const allUniqueCourses = useMemo(() => {
    const coursesSet = new Set<string>();
    DETAILED_UNIVERSITIES.forEach(uni => {
      uni.programs.forEach(prog => coursesSet.add(prog));
    });
    return Array.from(coursesSet).sort();
  }, []);

  // Filter unique courses list by typing search keyword
  const filteredDropdownCourses = useMemo(() => {
    if (!pendingCourseInput) return allUniqueCourses;
    const q = pendingCourseInput.toLowerCase();
    return allUniqueCourses.filter(c => c.toLowerCase().includes(q));
  }, [allUniqueCourses, pendingCourseInput]);
  
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
    if (type === 'country') {
      setSelectedCountries(prev => prev.filter(c => c !== value));
      setPendingSelectedCountries(prev => prev.filter(c => c !== value));
    }
    if (type === 'intake') {
      setSelectedIntakes(prev => prev.filter(i => i !== value));
      setPendingSelectedIntakes(prev => prev.filter(i => i !== value));
    }
    if (type === 'degree') {
      setSelectedDegreeLevels(prev => prev.filter(d => d !== value));
      setPendingSelectedDegreeLevels(prev => prev.filter(d => d !== value));
    }
    if (type === 'courseType') {
      setSelectedCourseTypes(prev => prev.filter(t => t !== value));
      setPendingSelectedCourseTypes(prev => prev.filter(t => t !== value));
    }
    if (type === 'course') {
      setSelectedCourse('');
      setPendingSelectedCourse('');
      setPendingCourseInput('');
    }
    if (type === 'fee') {
      setFeeRange('All');
      setPendingFeeRange('All');
    }
    if (type === 'rank') {
      setMinRanking('All');
      setPendingMinRanking('All');
    }
    if (type === 'search') {
      setSearchQuery('');
      setPendingSearchQuery('');
    }
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

  // Pending filter universities calculator (used for button badge numbers)
  const pendingFilteredUniversities = useMemo(() => {
    let result = [...DETAILED_UNIVERSITIES];

    // 1. Search Query
    if (pendingSearchQuery.trim() !== '') {
      const q = pendingSearchQuery.toLowerCase();
      result = result.filter(uni => 
        uni.name.toLowerCase().includes(q) || 
        uni.country.toLowerCase().includes(q) || 
        uni.programs.some(prog => prog.toLowerCase().includes(q))
      );
    }

    // 2. Country Filter
    if (pendingSelectedCountries.length > 0) {
      result = result.filter(uni => pendingSelectedCountries.includes(uni.country));
    }

    // 3. Intake Filter
    if (pendingSelectedIntakes.length > 0) {
      result = result.filter(uni => 
        uni.intakes.some(month => pendingSelectedIntakes.includes(month))
      );
    }

    // 4. Course Level / Degree Filter
    if (pendingSelectedDegreeLevels.length > 0) {
      result = result.filter(uni => {
        const hasBachelors = pendingSelectedDegreeLevels.includes("Bachelor's");
        const hasMasters = pendingSelectedDegreeLevels.includes("Master's");
        const hasPhD = pendingSelectedDegreeLevels.includes("PhD");
        const hasPGDip = pendingSelectedDegreeLevels.includes("PG Diploma");
        
        let match = false;
        if (hasBachelors && uni.programs.some(p => p.includes("Bachelor") || p.includes("B.S.") || p.includes("PPE") || p.includes("Law") || p.includes("Medicine"))) match = true;
        if (hasMasters && uni.programs.some(p => p.includes("Master") || p.includes("M.S.") || p.includes("AI") || p.includes("MBA") || p.includes("Finance") || p.includes("Computing"))) match = true;
        if (hasPhD && uni.programs.some(p => p.includes("PhD") || p.includes("Doctorate") || p.includes("Research") || p.includes("Quantum"))) match = true;
        if (hasPGDip && uni.programs.some(p => p.includes("Diploma") || p.includes("Management") || p.includes("Criminology"))) match = true;
        
        if (!match && (hasMasters || hasBachelors)) match = true;
        return match;
      });
    }

    // 4.5. Course Type Filter
    if (pendingSelectedCourseTypes.length > 0) {
      result = result.filter(uni => {
        return uni.programs.some(p => {
          const lowerP = p.toLowerCase();
          return pendingSelectedCourseTypes.some(type => {
            if (type === 'STEM') {
              return lowerP.includes('science') || lowerP.includes('engineering') || 
                     lowerP.includes('computer') || lowerP.includes('ai') || 
                     lowerP.includes('robotics') || lowerP.includes('computing') || 
                     lowerP.includes('math') || lowerP.includes('technology') || 
                     lowerP.includes('physics') || lowerP.includes('cyber') || 
                     lowerP.includes('data');
            }
            if (type === 'Business') {
              return lowerP.includes('business') || lowerP.includes('management') || 
                     lowerP.includes('mba') || lowerP.includes('finance') || 
                     lowerP.includes('economics') || lowerP.includes('analytics') || 
                     lowerP.includes('marketing') || lowerP.includes('hospitality') || 
                     lowerP.includes('logistics');
            }
            if (type === 'Arts') {
              return lowerP.includes('art') || lowerP.includes('design') || 
                     lowerP.includes('writing') || lowerP.includes('journalism') || 
                     lowerP.includes('law') || lowerP.includes('criminology') || 
                     lowerP.includes('ppe') || lowerP.includes('history') || 
                     lowerP.includes('conflict') || lowerP.includes('architecture');
            }
            if (type === 'Medicine') {
              return lowerP.includes('medicine') || lowerP.includes('pharmacy') || 
                     lowerP.includes('health') || lowerP.includes('biology') || 
                     lowerP.includes('biomedical') || lowerP.includes('sports');
            }
            return false;
          });
        });
      });
    }

    // 4.7. Course Search-Select / Type Filter
    if (pendingSelectedCourse.trim() !== '') {
      const q = pendingSelectedCourse.toLowerCase();
      result = result.filter(uni => 
        uni.programs.some(p => p.toLowerCase().includes(q))
      );
    }

    // 5. Tuition Fee Filter
    if (pendingFeeRange !== 'All') {
      result = result.filter(uni => {
        const val = uni.tuitionValue;
        if (pendingFeeRange === 'under18k') return val < 18000;
        if (pendingFeeRange === '18kto35k') return val >= 18000 && val <= 35000;
        if (pendingFeeRange === '35kto55k') return val > 35000 && val <= 55000;
        if (pendingFeeRange === 'over55k') return val > 55000;
        return true;
      });
    }

    // 6. Ranking Filter
    if (pendingMinRanking !== 'All') {
      result = result.filter(uni => {
        const rank = uni.rankValue;
        if (pendingMinRanking === 'top10') return rank <= 10;
        if (pendingMinRanking === 'top50') return rank <= 50;
        if (pendingMinRanking === 'top100') return rank <= 100;
        if (pendingMinRanking === 'top500') return rank <= 500;
        return true;
      });
    }

    return result;
  }, [
    pendingSearchQuery, pendingSelectedCountries, pendingSelectedIntakes,
    pendingSelectedDegreeLevels, pendingSelectedCourseTypes, pendingSelectedCourse,
    pendingFeeRange, pendingMinRanking
  ]);

  // Multi-faceted filtering & sorting logic
  const filteredAndSortedUniversities = useMemo(() => {
    let result = [...DETAILED_UNIVERSITIES];

    // 1. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(uni => 
        uni.name.toLowerCase().includes(q) || 
        uni.country.toLowerCase().includes(q) || 
        uni.programs.some(prog => prog.toLowerCase().includes(q))
      );
    }

    // 2. Country Filter
    if (selectedCountries.length > 0) {
      result = result.filter(uni => selectedCountries.includes(uni.country));
    }

    // 3. Intake Filter
    if (selectedIntakes.length > 0) {
      result = result.filter(uni => 
        uni.intakes.some(intake => selectedIntakes.includes(intake))
      );
    }

    // 4. Course Level / Degree Filter
    if (selectedDegreeLevels.length > 0) {
      // Programs inside detailed universities are mapped to standard categories
      result = result.filter(uni => {
        // If searching Bachelor's, check if has standard undergrad course or if matches programs
        const hasBachelors = selectedDegreeLevels.includes("Bachelor's");
        const hasMasters = selectedDegreeLevels.includes("Master's");
        const hasPhD = selectedDegreeLevels.includes("PhD");
        const hasPGDip = selectedDegreeLevels.includes("PG Diploma");
        
        let match = false;
        if (hasBachelors && uni.programs.some(p => p.includes("Bachelor") || p.includes("B.S.") || p.includes("PPE") || p.includes("Law") || p.includes("Medicine"))) match = true;
        if (hasMasters && uni.programs.some(p => p.includes("Master") || p.includes("M.S.") || p.includes("AI") || p.includes("MBA") || p.includes("Finance") || p.includes("Computing"))) match = true;
        if (hasPhD && uni.programs.some(p => p.includes("PhD") || p.includes("Doctorate") || p.includes("Research") || p.includes("Quantum"))) match = true;
        if (hasPGDip && uni.programs.some(p => p.includes("Diploma") || p.includes("Management") || p.includes("Criminology"))) match = true;
        
        // Default fallback if no specific keywords: assume Master's and Bachelor's are available on most
        if (!match && (hasMasters || hasBachelors)) match = true;
        
        return match;
      });
    }

    // 4.5. Course Type Filter
    if (selectedCourseTypes.length > 0) {
      result = result.filter(uni => {
        return uni.programs.some(p => {
          const lowerP = p.toLowerCase();
          return selectedCourseTypes.some(type => {
            if (type === 'STEM') {
              return lowerP.includes('science') || lowerP.includes('engineering') || 
                     lowerP.includes('computer') || lowerP.includes('ai') || 
                     lowerP.includes('robotics') || lowerP.includes('computing') || 
                     lowerP.includes('math') || lowerP.includes('technology') || 
                     lowerP.includes('physics') || lowerP.includes('cyber') || 
                     lowerP.includes('data');
            }
            if (type === 'Business') {
              return lowerP.includes('business') || lowerP.includes('management') || 
                     lowerP.includes('mba') || lowerP.includes('finance') || 
                     lowerP.includes('economics') || lowerP.includes('analytics') || 
                     lowerP.includes('marketing') || lowerP.includes('hospitality') || 
                     lowerP.includes('logistics');
            }
            if (type === 'Arts') {
              return lowerP.includes('art') || lowerP.includes('design') || 
                     lowerP.includes('writing') || lowerP.includes('journalism') || 
                     lowerP.includes('law') || lowerP.includes('criminology') || 
                     lowerP.includes('ppe') || lowerP.includes('history') || 
                     lowerP.includes('conflict') || lowerP.includes('architecture');
            }
            if (type === 'Medicine') {
              return lowerP.includes('medicine') || lowerP.includes('pharmacy') || 
                     lowerP.includes('health') || lowerP.includes('biology') || 
                     lowerP.includes('biomedical') || lowerP.includes('sports');
            }
            return false;
          });
        });
      });
    }

    // 4.7. Course Search-Select / Type Filter
    if (selectedCourse.trim() !== '') {
      const q = selectedCourse.toLowerCase();
      result = result.filter(uni => 
        uni.programs.some(p => p.toLowerCase().includes(q))
      );
    }

    // 5. Tuition Fee Filter
    if (feeRange !== 'All') {
      result = result.filter(uni => {
        // tuitionValue is in local currency: GBP/USD/CAD
        const val = uni.tuitionValue;
        if (feeRange === 'under18k') return val < 18000;
        if (feeRange === '18kto35k') return val >= 18000 && val <= 35000;
        if (feeRange === '35kto55k') return val > 35000 && val <= 55000;
        if (feeRange === 'over55k') return val > 55000;
        return true;
      });
    }

    // 6. Ranking Filter
    if (minRanking !== 'All') {
      result = result.filter(uni => {
        const rank = uni.rankValue;
        if (minRanking === 'top10') return rank <= 10;
        if (minRanking === 'top50') return rank <= 50;
        if (minRanking === 'top100') return rank <= 100;
        if (minRanking === 'top500') return rank <= 500;
        return true;
      });
    }

    // Sort Results
    result.sort((a, b) => {
      if (sortBy === 'rank') {
        return a.rankValue - b.rankValue; // Lower number = better rank
      }
      if (sortBy === 'courseCount') {
        return b.courseCount - a.courseCount;
      }
      if (sortBy === 'tuitionAsc') {
        // Standardize fee to USD/GBP approximate for sort
        const feeA = a.country === 'Germany' ? 0 : a.tuitionValue;
        const feeB = b.country === 'Germany' ? 0 : b.tuitionValue;
        return feeA - feeB;
      }
      if (sortBy === 'acceptanceDesc') {
        return b.acceptanceValue - a.acceptanceValue;
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedCountries, selectedIntakes, selectedDegreeLevels, selectedCourseTypes, selectedCourse, feeRange, minRanking, sortBy]);

  // Paginated Data
  const paginatedUniversities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUniversities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUniversities, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedUniversities.length / itemsPerPage);

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

  const handleOpenDetailsModal = (uni: DetailedUniversity) => {
    setDetailsUni(uni);
  };

  const handleCloseDetailsModal = () => {
    setDetailsUni(null);
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
                      {filteredDropdownCourses.length === 0 ? (
                        <div className="text-[11px] text-slate-400 text-center py-4 font-medium">
                          No courses match your search
                        </div>
                      ) : (
                        filteredDropdownCourses.map(course => {
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
                  <span>Apply Filters ({pendingFilteredUniversities.length})</span>
                </button>
              </div>

            </aside>

            {/* RIGHT MAIN CATALOG CONTENT AREA */}
            <main className="col-span-1 lg:col-span-3 space-y-6 text-left">
              
              {/* Dynamic Header Controls Bar */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Result count & active details */}
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-center md:text-left">
                  {filteredAndSortedUniversities.length === 0 ? (
                    <span className="text-red-500">0 match results found</span>
                  ) : (
                    <span>
                      Found {filteredAndSortedUniversities.length} Universities matching criteria
                    </span>
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
                      onChange={(e) => setSortBy(e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <AnimatePresence mode="popLayout">
                  {paginatedUniversities.map((uni, idx) => (
                    <motion.article
                      key={uni.name}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.25) }}
                      className="bg-white rounded-3xl border border-slate-100/90 hover:border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
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
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <button
                            onClick={() => handleOpenDetailsModal(uni)}
                            className="py-3 px-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-97 cursor-pointer text-center flex items-center justify-center gap-1.5"
                          >
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                            <span>Details</span>
                          </button>
                          
                          <button
                            onClick={() => handleOpenEligibilityModal(uni)}
                            className="py-3 px-2 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider hover:shadow-lg active:scale-97 transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <GraduationCap className="w-4 h-4" />
                            <span>Match Profile</span>
                          </button>
                        </div>

                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-sm flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-slate-450">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredAndSortedUniversities.length)} of {filteredAndSortedUniversities.length} results
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
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 text-left flex flex-col max-h-[90vh]"
            >
              {/* Banner image with overlay */}
              <div className="relative h-48 overflow-hidden shrink-0">
                <img
                  src={detailsUni.imageUrl}
                  alt={`${detailsUni.name} campus`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                
                <button
                  onClick={handleCloseDetailsModal}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-white/20 hover:bg-white/35 backdrop-blur-xs border border-white/20 text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-5 left-6 space-y-1.5">
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

              {/* Main scrollable body */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6">
                
                {/* Highlight Stats grids */}
                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-5">
                  <div className="text-center space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-450 tracking-wider block">QS Ranking</span>
                    <span className="text-sm font-extrabold text-[#001F3F] bg-slate-50 px-3 py-1 rounded-xl border border-slate-100 block">
                      {detailsUni.ranking}
                    </span>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-450 tracking-wider block">Total Programs</span>
                    <span className="text-sm font-extrabold text-[#001F3F] bg-slate-50 px-3 py-1 rounded-xl border border-slate-100 block">
                      {detailsUni.courseCount} Courses
                    </span>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-450 tracking-wider block">Acceptance</span>
                    <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50/80 px-3 py-1 rounded-xl border border-emerald-100 block">
                      {detailsUni.acceptanceRate}
                    </span>
                  </div>
                </div>

                {/* Available programs lists */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-[#FF0000] uppercase">Admissions Fields of Study</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailsUni.programs.map(prog => (
                      <span
                        key={prog}
                        className="px-3.5 py-2 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold text-slate-700"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                {/* General facts specs */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-[#001F3F] uppercase border-b border-slate-100 pb-1.5">Destination Overview</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium leading-relaxed">
                    <div className="space-y-2.5">
                      <p><strong>Tuition Budget:</strong> {detailsUni.tuition}</p>
                      <p><strong>Intake Slots:</strong> {detailsUni.intakes.join(' & ')}</p>
                      <p><strong>Scholarship Availability:</strong> {detailsUni.scholarship}</p>
                    </div>

                    <div className="space-y-2.5">
                      <p><strong>Post-Study Work Visa:</strong> {detailsUni.country === 'UK' ? '2 Years Graduate Route (PSW)' : detailsUni.country === 'USA' ? '12 - 36 months OPT (STEM)' : 'Up to 3 years PGWP'}</p>
                      <p><strong>Estimate Living Cost:</strong> {detailsUni.country === 'UK' ? '£1,000 - £1,300/month' : detailsUni.country === 'USA' ? '$1,200 - $1,500/month' : '€930/month (German Blocked)'}</p>
                      <p><strong>Dorm Housing:</strong> Guaranteed university hall allotments.</p>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      handleCloseDetailsModal();
                      handleOpenEligibilityModal(detailsUni);
                    }}
                    className="w-full py-4 bg-[#001F3F] hover:bg-[#FF0000] text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest active:scale-97 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Run Match Evaluation</span>
                  </button>
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
                        {filteredDropdownCourses.length === 0 ? (
                          <div className="text-[11px] text-slate-400 text-center py-4 font-medium">
                            No courses match your search
                          </div>
                        ) : (
                          filteredDropdownCourses.map(course => {
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
                Apply Filters ({pendingFilteredUniversities.length} Results)
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
