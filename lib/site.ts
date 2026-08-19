import type { Metadata } from 'next';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/content/types';
import { site } from '@/content/site';

/**
 * LARK STUDIO — THE NON-VISUAL LAYER
 *
 * Typefaces, locale plumbing, route construction and metadata. Four
 * files of forty lines each, previously; nothing here is ever read on
 * its own and every route imports at least three of them.
 */

/* ------------------------------------------------------------------ *
 * Type
 * ------------------------------------------------------------------ */

/*
 * NO WEBFONT IS LOADED. Both tiers are Helvetica, declared as a system
 * stack in `--font-helvetica` in `app/globals.css`; `font-display` and
 * `font-text` both resolve to it. There is nothing for `next/font` to
 * host and no `--font-*` class for the `<html>` element to carry, so
 * the loaders and the `fontVariables` export that fed them are gone.
 */

/* ------------------------------------------------------------------ *
 * Locale
 * ------------------------------------------------------------------ */

/** Runtime guard for the `[lang]` route segment. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_LABEL: Record<Locale, string> = { en: 'EN', id: 'ID' };

/* ------------------------------------------------------------------ *
 * Routes
 * ------------------------------------------------------------------ */

export const paths = {
  home: (locale: Locale) => `/${locale}`,
  project: (locale: Locale, slug: string) => `/${locale}/work/${slug}`,
  approach: (locale: Locale) => `/${locale}/approach`,
  studio: (locale: Locale) => `/${locale}/studio`,
  contact: (locale: Locale) => `/${locale}/contact`,
} as const;

export function absolute(path: string): string {
  return `${site.origin}${path}`;
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

/** wa.me with a pre-filled opener — a courtesy that measurably raises
 *  the quality of first messages. */
export function whatsappLink(opener: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(opener)}`;
}

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

/** Tabular, locale-aware, and never a bare float: 115.5 → '115,5 m²'. */
export function formatArea(value: number, locale: Locale): string {
  return `${new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    maximumFractionDigits: 1,
  }).format(value)} m²`;
}

/**
 * The first sentence of a paragraph.
 *
 * The portfolio panels want a one-line summary and the projects carry a
 * paragraph. Deriving rather than authoring a second field is deliberate:
 * every `outcome` in the registry is written topic-sentence-first, so the
 * first sentence IS the summary — and it cannot drift out of sync with
 * the paragraph a reader meets thirty seconds later on the project page.
 */
export function firstSentence(text: string): string {
  const end = text.indexOf('. ');
  return end === -1 ? text : text.slice(0, end + 1);
}

/** '01', '02'… never locale-dependent numerals. */
export function ordinal(index: number): string {
  return String(index + 1).padStart(2, '0');
}

/* ------------------------------------------------------------------ *
 * Metadata
 * ------------------------------------------------------------------ */

const OG_LOCALE: Record<Locale, string> = { en: 'en_GB', id: 'id_ID' };

/**
 * This site is reached by name, from referrals and proposal links. It
 * will not compete for generic terms and no design decision should be
 * distorted to try. Priority one is the link preview: WhatsApp is the
 * primary distribution surface and the unfurled card is the real first
 * impression, so OG images are designed static assets.
 */
export function buildMetadata({
  title,
  description,
  path,
  locale,
  image = '/og/home.jpg',
}: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string;
}): Metadata {
  const languages: Record<string, string> = {};
  for (const candidate of LOCALES) {
    languages[candidate] = absolute(translatePath(path, candidate));
  }
  languages['x-default'] = absolute(translatePath(path, DEFAULT_LOCALE));

  return {
    metadataBase: new URL(site.origin),
    title,
    description,
    alternates: { canonical: absolute(path), languages },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title,
      description,
      url: absolute(path),
      locale: OG_LOCALE[locale],
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    robots: { index: true, follow: true },
  };
}

/** Real address, real coordinates, no invented ratings or review counts. */
export const organisationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: site.origin,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address[0],
    addressLocality: 'Bogor',
    addressRegion: 'West Java',
    postalCode: '16152',
    addressCountry: 'ID',
  },
} as const;
