import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import { paths } from '@/lib/paths';
import { approach } from '@/content/pages/approach';
import { home } from '@/content/pages/home';
import { ui } from '@/content/ui';
import { Prose } from '@/components/sections/Prose';
import { ClosingBlock } from '@/components/sections/ClosingBlock';

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
    openGraphImage: approach.openGraphImage,
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

  const passages = approach.stages.map((stage) => ({
    id: stage.id,
    ...(stage.heading !== undefined && { heading: stage.heading[locale] }),
    body: stage.body[locale],
  }));

  return (
    <>
      <Prose statement={approach.statement[locale]} passages={passages} />
      <ClosingBlock
        message={home.closing[locale]}
        actionLabel={home.closingAction[locale]}
        actionHref={paths.contact(locale)}
      />
    </>
  );
}
