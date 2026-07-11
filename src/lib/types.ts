export interface Destination {
  id: string;
  name: string;
  code: string;
  flag: string;
  description: string;
  tagline: string;
  universities: string[];
  intakes: string;
  visaSuccessRate: string;
  glassColor: string;
  refractions: string;
}

export interface RoadmapStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  deliverables: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  course: string;
  university: string;
  destination: string;
  quote: string;
  rating: number;
  bubbleSize: string;
  delay: number;
  initialX: number;
  initialY: number;
}

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
  logo_url?: string | null;
  image_url?: string | null;
}

export interface UniversityApiResponse {
  universities: ApiUniversity[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

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

export interface ApiCourse {
  id: number;
  course_name: string;
  degree_level: string;
  duration_years: number;
  language: string;
  tuition_fee: number | null;
  currency: string | null;
}

export interface ApiScholarship {
  id: number;
  name: string;
  type: string;
  amount: string;
  coverage: string;
  eligibility: string | null;
  target_degree_level: string;
  country: string | null;
  provider: string;
  currency: string | null;
  deadline: string | null;
  application_url: string | null;
  description: string | null;
  renewable: boolean | null;
  min_gpa: string | null;
  field_of_study: string | null;
  number_of_awards: string | null;
}

