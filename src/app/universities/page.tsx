import React from 'react';
import { Metadata } from 'next';
import UniversityCatalog from '../../components/universities/UniversityCatalog';
import { 
  fetchUniversities, 
  mapApiToDetailedUniversity 
} from '../../lib/api';
import { FEATURED_UNIVERSITIES_FALLBACK } from '../../lib/constants';
import { DetailedUniversity } from '../../lib/types';

export const metadata: Metadata = {
  title: 'Universities Catalog | Fly & Flourish Overseas',
  description: 'Explore 150,000+ course programs across prestigious international partner campuses. Run instant eligibility evaluations, verify rankings, and lock in direct counselor advisories.',
};

export default async function UniversitiesPage() {
  let initialUniversities: DetailedUniversity[] | undefined = undefined;
  let initialTotal: number | undefined = undefined;

  try {
    // Fetch initial featured universities on the server directly from FastAPI target
    const data = await fetchUniversities({ featured: true, page: 1, page_size: 12 });
    initialUniversities = data.universities.map(mapApiToDetailedUniversity);
    initialTotal = data.total;
  } catch (err) {
    console.warn("Failed to pre-render live universities on server, falling back to local fallback data:", err);
    initialUniversities = FEATURED_UNIVERSITIES_FALLBACK.map(mapApiToDetailedUniversity);
    initialTotal = FEATURED_UNIVERSITIES_FALLBACK.length;
  }

  return (
    <UniversityCatalog 
      initialUniversities={initialUniversities} 
      initialTotal={initialTotal} 
    />
  );
}
