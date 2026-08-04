import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import { paths } from '@/lib/paths';
import { projects } from '@/content/projects';
import { home } from '@/content/pages/home';
import { approach } from '@/content/pages/approach';
import { services } from '@/content/pages/services';
import { testimonials } from '@/content/testimonials';
import { ui } from '@/content/ui';
import { Hero } from '@/components/sections/Hero';
import { Statement } from '@/components/sections/Statement';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { ClosingBlock } from '@/components/sections/ClosingBlock';
import { ScrollReveal } from '@/components/primitives/ScrollReveal';
import { ProjectEntry } from '@/components/primitives/ProjectEntry';

/**
 * HOME IS THE INDEX.
 *
 * Hero, a short statement, then the work, then Services / Process /
 * Testimonials, then one large closing CTA. There is no separate Work
 * route: with four to six projects, an index page exists only to hold
 * six links — a page whose entire function is to make the site feel
 * bigger.
 *
 * Composition over configuration: the sequence below is written out,
 * not produced by a renderer looping a blocks array. With this many
 * sections the abstraction costs legibility and buys nothing, and the
 * editorial rhythm is deliberately uneven — a generic renderer would
 * flatten it.
 *
 * The project entries sit OUTSIDE Container: images run to the
 * viewport while structural content does not. That tension is the
 * whole editorial effect.
 *
 * `Hero` now owns the first viewport and carries `priority` on its
 * background image, so the first `ProjectEntry` below — previously
 * the page's LCP candidate — no longer gets `priority`: it is below
 * the fold once Hero exists.
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
    openGraphImage: home.openGraphImage,
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

  const serviceItems = services.map((item, index) => ({
    id: item.id,
    number: String(index + 1).padStart(2, '0'),
    heading: item.heading?.[locale] ?? '',
    body: item.body[locale],
  }));

  const processStages = approach.stages.map((stage, index) => ({
    id: stage.id,
    number: String(index + 1).padStart(2, '0'),
    heading: stage.heading?.[locale] ?? '',
    body: stage.body[locale],
  }));

  const testimonialItems = testimonials.map((item) => ({
    id: item.id,
    quote: item.quote[locale],
    attribution: item.attribution[locale],
  }));

  return (
    <>
      <Hero
        headline={home.heroHeadline[locale]}
        subhead={home.heroSubhead[locale]}
        actionLabel={home.closingAction[locale]}
        actionHref={paths.contact(locale)}
        media={{ kind: 'image', image: home.heroImage, alt: '' }}
      />

      <Statement paragraphs={home.statement[locale]} />

      {projects.length > 0 && (
        <ScrollReveal>
          <section
            aria-label={home.metaTitle[locale]}
            className="flex flex-col gap-9 tablet:gap-10 desktop:gap-11"
          >
            {projects.map((project) => (
              <ProjectEntry key={project.slug} project={project} locale={locale} />
            ))}
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <Services eyebrow={ui.servicesHeading[locale]} items={serviceItems} />
      </ScrollReveal>

      <ScrollReveal>
        <Process eyebrow={ui.processHeading[locale]} stages={processStages} />
      </ScrollReveal>

      <ScrollReveal>
        <Testimonials eyebrow={ui.testimonialsHeading[locale]} items={testimonialItems} />
      </ScrollReveal>

      <ClosingBlock
        message={home.closing[locale]}
        actionLabel={home.closingAction[locale]}
        actionHref={paths.contact(locale)}
        variant="large"
      />
    </>
  );
}
