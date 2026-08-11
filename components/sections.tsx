'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  EASE,
  Motion,
  scrollToId,
  useInView,
  useMagnetic,
  usePointer,
  useProgress,
  useReducedMotion,
  useSpring,
  useTransform,
} from '@/lib/motion';
import { crop, type Locale, type Passage, type Project, type ProjectImage } from '@/content/types';
import { contact, disciplines, home, site, ui } from '@/content/site';
import { formatArea, ordinal, paths, whatsappLink } from '@/lib/site';
import {
  Action,
  Arrow,
  Container,
  CursorLabel,
  Eyebrow,
  Fill,
  Frame,
  Grid,
  Item,
  Measure,
  Reveal,
  ScrollText,
  Section,
  SplitText,
  Stagger,
  TextLink,
} from '@/components/ui';

/**
 * LARK STUDIO — SECTIONS
 *
 * Every block of page content, in the order a visitor meets them.
 *
 * THE ORGANISING IDEA: THE ARCHITECTURE IS THE CONTENT.
 *
 * The previous revision put the page on a perspective rig — stages,
 * planes, pointer tilt, frames banking as they passed. It produced real
 * depth and the wrong impression. A rotated photograph of a building
 * reads as an experiment about the web; the same photograph shown
 * square, large and surrounded by space reads as a studio confident in
 * its work. Dezeen does not tilt anything. Neither does a monograph.
 *
 * So the composition rules here are deliberately narrow:
 *
 *   1. TWO PLACEMENTS, NOT FIVE. A frame is either full bleed or held to
 *      the container. Nothing is offset, indented, rotated or skewed.
 *      Rhythm comes from scale and from the space between things — which
 *      is the only kind of rhythm that still looks composed in 2036.
 *   2. THE SAME FURNITURE EVERY TIME. Index, name, then type, location
 *      and year, on a hairline, in the same place under every frame. A
 *      caption that moves is a caption the reader has to find.
 *   3. NOTHING COMPETES WITH A PHOTOGRAPH. Where an image is large, the
 *      type near it is small, quiet and to one side.
 *
 * Motion is unchanged in quantity and changed in kind: settle, clip,
 * vertical parallax, split text, scroll-lit copy. No axis but the one
 * the visitor is already travelling along.
 */

/* ================================================================== *
 * HOME — HERO
 * ================================================================== */

/**
 * One building, one line.
 *
 * A single lead photograph at full bleed, the headline set across two
 * lines — upright serif, then an indented italic — and a credit for the
 * frame in the opposite corner. That credit is the small move that makes
 * the difference between a stock hero and a studio's hero: the first
 * thing on the page is not a slogan over a picture, it is a named
 * building.
 *
 * THE BACKGROUND MOVES, AND IT NEVER STOPS MOVING.
 *
 * A previous revision animated the type over a photograph that settled
 * once and then sat still, which is the exact failure the whole section
 * exists to avoid: it read as a website with a picture on it. There are
 * now three layers behind the type, each owning exactly one job, nested
 * so that no two of them ever write the same property:
 *
 *   SCROLL     the outer layer. Trails the page by 14% and pushes in to
 *              1.10 as the hero leaves, while the type moves the other
 *              way and twice as fast. Different rates in opposite
 *              directions is the whole of the depth effect.
 *   ENTRANCE   the middle layer. Opens a clip and settles from 1.12 over
 *              2.4s, once.
 *   DRIFT      the inner layer. A 26-second breath — 3% of scale and
 *              under 1% of translate — that mirrors forever.
 *
 * The drift is deliberately slower and smaller than a Ken Burns pan by
 * an order of magnitude. At this rate no one watches it happen; they
 * notice, a few seconds apart, that the frame is not where it was. That
 * is a camera breathing, and it is the difference between a still and a
 * held shot.
 */
export function Hero({
  locale,
  bed,
}: {
  locale: Locale;
  bed: { project: Project; image: ProjectImage };
}) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const progress = useProgress(section, ['start start', 'end start']);

  /* Foreground and background pull apart as the hero leaves. */
  const opacity = useTransform(progress, [0, 0.7], [1, 0]);
  const bedY = useTransform(progress, [0, 1], ['0%', '14%']);
  const bedScale = useTransform(progress, [0, 1], [1, 1.1]);
  const typeY = useTransform(progress, [0, 1], ['0%', '-28%']);
  /* The light going back down as the reader leaves for the work. */
  const washOpacity = useTransform(progress, [0, 1], [0.35, 0.62]);

  const [line1, line2] = home.heroLines[locale];

  /**
   * THE ENTRANCE, AS ONE SCORE.
   *
   * Nine cues on a single timeline rather than nine components each
   * choosing a delay. Written out because the ORDER is the design: the
   * building arrives first and alone, the light comes up on it, and only
   * then does the studio start speaking. Reversing any two of these makes
   * it a website with a picture on it.
   *
   *   0.00  image begins settling from 1.12 and the wash begins lifting
   *   0.55  headline, per character
   *   1.25  subhead
   *   1.40  call to action
   *   1.55  metadata rail
   *   1.80  scroll indicator
   *   2.40  the settle finishes and the drift takes over, seamlessly —
   *         it starts at scale 1, which is where the entrance ends
   *
   * The header runs 0.20–0.50 on its own clock in `chrome.tsx`, because
   * it persists across client navigations and must not replay.
   */
  const CUE = { head: 0.55, sub: 1.25, cta: 1.4, meta: 1.55, hint: 1.8 };

  return (
    <section ref={section} className="relative min-h-dvh overflow-hidden">
      {/* SCROLL. The slack is what makes a 14% translate safe: without
          it the layer is exactly viewport-sized and moving it exposes a
          band of empty page along one edge for the whole pass. */}
      <Motion.div
        className="absolute -inset-y-[16%] inset-x-0"
        style={{ y: bedY, scale: bedScale }}
      >
        {/* ENTRANCE */}
        <Motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(12% 0% 12% 0%)', scale: 1.12 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
          transition={{ duration: 2.4, ease: EASE.expo }}
        >
          {/* DRIFT */}
          <Motion.div
            className="absolute inset-0"
            {...(reduced === true
              ? {}
              : {
                  animate: { scale: [1, 1.03, 1], x: ['0%', '-0.9%', '0%'], y: ['0%', '0.6%', '0%'] },
                  transition: {
                    duration: 26,
                    ease: 'easeInOut' as const,
                    repeat: Infinity,
                    /* The entrance owns the first 2.4s; the drift starts
                       from the value the entrance lands on, so the
                       handover is invisible. */
                    delay: 2.4,
                  },
                })}
          >
            <Fill
              src={crop(bed.project.slug, bed.image.id, 'landscape')}
              portrait={crop(bed.project.slug, bed.image.id, 'portrait')}
              alt=""
              sizes="100vw"
              focal={bed.image.focal}
              priority
            />
          </Motion.div>
        </Motion.div>
        {/*
          THE LIGHT, IN TWO WASHES RATHER THAN ONE.

          The scroll wash carries the resting level and deepens as the
          hero leaves. The entrance wash sits over it and clears
          completely in 1.8s, so the building resolves out of the dark
          rather than being revealed by a curtain.

          Two elements, not one, because an `animate` keyframe and a
          scroll-linked `style` on the same property fight — and they
          cannot be nested either, since opacity clamps at 1 and the
          composite needs to start at 0.8 over a 0.35 base. Stacked, the
          maths is just what the compositor already does:
          1 − (1−0.35)(1−0.7) = 0.80 on arrival, 0.35 at rest.
        */}
        <Motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-paper"
          style={{ opacity: washOpacity }}
        />
        <Motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-paper"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: EASE.expo }}
        />
        {/* Bottom-weighted for the headline, top-weighted for the header:
            the bar is transparent over the hero, so the one place the
            photograph is not allowed to be interesting is the 80px the
            navigation sits in. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-paper via-paper/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-paper/80 to-transparent"
        />
      </Motion.div>

      {/* The foreground leaves twice as fast as the background arrives,
          and in the opposite direction. That difference in rate IS the
          depth — nothing here is rotated, scaled or put on a plane. */}
      <Motion.div
        className="absolute inset-x-0 bottom-0 pb-8 tablet:pb-9"
        style={{ opacity, y: typeY }}
      >
        <Container>
          <h1 className="font-display text-hero text-ink">
            <SplitText as="span" text={line1} mode="chars" immediate delay={CUE.head} className="block" />
            <SplitText
              as="span"
              text={line2}
              mode="words"
              immediate
              delay={CUE.head + 0.37}
              className="block italic text-ink/85 tablet:pl-[10%]"
            />
          </h1>

          <div className="mt-8 flex flex-col gap-6 tablet:mt-9 tablet:flex-row tablet:items-end tablet:justify-between">
            <Motion.p
              className="max-w-[38ch] font-text text-body text-ink-2 desktop:text-body-lg"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE.expo, delay: CUE.sub }}
            >
              {home.heroSubhead[locale]}
            </Motion.p>
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE.expo, delay: CUE.cta }}
            >
              <Action href={paths.contact(locale)} size="large">
                {home.closingAction[locale]}
              </Action>
            </Motion.div>
          </div>

          <Motion.div
            className="mt-8 flex items-baseline justify-between gap-5 border-t border-line pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE.expo, delay: CUE.meta }}
          >
            <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-text text-caption text-ink-3">
              {home.heroMeta[locale].map((entry) => (
                <li key={entry} className="figures">
                  {entry}
                </li>
              ))}
            </ul>
            {/* The frame is credited, not decorated. */}
            <Link
              href={paths.project(locale, bed.project.slug)}
              className="sweep hidden shrink-0 font-text text-caption text-ink-3 transition-colors duration-300 ease-expo hover:text-ink tablet:block"
            >
              {bed.project.name[locale]}
              <span aria-hidden="true"> — </span>
              {bed.project.type[locale]}, {bed.project.location[locale]}
            </Link>
          </Motion.div>
        </Container>
      </Motion.div>

      {/* Two elements, not one: the entrance and the scroll-fade both
          write `opacity`, and a motion value in `style` and a keyframe in
          `animate` on the same property fight. Nesting gives each its
          own. */}
      <Motion.div
        className="absolute bottom-8 right-6 z-10 hidden desktop:block"
        style={{ opacity }}
      >
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE.expo, delay: CUE.hint }}
        >
          {/* A BUTTON, BECAUSE IT LOOKS LIKE ONE. An indicator that
              points at the work, animates continuously and does nothing
              when clicked is a small broken promise on the first screen
              of the site. */}
          <button
            type="button"
            onClick={() => {
              scrollToId('work');
            }}
            className="group flex cursor-pointer flex-col items-center gap-4 py-2"
          >
            <span className="label text-ink-3 transition-colors duration-500 ease-expo group-hover:text-ink [writing-mode:vertical-rl]">
              {ui.scroll[locale]}
            </span>
            {/* `h-14` does not exist on this project's spacing scale, so
                the rail had no height at all and the brass marker was
                travelling down an invisible line. 56px, in pixels, with
                the marker's travel adding up to it exactly. */}
            <span aria-hidden="true" className="relative block h-[56px] w-px bg-line-strong">
              <Motion.span
                className="absolute inset-x-0 top-0 block h-[20px] bg-brass"
                animate={{ y: [0, 36, 0] }}
                transition={{ duration: 2.8, ease: EASE.quart, repeat: Infinity }}
              />
            </span>
          </button>
        </Motion.div>
      </Motion.div>
    </section>
  );
}

/* ================================================================== *
 * HOME — MANIFESTO
 * ================================================================== */

/**
 * Type only, and a great deal of air.
 *
 * This is the one section on the homepage with no photograph in it, and
 * that is its job: it is the pause between the hero and the work, and
 * the reason the first project frame lands as hard as it does. An image
 * here — as there was in the previous revision — makes three
 * image-sections in a row and the eye stops registering any of them.
 *
 * The statement lights one word at a time as it is scrolled past. The
 * site's one piece of literal scroll storytelling, spent on the only
 * copy written to be read slowly rather than scanned.
 */
export function Manifesto({ locale }: { locale: Locale }) {
  return (
    <Section rhythm="loose">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-3">
            <Eyebrow>{ui.writtenIn[locale]}</Eyebrow>
          </div>
          <div className="col-span-4 mt-7 tablet:col-span-8 desktop:col-span-8 desktop:col-start-5 desktop:mt-0">
            <ScrollText
              text={home.manifesto[locale]}
              className="font-display text-statement text-ink"
            />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[46ch] font-text text-body text-ink-2">
                {home.manifestoNote[locale]}
              </p>
            </Reveal>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

/* ================================================================== *
 * HOME — DISCIPLINES
 * ================================================================== */

/**
 * A list of four against a heading that pins beside it, and a preview
 * frame that follows the pointer.
 *
 * The preview is the section's whole identity: the rows carry the words,
 * the frame carries the evidence, and neither has to make room for the
 * other. It is the only place on the site where an image is summoned
 * rather than laid out, which is what keeps this from reading as a fifth
 * grid of pictures.
 *
 * It is a square-on rectangle. An earlier version banked it toward the
 * pointer, which was a good effect on a card and the wrong one on a
 * photograph of a building.
 */
export function Disciplines({ locale }: { locale: Locale }) {
  const { x, y } = usePointer();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const cardX = useSpring(x, { stiffness: 160, damping: 26, mass: 0.8 });
  const cardY = useSpring(y, { stiffness: 160, damping: 26, mass: 0.8 });

  const shown = active !== null && reduced !== true;
  const preview = active === null ? null : disciplines[active];

  return (
    <Section rhythm="loose">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-3">
            <div className="desktop:sticky desktop:top-[7rem]">
              <Eyebrow>{ui.disciplines[locale]}</Eyebrow>
              <p className="mt-5 max-w-[28ch] font-text text-caption text-ink-3">
                {locale === 'en'
                  ? 'Four disciplines, run by one team, on one drawing set.'
                  : 'Empat disiplin, satu tim, satu set gambar kerja.'}
              </p>
            </div>
          </div>

          <div className="col-span-4 mt-9 tablet:col-span-8 desktop:col-span-8 desktop:col-start-5 desktop:mt-0">
            <ul
              onPointerLeave={() => {
                setActive(null);
              }}
            >
              {disciplines.map((item, index) => (
                <Item as="li" key={item.id} className="group border-t border-line last:border-b">
                  <div
                    className="flex cursor-default items-start gap-6 py-7 transition-transform duration-500 ease-expo desktop:py-8 desktop:group-hover:translate-x-2"
                    onPointerEnter={() => {
                      setActive(index);
                    }}
                  >
                    <span aria-hidden="true" className="figures label mt-2 text-brass">
                      {ordinal(index)}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display text-statement text-ink-2 transition-colors duration-500 ease-expo group-hover:text-ink">
                        {item.heading[locale]}
                      </h3>
                      <p className="mt-3 max-w-[52ch] font-text text-spec text-ink-3 transition-colors duration-500 ease-expo group-hover:text-ink-2">
                        {item.body[locale]}
                      </p>
                    </div>
                  </div>
                </Item>
              ))}
            </ul>
          </div>
        </Grid>
      </Container>

      {/* One frame, moved and re-sourced, rather than four mounted and
          toggled: four hidden images would each still be a DOM subtree
          and a decode the visitor may never ask for. Floated above the
          pointer so it never covers the row being read. */}
      <Motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden desktop:block"
        style={{ x: cardX, y: cardY }}
      >
        <Motion.div
          className="relative -translate-x-1/2 -translate-y-[115%] overflow-hidden bg-sunk"
          initial={false}
          animate={{ width: shown ? 400 : 0, height: shown ? 267 : 0, opacity: shown ? 1 : 0 }}
          transition={{ duration: 0.6, ease: EASE.expo }}
        >
          {preview && (
            <Fill src={`/images/projects/${preview.image}-3x2.jpg`} alt="" sizes="400px" eager />
          )}
        </Motion.div>
      </Motion.div>
    </Section>
  );
}

/* ================================================================== *
 * HOME / APPROACH — PROCESS
 * ================================================================== */

/**
 * A stage in the timeline. Dimmed until it reaches the middle of the
 * viewport, then it lights and eases into place.
 *
 * Once activated it stays: a marker that switches back off on
 * scroll-back turns one continuous gesture into six flickering ones.
 */
function ProcessStage({
  stage,
  index,
  locale,
}: {
  stage: Passage;
  index: number;
  locale: Locale;
}) {
  const { ref, inView } = useInView<HTMLLIElement>({ rootMargin: '-45% 0px -45% 0px' });

  return (
    <li ref={ref} className="relative pl-8 tablet:pl-10">
      <Motion.span
        aria-hidden="true"
        className="absolute left-0 top-[0.6rem] h-[7px] w-[7px] -translate-x-1/2 rounded-full"
        initial={false}
        animate={{
          backgroundColor: inView ? 'rgb(200,160,106)' : 'rgb(106,103,97)',
          scale: inView ? 1.4 : 1,
        }}
        transition={{ duration: 0.5, ease: EASE.expo }}
      />
      <Motion.div
        initial={false}
        animate={{ opacity: inView ? 1 : 0.4, x: inView ? 0 : -8 }}
        transition={{ duration: 0.8, ease: EASE.expo }}
      >
        <span aria-hidden="true" className="figures label text-ink-3">
          {ordinal(index)}
        </span>
        <h3 className="mt-2 font-display text-title text-ink">{stage.heading[locale]}</h3>
        <p className="mt-2 max-w-[52ch] font-text text-spec text-ink-2">{stage.body[locale]}</p>
      </Motion.div>
    </li>
  );
}

/**
 * A timeline whose rule draws itself as you scroll it, against a heading
 * that pins beside it.
 *
 * Used here and only here, because the content genuinely is a sequence.
 * Applying the same device to the disciplines, which have no order,
 * would be decoration. `position: sticky` costs nothing: no listener, no
 * measurement, no JavaScript.
 */
export function Process({ stages, locale }: { stages: readonly Passage[]; locale: Locale }) {
  const track = useRef<HTMLDivElement>(null);
  const progress = useProgress(track, ['start 70%', 'end 65%']);

  return (
    <Section rhythm="loose">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-3">
            <div className="desktop:sticky desktop:top-[7rem]">
              <Eyebrow>{ui.howWeWork[locale]}</Eyebrow>
              <p className="mt-5 max-w-[24ch] font-display text-title text-ink-2">
                {locale === 'en'
                  ? 'Six stages, from first site visit to handover.'
                  : 'Enam tahap, dari kunjungan pertama hingga serah terima.'}
              </p>
            </div>
          </div>

          <div
            ref={track}
            className="relative col-span-4 mt-9 tablet:col-span-8 desktop:col-span-8 desktop:col-start-5 desktop:mt-0"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-line"
            />
            <Motion.span
              aria-hidden="true"
              className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px origin-top bg-brass"
              style={{ scaleY: progress }}
            />
            <ul className="flex flex-col gap-10">
              {stages.map((stage, position) => (
                <ProcessStage key={stage.id} stage={stage} index={position} locale={locale} />
              ))}
            </ul>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

/* ================================================================== *
 * CLOSING
 * ================================================================== */

/**
 * Display type over a brass glow that drifts on its own and leans toward
 * the pointer.
 *
 * The only place on the site where a message is set at hero weight with
 * no photograph behind it. ONE call to action, ONE placement, at the end
 * of the reading unit: a studio that asks is a studio that needs.
 */
export function Closing({ locale }: { locale: Locale }) {
  const { ref, x, y } = useMagnetic(0.06, 500);

  return (
    <Section rhythm="loose" className="relative overflow-hidden">
      <Motion.span
        ref={ref}
        aria-hidden="true"
        className="glow left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 animate-drift"
        style={{ x, y }}
      />
      <Container>
        <Grid>
          <div className="relative col-span-4 tablet:col-span-8 desktop:col-span-9 desktop:col-start-2">
            <SplitText
              as="p"
              text={home.closing[locale]}
              mode="words"
              className="font-display text-display text-ink"
            />
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-[46ch] font-text text-body text-ink-2">
                {home.closingBody[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <Action href={paths.contact(locale)} size="large">
                  {home.closingAction[locale]}
                </Action>
                <TextLink
                  href={`mailto:${site.email}`}
                  external
                  className="font-text text-spec text-ink-2 hover:text-ink"
                >
                  {site.email}
                </TextLink>
              </div>
            </Reveal>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

/* ================================================================== *
 * SECONDARY PAGES
 * ================================================================== */

/**
 * The masthead for a page that opens with type rather than an image.
 *
 * Carries the fixed header's clearance itself. Asymmetric on purpose:
 * generous above, tight below, because the section that follows brings
 * its own top rhythm and letting both apply stacked 300px of dead space.
 */
export function PageHeader({
  title,
  lede,
}: {
  title: string;
  lede?: string;
}) {
  return (
    <Section rhythm="none" className="pb-8 pt-[9rem] tablet:pt-[11rem]">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-10">
            {/* The masthead line, not the page's own name — an eyebrow
                that repeats the headline beneath it is a label on a
                label. */}
            <Eyebrow>
              {site.name} — {site.address[1]}
            </Eyebrow>
            <SplitText
              as="h1"
              text={title}
              mode="chars"
              immediate
              delay={0.15}
              className="mt-7 font-display text-hero text-ink"
            />
            {lede !== undefined && (
              <Reveal delay={0.35}>
                <p className="mt-8 max-w-[52ch] font-text text-lead text-ink-2">{lede}</p>
              </Reveal>
            )}
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

/**
 * A statement followed by named passages — the studio's values.
 *
 * The passages open as a numbered list on hairlines the group draws in
 * as it arrives. The numbering is positional and decorative, so it is
 * `aria-hidden`; a screen reader gets the heading, which is the content.
 */
export function Prose({
  statement,
  passages,
  locale,
  eyebrow,
}: {
  statement: string;
  passages: readonly Passage[];
  locale: Locale;
  eyebrow: string;
}) {
  return (
    <Section rhythm="loose">
      <Container>
        <Grid>
          <Measure>
            <SplitText
              as="p"
              text={statement}
              mode="words"
              className="font-display text-statement text-ink"
            />
          </Measure>
        </Grid>

        {passages.length > 0 && (
          <div className="mt-12">
            <Grid>
              <div className="col-span-4 tablet:col-span-8 desktop:col-span-3">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
              <div className="col-span-4 mt-7 tablet:col-span-8 desktop:col-span-8 desktop:col-start-5 desktop:mt-0">
                <Stagger className="flex flex-col" each={0.09}>
                  {passages.map((passage, position) => (
                    <Item
                      key={passage.id}
                      className="group flex gap-6 border-t border-line py-7 last:border-b"
                    >
                      <span aria-hidden="true" className="figures label mt-1 text-brass">
                        {ordinal(position)}
                      </span>
                      <div className="flex-1">
                        <h2 className="font-display text-title text-ink">
                          {passage.heading[locale]}
                        </h2>
                        <p className="mt-2 max-w-[56ch] font-text text-body text-ink-2">
                          {passage.body[locale]}
                        </p>
                      </div>
                    </Item>
                  ))}
                </Stagger>
              </div>
            </Grid>
          </div>
        )}
      </Container>
    </Section>
  );
}

/**
 * Contact: two channels, stated as words. No form, no fields to qualify
 * a lead — the prompts do that by naming what is useful in a first
 * message.
 *
 * The layout is deliberately asymmetric: statement and prompts in the
 * reading column, the channels themselves in the wide right field the
 * rest of the site reserves for annotation. On this page the annotation
 * IS the point.
 */
export function ContactPanel({ locale }: { locale: Locale }) {
  return (
    <Section rhythm="loose">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-6">
            <SplitText
              as="p"
              text={contact.statement[locale]}
              mode="words"
              className="font-display text-statement text-ink"
            />
            <Stagger className="mt-10 flex flex-col" each={0.1}>
              {contact.prompts[locale].map((prompt, index) => (
                <Item
                  key={prompt}
                  className="flex items-baseline gap-5 border-t border-line py-5 last:border-b"
                >
                  <span aria-hidden="true" className="figures label text-brass">
                    {ordinal(index)}
                  </span>
                  <span className="font-text text-spec text-ink-2">{prompt}</span>
                </Item>
              ))}
            </Stagger>
          </div>

          <div className="col-span-4 mt-10 tablet:col-span-8 desktop:col-span-5 desktop:col-start-8 desktop:mt-0">
            <Reveal delay={0.15}>
              <div className="flex flex-col items-start gap-5">
                <Action href={`mailto:${site.email}`} external size="large">
                  {site.email}
                </Action>
                <Action href={whatsappLink(site.whatsappOpener[locale])} external size="large">
                  WhatsApp
                </Action>
                <Action href={site.instagram.href} external size="large">
                  {site.instagram.handle}
                </Action>
              </div>
              <address className="mt-10 border-t border-line pt-5 font-text text-spec not-italic text-ink-3">
                {site.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </Reveal>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

/* ================================================================== *
 * PROJECT PAGE
 * ================================================================== */

/**
 * The cover. Full bleed, the name over its lower edge, and nothing else.
 *
 * The title used to sit in a separate section beneath the image, which
 * meant a project page opened with a picture nobody could name for
 * another screen. Overlaying it costs a scrim and makes the first
 * viewport self-describing.
 */
export function ProjectHero({ project, locale }: { project: Project; locale: Locale }) {
  const section = useRef<HTMLElement>(null);
  const progress = useProgress(section, ['start start', 'end start']);
  const opacity = useTransform(progress, [0, 0.75], [1, 0]);
  const y = useTransform(progress, [0, 1], ['0%', '10%']);
  const opening = project.images[0];
  if (!opening) return null;

  return (
    <section ref={section} className="relative min-h-[90vh] overflow-hidden">
      <Motion.div className="absolute inset-0" style={{ y }}>
        <Motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(10% 0% 10% 0%)', scale: 1.06 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
          transition={{ duration: 1.6, ease: EASE.expo }}
        >
          <Fill
            src={crop(project.slug, opening.id, 'landscape')}
            portrait={crop(project.slug, opening.id, 'portrait')}
            alt={opening.alt[locale]}
            sizes="100vw"
            focal={opening.focal}
            priority
          />
        </Motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-paper/28" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-paper via-paper/70 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-paper/75 to-transparent"
        />
      </Motion.div>

      <Motion.div className="absolute inset-x-0 bottom-0 pb-9" style={{ opacity }}>
        <Container>
          <Motion.p
            className="label text-ink-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE.expo, delay: 0.5 }}
          >
            {project.type[locale]} · {project.location[locale]}
          </Motion.p>
          <SplitText
            as="h1"
            text={project.name[locale]}
            mode="chars"
            immediate
            delay={0.6}
            className="mt-4 font-display text-hero text-ink"
          />
        </Container>
      </Motion.div>
    </section>
  );
}

/**
 * The four facts, as a band rather than a table.
 *
 * FIGURES NEVER ANIMATE: no value counts up to itself. A visitor
 * scanning this block is reading evidence, and a number that arrives by
 * ticking is performing rather than stating.
 */
export function ProjectFacts({ project, locale }: { project: Project; locale: Locale }) {
  const facts = [
    { key: 'type', label: ui.type[locale], value: project.type[locale] },
    { key: 'location', label: ui.location[locale], value: project.location[locale] },
    { key: 'area', label: ui.area[locale], value: formatArea(project.area, locale) },
    { key: 'year', label: ui.year[locale], value: String(project.year) },
  ];

  return (
    <Section rhythm="default">
      <Container>
        <Eyebrow>{ui.details[locale]}</Eyebrow>
        <Stagger className="mt-8" each={0.08}>
          <Grid>
            {facts.map((fact) => (
              <Item key={fact.key} className="col-span-2 tablet:col-span-2 desktop:col-span-3">
                <div className="border-t border-line pt-4">
                  <p className="label text-ink-3">{fact.label}</p>
                  <p className="figures mt-2 font-display text-title text-ink">{fact.value}</p>
                </div>
              </Item>
            ))}
          </Grid>
        </Stagger>
      </Container>
    </Section>
  );
}

/**
 * A single plate: one photograph at the size its master can carry, with
 * its caption in the margin beneath.
 *
 * `lead` runs full bleed, `wide` is held to the container, and a pair of
 * consecutive `detail` frames is set as a diptych — two half-width
 * plates side by side. The diptych is the one composition on the site
 * that is not a single column, and it exists for a specific reason: the
 * documentary frames are the smallest masters, and two of them together
 * read as a deliberate pairing rather than as two images that were not
 * good enough to be large.
 */
function Plate({
  project,
  images,
  locale,
}: {
  project: Project;
  images: readonly ProjectImage[];
  locale: Locale;
}) {
  const diptych = images.length === 2;
  const first = images[0];
  if (!first) return null;
  const full = !diptych && first.weight === 'lead';

  const figure = (image: ProjectImage, sizes: string) => (
    <figure key={image.id}>
      <Frame
        slug={project.slug}
        image={image}
        locale={locale}
        sizes={sizes}
        parallax={full ? 44 : 56}
        reveal={full ? 'curtain' : 'wipe'}
      />
      {image.caption !== undefined && (
        <Reveal delay={0.1}>
          <figcaption className="mt-4 font-text text-caption text-ink-3">
            {image.caption[locale]}
          </figcaption>
        </Reveal>
      )}
    </figure>
  );

  if (full) return figure(first, '100vw');

  return (
    <Container>
      {diptych ? (
        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 tablet:gap-6 desktop:gap-7">
          {images.map((image) => figure(image, '(min-width: 640px) 46vw, 100vw'))}
        </div>
      ) : (
        <div className="mx-auto desktop:w-[80%]">{figure(first, '(min-width: 1024px) 80vw, 100vw')}</div>
      )}
    </Container>
  );
}

/**
 * The plates, in sequence.
 *
 * Every frame the project has, at the largest size its master supports,
 * with generous space between. Nothing is skipped and nothing is shown
 * as a thumbnail — which is the point of having reviewed each master
 * individually in the first place.
 */
export function Plates({ project, locale }: { project: Project; locale: Locale }) {
  const sequence = project.images.slice(1);
  if (sequence.length === 0) return null;

  /* Group consecutive `detail` frames into pairs; everything else stands
     alone. Done here rather than in content so that adding a frame
     cannot silently break a diptych someone hand-authored. */
  const groups: ProjectImage[][] = [];
  for (let i = 0; i < sequence.length; i += 1) {
    const image = sequence[i];
    if (!image) continue;
    const next = sequence[i + 1];
    if (image.weight === 'detail' && next?.weight === 'detail') {
      groups.push([image, next]);
      i += 1;
    } else {
      groups.push([image]);
    }
  }

  return (
    <Section rhythm="default" label={ui.gallery[locale]}>
      <Container>
        <Eyebrow>{ui.gallery[locale]}</Eyebrow>
      </Container>
      <div className="mt-9 flex flex-col gap-10 desktop:mt-10 desktop:gap-11">
        {groups.map((group) => (
          <Plate key={group[0]?.id} project={project} images={group} locale={locale} />
        ))}
      </div>
    </Section>
  );
}

/** The outcome, read at the same slow pace as the homepage manifesto —
 *  the only other block on the site written to be read rather than
 *  scanned. */
export function Outcome({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <Section rhythm="loose">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-3">
            <Eyebrow>{ui.result[locale]}</Eyebrow>
          </div>
          <div className="col-span-4 mt-7 tablet:col-span-8 desktop:col-span-8 desktop:col-start-5 desktop:mt-0">
            <ScrollText
              text={project.outcome[locale]}
              className="font-display text-statement text-ink"
            />
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

/**
 * The next project, full bleed, with its name over the frame.
 *
 * At the end of a project page the next project is the primary action,
 * not an afterthought — so it is given the same weight as the page's own
 * cover, and the cursor names it.
 */
export function NextProject({ project, locale }: { project: Project; locale: Locale }) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '600px 0px 600px 0px' });
  const opening = project.images[0];
  if (!opening) return null;

  return (
    <Section rhythm="tight">
      <Container>
        <Eyebrow>{ui.nextProject[locale]}</Eyebrow>
      </Container>

      <div className="mt-8">
        <CursorLabel label={ui.viewProject[locale]} className="block">
          <Link href={paths.project(locale, project.slug)} className="group relative block">
            <div ref={ref} className="relative h-[min(66.667vw,74vh)] overflow-hidden bg-sunk">
              <Motion.div
                className="absolute inset-0"
                initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}}
                transition={{ duration: 1.2, ease: EASE.expo }}
              >
                <Fill
                  src={crop(project.slug, opening.id, 'landscape')}
                  portrait={crop(project.slug, opening.id, 'portrait')}
                  alt={opening.alt[locale]}
                  sizes="100vw"
                  focal={opening.focal}
                  eager={inView}
                  className="transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.03]"
                />
              </Motion.div>
              {/* The light coming up. The wash starts heavy and lifts over
            1.8s, so the building resolves out of the dark rather than
            being revealed by a curtain — the quietest possible way to
            make a still photograph an event. */}
        <Motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-paper"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 1.8, ease: EASE.expo }}
        />
              <div className="absolute inset-x-0 bottom-0 p-5 tablet:p-8">
                <Container>
                  <div className="flex items-end justify-between gap-5">
                    <h2 className="font-display text-display text-ink">{project.name[locale]}</h2>
                    <Arrow className="mb-3 shrink-0 text-ink transition-transform duration-500 ease-expo group-hover:translate-x-3" />
                  </div>
                </Container>
              </div>
            </div>
          </Link>
        </CursorLabel>
      </div>
    </Section>
  );
}

/* ================================================================== *
 * 404
 * ================================================================== */

/** Errors do not apologise and are never vague. This states what
 *  happened and offers the one route back. */
export function NotFoundBlock({ locale }: { locale: Locale }) {
  return (
    <Section rhythm="loose" className="pt-[10rem]">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-8 desktop:col-start-3">
            <SplitText
              as="h1"
              text={ui.notFoundTitle[locale]}
              mode="chars"
              immediate
              className="font-display text-display text-ink"
            />
            <Reveal delay={0.25}>
              <p className="mt-6 max-w-[44ch] font-text text-lead text-ink-2">
                {ui.notFoundBody[locale]}
              </p>
              <div className="mt-9">
                <Action href={paths.home(locale)}>{ui.allWork[locale]}</Action>
              </div>
            </Reveal>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
