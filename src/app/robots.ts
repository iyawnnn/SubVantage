import { MetadataRoute } from 'next';

const DOMAIN = "https://subvantage.iansebastian.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Protect private user data from being indexed
      disallow: ['/dashboard/', '/api/', '/settings/', '/subscriptions/', '/archive/'],
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}