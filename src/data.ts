import { Destination, RoadmapStep, Testimonial } from './types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'usa',
    name: 'United States',
    code: 'USA',
    flag: 'US',
    tagline: 'The Apex of Global Innovation & Research',
    description: 'Access the world’s most prestigious Ivy League institutions, cutting-edge tech hubs, and unparalleled post-graduate career accelerators in Silicon Valley and beyond.',
    universities: ['MIT', 'Stanford University', 'Harvard University', 'UC Berkeley', 'Columbia University'],
    intakes: 'Fall (Aug/Sept) & Spring (Jan)',
    visaSuccessRate: '96.4%',
    glassColor: 'rgba(15, 30, 67, 0.08)',
    refractions: 'from-blue-500/20 via-indigo-500/10 to-transparent'
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    code: 'GBR',
    flag: 'GB',
    tagline: 'Legacy of Academic Excellence & Heritage',
    description: 'Immerse yourself of centuries-old academic traditions, flexible 1-year master’s courses, and structured 2-year post-study work routes in London, Edinburgh, and Oxford.',
    universities: ['University of Oxford', 'University of Cambridge', 'Imperial College London', 'UCL', 'LSE'],
    intakes: 'September & January',
    visaSuccessRate: '98.1%',
    glassColor: 'rgba(239, 68, 68, 0.05)',
    refractions: 'from-red-500/20 via-pink-500/10 to-transparent'
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CAN',
    flag: 'CA',
    tagline: 'High Quality of Living & Permanent Residency Pathway',
    description: 'A global sanctuary prioritizing student welfare, offering highly competitive tuition structures, world-tier co-op options, and direct permanent transition routes.',
    universities: ['University of Toronto', 'UBC', 'McGill University', 'University of Waterloo', 'McMaster University'],
    intakes: 'Fall (Sept), Winter (Jan) & Summer (May)',
    visaSuccessRate: '95.8%',
    glassColor: 'rgba(239, 68, 68, 0.08)',
    refractions: 'from-red-500/15 via-orange-500/10 to-transparent'
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AUS',
    flag: 'AU',
    tagline: 'Sun-Drenched Research & Dynamic Lifestyle',
    description: 'Explore highly-ranked beachside universities, pioneering medical discoveries, and generous post-study work authorization durations up to 4–6 years in regional hubs.',
    universities: ['University of Melbourne', 'Sydney University', 'ANU', 'UQ', 'UNSW Sydney'],
    intakes: 'Semester 1 (Feb) & Semester 2 (July)',
    visaSuccessRate: '97.2%',
    glassColor: 'rgba(15, 30, 67, 0.06)',
    refractions: 'from-sky-500/20 via-emerald-500/10 to-transparent'
  },
  {
    id: 'germany',
    name: 'Germany',
    code: 'DEU',
    flag: 'DE',
    tagline: 'Tuition-Free Engineering & Industrial Powerhouse',
    description: 'Unlock world-leading technical education with zero tuition fees across public universities, bolstered by Europe’s strongest industrial sector and post-study opportunities.',
    universities: ['TUM', 'LMU Munich', 'Heidelberg University', 'RWTH Aachen', 'KIT'],
    intakes: 'Winter (Oct) & Summer (April)',
    visaSuccessRate: '94.9%',
    glassColor: 'rgba(0, 0, 0, 0.04)',
    refractions: 'from-amber-500/20 via-purple-500/10 to-transparent'
  }
];

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: 1,
    title: 'Elite Profiling & Counseling',
    subtitle: 'Strategic alignment of academic ambitions.',
    description: 'We perform a holistic mapping of your academic records, extra-curriculars, and budget. Our elite strategists craft a custom shortlist of high-acceptance matching programs.',
    duration: 'Week 1 - 2',
    deliverables: ['Custom Career Roadmap', '3-Tier University Shortlist', 'Financial Planners']
  },
  {
    id: 2,
    title: 'Precision Applications',
    subtitle: 'Crafting persuasive application files.',
    description: 'Get tailored SOP styling, hyper-refined recommendation templates, and direct application routing. Every application is optimized to highlight your exceptional talent.',
    duration: 'Week 3 - 8',
    deliverables: ['Bespoke Statement of Purpose (SOP)', '2-3 Peerless Academic LORs', 'Express Application Submissions']
  },
  {
    id: 3,
    title: 'Holographic Visa Clearance',
    subtitle: 'Flawless document preparation & interviews.',
    description: 'Our immigration experts ensure perfect financial declarations, visa mock interviews, and express processing guidelines. We uphold a near-perfect visa success rate globally.',
    duration: 'Week 9 - 12',
    deliverables: ['Immigration Dossier Audit', '3x Custom Mock Visa Interviews', 'Sponsor Valuation Reports']
  },
  {
    id: 4,
    title: 'Pre-Departure Orbit',
    subtitle: 'Seamless integration into your destination.',
    description: 'From booking student-tier global flights and coordinating high-end student accommodation to hosting our exclusive peer networking circles with foreign alumni groups.',
    duration: 'Week 13+',
    deliverables: ['Premium Housing Placements', 'FX Pre-Loaded Cards', 'Alumni Network Integrations']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Aanya Sharma',
    course: 'M.S. Computer Science',
    university: 'Stanford University',
    destination: 'USA',
    quote: 'The holistic guidance at Fly & Flourish was transcendent. Their Sop editing turned my resume into an elegant story. Now I am in Silicon Valley!',
    rating: 5,
    bubbleSize: 'w-72 h-72 md:w-80 md:h-80',
    delay: 0,
    initialX: 10,
    initialY: 15
  },
  {
    id: 2,
    name: 'Ethan Dubois',
    course: 'MBA in Finance',
    university: 'London Business School',
    destination: 'UK',
    quote: 'Absolutely peerless. Their visa prep dossier was pristine. They helped secure an educational grant that saved me £20,000 upfront.',
    rating: 5,
    bubbleSize: 'w-64 h-64 md:w-72 md:h-72',
    delay: 1.5,
    initialX: 65,
    initialY: 20
  },
  {
    id: 3,
    name: 'Chloe Zhang',
    course: 'B.S. Robotics Engineering',
    university: 'University of Waterloo',
    destination: 'Canada',
    quote: 'Incredible co-op opportunities! Fly & Flourish guided me from high school graduation in Shenzhen all the way to my current research tenure in Toronto.',
    rating: 5,
    bubbleSize: 'w-68 h-68 md:w-76 md:h-76',
    delay: 3,
    initialX: 35,
    initialY: 55
  },
  {
    id: 4,
    name: 'Matthias Novak',
    course: 'M.S. Autonomous Systems',
    university: 'TU Munich (TUM)',
    destination: 'Germany',
    quote: 'Navigating public university admissions in Germany seemed impossible until Fly & Flourish stepped in. Their German language prep guides are stellar.',
    rating: 5,
    bubbleSize: 'w-60 h-60 md:w-68 md:h-68',
    delay: 4.5,
    initialX: 75,
    initialY: 60
  }
];
