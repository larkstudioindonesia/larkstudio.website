import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import ClarityProvider from '@/components/providers/ClarityProvider';
import { GoogleAnalytics } from '@next/third-parties/google';
import { notFound } from 'next/navigation';
import '@/app/globals.css';

import { fontVariables } from '@/lib/fonts';
import { MotionProvider } from '@/lib/motion';
import { HTML_LANG, isLocale, type Locale } from '@/lib/i18n';
import { whatsappLink } from '@/lib/paths';
import { siteJsonLd, jsonLdScriptProps } from '@/lib/schema';
import { SkipLink } from '@/components/primitives/SkipLink';
import { Header } from '@/components/chrome/Header';
import { Footer } from '@/components/chrome/Footer';
import { ui } from '@/content/ui';
import { site } from '@/content/site';
import { LOCALES } from '@/content/types';

/**
 * THE APPLICATION SHELL.
 *
 * Header, main, footer. Nothing else — no announcement bar, no cookie
 * banner (analytics are cookieless, so consent is not required), no
 * chat widget, no back-to-top button.
 *
 * `MotionProvider` is mounted once here so LazyMotion's domAnimation
 * feature set loads a single time and every `m` component shares it.
 */

export const metadata: Metadata = {
  title: {
    default: 'Lark Studio',
    template: '%s — Lark Studio',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  verification: {
    bing: 'E472E5DCFCB14A1B493CB93E948FE803',
  },
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

  const whatsappHref = whatsappLink(
    site.whatsapp,
    site.whatsappOpener[locale],
  );

  return (
    <html lang={HTML_LANG[locale]} className={fontVariables}>
      <body className="flex min-h-screen flex-col bg-paper font-serif text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScriptProps(siteJsonLd())}
        />
        <SkipLink label={ui.skipToContent[locale]} />
        <MotionProvider>
          <Header
            locale={locale}
            email={site.email}
            whatsappHref={whatsappHref}
            instagramHref={site.instagram.href}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer
            locale={locale}
            email={site.email}
            whatsappHref={whatsappHref}
            instagramHref={site.instagram.href}
            address={site.address}
          />
        </MotionProvider>
        <ClarityProvider />
        <GoogleAnalytics gaId="G-QX30Q2164X" />
      </body>
    </html>
  );
}
