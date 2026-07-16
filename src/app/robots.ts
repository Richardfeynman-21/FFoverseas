import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/agent/', '/api/'],
    },
    sitemap: 'https://www.ffoverseas.in/sitemap.xml',
  };
}
