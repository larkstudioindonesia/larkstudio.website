import { DEFAULT_LOCALE, LOCALES, type Locale, type Localized } from '@/content/types';

export { DEFAULT_LOCALE, LOCALES };
export type { Locale, Localized };

/** Runtime guard for the `[lang]` route segment. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Resolves an unknown segment to a locale, defaulting to English. */
export function resolveLocale(value: string | undefined): Locale {
  return value !== undefined && isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Reads one side of a localised value. */
export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/**
 * `lang` attribute for <html>. Bahasa Indonesia is 'id'; the region
 * suffix is unnecessary and screen readers handle the bare tag.
 */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  id: 'id',
};

/** Locale names, each written in its own language. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'EN',
  id: 'ID',
};

/**
 * Date formatting. Facts are stated plainly and in full — no
 * abbreviated months, no ordinals.
 */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Tabular figures with locale-correct grouping. */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-GB').format(value);
}
