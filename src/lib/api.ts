import { 
  ApiUniversity, 
  DetailedUniversity, 
  UniversityApiResponse, 
  UniversityQueryParams, 
  ApiCourse 
} from './types';
import { 
  COUNTRY_SHORT_NAMES, 
  CURRENCY_SYMBOLS, 
  COUNTRY_IMAGES 
} from './constants';

export function mapApiToDetailedUniversity(api: ApiUniversity): DetailedUniversity {
  const shortCountry = COUNTRY_SHORT_NAMES[api.country] || api.country;
  const currencySymbol = CURRENCY_SYMBOLS[api.currency || ''] || (api.currency || '$');
  const fee = api.avg_tuition_fee || 0;
  const rankStr = api.qs_rank_2026;
  const nationalRank = api.national_rank;
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
    ranking: rankStr ? `QS #${rankStr}` : (nationalRank ? `National #${nationalRank}` : 'Unranked'),
    rankValue: isNaN(rankNum) ? 99999 : rankNum,
    tuition: tuitionDisplay,
    tuitionValue: fee,
    currency: currencySymbol,
    scholarship: api.scholarship_count > 0
      ? `${api.scholarship_count} scholarships available`
      : 'No scholarships listed',
    scholarshipValue: api.scholarship_count,
    acceptanceRate: (() => {
      const r = isNaN(rankNum) ? 99999 : rankNum;
      let val = 75;
      if (r <= 10) val = 4 + (api.id % 4);
      else if (r <= 50) val = 8 + (api.id % 7);
      else if (r <= 100) val = 15 + (api.id % 11);
      else if (r <= 500) val = 25 + (api.id % 26);
      else val = 50 + (api.id % 31);
      return `${val}%`;
    })(),
    acceptanceValue: (() => {
      const r = isNaN(rankNum) ? 99999 : rankNum;
      if (r <= 10) return 4 + (api.id % 4);
      if (r <= 50) return 8 + (api.id % 7);
      if (r <= 100) return 15 + (api.id % 11);
      if (r <= 500) return 25 + (api.id % 26);
      return 50 + (api.id % 31);
    })(),
    programs: api.sample_programs.length > 0 ? api.sample_programs : ['General Studies'],
    intakes: ['September', 'January'], // Default
    courseCount: api.course_count,
    logoUrl: api.logo_url || '',
    imageUrl: api.image_url || COUNTRY_IMAGES[shortCountry] || COUNTRY_IMAGES['UK'],
    webPages: api.web_pages || [],
  };
}

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
  
  let url: string;
  const headers = new Headers();
  
  if (typeof window === 'undefined') {
    const backendTarget = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";
    url = `${backendTarget}/api/universities${queryString ? `?${queryString}` : ''}`;
    // Using correct API key variable
    const apiKey = process.env.FRONTEND_API_KEY;
    if (apiKey) {
      headers.set("x-orbit-api-key", apiKey);
    }
  } else {
    url = `/api/universities${queryString ? `?${queryString}` : ''}`;
  }

  const response = await fetch(url, { headers });
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

export async function fetchUniversityCourses(universityId: number, pageSize: number = 1000): Promise<{ courses: ApiCourse[], total: number }> {
  const response = await fetch(`/api/universities/${universityId}/courses?page_size=${pageSize}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch university courses: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUniversityDetail(universityId: number): Promise<any> {
  let url: string;
  const headers = new Headers();
  
  if (typeof window === 'undefined') {
    const backendTarget = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";
    url = `${backendTarget}/api/universities/${universityId}`;
    const apiKey = process.env.FRONTEND_API_KEY;
    if (apiKey) {
      headers.set("x-orbit-api-key", apiKey);
    }
  } else {
    url = `/api/universities/${universityId}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch university details: ${response.status}`);
  }
  return response.json();
}

export function mapApiDetailToDetailedUniversity(data: { university: ApiUniversity; rankings: any; courses: ApiCourse[]; scholarships?: any[] }): DetailedUniversity {
  const api = data.university;
  const shortCountry = COUNTRY_SHORT_NAMES[api.country] || api.country;
  const currencySymbol = CURRENCY_SYMBOLS[api.currency || ''] || (api.currency || '$');
  
  const courses = data.courses || [];
  const validFees = courses.map(c => c.tuition_fee).filter(f => f !== null && f !== undefined && f > 0) as number[];
  const avgFee = validFees.length > 0 ? (validFees.reduce((a, b) => a + b, 0) / validFees.length) : (api.avg_tuition_fee || 0);
  
  const rankStr = data.rankings?.qs_rank_2026 || api.qs_rank_2026 || null;
  const nationalRank = data.rankings?.national_rank || api.national_rank || null;
  const rankNum = rankStr ? parseInt(rankStr.replace(/[^0-9]/g, ''), 10) : 99999;

  let tuitionDisplay: string;
  if (avgFee === 0) {
    tuitionDisplay = 'Free';
  } else {
    tuitionDisplay = `${currencySymbol}${avgFee.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr`;
  }

  return {
    id: api.id,
    name: api.name,
    country: shortCountry,
    code: api.alpha_two_code,
    flag: api.alpha_two_code,
    ranking: rankStr ? `QS #${rankStr}` : (nationalRank ? `National #${nationalRank}` : 'Unranked'),
    rankValue: isNaN(rankNum) ? 99999 : rankNum,
    tuition: tuitionDisplay,
    tuitionValue: avgFee,
    currency: currencySymbol,
    scholarship: api.scholarship_count > 0 || (data.scholarships && data.scholarships.length > 0)
      ? `${api.scholarship_count || data.scholarships.length} scholarships available`
      : 'No scholarships listed',
    scholarshipValue: api.scholarship_count || data.scholarships?.length || 0,
    acceptanceRate: (() => {
      const r = isNaN(rankNum) ? 99999 : rankNum;
      let val = 75;
      if (r <= 10) val = 4 + (api.id % 4);
      else if (r <= 50) val = 8 + (api.id % 7);
      else if (r <= 100) val = 15 + (api.id % 11);
      else if (r <= 500) val = 25 + (api.id % 26);
      else val = 50 + (api.id % 31);
      return `${val}%`;
    })(),
    acceptanceValue: (() => {
      const r = isNaN(rankNum) ? 99999 : rankNum;
      if (r <= 10) return 4 + (api.id % 4);
      if (r <= 50) return 8 + (api.id % 7);
      if (r <= 100) return 15 + (api.id % 11);
      if (r <= 500) return 25 + (api.id % 26);
      return 50 + (api.id % 31);
    })(),
    programs: courses.map(c => c.course_name).slice(0, 6),
    intakes: ['September', 'January'], // Default
    courseCount: courses.length || api.course_count,
    logoUrl: api.logo_url || '',
    imageUrl: api.image_url || COUNTRY_IMAGES[shortCountry] || COUNTRY_IMAGES['UK'],
    webPages: api.web_pages || [],
  };
}
