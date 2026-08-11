import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildMetadata, isLocale, paths } from '@/lib/site';
import type { Locale } from '@/content/types';
import { approach, ui } from '@/content/site';
import { Closing, PageHeader, Process } from '@/components/sections';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  return buildMetadata({
    title: ui.navApproach[locale],
    description: approach.statement[locale],
    path: paths.approach(locale),
    locale,
  });
}

export default async function ApproachPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <>
      <PageHeader
        title={ui.navApproach[locale]}
        lede={approach.statement[locale]}
      />
      <Process stages={approach.stages} locale={locale} />
      <Closing locale={locale} />
    </>
  );
}
