import React from 'react';
import UniversityDetailClient from '../../../components/universities/UniversityDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UniversityDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <UniversityDetailClient universityId={Number(id)} />;
}
