import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildMetadata, isLocale, paths } from '@/lib/site';
import type { Locale } from '@/content/types';
import { contact, ui } from '@/content/site';
import { ContactPanel, PageHeader } from '@/components/sections';

/**
 * The one page that ends without a closing block: it is already the
 * destination every other call to action points at, and a page that ends
 * by asking you to go to the page you are on is a page that has stopped
 * paying attention.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  return buildMetadata({
    title: ui.navContact[locale],
    description: contact.statement[locale],
    path: paths.contact(locale),
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <>
      <PageHeader title={ui.navContact[locale]} />
      <ContactPanel locale={locale} />
    </>
  );
}
