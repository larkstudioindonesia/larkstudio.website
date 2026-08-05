import { site } from '@/content/site';
import { LOCALES } from '@/content/types';
import { SITE_NAME } from '@/lib/seo';
import { SITE_ORIGIN, absolute } from '@/lib/paths';

/**
 * LARK STUDIO — STRUCTURED DATA (JSON-LD)
 *
 * Organization + WebSite, schema.org's minimum viable pair for a
 * small studio site. Every fact below is read from the same content
 * modules the rest of the app renders from (`content/site.ts`,
 * `lib/paths.ts`, `lib/seo.ts`) — nothing here is a second, hand-typed
 * copy of a name, address or URL stated elsewhere.
 */

interface PostalAddressSchema {
  readonly '@type': 'PostalAddress';
  readonly streetAddress: string;
  readonly addressLocality?: string;
  readonly postalCode?: string;
  readonly addressCountry: string;
}

export interface OrganizationSchema {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'Organization';
  readonly name: string;
  readonly url: string;
  readonly logo: string;
  readonly email: string;
  readonly address: PostalAddressSchema;
  readonly sameAs: readonly string[];
}

export interface WebSiteSchema {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'WebSite';
  readonly name: string;
  readonly url: string;
  readonly inLanguage: readonly string[];
}

export interface SiteJsonLd {
  readonly '@context': 'https://schema.org';
  readonly '@graph': readonly [OrganizationSchema, WebSiteSchema];
}

/**
 * `site.address`'s second line is free text like "Bogor 16152" — a
 * city name followed by an Indonesian postal code, since that's how
 * the Footer displays it. Split the trailing digits off rather than
 * carrying a second, separately-maintained copy of the city/postcode
 * anywhere in content.
 */
function splitLocalityLine(line: string): { locality?: string; postalCode?: string } {
  const trimmed = line.trim();
  const match = /^(.*?)\s*(\d{4,6})$/.exec(trimmed);
  if (!match) return trimmed === '' ? {} : { locality: trimmed };
  const [, locality, postalCode] = match;
  return {
    ...(locality !== undefined && locality !== '' && { locality }),
    ...(postalCode !== undefined && { postalCode }),
  };
}

function addressSchema(): PostalAddressSchema {
  const [streetAddress, localityLine, country] = site.address;
  const { locality, postalCode } = splitLocalityLine(localityLine);
  return {
    '@type': 'PostalAddress',
    streetAddress,
    ...(locality !== undefined && { addressLocality: locality }),
    ...(postalCode !== undefined && { postalCode }),
    addressCountry: country,
  };
}

export function organizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: absolute(site.logo),
    email: site.email,
    address: addressSchema(),
    sameAs: [site.instagram.href],
  };
}

export function websiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    inLanguage: LOCALES,
  };
}

/** The one object the root layout actually renders — both schemas
 *  under a single `@context` via `@graph`, so the page ships one
 *  `<script>` tag instead of one per type. */
export function siteJsonLd(): SiteJsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema()],
  };
}

/**
 * Props for a `<script type="application/ld+json">`. `JSON.stringify`
 * alone can emit a literal `</script>` if any string value happens to
 * contain that substring, which would close the tag early — escaping
 * `<` neutralises that without changing the parsed JSON value.
 */
export function jsonLdScriptProps(data: unknown): { readonly __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
