import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildMetadata, isLocale, paths } from '@/lib/site';
import { LOCALES, type Locale } from '@/content/types';
import { getProject, nextProject, projects } from '@/content/projects';
import {
  Closing,
  NextProject,
  Outcome,
  Plates,
  ProjectFacts,
  ProjectHero,
} from '@/components/sections';

/**
 * A PROJECT PAGE, MAGAZINE STRUCTURE.
 *
 * Cover with the name over it → the four facts → the plates, every
 * frame the project has at the largest size its master supports → the
 * outcome, read slowly → the next project at the same scale as the
 * cover → one call to action.
 *
 * The previous revision also rendered Challenge, Concept, Materials and
 * Plans. All four were placeholder or empty for all eight projects, and
 * three of them printed the words "to be added once full project
 * documentation is available" onto a portfolio page. They are gone
 * rather than hidden: a section that exists only to be filled in later
 * is a promise made in the codebase, and this one had been open for
 * months.
 */

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => projects.map((project) => ({ lang, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const project = getProject(slug);
  if (!project) return {};

  return buildMetadata({
    title: `${project.name[locale]} — ${project.type[locale]}`,
    /* The write-up when there is one; otherwise the stated facts,
       assembled — never invented copy. */
    description:
      project.outcome?.[locale] ??
      `${project.name[locale]} — ${project.type[locale]}, ${project.location[locale]}, ${String(project.year)}.`,
    path: paths.project(locale, project.slug),
    locale,
    image: `/og/${project.slug}.jpg`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const project = getProject(slug);
  if (!project) notFound();
  const next = nextProject(project.slug);

  return (
    <>
      <ProjectHero project={project} locale={locale} />
      <ProjectFacts project={project} locale={locale} />
      <Plates project={project} locale={locale} />
      <Outcome project={project} locale={locale} />
      {next && <NextProject project={next} locale={locale} />}
      <Closing locale={locale} />
    </>
  );
}
