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
   * The hero PLATE is its own master (`home.stage.image`) rather than a
   * frame lifted out of the registry — a photograph that is excellent in
   * a gallery can still be the wrong thing to set a headline on, and
   * this one was exported wide specifically for the job.
   *
   * What the registry is still consulted for is the CREDIT: the room in
   * the plate is a real project, and naming it is the difference between
   * a stock hero and a studio's. `home.stage.bed` holds the frame id, so
   * reordering the registry cannot silently re-credit the hero.
   */
  const credit = findImage(home.stage.bed)?.project;

  return (
    <>
      {credit && <Hero locale={locale} credit={credit} />}
      <Portfolio projects={projects} locale={locale} />
      <Manifesto locale={locale} />
      <Disciplines locale={locale} />

      <Process stages={approach.stages} locale={locale} />
      <Closing locale={locale} />
    </>
  );
}
