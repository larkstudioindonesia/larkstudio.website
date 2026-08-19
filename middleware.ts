import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/content/types';

/**
 * The site lives entirely under /en and /id. This redirects the bare
 * origin to a locale, honouring the visitor's remembered choice before
 * falling back to the Accept-Language header, then to English.
 *
 * English is the default rather than Bahasa because English is the
 * premium register in this market and the developer and F&B clients
 * expect it — while the layout is built to the longer Bahasa strings so
 * neither language is the compromised one.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const remembered = request.cookies.get('lark-locale')?.value;
  const preferred = request.headers.get('accept-language') ?? '';

  const locale =
    remembered !== undefined && (LOCALES as readonly string[]).includes(remembered)
      ? remembered
      : preferred.toLowerCase().startsWith('id')
        ? 'id'
        : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

/**
 * WHAT THE LOCALE REDIRECT MUST NOT TOUCH.
 *
 * This used to be a hand-written list of asset paths, and a hand-written
 * list is wrong the moment anything is added. Three things were already
 * broken by it: `apple-icon.png` and `manifest.webmanifest` were being
 * redirected to `/en/...` and served as 404s, so iOS had no home-screen
 * icon and no browser could read the manifest. `images-2` only worked by
 * accident, because the string happens to start with the listed
 * `images`.
 *
 * The rule is now structural rather than enumerated: SKIP ANYTHING THAT
 * LOOKS LIKE A FILE. A locale route never contains a dot, and every
 * static asset and metadata route does — `.png`, `.ico`, `.jpg`, `.txt`,
 * `.xml`, `.webmanifest`. Nothing has to be added here again.
 */
export const config = {
  matcher: ['/((?!_next/|.*\\.).*)'],
};
