import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildMetadata, isLocale, paths } from '@/lib/site';
import type { Locale } from '@/content/types';
import { studio, ui } from '@/content/site';
import { Closing, PageHeader, Prose } from '@/components/sections';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;

  return buildMetadata({
    title: ui.navStudio[locale],
    description: studio.statement[locale],
    path: paths.studio(locale),
    locale,
  });
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <>
      <PageHeader title={ui.navStudio[locale]} />
      <Prose
        statement={studio.statement[locale]}
        passages={studio.passages}
        locale={locale}
        eyebrow={ui.howWeWork[locale]}
      />
      <Closing locale={locale} />
    </>
  );
}
