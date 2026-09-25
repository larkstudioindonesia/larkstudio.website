import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/app/globals.css';

import { brandFace, isLocale, organisationJsonLd } from '@/lib/site';
import { INTRO_SCRIPT, MotionProvider } from '@/lib/motion';
import { LOCALES, type Locale } from '@/content/types';
import { site, ui } from '@/content/site';
import { Lightbox, SkipLink } from '@/components/ui';
import { Announcement, Cursor, Footer, Header, Preloader, ScrollRail } from '@/components/chrome';

/**
 * THE APPLICATION SHELL.
 *
 * Header, main, footer, and four pieces of document chrome that render
 * no content: the opening sequence, the scroll rail, the cursor and the
 * grain overlay. No announcement bar, no cookie banner (analytics are
 * cookieless, so consent is not required), no chat widget, no
 * back-to-top button.
 *
 * `MotionProvider` is mounted once here so LazyMotion's feature set
 * loads a single time, every `Motion` component shares it, and Lenis has
 * exactly one instance.
 *
 * HEADER CLEARANCE IS NOT SET HERE. The header is `fixed` on every
 * route, so something has to reserve space beneath it — but `<main>` is
 * the wrong place. Padding it pushes down the two pages that are
 * supposed to run underneath the bar (the homepage hero, a project's
 * full-bleed opener), which then cancel it with a negative margin; that
 * cancellation collides with `min-h-dvh` and clips the top of the
 * headline off-screen where there is no scrollback. Clearance belongs to
 * the sections that want it.
 */

/**
 * ROOT METADATA.
 *
 * `metadataBase` is what turns every relative asset path below — and the
 * OG images in `buildMetadata` — into the absolute URLs that crawlers and
 * social scrapers require. Without it Next emits relative `og:image`
 * paths and link previews silently fail off-origin.
 *
 * The icons are NOT listed here. `app/icon.png`, `app/apple-icon.png`
 * and `app/favicon.ico` are file-convention routes: Next discovers them,
 * fingerprints them and emits the `<link>` tags itself. Declaring them
 * again by hand would produce duplicate, unfingerprinted tags that
 * compete with the generated ones.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: { default: site.name, template: `%s — ${site.name}` },
};

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    /* `suppressHydrationWarning` covers exactly one thing: the
       `data-intro` attribute the head script below writes before React
       hydrates. It does not reach into children. */
    <html
      lang={locale}
      className={brandFace.variable}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-paper font-text text-ink">
        {/* Decides whether the overture plays, before first paint. Must
            stay the first thing in <body>. See `INTRO_SCRIPT`. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <script
          type="application/ld+json"
          /* Serialised from a typed object literal — no user input
             reaches this string. */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />

        {/*
          NO-JAVASCRIPT FAILSAFE.

          Every reveal on this site renders its initial state into the
          server HTML — `opacity: 0`, a closed `clip-path`, an offset
          transform. That is correct for the animation and catastrophic
          without it: the copy is all present in the markup, but a
          visitor with JavaScript disabled sees a correctly-structured,
          entirely blank page. `!important` in a stylesheet outranks an
          inline declaration, so these five lines put everything back.
          Nothing here conveys meaning through transform or opacity,
          which is what makes the blunt reset safe.
        */}
        <noscript>
          <style>{`
            header *, main *, footer * {
              opacity: 1 !important;
              transform: none !important;
              clip-path: none !important;
              filter: none !important;
            }
            [data-overture] { display: none !important; }
          `}</style>
        </noscript>

        <SkipLink label={ui.skipToContent[locale]} />

        <MotionProvider>
          <Preloader />
          <ScrollRail />
          <Cursor />

          <Header locale={locale} />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer locale={locale} />

          {/* The one photo lightbox. Any print on any page opens it. */}
          <Lightbox />

          {/* The studio's New Directions announcement — shown once a
              session after the intro, reopened from the header. */}
          <Announcement locale={locale} />
        </MotionProvider>

        {/* Grain sits above everything except the menu and the cursor.
            Pointer-events none, one composited layer, no per-frame work
            — and it is what stops six consecutive full-width areas of
            near-black reading as flat. */}
        <div className="grain no-print" aria-hidden="true" />
      </body>
    </html>
  );
}
