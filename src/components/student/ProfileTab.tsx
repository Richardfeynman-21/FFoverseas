'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, ChevronDown, ChevronUp, Plus, Trash2, ShieldAlert, Award, FileText, Info
} from 'lucide-react';

interface School {
  id: string;
  level: string;
  country: string;
  name: string;
  gradingScheme: string;
  language: string;
  from: string;
  to: string;
  degreeName: string;
  graduated: string;
  graduationDate: string;
  hasCertificate: boolean;
  address: string;
  city: string;
  state: string;
  zip: string;
  isCollapsed?: boolean;
}

interface ProfileData {
  // Personal Info
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  firstLanguage: string;
  citizenship: string;
  passportNumber: string;
  passportExpiry: string;
  maritalStatus: 'Single' | 'Married';
  gender: 'Male' | 'Female';
  
  // Address Detail
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  email: string;
  phone: string;

  // Education Summary
  eduCountry: string;
  eduHighestLevel: string;
  eduGradingScheme: string;
  eduGradeAverage: string;
  eduGraduated: string;

  // Schools Attended
  schools: School[];

  // Test Scores
  englishProof: 'yes' | 'no_exemption' | 'no_exemption_nationality' | 'no_plan';
  englishTestType: 'TOEFL' | 'IELTS' | 'PTE' | 'Duolingo' | 'Other';
  duolingoScore: string;
  duolingoDate: string;
  toeflScore: string;
  toeflDate: string;
  ieltsScore: string;
  ieltsDate: string;
  pteScore: string;
  pteDate: string;
  openToLanguageCourse: boolean;
  hasGmat: boolean;
  hasGre: boolean;
  greVerbalScore: string;
  greVerbalRank: string;
  greQuantScore: string;
  greQuantRank: string;
  greAwaScore: string;
  greAwaRank: string;
  greDate: string;

  // Visa & Study Permit
  refusedVisa: 'Yes' | 'No';
  validPermits: string[];
  visaRefusalDetails: string;
}

const DEFAULT_PROFILE_DATA: ProfileData = {
  firstName: 'Abhinove Reddy',
  middleName: '',
  lastName: 'Survi',
  dob: '2001-10-19',
  firstLanguage: 'Telugu',
  citizenship: 'India',
  passportNumber: 'W2059454',
  passportExpiry: '2032-06-26',
  maritalStatus: 'Single',
  gender: 'Male',
  address: '1-64, Rudravelly,Yadadri Bhongir',
  city: 'Hyderabad',
  country: 'India',
  state: 'Telangana',
  zip: '508126',
  email: 'abhinovereddy19@gmail.com',
  phone: '+91 90105 51441',
  eduCountry: 'India',
  eduHighestLevel: '4-Year Bachelors Degree',
  eduGradingScheme: 'Higher Education (Bachelor and above) Grading Scheme',
  eduGradeAverage: '7',
  eduGraduated: 'Yes',
  schools: [
    {
      id: 'school-1',
      level: '4-Year Bachelors Degree',
      country: 'India',
      name: 'Holy Mary Institute Of Technology & Science',
      gradingScheme: 'Higher Education (Bachelor and above) Grading Scheme',
      language: 'English',
      from: '2019-08-08',
      to: '2023-07-08',
      degreeName: '4-Year Bachelors Degree',
      graduated: 'Yes',
      graduationDate: '2023-07-08',
      hasCertificate: true,
      address: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '508126',
      isCollapsed: false,
    },
    {
      id: 'school-2',
      level: 'Grade 12 / High School',
      country: 'India',
      name: 'Kakatiya Junior College',
      gradingScheme: 'Standard Grading Scheme',
      language: 'English',
      from: '2017-06-08',
      to: '2019-05-30',
      degreeName: 'Intermediate',
      graduated: 'Yes',
      graduationDate: '2019-05-30',
      hasCertificate: true,
      address: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '508126',
      isCollapsed: true,
    },
    {
      id: 'school-3',
      level: 'Grade 10',
      country: 'India',
      name: 'Mary Mother Of Divine Grace High School',
      gradingScheme: 'Standard Grading Scheme',
      language: 'English',
      from: '2016-06-06',
      to: '2017-03-30',
      degreeName: '10th class',
      graduated: 'Yes',
      graduationDate: '2017-03-30',
      hasCertificate: true,
      address: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '508126',
      isCollapsed: true,
    }
  ],
  englishProof: 'yes',
  englishTestType: 'Duolingo',
  duolingoScore: '125',
  duolingoDate: '2023-08-18',
  toeflScore: '',
  toeflDate: '',
  ieltsScore: '',
  ieltsDate: '',
  pteScore: '',
  pteDate: '',
  openToLanguageCourse: false,
  hasGmat: false,
  hasGre: true,
  greVerbalScore: '157',
  greVerbalRank: '73',
  greQuantScore: '168',
  greQuantRank: '87',
  greAwaScore: '2.5',
  greAwaRank: '7',
  greDate: '2022-08-24',
  refusedVisa: 'No',
  validPermits: [],
  visaRefusalDetails: ''
};

export const ProfileTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'education' | 'scores' | 'visa'>('general');
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('ff_profile_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROFILE_DATA;
  });

  // Collapsible cards state
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({
    personal: false,
    address: false,
    eduSummary: false,
    schools: false,
    english: false,
    greGmat: false,
    visaPermit: false
  });

  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ff_profile_data', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSchoolChange = (schoolId: string, field: keyof School, value: any) => {
    setProfile(prev => ({
      ...prev,
      schools: prev.schools.map(s => s.id === schoolId ? { ...s, [field]: value } : s)
    }));
  };

  const addSchool = () => {
    const newSchool: School = {
      id: `school-${Date.now()}`,
      level: 'Grade 12 / High School',
      country: 'India',
      name: '',
      gradingScheme: 'Standard Grading Scheme',
      language: 'English',
      from: '',
      to: '',
      degreeName: '',
      graduated: 'Yes',
      graduationDate: '',
      hasCertificate: false,
      address: '',
      city: '',
      state: '',
      zip: '',
      isCollapsed: false
    };

    setProfile(prev => ({
      ...prev,
      schools: [...prev.schools, newSchool]
    }));
    setToastMsg({ text: 'Added new school entry.', type: 'success' });
  };

  const deleteSchool = (schoolId: string) => {
    setProfile(prev => ({
      ...prev,
      schools: prev.schools.filter(s => s.id !== schoolId)
    }));
    setToastMsg({ text: 'Removed school entry.', type: 'success' });
  };

  const toggleCard = (cardKey: string) => {
    setCollapsedCards(prev => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  const toggleSchoolCollapse = (schoolId: string) => {
    setProfile(prev => ({
      ...prev,
      schools: prev.schools.map(s => s.id === schoolId ? { ...s, isCollapsed: !s.isCollapsed } : s)
    }));
  };

  const handleSaveAndContinue = () => {
    setToastMsg({ text: 'Profile changes saved successfully!', type: 'success' });
    
    // Auto-advance tabs
    if (activeSubTab === 'general') setActiveSubTab('education');
    else if (activeSubTab === 'education') setActiveSubTab('scores');
    else if (activeSubTab === 'scores') setActiveSubTab('visa');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePermitToggle = (permit: string) => {
    setProfile(prev => {
      const exists = prev.validPermits.includes(permit);
      if (exists) {
        return {
          ...prev,
          validPermits: prev.validPermits.filter(p => p !== permit)
        };
      } else {
        return {
          ...prev,
          validPermits: [...prev.validPermits, permit]
        };
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
      {/* ── LEFT INNER SUB-NAVIGATION ── */}
      <nav className="w-full lg:w-64 bg-white rounded-3xl p-5 border border-slate-100 shadow-xl shadow-slate-900/2 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 scrollbar-hide">
        {[
          { key: 'general', label: 'General Information' },
          { key: 'education', label: 'Education History' },
          { key: 'scores', label: 'Test Scores' },
          { key: 'visa', label: 'Visa & Study Permit' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-semibold text-xs tracking-wide transition-all whitespace-nowrap lg:w-full cursor-pointer relative ${
                isActive 
                  ? 'bg-primary/5 text-primary' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeSubTabIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-lg hidden lg:block"
                />
              )}
              {/* Checkmark icon for completeness */}
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Check size={12} className="stroke-[3]" />
              </div>
              <span className="flex-1">{tab.label}</span>
              {isActive && (
                <span className="text-primary hidden lg:inline-block font-mono text-sm leading-none">&rarr;</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── MAIN CARD AREA ── */}
      <div className="flex-1 w-full space-y-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#001F3F]">My Profile</h2>

        <AnimatePresence mode="wait">
          {/* GENERAL INFO TAB */}
          {activeSubTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Card 1: Personal Information */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/2">
                <button
                  onClick={() => toggleCard('personal')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left border-b border-slate-50 hover:bg-slate-50/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-[#001F3F]/5 text-primary rounded-lg material-symbols-outlined text-[20px]">person</span>
                    <h3 className="font-bold text-[#001F3F]">Personal Information</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-400 font-mono select-none">Registration Date: December 7th, 2023</span>
                    {collapsedCards.personal ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {!collapsedCards.personal && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* First name */}
                          <div className="relative">
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              First name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={profile.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>

                          {/* Middle name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Middle name
                            </label>
                            <input
                              type="text"
                              value={profile.middleName}
                              onChange={(e) => handleInputChange('middleName', e.target.value)}
                              placeholder="Middle name"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>

                          {/* Last name */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Last name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={profile.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* Date of birth */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Date of birth <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={profile.dob}
                              onChange={(e) => handleInputChange('dob', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>

                          {/* First language */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              First language <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={profile.firstLanguage}
                              onChange={(e) => handleInputChange('firstLanguage', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>

                          {/* Country of citizenship */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Country of citizenship <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={profile.citizenship}
                              onChange={(e) => handleInputChange('citizenship', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                            >
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Passport number */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Passport number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={profile.passportNumber}
                              onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>

                          {/* Passport expiry date */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Passport expiry date
                            </label>
                            <input
                              type="date"
                              value={profile.passportExpiry}
                              onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                          {/* Marital Status */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase font-mono tracking-wider">
                              Marital Status <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-6">
                              {['Single', 'Married'].map((status) => (
                                <label key={status} className="flex items-center gap-2.5 font-semibold text-sm text-[#001F3F] cursor-pointer">
                                  <input
                                    type="radio"
                                    name="maritalStatus"
                                    value={status}
                                    checked={profile.maritalStatus === status}
                                    onChange={() => handleInputChange('maritalStatus', status)}
                                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary focus:ring-1"
                                  />
                                  <span>{status}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Gender */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase font-mono tracking-wider">
                              Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-6">
                              {['Male', 'Female'].map((gender) => (
                                <label key={gender} className="flex items-center gap-2.5 font-semibold text-sm text-[#001F3F] cursor-pointer">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value={gender}
                                    checked={profile.gender === gender}
                                    onChange={() => handleInputChange('gender', gender)}
                                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary focus:ring-1"
                                  />
                                  <span>{gender}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card 2: Address Detail */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/2">
                <button
                  onClick={() => toggleCard('address')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left border-b border-slate-50 hover:bg-slate-50/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-[#001F3F]/5 text-primary rounded-lg material-symbols-outlined text-[20px]">home</span>
                    <h3 className="font-bold text-[#001F3F]">Address Detail</h3>
                  </div>
                  {collapsedCards.address ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {!collapsedCards.address && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* Address */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={profile.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>

                          {/* City/Town */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              City/ Town <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={profile.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* Country */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Country <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={profile.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                            >
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                            </select>
                          </div>

                          {/* State */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Province/ State <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={profile.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                            >
                              <option value="Telangana">Telangana</option>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Karnataka">Karnataka</option>
                            </select>
                          </div>

                          {/* Postal Code */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Postal/ Zip code
                            </label>
                            <input
                              type="text"
                              value={profile.zip}
                              onChange={(e) => handleInputChange('zip', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Email */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Email
                            </label>
                            <input
                              type="email"
                              value={profile.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>

                          {/* Phone number */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Phone number <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                              {/* Simple Mock Country Flag Indicator */}
                              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl select-none">
                                <span className="text-xs">🇮🇳</span>
                              </div>
                              <input
                                type="text"
                                value={profile.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveAndContinue}
                  className="px-8 py-3 bg-primary hover:bg-slate-800 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Save & Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* EDUCATION TAB */}
          {activeSubTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Card 1: Education Summary */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/2">
                <button
                  onClick={() => toggleCard('eduSummary')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left border-b border-slate-50 hover:bg-slate-50/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-[#001F3F]/5 text-primary rounded-lg material-symbols-outlined text-[20px]">school</span>
                    <h3 className="font-bold text-[#001F3F]">Education Summary</h3>
                  </div>
                  {collapsedCards.eduSummary ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {!collapsedCards.eduSummary && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 space-y-6">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide bg-slate-50 px-4 py-3 rounded-2xl flex items-center gap-2">
                          <Info size={16} className="text-primary shrink-0" />
                          <span>Please enter the information for the highest academic level that you have completed.</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Country of Education */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Country of education <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={profile.eduCountry}
                              onChange={(e) => handleInputChange('eduCountry', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                            >
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                            </select>
                          </div>

                          {/* Highest Level of Education */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Highest level of education <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={profile.eduHighestLevel}
                              onChange={(e) => handleInputChange('eduHighestLevel', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                            >
                              <option value="4-Year Bachelors Degree">4-Year Bachelors Degree</option>
                              <option value="3-Year Bachelors Degree">3-Year Bachelors Degree</option>
                              <option value="Master Degree">Master Degree</option>
                              <option value="Grade 12 / High School">Grade 12 / High School</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Grading scheme */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Grading scheme <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={profile.eduGradingScheme}
                              onChange={(e) => handleInputChange('eduGradingScheme', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                            >
                              <option value="Higher Education (Bachelor and above) Grading Scheme">Higher Education (Bachelor and above) Grading Scheme</option>
                              <option value="Standard Grading Scheme">Standard Grading Scheme</option>
                            </select>
                          </div>

                          {/* Grade average */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                              Grade average <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={profile.eduGradeAverage}
                              onChange={(e) => handleInputChange('eduGradeAverage', e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        {/* I have graduated */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase font-mono tracking-wider">
                            I have graduated from this institution <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-6">
                            {['Yes', 'No'].map((choice) => (
                              <label key={choice} className="flex items-center gap-2.5 font-semibold text-sm text-[#001F3F] cursor-pointer">
                                <input
                                  type="radio"
                                  name="eduGraduated"
                                  value={choice}
                                  checked={profile.eduGraduated === choice}
                                  onChange={() => handleInputChange('eduGraduated', choice)}
                                  className="w-4 h-4 text-primary border-slate-300 focus:ring-primary focus:ring-1"
                                />
                                <span>{choice}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card 2: Schools Attended */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/2">
                <button
                  onClick={() => toggleCard('schools')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left border-b border-slate-50 hover:bg-slate-50/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-[#001F3F]/5 text-primary rounded-lg material-symbols-outlined text-[20px]">corporate_fare</span>
                    <h3 className="font-bold text-[#001F3F]">Schools Attended</h3>
                  </div>
                  {collapsedCards.schools ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {!collapsedCards.schools && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 space-y-6">
                        {profile.schools.map((school, index) => (
                          <div 
                            key={school.id}
                            className="border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-md shadow-slate-100/50"
                          >
                            {/* Inner School Header */}
                            <button
                              onClick={() => toggleSchoolCollapse(school.id)}
                              className="w-full px-6 py-4 flex items-center justify-between text-left bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100/50 cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                  <Check size={12} className="stroke-[3]" />
                                </div>
                                <span className="font-bold text-[#001F3F] text-xs uppercase font-mono tracking-wider truncate flex-1">
                                  {school.level}: {school.name || '(Enter School Name)'}
                                </span>
                              </div>
                              {school.isCollapsed ? <ChevronDown size={16} className="text-slate-400 shrink-0" /> : <ChevronUp size={16} className="text-slate-400 shrink-0" />}
                            </button>

                            {/* Inner School Fields */}
                            <AnimatePresence>
                              {!school.isCollapsed && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                      {/* Country */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Country of institution <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                          value={school.country}
                                          onChange={(e) => handleSchoolChange(school.id, 'country', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                                        >
                                          <option value="India">India</option>
                                          <option value="United States">United States</option>
                                          <option value="Canada">Canada</option>
                                        </select>
                                      </div>

                                      {/* Name */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Name of institution <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={school.name}
                                          onChange={(e) => handleSchoolChange(school.id, 'name', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                      {/* Level */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Level of education <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                          value={school.level}
                                          onChange={(e) => handleSchoolChange(school.id, 'level', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                                        >
                                          <option value="4-Year Bachelors Degree">4-Year Bachelors Degree</option>
                                          <option value="Grade 12 / High School">Grade 12 / High School</option>
                                          <option value="Grade 10">Grade 10</option>
                                        </select>
                                      </div>

                                      {/* Grading Scheme */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Grading Scheme <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                          value={school.gradingScheme}
                                          onChange={(e) => handleSchoolChange(school.id, 'gradingScheme', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all cursor-pointer"
                                        >
                                          <option value="Higher Education (Bachelor and above) Grading Scheme">Higher Education (Bachelor and above) Grading Scheme</option>
                                          <option value="Standard Grading Scheme">Standard Grading Scheme</option>
                                        </select>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                      {/* Primary language */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Primary language of instruction <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={school.language}
                                          onChange={(e) => handleSchoolChange(school.id, 'language', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                                        />
                                      </div>

                                      {/* Attended from */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Attended institution from <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="date"
                                          value={school.from}
                                          onChange={(e) => handleSchoolChange(school.id, 'from', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                                        />
                                      </div>

                                      {/* Attended to */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Attended institution to <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="date"
                                          value={school.to}
                                          onChange={(e) => handleSchoolChange(school.id, 'to', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                      {/* Degree name */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Degree name
                                        </label>
                                        <input
                                          type="text"
                                          value={school.degreeName}
                                          onChange={(e) => handleSchoolChange(school.id, 'degreeName', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                                        />
                                      </div>

                                      {/* Graduation date */}
                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase font-mono tracking-wider">
                                          Graduation date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="date"
                                          value={school.graduationDate}
                                          onChange={(e) => handleSchoolChange(school.id, 'graduationDate', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all"
                                        />
                                      </div>
                                    </div>

                                    {/* Physical Certificate Checkbox */}
                                    <label className="flex items-center gap-2.5 font-semibold text-sm text-[#001F3F] cursor-pointer bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                      <input
                                        type="checkbox"
                                        checked={school.hasCertificate}
                                        onChange={(e) => handleSchoolChange(school.id, 'hasCertificate', e.target.checked)}
                                        className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary focus:ring-1"
                                      />
                                      <span>I have the physical certificate for this degree</span>
                                    </label>

                                    {/* Sub-card: School Address */}
                                    <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 space-y-4">
                                      <h4 className="text-xs font-bold text-[#001F3F] font-mono tracking-wider uppercase">School Address</h4>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase font-mono">Address *</label>
                                          <input
                                            type="text"
                                            value={school.address}
                                            onChange={(e) => handleSchoolChange(school.id, 'address', e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#001F3F] outline-none focus:border-primary transition-all"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase font-mono">City/ Town *</label>
                                          <input
                                            type="text"
                                            value={school.city}
                                            onChange={(e) => handleSchoolChange(school.id, 'city', e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#001F3F] outline-none focus:border-primary transition-all"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase font-mono">Province/ State</label>
                                          <input
                                            type="text"
                                            value={school.state}
                                            onChange={(e) => handleSchoolChange(school.id, 'state', e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#001F3F] outline-none focus:border-primary transition-all"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase font-mono">Postal/ Zip code</label>
                                          <input
                                            type="text"
                                            value={school.zip}
                                            onChange={(e) => handleSchoolChange(school.id, 'zip', e.target.value)}
                                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#001F3F] outline-none focus:border-primary transition-all"
                                          />
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center pt-2">
                                        <button
                                          onClick={() => deleteSchool(school.id)}
                                          className="text-xs font-bold text-red-500 hover:underline cursor-pointer flex items-center gap-1.5"
                                        >
                                          <Trash2 size={14} />
                                          <span>Delete School Entry</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            toggleSchoolCollapse(school.id);
                                            setToastMsg({ text: 'School address saved successfully!', type: 'success' });
                                          }}
                                          className="px-4 py-1.5 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                        >
                                          Save Details
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}

                        {/* Add Attended School Button */}
                        <div className="pt-2">
                          <button
                            onClick={addSchool}
                            className="flex items-center gap-2 text-xs font-bold text-primary hover:underline cursor-pointer bg-slate-50 border border-slate-200 border-dashed w-full justify-center py-3.5 rounded-2xl hover:bg-slate-100/50 transition-all"
                          >
                            <Plus size={16} />
                            <span>Add Attended School</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveAndContinue}
                  className="px-8 py-3 bg-primary hover:bg-slate-800 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Save & Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* TEST SCORES TAB */}
          {activeSubTab === 'scores' && (
            <motion.div
              key="scores"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Card 1: English Test Scores */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/2">
                <button
                  onClick={() => toggleCard('english')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left border-b border-slate-50 hover:bg-slate-50/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-[#001F3F]/5 text-primary rounded-lg material-symbols-outlined text-[20px]">award</span>
                    <h3 className="font-bold text-[#001F3F]">English Test Scores</h3>
                  </div>
                  {collapsedCards.english ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {!collapsedCards.english && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 space-y-6">
                        {/* Parent options */}
                        <div className="space-y-5">
                          {/* Option 1: Valid proof */}
                          <div className="space-y-3">
                            <label className="flex items-start gap-3 font-semibold text-sm text-[#001F3F] cursor-pointer">
                              <input
                                type="radio"
                                name="englishProof"
                                checked={profile.englishProof === 'yes'}
                                onChange={() => handleInputChange('englishProof', 'yes')}
                                className="w-4 h-4 text-primary border-slate-300 mt-0.5 focus:ring-primary focus:ring-1"
                              />
                              <span>I have valid proof of English language proficiency</span>
                            </label>

                            {/* Nested test type options */}
                            {profile.englishProof === 'yes' && (
                              <div className="pl-7 space-y-4 border-l border-slate-100 ml-2 py-1">
                                <div className="flex flex-wrap gap-5">
                                  {['TOEFL', 'IELTS', 'PTE', 'Duolingo', 'Other'].map((test) => (
                                    <label key={test} className="flex items-center gap-2 font-semibold text-xs text-[#001F3F] cursor-pointer">
                                      <input
                                        type="radio"
                                        name="englishTestType"
                                        value={test}
                                        checked={profile.englishTestType === test}
                                        onChange={() => handleInputChange('englishTestType', test)}
                                        className="w-3.5 h-3.5 text-primary border-slate-300 focus:ring-primary focus:ring-1"
                                      />
                                      <span>{test}</span>
                                    </label>
                                  ))}
                                </div>

                                {/* Duolingo Score input */}
                                {profile.englishTestType === 'Duolingo' && (
                                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4 max-w-lg">
                                    <h4 className="text-xs font-bold text-[#001F3F] font-mono tracking-wider uppercase">Your Scores</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Total score *</label>
                                        <input
                                          type="text"
                                          value={profile.duolingoScore}
                                          onChange={(e) => handleInputChange('duolingoScore', e.target.value)}
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:border-primary transition-all"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Date of exam *</label>
                                        <input
                                          type="date"
                                          value={profile.duolingoDate}
                                          onChange={(e) => handleInputChange('duolingoDate', e.target.value)}
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:border-primary transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* TOEFL / IELTS / PTE Placeholder inputs */}
                                {['TOEFL', 'IELTS', 'PTE', 'Other'].includes(profile.englishTestType) && (
                                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4 max-w-lg">
                                    <h4 className="text-xs font-bold text-[#001F3F] font-mono tracking-wider uppercase">Your Scores ({profile.englishTestType})</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Score *</label>
                                        <input
                                          type="text"
                                          placeholder="Enter score"
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:border-primary transition-all"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Date of exam *</label>
                                        <input
                                          type="date"
                                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:border-primary transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Option 2: Pending program admission */}
                          <label className="flex items-start gap-3 font-semibold text-sm text-[#001F3F] cursor-pointer">
                            <input
                              type="radio"
                              name="englishProof"
                              checked={profile.englishProof === 'no_exemption'}
                              onChange={() => handleInputChange('englishProof', 'no_exemption')}
                              className="w-4 h-4 text-primary border-slate-300 mt-0.5 focus:ring-primary focus:ring-1"
                            />
                            <span className="flex-1">I have not taken a language test and will only apply to programs allowing proof after acceptance</span>
                          </label>

                          {/* Option 3: Exemption */}
                          <label className="flex items-start gap-3 font-semibold text-sm text-[#001F3F] cursor-pointer">
                            <input
                              type="radio"
                              name="englishProof"
                              checked={profile.englishProof === 'no_exemption_nationality'}
                              onChange={() => handleInputChange('englishProof', 'no_exemption_nationality')}
                              className="w-4 h-4 text-primary border-slate-300 mt-0.5 focus:ring-primary focus:ring-1"
                            />
                            <span className="flex-1">I believe my academic or nationality background may qualify me for an exemption</span>
                          </label>

                          {/* Option 4: Do not plan */}
                          <label className="flex items-start gap-3 font-semibold text-sm text-[#001F3F] cursor-pointer">
                            <input
                              type="radio"
                              name="englishProof"
                              checked={profile.englishProof === 'no_plan'}
                              onChange={() => handleInputChange('englishProof', 'no_plan')}
                              className="w-4 h-4 text-primary border-slate-300 mt-0.5 focus:ring-primary focus:ring-1"
                            />
                            <span className="flex-1">I have not taken a language test, and do not plan to take one</span>
                          </label>
                        </div>

                        {/* Exemption Course Checkbox */}
                        <div className="pt-2 border-t border-slate-100">
                          <label className="flex items-start gap-2.5 font-semibold text-xs text-[#001F3F] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.openToLanguageCourse}
                              onChange={(e) => handleInputChange('openToLanguageCourse', e.target.checked)}
                              className="w-4 h-4 text-primary border-slate-300 rounded mt-0.5 focus:ring-primary focus:ring-1"
                            />
                            <span className="flex-1 leading-relaxed">I'm open to taking a language proficiency course before starting my academic program</span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card 2: GRE or GMAT Scores */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/2">
                <button
                  onClick={() => toggleCard('greGmat')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left border-b border-slate-50 hover:bg-slate-50/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-[#001F3F]/5 text-primary rounded-lg material-symbols-outlined text-[20px]">equalizer</span>
                    <h3 className="font-bold text-[#001F3F]">GRE or GMAT Scores</h3>
                  </div>
                  {collapsedCards.greGmat ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {!collapsedCards.greGmat && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 space-y-6">
                        {/* Toggle Switches */}
                        <div className="space-y-4 max-w-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[#001F3F]">I have GMAT exam scores</span>
                            <button
                              onClick={() => handleInputChange('hasGmat', !profile.hasGmat)}
                              className={`w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer outline-none ${
                                profile.hasGmat ? 'bg-primary' : 'bg-slate-200'
                              }`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                                profile.hasGmat ? 'left-6' : 'left-1'
                              }`} />
                            </button>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[#001F3F]">I have GRE exam scores</span>
                            <button
                              onClick={() => handleInputChange('hasGre', !profile.hasGre)}
                              className={`w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer outline-none ${
                                profile.hasGre ? 'bg-primary' : 'bg-slate-200'
                              }`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                                profile.hasGre ? 'left-6' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        </div>

                        {/* GRE Input Section */}
                        {profile.hasGre && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-5 border-t border-slate-100 pt-5 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {/* Verbal */}
                              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                                <h4 className="text-xs font-bold text-[#001F3F] font-mono tracking-wider uppercase mb-3">Verbal</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Score *</label>
                                    <input
                                      type="text"
                                      value={profile.greVerbalScore}
                                      onChange={(e) => handleInputChange('greVerbalScore', e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#001F3F] outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Rank *</label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={profile.greVerbalRank}
                                        onChange={(e) => handleInputChange('greVerbalRank', e.target.value)}
                                        className="w-full pr-7 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#001F3F] outline-none"
                                      />
                                      <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400 font-mono">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Quantitative */}
                              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                                <h4 className="text-xs font-bold text-[#001F3F] font-mono tracking-wider uppercase mb-3">Quantitative</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Score *</label>
                                    <input
                                      type="text"
                                      value={profile.greQuantScore}
                                      onChange={(e) => handleInputChange('greQuantScore', e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#001F3F] outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Rank *</label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={profile.greQuantRank}
                                        onChange={(e) => handleInputChange('greQuantRank', e.target.value)}
                                        className="w-full pr-7 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#001F3F] outline-none"
                                      />
                                      <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400 font-mono">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {/* AWA */}
                              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                                <h4 className="text-xs font-bold text-[#001F3F] font-mono tracking-wider uppercase mb-3">AWA</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Score *</label>
                                    <input
                                      type="text"
                                      value={profile.greAwaScore}
                                      onChange={(e) => handleInputChange('greAwaScore', e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#001F3F] outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase font-mono">Rank *</label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={profile.greAwaRank}
                                        onChange={(e) => handleInputChange('greAwaRank', e.target.value)}
                                        className="w-full pr-7 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#001F3F] outline-none"
                                      />
                                      <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400 font-mono">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Exam Date */}
                              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col justify-center">
                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase font-mono">Date of exam *</label>
                                <input
                                  type="date"
                                  value={profile.greDate}
                                  onChange={(e) => handleInputChange('greDate', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#001F3F] outline-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveAndContinue}
                  className="px-8 py-3 bg-primary hover:bg-slate-800 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Save & Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* VISA & STUDY PERMIT TAB */}
          {activeSubTab === 'visa' && (
            <motion.div
              key="visa"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Card 1: Visa & Study Permit details */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/2">
                <button
                  onClick={() => toggleCard('visaPermit')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left border-b border-slate-50 hover:bg-slate-50/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-[#001F3F]/5 text-primary rounded-lg material-symbols-outlined text-[20px]">airplane_ticket</span>
                    <h3 className="font-bold text-[#001F3F]">Visa &amp; Study Permit</h3>
                  </div>
                  {collapsedCards.visaPermit ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {!collapsedCards.visaPermit && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 space-y-6">
                        {/* Refused Visa Question */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-[#001F3F] leading-snug">
                            Have you been refused a visa from Canada, the USA, the United Kingdom, New Zealand, Australia or Ireland? <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-6">
                            {['Yes', 'No'].map((choice) => (
                              <label key={choice} className="flex items-center gap-2.5 font-semibold text-sm text-[#001F3F] cursor-pointer">
                                <input
                                  type="radio"
                                  name="refusedVisa"
                                  value={choice}
                                  checked={profile.refusedVisa === choice}
                                  onChange={() => handleInputChange('refusedVisa', choice)}
                                  className="w-4 h-4 text-primary border-slate-300 focus:ring-primary focus:ring-1"
                                />
                                <span>{choice}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Which study permits/visas */}
                        <div className="space-y-3.5 pt-2 border-t border-slate-100">
                          <label className="block text-sm font-semibold text-primary">
                            Which valid study permits or visas do you have?
                          </label>
                          <div className="space-y-2.5 max-w-lg">
                            {[
                              'Canadian Study Permit/ Visitor Visa',
                              'USA F1 Visa',
                              'Australian Study Visa',
                              'UK Tier 4 Student/ Short Term Study Visa',
                              'Irish Stamp 2',
                              'I don\'t have this'
                            ].map((permit) => (
                              <label key={permit} className="flex items-start gap-3 font-semibold text-xs text-slate-650 cursor-pointer bg-slate-50/50 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100 select-none">
                                <input
                                  type="checkbox"
                                  checked={profile.validPermits.includes(permit)}
                                  onChange={() => handlePermitToggle(permit)}
                                  className="w-4 h-4 text-primary border-slate-300 rounded mt-0.5 focus:ring-primary focus:ring-1"
                                />
                                <span className="flex-1 leading-tight">{permit}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* More information details */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <label className="block text-sm font-semibold text-primary leading-snug">
                            Please provide more information about your current study permit/visa and any past refusals, if any
                          </label>
                          <textarea
                            value={profile.visaRefusalDetails}
                            onChange={(e) => handleInputChange('visaRefusalDetails', e.target.value)}
                            placeholder="Enter your details..."
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#001F3F] outline-none focus:bg-white focus:border-primary transition-all resize-none placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setToastMsg({ text: 'All profile information has been finalized successfully!', type: 'success' });
                  }}
                  className="px-8 py-3 bg-secondary text-white hover:bg-secondary/90 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Finalize &amp; Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm bg-[#001F3F] text-white border border-white/10"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Check size={18} className="stroke-[3]" />
            </div>
            <div className="text-xs font-semibold leading-relaxed">
              {toastMsg.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
