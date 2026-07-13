import { MetadataRoute } from 'next';

export const revalidate = 86400; // Cache sitemap for 24 hours route-level

const BASE_URL = 'https://ffoverseas.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/aboutus`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/universities`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/student/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const backendUrl = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000';
    const apiKey = process.env.FRONTEND_API_KEY;
    const headers = new Headers();
    if (apiKey) {
      headers.set('x-orbit-api-key', apiKey);
    }

    const response = await fetch(`${backendUrl}/api/universities?page_size=4000`, {
      headers,
      next: { revalidate: 86400 }, // Cache sitemap list for 24 hours
    });

    if (response.ok) {
      const data = await response.json();
      const universities = data.universities || [];

      const dynamicRoutes: MetadataRoute.Sitemap = universities.map((uni: { id: number }) => ({
        url: `${BASE_URL}/universities/${uni.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

      return [...staticRoutes, ...dynamicRoutes];
    }
  } catch (error) {
    console.error('Failed to generate dynamic university sitemap pages:', error);
  }

  // Fallback to static routes if database or API is unreachable
  return staticRoutes;
}
