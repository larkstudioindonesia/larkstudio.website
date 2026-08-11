import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildMetadata, isLocale, paths } from '@/lib/site';
import type { Locale } from '@/content/types';
import { findImage, projects } from '@/content/projects';
import { approach, home } from '@/content/site';
import { Closing, Disciplines, Hero, Manifesto, Process } from '@/components/sections';
import { Portfolio } from '@/components/portfolio';

/**
 * HOME IS THE INDEX.
 *
 * One continuous journey, in six movements:
 *
 *   Hero        a single building, full bleed, entering on a scored
 *               nine-cue sequence
 *   Portfolio   the work, travelled through horizontally — the page's
 *               centrepiece, and the reason there is no separate /work
 *               route
 *   Manifesto   the studio speaking, in type alone, with a great deal of
 *               air after eight screens of photography
 *   Disciplines what the studio does, evidence summoned to the pointer
 *   Process     how it does it, on a rule that draws itself
 *   Closing     one call to action, at the end of the reading unit
 *
 * COMPOSITION OVER CONFIGURATION. The sequence is written out, not
 * produced by a renderer looping a blocks array. With this many sections
 * the abstraction costs legibility and buys nothing, and the editorial
 * rhythm is deliberately uneven — a generic renderer would flatten it,
 * and flattening it is exactly what makes a studio site look like every
 * other studio site.
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
    title: home.metaTitle[locale],
    description: home.metaDescription[locale],
    path: paths.home(locale),
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  /**
   * The hero frame is named in content rather than taken from the top of
   * the registry: a photograph that is excellent on its own can still be
   * the wrong thing to set a headline on, and this one was chosen for
   * what it does UNDER TYPE — dark through the lower two thirds, with
   * its own signage high and right, away from the headline.
   */
  const bed = findImage(home.stage.bed);

  return (
    <>
      {bed && <Hero locale={locale} bed={bed} />}
      <Portfolio projects={projects} locale={locale} />
      <Manifesto locale={locale} />
      <Disciplines locale={locale} />

      <Process stages={approach.stages} locale={locale} />
      <Closing locale={locale} />
    </>
  );
}
