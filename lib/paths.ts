import type { Locale, ProjectSlug } from '@/content/types';
import { DEFAULT_LOCALE } from '@/content/types';

/**
 * Typed route construction. Slugs are permanent once published: they
 * are pasted into WhatsApp and sit inside proposal emails for years.
 * Any change is a broken link in someone's archive.
 */

export const SITE_ORIGIN = 'https://larkstudio.id';

export const paths = {
  home: (locale: Locale) => `/${locale}`,
  project: (locale: Locale, slug: ProjectSlug) => `/${locale}/work/${slug}`,
  approach: (locale: Locale) => `/${locale}/approach`,
  studio: (locale: Locale) => `/${locale}/studio`,
  contact: (locale: Locale) => `/${locale}/contact`,
} as const;

export type PathKey = keyof typeof paths;

/** Absolute URL, for canonicals, hreflang, sitemap and OG tags. */
export function absolute(path: string): string {
  return `${SITE_ORIGIN}${path}`;
}

/**
 * Maps a path in one locale to the same page in the other. Switching
 * language on a project page must land on that project, never on the
 * homepage — obvious, and broken on most bilingual sites.
 */
export function translatePath(path: string, target: Locale): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return `/${target}`;
  segments[0] = target;
  return `/${segments.join('/')}`;
}

/** wa.me link with a pre-filled opener — a small courtesy that
 *  measurably raises the quality of first messages. */
export function whatsappLink(number: string, opener: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(opener)}`;
}

export { DEFAULT_LOCALE };
