'use client';

import { LayoutDashboard, Building2, BarChart3, MessageCircle, Headphones } from 'lucide-react';
import { ApplicationStage, University, DocumentItem, NavItem, StudentApplication } from './types';

export const NAVY = '#001F3F';
export const RED = '#FF0000';

export const DEFAULT_APPLICATION_STAGES: ApplicationStage[] = [
  { id: 1, name: 'Profile Submitted', status: 'completed', date: 'May 28, 2026', description: 'Your personal and academic profile has been submitted and recorded in our system.' },
  { id: 2, name: 'Documents Verified', status: 'completed', date: 'Jun 05, 2026', description: 'All submitted documents have been verified and approved by our admissions team.' },
  { id: 3, name: 'University Shortlisted', status: 'current', date: '', description: 'Our experts are shortlisting the best universities matching your profile and preferences.' },
  { id: 4, name: 'Application Sent', status: 'pending', date: '', description: 'Your finalized applications will be dispatched to selected universities.' },
  { id: 5, name: 'Offer Letter', status: 'pending', date: '', description: 'Awaiting acceptance letters and offer confirmations from universities.' },
  { id: 6, name: 'Visa Processing', status: 'pending', date: '', description: 'Visa application preparation, mock interviews, and embassy submission.' },
  { id: 7, name: 'Pre-Departure Briefing', status: 'pending', date: '', description: 'Final orientation including accommodation, travel, and cultural prep.' },
];

export const UNIVERSITIES: University[] = [
  { name: 'Massachusetts Institute of Technology', country: 'USA', flag: 'US', ranking: 'QS #1', tuition: '$55,000 - $61,000/yr', scholarship: 'Up to $30,000/yr', programs: ['Computer Science', 'Engineering', 'Data Science'], acceptanceRate: '3.9%' },
  { name: 'Stanford University', country: 'USA', flag: 'US', ranking: 'QS #5', tuition: '$56,000 - $62,000/yr', scholarship: 'Up to $28,000/yr', programs: ['AI & Machine Learning', 'Business', 'Bioengineering'], acceptanceRate: '3.7%' },
  { name: 'Harvard University', country: 'USA', flag: 'US', ranking: 'QS #4', tuition: '$52,000 - $57,000/yr', scholarship: 'Up to $35,000/yr', programs: ['Law', 'Medicine', 'Economics'], acceptanceRate: '3.2%' },
  { name: 'UC Berkeley', country: 'USA', flag: 'US', ranking: 'QS #10', tuition: '$44,000 - $48,000/yr', scholarship: 'Up to $20,000/yr', programs: ['EECS', 'Business Analytics', 'Environmental Science'], acceptanceRate: '11.6%' },
  { name: 'Columbia University', country: 'USA', flag: 'US', ranking: 'QS #23', tuition: '$63,000 - $68,000/yr', scholarship: 'Up to $25,000/yr', programs: ['Journalism', 'Finance', 'International Relations'], acceptanceRate: '3.9%' },
  { name: 'University of Oxford', country: 'UK', flag: 'GB', ranking: 'QS #3', tuition: '£28,000 - £44,000/yr', scholarship: 'Up to £18,000/yr', programs: ['PPE', 'Computer Science', 'Medicine'], acceptanceRate: '15.3%' },
  { name: 'University of Cambridge', country: 'UK', flag: 'GB', ranking: 'QS #2', tuition: '£25,000 - £40,000/yr', scholarship: 'Up to £16,000/yr', programs: ['Natural Sciences', 'Engineering', 'Mathematics'], acceptanceRate: '18.0%' },
  { name: 'Imperial College London', country: 'UK', flag: 'GB', ranking: 'QS #6', tuition: '£30,000 - £45,000/yr', scholarship: 'Up to £12,000/yr', programs: ['Biomedical Engineering', 'Computing', 'Physics'], acceptanceRate: '14.3%' },
  { name: 'UCL', country: 'UK', flag: 'GB', ranking: 'QS #9', tuition: '£22,000 - £38,000/yr', scholarship: 'Up to £10,000/yr', programs: ['Architecture', 'Neuroscience', 'Education'], acceptanceRate: '28.0%' },
  { name: 'LSE', country: 'UK', flag: 'GB', ranking: 'QS #45', tuition: '£24,000 - £35,000/yr', scholarship: 'Up to £15,000/yr', programs: ['Economics', 'Political Science', 'Social Policy'], acceptanceRate: '8.9%' },
  { name: 'University of Toronto', country: 'Canada', flag: 'CA', ranking: 'QS #21', tuition: 'CAD $45,000 - $62,000/yr', scholarship: 'Up to CAD $20,000/yr', programs: ['Computer Science', 'Engineering', 'Life Sciences'], acceptanceRate: '43.0%' },
  { name: 'UBC', country: 'Canada', flag: 'CA', ranking: 'QS #34', tuition: 'CAD $40,000 - $55,000/yr', scholarship: 'Up to CAD $16,000/yr', programs: ['Forestry', 'Commerce', 'Kinesiology'], acceptanceRate: '46.0%' },
  { name: 'McGill University', country: 'Canada', flag: 'CA', ranking: 'QS #30', tuition: 'CAD $25,000 - $50,000/yr', scholarship: 'Up to CAD $12,000/yr', programs: ['Medicine', 'Music', 'Neuroscience'], acceptanceRate: '41.0%' },
  { name: 'University of Melbourne', country: 'Australia', flag: 'AU', ranking: 'QS #13', tuition: 'AUD $35,000 - $50,000/yr', scholarship: 'Up to AUD $15,000/yr', programs: ['Biomedicine', 'Design', 'Commerce'], acceptanceRate: '52.0%' },
  { name: 'University of Sydney', country: 'Australia', flag: 'AU', ranking: 'QS #18', tuition: 'AUD $38,000 - $52,000/yr', scholarship: 'Up to AUD $18,000/yr', programs: ['Law', 'Arts', 'Engineering'], acceptanceRate: '48.0%' },
  { name: 'Technical University of Munich', country: 'Germany', flag: 'DE', ranking: 'QS #37', tuition: '€250 semester fee', scholarship: 'DAAD up to €15,000/yr', programs: ['Mechanical Engineering', 'Informatics', 'Physics'], acceptanceRate: '8.0%' },
  { name: 'LMU Munich', country: 'Germany', flag: 'DE', ranking: 'QS #54', tuition: '€250 semester fee', scholarship: 'DAAD up to €12,000/yr', programs: ['Biology', 'Philosophy', 'Law'], acceptanceRate: '12.0%' },
];

export const DOCUMENTS: DocumentItem[] = [
  { id: 'passport', name: 'Passport Copy', uploaded: true },
  { id: 'transcripts', name: 'Academic Transcripts', uploaded: true },
  { id: 'sop', name: 'Statement of Purpose', uploaded: true },
  { id: 'lor', name: 'Letters of Recommendation', uploaded: false },
  { id: 'financial', name: 'Financial Documents', uploaded: true },
  { id: 'english', name: 'English Test Score (IELTS/TOEFL)', uploaded: true },
  { id: 'photos', name: 'Passport Size Photos', uploaded: false },
];

export const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'universities', label: 'Universities', icon: Building2 },
  { key: 'progress', label: 'My Progress', icon: BarChart3 },
  { key: 'chat', label: 'Aero AI Support', icon: MessageCircle },
  { key: 'agent-chat', label: 'Talk to Counselor', icon: Headphones },
];

export function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('status') || lower.includes('application') || lower.includes('progress'))
    return "Your application is currently in the **University Shortlisting** phase. Our experts are matching your profile with the best-fit universities. You'll receive shortlist notifications within 3-5 business days. 📋";
  if (lower.includes('scholarship') || lower.includes('financial') || lower.includes('aid'))
    return "Based on your profile, you're eligible for scholarships worth up to **$12,000 - $25,000/year** across partner universities. We've flagged merit-based and need-based options. Your advisor will share the final list soon! 💰";
  if (lower.includes('visa') || lower.includes('interview') || lower.includes('embassy'))
    return "Visa processing begins after you receive your offer letter. We provide **3 mock visa interviews**, a complete document audit, and embassy appointment scheduling. Our visa success rate is 98.4%! 🛂";
  if (lower.includes('advisor') || lower.includes('talk') || lower.includes('call') || lower.includes('help'))
    return "Your dedicated advisor is available for live chat. You can contact them through the 'Chat with Counselor' tab. Office hours: Mon-Sat, 9 AM - 6 PM IST. Would you like us to schedule a callback? 📞";
  if (lower.includes('document') || lower.includes('upload') || lower.includes('lor'))
    return "You've uploaded **5 out of 7** required documents. Missing: Letters of Recommendation and Passport Photos. Please upload them through the 'My Progress' tab to avoid delays. 📄";
  if (lower.includes('university') || lower.includes('college'))
    return "Check out the **Universities** tab to explore 17+ partner universities across USA, UK, Canada, Australia, and Germany. Each listing includes tuition fees, scholarship amounts, and acceptance rates! 🎓";
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey'))
    return "Hello! 👋 Welcome to Fly & Flourish Support. I'm here to help with your study abroad journey. Ask me about your application status, scholarships, visa process, or anything else!";
  return "Thank you for your message! I've noted your query. For specific questions, try asking about: **application status**, **scholarships**, **visa process**, **documents**, or **universities**. You can also request to **talk to an advisor** for personalized guidance. 🌍";
}

export const DEFAULT_APPLICATIONS: StudentApplication[] = [
  {
    id: 'app-toronto-cs',
    universityName: 'University of Toronto',
    programName: 'MS in Computer Science',
    country: 'Canada',
    flag: 'CA',
    logoColor: 'from-[#002f6c] to-[#001834]',
    status: 'applied',
    stages: [
      { id: 1, name: 'Profile Submitted', status: 'completed', date: 'May 28, 2026', description: 'Your personal and academic profile has been submitted and recorded in our system.' },
      { id: 2, name: 'Documents Verified', status: 'completed', date: 'Jun 05, 2026', description: 'All submitted documents have been verified and approved by our admissions team.' },
      { id: 3, name: 'University Shortlisted', status: 'completed', date: 'Jun 10, 2026', description: 'Selected University of Toronto MS in CS as a primary target after consultation.' },
      { id: 4, name: 'Application Sent', status: 'completed', date: 'Jun 15, 2026', description: 'Your finalized application packet and transcripts were dispatched to U of Toronto admissions.' },
      { id: 5, name: 'Offer Letter', status: 'current', date: '', description: 'Awaiting decision. The department admissions committee is currently reviewing your CS application.' },
      { id: 6, name: 'Visa Processing', status: 'pending', date: '', description: 'Visa application preparation, mock interviews, and embassy submission.' },
      { id: 7, name: 'Pre-Departure Briefing', status: 'pending', date: '', description: 'Final orientation including accommodation, travel, and cultural prep.' },
    ]
  },
  {
    id: 'app-ubc-ds',
    universityName: 'University of British Columbia',
    programName: 'MS in Data Science',
    country: 'Canada',
    flag: 'CA',
    logoColor: 'from-[#0A2240] to-[#00152B]',
    status: 'submitted',
    stages: [
      { id: 1, name: 'Profile Submitted', status: 'completed', date: 'May 28, 2026', description: 'Your personal and academic profile has been submitted and recorded in our system.' },
      { id: 2, name: 'Documents Verified', status: 'completed', date: 'Jun 05, 2026', description: 'All submitted documents have been verified and approved by our admissions team.' },
      { id: 3, name: 'University Shortlisted', status: 'completed', date: 'Jun 10, 2026', description: 'Selected University of British Columbia MS in DS as a key target.' },
      { id: 4, name: 'Application Sent', status: 'current', date: '', description: 'Admissions packet is fully compiled. Awaiting official recommendation letters from references.' },
      { id: 5, name: 'Offer Letter', status: 'pending', date: '', description: 'Awaiting acceptance letters and offer confirmations from universities.' },
      { id: 6, name: 'Visa Processing', status: 'pending', date: '', description: 'Visa application preparation, mock interviews, and embassy submission.' },
      { id: 7, name: 'Pre-Departure Briefing', status: 'pending', date: '', description: 'Final orientation including accommodation, travel, and cultural prep.' },
    ]
  },
  {
    id: 'app-mcgill-ai',
    universityName: 'McGill University',
    programName: 'MS in Artificial Intelligence',
    country: 'Canada',
    flag: 'CA',
    logoColor: 'from-[#ED1B2F] to-[#A3000D]',
    status: 'draft',
    stages: [
      { id: 1, name: 'Profile Submitted', status: 'completed', date: 'May 28, 2026', description: 'Your personal and academic profile has been submitted and recorded in our system.' },
      { id: 2, name: 'Documents Verified', status: 'completed', date: 'Jun 05, 2026', description: 'All submitted documents have been verified and approved by our admissions team.' },
      { id: 3, name: 'University Shortlisted', status: 'current', date: '', description: 'Discussing AI faculty mentors and aligning thesis proposals with McGill advisors.' },
      { id: 4, name: 'Application Sent', status: 'pending', date: '', description: 'Your finalized applications will be dispatched to selected universities.' },
      { id: 5, name: 'Offer Letter', status: 'pending', date: '', description: 'Awaiting acceptance letters and offer confirmations from universities.' },
      { id: 6, name: 'Visa Processing', status: 'pending', date: '', description: 'Visa application preparation, mock interviews, and embassy submission.' },
      { id: 7, name: 'Pre-Departure Briefing', status: 'pending', date: '', description: 'Final orientation including accommodation, travel, and cultural prep.' },
    ]
  }
];
