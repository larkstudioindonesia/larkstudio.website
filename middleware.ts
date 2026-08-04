import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/content/types';

/**
 * The site lives entirely under /en and /id. This redirects the bare
 * origin to a locale, honouring the visitor's remembered choice
 * before falling back to the Accept-Language header, then to English.
 *
 * English is the default rather than Bahasa because English is the
 * premium register in this market and the developer and F&B clients
 * expect it — while the layout is built to the longer Bahasa strings
 * so neither language is the compromised one.
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
    remembered !== undefined &&
    (LOCALES as readonly string[]).includes(remembered)
      ? remembered
      : preferred.toLowerCase().startsWith('id')
        ? 'id'
        : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|images|logo|og|fonts|favicon.ico|robots.txt|sitemap.xml).*)'],
};
