// =============================================================================
// University API Client & Data Types
// Connects to the FastAPI backend via the Express proxy (/api/*)
// =============================================================================

// --- API Response Types ---

export interface ApiUniversity {
  id: number;
  name: string;
  country: string;
  alpha_two_code: string;
  state_province: string | null;
  web_pages: string[];
  qs_rank_2026: string | null;
  national_rank: number | null;
  overall_score: number | null;
  course_count: number;
  avg_tuition_fee: number | null;
  currency: string | null;
  scholarship_count: number;
  sample_programs: string[];
  degree_levels: string[];
}

export interface UniversityApiResponse {
  universities: ApiUniversity[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// --- Display Interface (used by the UI cards & modals) ---

export interface DetailedUniversity {
  id: number;
  name: string;
  country: string;
  code: string;
  flag: string;
  ranking: string;
  rankValue: number;
  tuition: string;
  tuitionValue: number;
  currency: string;
  scholarship: string;
  scholarshipValue: number;
  acceptanceRate: string;
  acceptanceValue: number;
  programs: string[];
  intakes: string[];
  courseCount: number;
  logoUrl: string;
  imageUrl: string;
  webPages: string[];
}

// --- Constants ---

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  USD: '$',
  CAD: 'CAD $',
  AUD: 'AUD $',
  EUR: '€',
};

const COUNTRY_SHORT_NAMES: Record<string, string> = {
  'United Kingdom': 'UK',
  'United States': 'USA',
};

const COUNTRY_IMAGES: Record<string, string> = {
  'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
  'USA': 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=600&auto=format&fit=crop&q=80',
  'Canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&auto=format&fit=crop&q=80',
  'Australia': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&auto=format&fit=crop&q=80',
  'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&auto=format&fit=crop&q=80',
};

// --- Mapping Function ---

export function mapApiToDetailedUniversity(api: ApiUniversity): DetailedUniversity {
  const shortCountry = COUNTRY_SHORT_NAMES[api.country] || api.country;
  const currencySymbol = CURRENCY_SYMBOLS[api.currency || ''] || (api.currency || '$');
  const fee = api.avg_tuition_fee || 0;
  const rankStr = api.qs_rank_2026;
  const rankNum = rankStr ? parseInt(rankStr.replace(/[^0-9]/g, ''), 10) : 99999;

  let tuitionDisplay: string;
  if (fee === 0) {
    tuitionDisplay = 'Free';
  } else {
    tuitionDisplay = `${currencySymbol}${fee.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr`;
  }

  return {
    id: api.id,
    name: api.name,
    country: shortCountry,
    code: api.alpha_two_code,
    flag: api.alpha_two_code,
    ranking: rankStr ? `QS #${rankStr}` : 'Unranked',
    rankValue: isNaN(rankNum) ? 99999 : rankNum,
    tuition: tuitionDisplay,
    tuitionValue: fee,
    currency: currencySymbol,
    scholarship: api.scholarship_count > 0
      ? `${api.scholarship_count} scholarships available`
      : 'No scholarships listed',
    scholarshipValue: api.scholarship_count,
    acceptanceRate: 'N/A',
    acceptanceValue: 0,
    programs: api.sample_programs.length > 0 ? api.sample_programs : ['General Studies'],
    intakes: ['September', 'January'], // Default — not available in DB
    courseCount: api.course_count,
    logoUrl: '', // Will trigger initials fallback in the card
    imageUrl: COUNTRY_IMAGES[shortCountry] || COUNTRY_IMAGES['UK'],
    webPages: api.web_pages || [],
  };
}

// --- API Query Params ---

export interface UniversityQueryParams {
  search?: string;
  countries?: string;
  degree_levels?: string;
  course_search?: string;
  course_types?: string;
  fee_range?: string;
  min_ranking?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
  featured?: boolean;
}

// --- API Fetch Functions ---

export async function fetchUniversities(params: UniversityQueryParams): Promise<UniversityApiResponse> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set('search', params.search);
  if (params.countries) searchParams.set('countries', params.countries);
  if (params.degree_levels) searchParams.set('degree_levels', params.degree_levels);
  if (params.course_search) searchParams.set('course_search', params.course_search);
  if (params.course_types) searchParams.set('course_types', params.course_types);
  if (params.fee_range) searchParams.set('fee_range', params.fee_range);
  if (params.min_ranking) searchParams.set('min_ranking', params.min_ranking);
  if (params.sort_by) searchParams.set('sort_by', params.sort_by);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  if (params.featured) searchParams.set('featured', 'true');

  const queryString = searchParams.toString();
  const url = `/api/universities${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch universities: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchCourseAutocomplete(query: string): Promise<string[]> {
  if (!query || query.trim().length < 2) return [];

  const response = await fetch(`/api/universities/courses/search?q=${encodeURIComponent(query.trim())}`);
  if (!response.ok) {
    console.warn('Course autocomplete failed:', response.status);
    return [];
  }
  return response.json();
}
