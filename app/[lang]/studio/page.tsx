import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import { paths } from '@/lib/paths';
import { studio } from '@/content/pages/studio';
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
    title: ui.navStudio[locale],
    description: studio.statement[locale],
    path: paths.studio(locale),
    locale,
    openGraphImage: studio.openGraphImage,
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

  const passages = studio.passages.map((passage) => ({
    id: passage.id,
    ...(passage.heading !== undefined && { heading: passage.heading[locale] }),
    body: passage.body[locale],
  }));

  return (
    <>
      <Prose statement={studio.statement[locale]} passages={passages} />
      <ClosingBlock
        message={home.closing[locale]}
        actionLabel={home.closingAction[locale]}
        actionHref={paths.contact(locale)}
      />
    </>
  );
}
