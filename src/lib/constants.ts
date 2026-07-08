import { ApiUniversity } from './types';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  USD: '$',
  CAD: 'CAD $',
  AUD: 'AUD $',
  EUR: '€',
};

export const COUNTRY_SHORT_NAMES: Record<string, string> = {
  'United Kingdom': 'UK',
  'United States': 'USA',
};

export const COUNTRY_IMAGES: Record<string, string> = {
  'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
  'USA': 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=600&auto=format&fit=crop&q=80',
  'Canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&auto=format&fit=crop&q=80',
  'Australia': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&auto=format&fit=crop&q=80',
  'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&auto=format&fit=crop&q=80',
};

export const COMMON_COURSES = [
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

export const FEATURED_UNIVERSITIES_FALLBACK: ApiUniversity[] = [
  {
    "id": 1256,
    "name": "Massachusetts Institute of Technology",
    "country": "United States",
    "alpha_two_code": "US",
    "state_province": null,
    "web_pages": ["http://web.mit.edu/"],
    "qs_rank_2026": "1",
    "national_rank": 1,
    "overall_score": 100.0,
    "course_count": 67,
    "avg_tuition_fee": 53591.82,
    "currency": "USD",
    "scholarship_count": 0,
    "sample_programs": [
      "Bachelor (Brain and Cognitive Sciences)",
      "Bachelor (Civil and Environmental Engineering)",
      "Bachelor (Earth, Atmospheric And Planetary Sciences)",
      "Bachelor of Science [B.Sc]/Master of Science [M.Sc] (Political Science)",
      "Master (Computational Science and Engineering)",
      "Master (Economics)"
    ],
    "degree_levels": ["Bachelor", "Master"]
  },
  {
    "id": 67,
    "name": "Imperial College London",
    "country": "United Kingdom",
    "alpha_two_code": "GB",
    "state_province": null,
    "web_pages": ["http://www.imperial.ac.uk/"],
    "qs_rank_2026": "2",
    "national_rank": 1,
    "overall_score": 99.4,
    "course_count": 236,
    "avg_tuition_fee": 33050.66,
    "currency": "GBP",
    "scholarship_count": 0,
    "sample_programs": [
      "Aeronautical Engineering MEng (Hons)",
      "Biochemistry BSc (Hons)",
      "Biochemistry with French for Science BSc (Hons)",
      "Biochemistry with German for Science BSc (Hons)",
      "Bioengineering MD",
      "Biomaterials and Tissue Engineering MEng (Hons)"
    ],
    "degree_levels": ["Bachelor", "Master"]
  },
  {
    "id": 1527,
    "name": "Stanford University",
    "country": "United States",
    "alpha_two_code": "US",
    "state_province": null,
    "web_pages": ["http://www.stanford.edu/"],
    "qs_rank_2026": "3",
    "national_rank": 2,
    "overall_score": 98.9,
    "course_count": 63,
    "avg_tuition_fee": 77007.5,
    "currency": "USD",
    "scholarship_count": 0,
    "sample_programs": [
      "Bachelor of Arts [B.A] (Archaeology)",
      "Bachelor of Arts [B.A] (Economics)",
      "Bachelor of Arts [B.A] (English)",
      "Bachelor of Arts [B.A] (English)",
      "Bachelor of Arts [B.A] (Economics)",
      "Bachelor of Arts [B.A] (English)",
      "Master of Arts [M.A] (Anthropology)",
      "Master of Arts [M.A] (Communication)",
      "Master of Arts [M.A] (German Studies)"
    ],
    "degree_levels": ["Bachelor", "Master"]
  },
  {
    "id": 105,
    "name": "University of Oxford",
    "country": "United Kingdom",
    "alpha_two_code": "GB",
    "state_province": null,
    "web_pages": ["http://www.ox.ac.uk/"],
    "qs_rank_2026": "4",
    "national_rank": 2,
    "overall_score": 97.9,
    "course_count": 439,
    "avg_tuition_fee": 30178.59,
    "currency": "GBP",
    "scholarship_count": 1,
    "sample_programs": [
      "Classical Languages and Literature DPhil",
      "Classics and Beginners' Czech (with Slovak) BA (Hons)",
      "Classics and Beginners' Italian BA (Hons)",
      "Classics and Beginners' Modern Greek BA (Hons)",
      "Classics and German BA (Hons)",
      "Clinical and Therapeutic Neuroscience MSc"
    ],
    "degree_levels": ["Bachelor", "Master"]
  },
  {
    "id": 3057,
    "name": "University of Melbourne",
    "country": "Australia",
    "alpha_two_code": "AU",
    "state_province": "Victoria",
    "web_pages": ["http://www.unimelb.edu.au/"],
    "qs_rank_2026": "19",
    "national_rank": 1,
    "overall_score": 90.8,
    "course_count": 281,
    "avg_tuition_fee": 42215.62,
    "currency": "AUD",
    "scholarship_count": 0,
    "sample_programs": [
      "Bachelor of Agriculture",
      "Bachelor of Arts",
      "Bachelor of Arts (Degree with Honours)",
      "Executive Master of Arts",
      "Graduate Certificate in Agricultural Sciences",
      "Graduate Certificate in Arboriculture"
    ],
    "degree_levels": ["Bachelor", "Master"]
  },
  {
    "id": 3059,
    "name": "University of New South Wales",
    "country": "Australia",
    "alpha_two_code": "AU",
    "state_province": "New South Wales",
    "web_pages": ["http://www.unsw.edu.au/"],
    "qs_rank_2026": "20",
    "national_rank": 2,
    "overall_score": 90.7,
    "course_count": 0,
    "avg_tuition_fee": null,
    "currency": null,
    "scholarship_count": 0,
    "sample_programs": [],
    "degree_levels": []
  },
  {
    "id": 414,
    "name": "Technische Universität München",
    "country": "Germany",
    "alpha_two_code": "DE",
    "state_province": null,
    "web_pages": ["http://www.tum.de/"],
    "qs_rank_2026": "22",
    "national_rank": 1,
    "overall_score": 90.2,
    "course_count": 1,
    "avg_tuition_fee": null,
    "currency": null,
    "scholarship_count": 0,
    "sample_programs": [
      "Chromatin Dynamics (Integrated Research Training Group IRTG-SFB 1064)"
    ],
    "degree_levels": ["Master"]
  },
  {
    "id": 568,
    "name": "McGill University",
    "country": "Canada",
    "alpha_two_code": "CA",
    "state_province": "Quebec",
    "web_pages": ["http://www.mcgill.ca/"],
    "qs_rank_2026": "27",
    "national_rank": 1,
    "overall_score": 88.9,
    "course_count": 736,
    "avg_tuition_fee": 32854.04,
    "currency": "CAD",
    "scholarship_count": 3,
    "sample_programs": [
      "Bachelor Engineering (B.Eng.) - Co-op in Software Engineering (141 credits)",
      "Bachelor of Arts and Science (B.A. & Sc.) - Freshman Program (30 credits)",
      "Bachelor of Arts and Science (B.A. & Sc.) - Honours Cognitive Science (60 credits)",
      "Executive Master of Business Administration (E.M.B.A.) Joint Executive M.B.A. (Non-Thesis) (45 credits)",
      "Graduate Artist Diploma (Gr. Art. Dip.) Performance (30 credits)",
      "Graduate Certificate (Gr. Cert.) Adult Care Nurse Practitioner (21 credits)"
    ],
    "degree_levels": ["Bachelor", "Master"]
  },
  {
    "id": 594,
    "name": "University of Toronto, Scarborough",
    "country": "Canada",
    "alpha_two_code": "CA",
    "state_province": "Ontario",
    "web_pages": ["http://www.scar.utoronto.ca/"],
    "qs_rank_2026": "29",
    "national_rank": 2,
    "overall_score": 88.5,
    "course_count": 0,
    "avg_tuition_fee": null,
    "currency": null,
    "scholarship_count": 0,
    "sample_programs": [],
    "degree_levels": []
  },
  {
    "id": 454,
    "name": "Ludwig-Maximilians-Universität München",
    "country": "Germany",
    "alpha_two_code": "DE",
    "state_province": null,
    "web_pages": ["http://www.lmu.de/", "http://www.uni-muenchen.de/"],
    "qs_rank_2026": "58",
    "national_rank": 2,
    "overall_score": 80.1,
    "course_count": 0,
    "avg_tuition_fee": null,
    "currency": null,
    "scholarship_count": 0,
    "sample_programs": [],
    "degree_levels": []
  }
];
