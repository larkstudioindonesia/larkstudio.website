import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://larkstudio.id/sitemap.xml',
    host: 'https://larkstudio.id',
  };
}