import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildMetadata, isLocale, paths } from '@/lib/site';
import type { Locale } from '@/content/types';
import { team, ui } from '@/content/site';
import { Closing, PageHeader, TeamArchive, TeamClosing } from '@/components/sections';

/**
 * WHO WE ARE — the seven people of the studio, from the same `team` data
 * the homepage section reads. Header and statement, the archive of
 * prints, one line to close, then the call to action every page ends on.
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
    title: ui.navTeam[locale],
    description: team.intro[locale],
    path: paths.team(locale),
    locale,
  });
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <>
      <PageHeader title={ui.navTeam[locale]} lede={team.intro[locale]} />
      <TeamArchive locale={locale} />
      <TeamClosing locale={locale} />
      <Closing locale={locale} />
    </>
  );
}
