import type { MetadataRoute } from 'next';

import { absolute, paths } from '@/lib/paths';
import { projects } from '@/content/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  const locales = ['en', 'id'] as const;

  for (const locale of locales) {
    routes.push({
      url: absolute(paths.home(locale)),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    });

    routes.push({
      url: absolute(paths.approach(locale)),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    routes.push({
      url: absolute(paths.studio(locale)),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    routes.push({
      url: absolute(paths.contact(locale)),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    for (const project of projects) {
      routes.push({
        url: absolute(paths.project(locale, project.slug)),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }
  }

  return routes;
}