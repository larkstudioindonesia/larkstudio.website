import type { MetadataRoute } from 'next';
import { LOCALES } from '@/content/types';
import { projects } from '@/content/projects';
import { absolute, paths } from '@/lib/site';

/** Every route the site has, in both languages. Derived from the same
 *  registry the pages render from, so it cannot go stale. */
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) => [
    { url: absolute(paths.home(locale)), priority: 1 },
    { url: absolute(paths.approach(locale)), priority: 0.8 },
    { url: absolute(paths.studio(locale)), priority: 0.8 },
    { url: absolute(paths.contact(locale)), priority: 0.8 },
    ...projects.map((project) => ({
      url: absolute(paths.project(locale, project.slug)),
      priority: 0.9,
    })),
  ]);
}
