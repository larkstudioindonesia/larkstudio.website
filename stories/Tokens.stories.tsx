import type { Meta, StoryObj } from '@storybook/react';

/**
 * The design system rendered as a specimen sheet. This is the first
 * place to look when something feels off — nearly every visual bug
 * traces back to a token being bypassed.
 */
const meta: Meta = { title: 'Foundation/Tokens' };
export default meta;

const COLOURS = [
  ['paper', 'Primary surface — #1A1A1A'],
  ['sunk', 'Secondary surface, image placeholder — #202020'],
  ['card', 'Third surface — Testimonials panels only, flat tone, no border/radius/shadow'],
  ['ink', 'Primary text — #F5F5F5'],
  ['ink-2', 'Secondary text, standfirsts'],
  ['ink-3', 'Captions, credits, metadata'],
  ['hairline', 'Hairlines'],
  ['structural', 'Structural divisions, framed action border'],
  ['signal', 'Errors only'],
] as const;

const SPACE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const Colour: StoryObj = {
  render: () => (
    <div className="p-8">
      <p className="mb-6 font-grotesque text-caption text-ink-3">
        There is no brand accent. At Image Dominance 8 the photographs
        supply every chromatic event on the site.
      </p>
      <ul className="flex flex-col gap-3">
        {COLOURS.map(([name, use]) => (
          <li key={name} className="flex items-center gap-5">
            <span
              className={`block h-10 w-10 border border-hairline bg-${name}`}
            />
            <span className="font-grotesque text-spec">{name}</span>
            <span className="font-grotesque text-caption text-ink-3">{use}</span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const Space: StoryObj = {
  render: () => (
    <div className="p-8">
      <p className="mb-6 font-grotesque text-caption text-ink-3">
        The large values are a specification, not a preference. Quiet
        compression during build is how restrained designs turn ordinary.
      </p>
      <ul className="flex flex-col gap-3">
        {SPACE.map((step) => (
          <li key={step} className="flex items-center gap-5">
            <span className="w-8 font-grotesque text-caption figures text-ink-3">
              {step}
            </span>
            <span className={`block h-2 bg-ink w-${step}`} />
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const Type: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <p className="font-grotesque text-caption text-ink-3">
        All-sans, minimalist. `font-serif` carries Montserrat
        (heading/display/hero) and `font-grotesque` carries Manrope
        (body/UI/caption/fact) — the variable names predate this
        direction and are left alone; only the typefaces changed.
      </p>
      <p className="font-serif text-hero font-medium desktop:text-hero-desktop">
        Hero
      </p>
      <p className="font-serif text-display font-medium desktop:text-display-desktop">
        Display
      </p>
      <p className="font-serif text-statement desktop:text-statement-desktop">
        Statement — a 96-seat restaurant in a 1970s shophouse.
      </p>
      <p className="font-serif text-title desktop:text-title-desktop">
        Project title
      </p>
      <p className="font-serif text-lead text-ink-2 desktop:text-lead-desktop">
        Lead paragraph. Facts before adjectives.
      </p>
      <p className="font-serif text-body desktop:text-body-desktop">
        Body. Every delivery crosses the dining room, so service had to run
        on a single spine.
      </p>
      <p className="figures font-grotesque text-spec desktop:text-spec-desktop">
        Specification — 218 sqm · 96 seats · 34 weeks
      </p>
      <p className="font-grotesque text-caption text-ink-3 desktop:text-caption-desktop">
        Caption — photography and contractor credited by name.
      </p>
      <p className="label-case font-grotesque text-label text-ink-3">
        Label
      </p>
    </div>
  ),
};
