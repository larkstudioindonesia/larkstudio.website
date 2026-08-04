import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from '../components/sections/Hero';
import { Statement } from '../components/sections/Statement';
import { Services } from '../components/sections/Services';
import { Process } from '../components/sections/Process';
import { Testimonials } from '../components/sections/Testimonials';
import { ClosingBlock } from '../components/sections/ClosingBlock';
import { home } from '../content/pages/home';
import { services } from '../content/pages/services';
import { approach } from '../content/pages/approach';
import { testimonials } from '../content/testimonials';

/**
 * The homepage sections in isolation, in page order: Hero, Statement,
 * (the project list is a sequence of ProjectEntry composites, covered
 * in Composites/Project Entry, not repeated here), Services, Process,
 * Testimonials, and the large closing CTA.
 *
 * Review at the wide viewport: the measure must sit LEFT of centre,
 * leaving the right field empty. If it reads as centred, the grid
 * zone has been bypassed.
 */
const meta: Meta = { title: 'Sections/Home' };
export default meta;

const withNumbers = <
  T extends { readonly id: string; readonly heading?: { en: string }; readonly body: { en: string } },
>(
  items: readonly T[],
) =>
  items.map((item, index) => ({
    id: item.id,
    number: String(index + 1).padStart(2, '0'),
    heading: item.heading?.en ?? '',
    body: item.body.en,
  }));

export const HeroSection: StoryObj = {
  render: () => (
    <Hero
      headline={home.heroHeadline.en}
      subhead={home.heroSubhead.en}
      actionLabel={home.closingAction.en}
      actionHref="#"
      media={{ kind: 'image', image: home.heroImage, alt: '' }}
    />
  ),
  parameters: { layout: 'fullscreen' },
};

export const ServicesSection: StoryObj = {
  render: () => <Services eyebrow="Services" items={withNumbers(services)} />,
};

export const ProcessSection: StoryObj = {
  render: () => <Process eyebrow="Process" stages={withNumbers(approach.stages)} />,
};

export const TestimonialsSection: StoryObj = {
  render: () => (
    <Testimonials
      eyebrow="What clients say"
      items={testimonials.map((item) => ({
        id: item.id,
        quote: item.quote.en,
        attribution: item.attribution.en,
      }))}
    />
  ),
};

export const ClosingLarge: StoryObj = {
  render: () => (
    <ClosingBlock
      message={home.closing.en}
      actionLabel={home.closingAction.en}
      actionHref="#"
      variant="large"
    />
  ),
};

export const StatementEnglish: StoryObj = {
  render: () => <Statement paragraphs={home.statement.en} />,
};

export const StatementBahasa: StoryObj = {
  render: () => (
    <div lang="id">
      <Statement paragraphs={home.statement.id} />
    </div>
  ),
};

export const Closing: StoryObj = {
  render: () => (
    <ClosingBlock
      message={home.closing.en}
      actionLabel={home.closingAction.en}
      actionHref="#"
    />
  ),
};

/** Bahasa runs 15–20% longer; the block is sized to it. */
export const ClosingBahasa: StoryObj = {
  render: () => (
    <div lang="id">
      <ClosingBlock
        message={home.closing.id}
        actionLabel={home.closingAction.id}
        actionHref="#"
      />
    </div>
  ),
};
