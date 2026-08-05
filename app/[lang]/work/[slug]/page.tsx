import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import { paths } from '@/lib/paths';
import { LOCALES } from '@/content/types';
import { getProject, nextProject, projectSlugs } from '@/content/projects';
import { home } from '@/content/pages/home';
import { ui } from '@/content/ui';
import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { ProjectMeasure } from '@/components/primitives/ProjectMeasure';
import { Figures, Label } from '@/components/primitives/Figures';
import { NextProject } from '@/components/primitives/NextProject';
import { Statement } from '@/components/sections/Statement';
import { FullBleedImage } from '@/components/sections/FullBleedImage';
import { CaptionedImage } from '@/components/sections/CaptionedImage';
import { Concept } from '@/components/sections/Concept';
import { MaterialPalette } from '@/components/sections/MaterialPalette';
import { Plans } from '@/components/sections/Plans';
import { Specification } from '@/components/sections/Specification';
import { Credits } from '@/components/sections/Credits';
import { ClosingBlock } from '@/components/sections/ClosingBlock';

/**
 * A PROJECT PAGE, MAGAZINE STRUCTURE.
 *
 * Hero → Overview (identification) → Challenge (the constraint) →
 * Concept (the named decisions) → Materials (conditional) → Plans
 * (conditional) → Gallery → Result (outcome + Specification) →
 * Credits → Next project.
 *
 * Materials and Plans render nothing until a project has real
 * `details`/`plans` data — true for all 8 projects today, so those
 * two sections are currently invisible in production without being
 * dead code: they activate the moment real content exists.
 *
 * Challenge/Concept/Specification/Credits now render real fields
 * (`constraint`, `decisions`, `specification`, `credits`) that exist
 * on every project but are, as of this pass, still placeholder text
 * in the source for all 8 — see each project file's own comments.
 * Replacing that placeholder copy is a required pre-launch content
 * task, tracked separately from this page's structure.
 */

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => projectSlugs().map((slug) => ({ lang, slug })));
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
    title: `${project.identification.name[locale]} — ${project.identification.type[locale]}`,
    description: project.outcome[locale],
    path: paths.project(locale, project.slug),
    locale,
    openGraphImage: project.openGraphImage,
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

  const { identification } = project;
  const [hero, ...sequence] = project.images;
  const next = nextProject(project.slug);

  const decisions = project.decisions.map((decision) => ({
    id: decision.id,
    heading: decision.heading[locale],
    body: decision.body[locale],
  }));

  const materials =
    project.details?.map((detail) => ({
      id: detail.id,
      src: detail.square.src,
      width: detail.square.width,
      height: detail.square.height,
      alt: detail.alt[locale],
      ...(detail.caption !== undefined && { caption: detail.caption[locale] }),
    })) ?? [];

  const plans =
    project.plans?.map((plan) => ({
      id: plan.id,
      src: plan.image.src,
      width: plan.image.width,
      height: plan.image.height,
      alt: plan.alt[locale],
      ...(plan.caption !== undefined && { caption: plan.caption[locale] }),
    })) ?? [];

  return (
    <>
      <FullBleedImage image={hero} locale={locale} priority />

      <Container>
        <div className="pt-9 tablet:pt-10 desktop:pt-11">
          <Grid>
            <ProjectMeasure>
              <h1 className="font-serif text-title text-ink desktop:text-title-desktop">
                {identification.name[locale]}
              </h1>
              <p className="mt-3 font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                {identification.type[locale]}
                <span aria-hidden="true"> · </span>
                {identification.location[locale]}
                <span aria-hidden="true"> · </span>
                <Figures>{identification.year}</Figures>
              </p>
            </ProjectMeasure>
          </Grid>
        </div>
      </Container>

      <Statement
        eyebrow={ui.challengeHeading[locale]}
        paragraphs={[project.constraint[locale]]}
        align="left"
      />

      <Concept eyebrow={ui.conceptHeading[locale]} decisions={decisions} />

      <MaterialPalette eyebrow={ui.materialsHeading[locale]} items={materials} />

      <Plans eyebrow={ui.plansHeading[locale]} items={plans} />

      {sequence.length > 0 && (
        <>
          <section className="pb-6 pt-9 tablet:pt-10 desktop:pt-11">
            <Container>
              <Grid>
                <Measure>
                  <Label>{ui.galleryHeading[locale]}</Label>
                </Measure>
              </Grid>
            </Container>
          </section>
          {sequence.map((image) => (
            <CaptionedImage key={image.id} image={image} locale={locale} hoverZoom />
          ))}
        </>
      )}

      <Statement eyebrow={ui.resultHeading[locale]} paragraphs={[project.outcome[locale]]} />

      <Specification specification={project.specification} locale={locale} />

      <Credits credits={project.credits} locale={locale} />

      {next && (
        <Container>
          <div className="pb-9 tablet:pb-10 desktop:pb-11">
            <Grid>
              <div className="col-span-4 tablet:col-span-8 desktop:col-span-6">
                <NextProject project={next} locale={locale} />
              </div>
            </Grid>
          </div>
        </Container>
      )}

      <ClosingBlock
        message={home.closing[locale]}
        actionLabel={home.closingAction[locale]}
        actionHref={paths.contact(locale)}
      />
    </>
  );
}
