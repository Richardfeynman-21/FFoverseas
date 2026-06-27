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
title: 'Profiling & Counseling',
subtitle: 'Building a personalized study abroad strategy.',
description: 'Our counselors evaluate your academic profile, career goals, preferred destinations, and budget to create a tailored roadmap. We identify the most suitable programs and countries that align with your aspirations and maximize admission opportunities.',
duration: 'Week 1 - 2',
deliverables: [
'Personalized Career Assessment',
'Study Abroad Roadmap',
'Country & Program Recommendations'
]
},
{
id: 2,
title: 'Shortlisting User Recommended Universities',
subtitle: 'Selecting universities that fit your ambitions.',
description: 'Based on your preferences and profile, we carefully shortlist universities across ambitious, balanced, and safe categories. Every recommendation is backed by admission probability, career outcomes, and financial considerations.',
duration: 'Week 3 - 4',
deliverables: [
'Curated University Shortlist',
'Admission Probability Analysis',
'Tuition & Cost Comparison Report'
]
},
{
id: 3,
title: 'Starting the Application Process',
subtitle: 'Preparing strong applications for success.',
description: 'We assist with application submissions, document preparation, SOP creation, and recommendation letter guidance. Each application is strategically optimized to showcase your strengths and achievements.',
duration: 'Week 5 - 8',
deliverables: [
'Statement of Purpose (SOP)',
'Letters of Recommendation (LOR) Support',
'University Application Submission'
]
},
{
id: 4,
title: 'Offer Acceptance',
subtitle: 'Choosing and securing the right admission offer.',
description: 'Once offers arrive, we help compare universities, evaluate scholarships, and guide you through acceptance procedures to ensure you make the best academic and financial decision.',
duration: 'Week 9 - 10',
deliverables: [
'Offer Evaluation Support',
'Scholarship Guidance',
'Admission Confirmation Assistance'
]
},
{
id: 5,
title: 'Loan Process',
subtitle: 'Securing financial support with confidence.',
description: 'Our experts guide you through education loan options, documentation, lender selection, and approval procedures to ensure smooth funding for your international education journey.',
duration: 'Week 10 - 11',
deliverables: [
'Loan Eligibility Assessment',
'Financial Documentation Support',
'Loan Application Assistance'
]
},
{
id: 6,
title: 'Visa Filing',
subtitle: 'Ensuring a smooth and successful visa application.',
description: 'We assist with visa documentation, application filing, financial proof preparation, and mock interview sessions to maximize your chances of visa approval.',
duration: 'Week 11 - 12',
deliverables: [
'Visa Documentation Review',
'Visa Application Support',
'Mock Visa Interview Sessions'
]
},
{
id: 7,
title: 'Get, Set, Go...',
subtitle: 'Preparing you for a successful transition abroad.',
description: 'From accommodation support and travel planning to pre-departure briefings and networking opportunities, we ensure you are fully prepared for life at your destination university.',
duration: 'Week 13+',
deliverables: [
'Pre-Departure Orientation',
'Accommodation Assistance',
'Travel & Settlement Support'
]
}

];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'ROUTHU SAMPATH DEVI SRI',
    course: 'M.S. Computer Science',
    university: 'Cincinnati University',
    destination: 'USA',
    quote: 'The holistic guidance at Fly & Flourish was transcendent. Their SOP editing turned my resume into an elegant story. Now I am in the USA!',
    rating: 5,
    bubbleSize: 'w-72 h-72 md:w-80 md:h-80',
    delay: 0,
    initialX: 10,
    initialY: 15
  },
  {
    id: 2,
    name: 'Tara Reddy',
    course: 'MBA in Finance',
    university: 'University of Leeds',
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
    name: 'NAVEEN YADAV',
    course: 'B.S. Robotics Engineering',
    university: 'University of Waterloo',
    destination: 'Canada',
    quote: 'Incredible co-op opportunities! Fly & Flourish guided me from high school graduation all the way to my current research tenure in Toronto.',
    rating: 5,
    bubbleSize: 'w-68 h-68 md:w-76 md:h-76',
    delay: 3,
    initialX: 35,
    initialY: 55
  },
  {
    id: 4,
    name: 'MD Sameer',
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
