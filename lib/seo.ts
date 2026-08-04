import type { Metadata } from 'next';
import type { Locale } from '@/content/types';
import { LOCALES } from '@/content/types';
import { SITE_ORIGIN, absolute, translatePath } from '@/lib/paths';

/**
 * LARK STUDIO — METADATA
 *
 * This site is reached by name, from referrals and proposal links. It
 * will not compete for generic terms and no design decision should be
 * distorted to try.
 *
 * Priority one is the link preview. WhatsApp is the primary
 * distribution surface and the unfurled card is the true first
 * impression — so OG images are designed, static brand assets, not
 * generated at the edge.
 */

export const SITE_NAME = 'Lark Studio';

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB',
  id: 'id_ID',
};

interface PageMetadataInput {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly locale: Locale;
  readonly openGraphImage: string;
}

export function buildMetadata({
  title,
  description,
  path,
  locale,
  openGraphImage,
}: PageMetadataInput): Metadata {
  const languages: Record<string, string> = {};
  for (const candidate of LOCALES) {
    languages[candidate] = absolute(translatePath(path, candidate));
  }
  /* English is x-default: it is the primary language of the site
     even though the primary market is domestic. */
  languages['x-default'] = absolute(translatePath(path, 'en'));

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    alternates: {
      canonical: absolute(path),
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: absolute(path),
      locale: OG_LOCALE[locale],
      images: [{ url: openGraphImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [openGraphImage],
    },
    robots: { index: true, follow: true },
  };
}

/** Organisation schema. Real address and coordinates, no invented
 *  ratings or review counts. */
export function organisationJsonLd(input: {
  readonly streetAddress: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly countryCode: string;
  readonly email: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    email: input.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: input.streetAddress,
      addressLocality: input.locality,
      addressRegion: input.region,
      postalCode: input.postalCode,
      addressCountry: input.countryCode,
    },
  };
}
