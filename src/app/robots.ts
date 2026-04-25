import { MetadataRoute } from 'next';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/settings/', '/subscriptions/', '/archive/'],
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}