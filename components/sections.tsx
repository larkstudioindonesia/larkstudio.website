'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  EASE,
  Motion,
  turn,
  scrollToId,
  useInView,
  useMagnetic,
  usePointer,
  useProgress,
  useReducedMotion,
  useActTwo,
  useSpring,
  useMedia,
  useTransform,
} from '@/lib/motion';
import type { Locale, Passage, Photograph, Project, ProjectImage } from '@/content/types';
import { framePhotograph, projectPhotographs } from '@/content/projects';
import { contact, directions, disciplines, home, practice, site, ui } from '@/content/site';
import { formatArea, ordinal, paths, whatsappLink } from '@/lib/site';
import {
  Action,
  Arrow,
  Container,
  CursorLabel,
  Eyebrow,
  Fill,
  Grid,
  Item,
  Measure,
  Print,
  Reveal,
  ScrollText,
  Section,
  SplitText,
  Stagger,
  TextLink,
  openLightbox,
  printAspect,
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
 * One room, one line — composed around the photograph rather than laid
 * on top of it.
 *
 * THE PLATE DECIDES THE LAYOUT, and this is the whole of the section.
 * `home-hero.jpg` is an upper landing shot square down its axis: the
 * subject occupies a band from roughly 33% to 78% of the width — sliding
 * door, garden beyond, the desk, the wardrobe joinery — and everything
 * left of 30% is an unbroken pale wall running from the ceiling down to
 * the balustrade. The type goes on that wall. Nothing the studio built
 * has type over it.
 *
 * That is a change of kind from the previous revision, which stacked
 * headline, subhead, action and metadata in one block across the bottom
 * of the frame and lit the whole lower two thirds with a paper gradient
 * to make them legible. On a dark plate that was merely heavy. On this
 * one it would have been fatal: the lower two thirds is where the floor
 * reflections, the chair and the whole garden view are, and a 72%-tall
 * scrim over a high-key interior does not read as atmosphere, it reads
 * as fog.
 *
 * So the light is now DIRECTIONAL, and it is aimed at the wall:
 *
 *   left    the type scrim. Full strength at the edge, gone by 68%.
 *           It darkens the blank wall and stops before the door.
 *   bottom  a 30% band under the metadata rail, down from 72%.
 *   top     an 18% band so the fixed header stays readable.
 *   flat    a resting wash across everything, cut from 0.35 to 0.14 —
 *           the frame is bright enough to carry light type once the
 *           directional scrims are doing the real work, and every point
 *           of flat wash is contrast thrown away for nothing.
 *
 * THE PHONE GETS THE WHOLE PLATE. A 1.578:1 render cannot cover a
 * 0.46:1 phone without discarding most of it, and an earlier revision
 * showed a 56svh band holding 47% of the plate's width, enlarged. Below
 * 640px the photograph is now a full-width band at its own ratio, clear
 * of the header, with the type beneath it on clean paper — the plate
 * smaller and complete, as every photograph on the site now is.
 *
 * THE BACKGROUND MOVES, AND IT NEVER STOPS MOVING. Three layers, each
 * owning exactly one job, nested so no two ever write the same property:
 *
 *   SCROLL     the outer layer. Trails the page by 5% and pushes in to
 *              1.02 as the hero leaves, while the type moves the other
 *              way and several times as fast. Different rates in
 *              opposite directions is the whole of the depth effect —
 *              and the type may travel freely, because moving type
 *              costs no photograph.
 *   ENTRANCE   the middle layer. Opens a clip and settles from 1.02 over
 *              2.4s, once.
 *   DRIFT      the inner layer. A 26-second breath — 2% of scale and
 *              under 1% of translate — that mirrors forever.
 *
 * The scales compound, and they are budgeted so that they cannot cost
 * detail: 1.02 x 1.02 is 1.04 at the worst instant, so a 1440px viewport
 * at 2x needs 2995 real pixels against a 4000px master and a 4096
 * candidate. The drift is slower and smaller than a Ken Burns pan by an
 * order of magnitude. At this rate no one watches it happen; they
 * notice, a few seconds apart, that the frame is not where it was.
 */
export function Hero({ locale, credit }: { locale: Locale; credit: Project }) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  /* ACT II GATE. Every cue below is held at its hidden state until the
     overture has fully left — not delayed, held. See `useActTwo`. */
  const act2 = useActTwo();
  const progress = useProgress(section, ['start start', 'end start']);

  /* Foreground and background pull apart as the hero leaves. */
  const opacity = useTransform(progress, [0, 0.7], [1, 0]);
  /**
   * PARALLAX IS PAID FOR IN COMPOSITION, AND THE PRICE WAS TOO HIGH.
   *
   * The bed has to be taller than the viewport or translating it exposes
   * a band of empty page. But the overhang is not free: it is the part
   * of the photograph that is scrolled past rather than seen. At 14%
   * travel over a 16% overhang the hero showed 56% of the render — a
   * visitor never saw the ceiling or the floor of the room, on the one
   * image the studio leads with.
   *
   * 5% travel over a 5% overhang keeps the parallax legible as movement
   * and returns the composition. The render is the product; the drift is
   * decoration on top of it.
   */
  /* 6% travel over a 6% overhang, and a push-in of 2% rather than 5%:
     the scroll scale compounds with the drift below, and at 1.05 x 1.04
     the plate was being shown 9% over-size — enough to soften a render
     that is the first thing anyone sees. */
  const bedY = useTransform(progress, [0, 1], ['0%', '6%']);
  const bedScale = useTransform(progress, [0, 1], [1, 1.02]);
  /* The ambient drift is a desktop and tablet luxury. On a phone it is
     a full-width layer animating forever, for a movement too small to
     read on a 6-inch screen. */
  const drifting = useMedia('(min-width: 640px)');
  const typeY = useTransform(progress, [0, 1], ['0%', '-28%']);
  /* The light going back down as the reader leaves for the work. Rests
     at 0.14 rather than 0.35: see the note on directional light above. */
  const washOpacity = useTransform(progress, [0, 1], [0.14, 0.5]);

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
   *   0.00  image begins settling from 1.02 and the wash begins lifting
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
  /* Every cue is offset by the stage clock, so on a first visit the
     whole score is parked until the overture's aperture is opening and
     the page performs INTO it. On a repeat visit `stage` is 0 and the
     timings below are exactly as written. */
  const CUE = { head: 0.5, sub: 1.15, cta: 1.35, meta: 1.55, hint: 1.85 };

  return (
    /* `svh`, not `dvh`. A dynamic unit tracks the mobile browser's
       collapsing toolbar, so the hero — and everything below it —
       changed height and jumped the moment the visitor started to
       scroll. The small viewport is the one height that never moves. */
    <section ref={section} className="relative flex min-h-svh flex-col overflow-hidden">
      {/*
        THE PLATE. A band across the top on a phone, the whole viewport
        from 640px up — one element, two sizing models, because the crop
        a phone would otherwise take is not survivable. See the note on
        the component.
      */}
      {/* On a phone the plate is shown WHOLE — a full-width band at the
          photograph's own ratio, clear of the header — where it used to be
          a 56svh band holding 47% of the render's width, enlarged. */}
      <div className="relative mt-[4.75rem] aspect-[4000/2535] w-full shrink-0 overflow-hidden tablet:absolute tablet:inset-0 tablet:mt-0 tablet:aspect-auto tablet:h-auto">
        {/* SCROLL. The slack is what makes the translate safe: without it
            the layer is exactly viewport-sized and moving it exposes a
            band of empty page along one edge for the whole pass. Overhang
            and travel are kept equal and small — every extra percent of
            overhang is a percent of the render nobody ever sees. */}
        <Motion.div
          /* The parallax overhang is desktop and tablet only: on a phone
             it would be cropping the plate it now shows whole. */
          className="absolute inset-0 tablet:-inset-y-[6%]"
          style={drifting ? { y: bedY, scale: bedScale } : {}}
        >
          {/* ENTRANCE */}
          <Motion.div
            className="absolute inset-0"
            initial={{ clipPath: 'inset(6% 0% 6% 0%)', scale: 1.02 }}
            animate={
              act2
                ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }
                : { clipPath: 'inset(6% 0% 6% 0%)', scale: 1.02 }
            }
            transition={{ duration: 2.8, ease: EASE.expo }}
          >
            {/* DRIFT */}
            <Motion.div
              className="absolute inset-0"
              {...(reduced === true || !act2 || !drifting
                ? {}
                : {
                    animate: {
                      scale: [1, 1.02, 1],
                      x: ['0%', '-0.9%', '0%'],
                      y: ['0%', '0.6%', '0%'],
                    },
                    transition: {
                      duration: 16,
                      ease: 'easeInOut' as const,
                      repeat: Infinity,
                      /* The entrance owns the first 2.4s; the drift starts
                         from the value the entrance lands on, so the
                         handover is invisible. */
                      delay: 2.8,
                    },
                  })}
            >
              <Fill
                src={home.stage.image}
                alt=""
                /* The band is the full width at the plate's own ratio on
                   a phone, and the full viewport from 640px up. */
                sizes="100vw"
                focal={home.stage.focal}
                priority
              />
            </Motion.div>
          </Motion.div>
          {/*
            THE LIGHT, IN TWO WASHES RATHER THAN ONE.

            The scroll wash carries the resting level and deepens as the
            hero leaves. The entrance wash sits over it and clears
            completely in 1.8s, so the room resolves out of the dark
            rather than being revealed by a curtain.

            Two elements, not one, because an `animate` keyframe and a
            scroll-linked `style` on the same property fight — and they
            cannot be nested either, since opacity clamps at 1 and the
            composite needs to start high over a low base. Stacked, the
            maths is just what the compositor already does:
            1 − (1−0.14)(1−0.62) = 0.67 on arrival, 0.14 at rest.
          */}
          <Motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-paper"
            style={{ opacity: washOpacity }}
          />
          <Motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-paper"
            initial={{ opacity: 0.62 }}
            animate={{ opacity: act2 ? 0 : 0.62 }}
            transition={{ duration: 1.8, ease: EASE.expo }}
          />
          {/* THE TYPE SCRIM, and the reason it runs left rather than up.
              It lands on the blank wall the headline sits on and is gone
              by 68% — before the sliding door, the garden and the
              joinery, none of which are allowed to be fogged to make
              text readable. Tablet and up only: on a phone the type is
              below the band on bare paper and needs no help. */}
          {/* The stops are measured, not chosen: at 1440px the headline
              column ends at 29% of the width and the sliding door begins
              at 31%, so the scrim holds full strength to 26%, is half
              gone by the door and clear by 58%. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 hidden w-full bg-gradient-to-r from-paper from-0% via-paper/48 via-30% to-transparent to-58% tablet:block"
          />
          {/* Bottom for the metadata rail, top for the header: the bar is
              transparent over the hero, so the one place the photograph
              is not allowed to be interesting is the 80px the navigation
              sits in. The bottom band was 72% and is now 26% — the floor
              of this plate carries the reflections, and they were the
              first thing the old full-height gradient erased. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-paper via-paper/50 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-paper/75 to-transparent"
          />
        </Motion.div>
      </div>

      {/*
        THE TYPE COLUMN.

        In flow beneath the band on a phone; on the blank left third of
        the photograph from 640px up, held off the bottom so the metadata
        rail has the floor to itself. The foreground leaves twice as fast
        as the background arrives, and in the opposite direction — that
        difference in rate IS the depth, and nothing here is rotated,
        scaled or put on a plane.
      */}
      <Motion.div
        /*
         * THE CLEARANCES ARE FIXED, NOT PROPORTIONAL, and that is the
         * point. Centring the column in the raw viewport put a three-line
         * headline under the fixed header on any laptop short enough to
         * have browser chrome — 758px of usable height was enough to
         * collide. `pt` clears the header and `pb` clears the metadata
         * rail, and the block centres in what is left, so it cannot
         * overlap either at any height.
         */
        className="relative z-10 flex flex-1 flex-col justify-center pb-7 pt-8 tablet:absolute tablet:inset-x-0 tablet:top-0 tablet:h-full tablet:justify-center tablet:pb-[9rem] tablet:pt-[7.5rem]"
        style={{ opacity, y: typeY }}
      >
        <Container>
          {/*
            THE HEADLINE, RE-MEASURED RATHER THAN RESIZED.

            It was capped at 7.5rem and set across the full container,
            which put a 120px line straight through the middle of
            whatever it was standing on. The cap is now 4.75rem and the
            block is held to 15ch, so `Tropical architecture` breaks
            after `Tropical` and the longest visual line — `architecture`
            — is about 6em wide. At 1440px that is 460px against the
            475px of blank wall the plate offers. The headline got
            smaller and reads larger, because it now has an edge.

            `SplitText` wraps every word in `whitespace-nowrap`, so the
            per-character animation survives the break: the line wraps
            between words, never through one.
          */}
          <h1 className="max-w-[13ch] font-display text-hero text-ink">
            <SplitText
              as="span"
              text={line1}
              mode="chars"
              immediate
              play={act2}
              delay={CUE.head}
              className="block"
            />
            <SplitText
              as="span"
              text={line2}
              mode="words"
              immediate
              play={act2}
              delay={CUE.head + 0.37}
              className="block text-ink/70 tablet:pl-[8%]"
            />
          </h1>

          {/* Subhead and action stack rather than sitting shoulder to
              shoulder: the row form needed the full container width, and
              the column is now 44% of it. Reading order is also the
              order of the score — sentence, then the thing to do. */}
          <div className="mt-7 flex max-w-[30rem] flex-col items-start gap-6 tablet:mt-8 desktop:max-w-[34rem]">
            <Motion.p
              className="max-w-[34ch] font-text text-body text-ink-2 desktop:text-body-lg"
              initial={{ opacity: 0, y: 18 }}
              animate={act2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.9, ease: EASE.expo, delay: CUE.sub }}
            >
              {home.heroSubhead[locale]}
            </Motion.p>
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={act2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.9, ease: EASE.expo, delay: CUE.cta }}
            >
              <Action href={paths.contact(locale)} size="large">
                {home.closingAction[locale]}
              </Action>
            </Motion.div>
          </div>
        </Container>
      </Motion.div>

      {/* THE METADATA RAIL, on the floor of the hero rather than stacked
          under the action. It is the only element that spans the full
          container width, which is what makes it read as a base line
          under the composition instead of a fourth paragraph. */}
      <Motion.div
        className="relative z-10 pb-8 tablet:absolute tablet:inset-x-0 tablet:bottom-0 tablet:pb-9"
        style={{ opacity }}
      >
        <Container>
          <Motion.div
            className="flex items-baseline justify-between gap-5 border-t border-line pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: act2 ? 1 : 0 }}
            transition={{ duration: 1, ease: EASE.expo, delay: CUE.meta }}
          >
            <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-text text-caption text-ink-3">
              {home.heroMeta[locale].map((entry) => (
                <li key={entry} className="figures">
                  {entry}
                </li>
              ))}
            </ul>
            {/* The frame is credited, not decorated. The hero plate is
                its own master, so the credit names the project the room
                belongs to rather than the file. */}
            <Link
              href={paths.project(locale, credit.slug)}
              className="sweep hidden shrink-0 font-text text-caption text-ink-3 transition-colors duration-300 ease-expo hover:text-ink tablet:block"
            >
              {credit.name[locale]}
              <span aria-hidden="true"> — </span>
              {credit.type[locale]}, {credit.location[locale]}
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
          animate={{ opacity: act2 ? 1 : 0 }}
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
        {/* A small print held above the pointer. It appears by scale and
            opacity — transform only — where it used to grow its width and
            height, which re-laid-out the card on every frame and cropped
            the photograph while it did. */}
        <Motion.div
          className="-translate-x-1/2 -translate-y-[112%]"
          initial={false}
          animate={{ scale: shown ? 1 : 0.9, opacity: shown ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE.expo }}
        >
          {preview && (
            <Print
              photo={framePhotograph(preview.image)}
              locale={locale}
              sizes="360px"
              eager
              rotate={-1}
              className="w-[360px]"
            />
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
 * HOME — IN PRACTICE
 * ================================================================== */

/**
 * The studio at work — a short run of documentary photographs, turned
 * like pages, between the work and the closing statement.
 *
 * WHY A SLIDESHOW AND NOT A GRID. The photographs are of very different
 * shapes (4:3, 16:9, a 9:16 phone portrait) and qualities, and a grid
 * would force them into one ratio or into a ragged wall. One at a time,
 * each is shown whole at its own shape, as a print, as large as the stage
 * allows — and never larger than the file has pixels, which matters for
 * the three WhatsApp copies.
 *
 * NO LAYOUT JUMP. The stage has a fixed height at every breakpoint and
 * slides are absolutely placed inside it, so a portrait following a
 * landscape changes nothing around it. The caption line reserves two
 * lines for the same reason.
 *
 * THE TURN. The outgoing print eases away 48px and fades while the next
 * settles in from the other side — the gesture of turning a page, not of
 * a carousel. Arrows, arrow keys (only while the section is centred on
 * screen, and never while the lightbox has them), a sideways swipe, and a
 * tap on the print to enlarge it. No autoplay: the reader sets the pace.
 * The neighbouring photographs are mounted invisibly so a turn never
 * shows a print arriving half-loaded.
 */

/** A print sized to fit the stage whole: its own ratio, the stage's
 *  width or height (whichever binds), and never past its own pixels. */
function StagedPrint({
  photo,
  locale,
  onOpen,
}: {
  photo: Photograph;
  locale: Locale;
  onOpen?: (origin: HTMLElement) => void;
}) {
  return (
    <div
      style={{
        width: `min(100cqw, calc(100cqh * ${String(printAspect(photo))}), ${String(photo.width)}px)`,
      }}
    >
      <Print
        photo={photo}
        locale={locale}
        sizes="(min-width: 1024px) 58vw, 92vw"
        eager
        {...(onOpen && { onOpen })}
      />
    </div>
  );
}

export function Practice({ locale }: { locale: Locale }) {
  const photos = practice.photographs;
  const count = photos.length;
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const { ref: stage, inView } = useInView<HTMLDivElement>({
    once: false,
    rootMargin: '-35% 0px -35% 0px',
  });

  const go = useCallback(
    (delta: number) => {
      setState(([current]) => [(current + delta + count) % count, delta]);
    },
    [count],
  );

  /* Arrow keys while the section owns the screen — and not while the
     lightbox is open, which uses the same keys for its own set. */
  useEffect(() => {
    if (!inView) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      if (document.querySelector('[role="dialog"]')) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      go(event.key === 'ArrowRight' ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [inView, go]);

  const swipe = useRef<{ x: number; y: number } | null>(null);
  const photo = photos[index] ?? photos[0];
  const neighbours = [photos[(index + 1) % count], photos[(index - 1 + count) % count]];

  const arrow =
    'flex h-[44px] w-[44px] items-center justify-center border border-line text-ink-2 transition-colors duration-300 ease-expo hover:border-line-strong hover:text-ink';

  return (
    <Section rhythm="default" label={practice.title[locale]}>
      <Container>
        <Grid className="desktop:grid-rows-[auto_1fr]">
          {/* The heading: the label, then one line on what the photographs
              show. */}
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-4 desktop:row-start-1">
            <Eyebrow>{practice.title[locale]}</Eyebrow>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[22ch] font-display text-statement text-ink desktop:mt-8">
                {practice.intro[locale]}
              </p>
            </Reveal>
          </div>

          {/* THE STAGE — a fixed-height size container. */}
          <div
            ref={stage}
            className="relative col-span-4 mt-8 h-[min(58svh,118vw)] touch-pan-y [container-type:size] tablet:col-span-8 tablet:h-[min(62svh,78vw)] desktop:col-span-8 desktop:col-start-5 desktop:row-span-2 desktop:row-start-1 desktop:mt-0 desktop:h-[min(76svh,44vw)]"
            onTouchStart={(event) => {
              const touch = event.touches[0];
              swipe.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
            }}
            onTouchEnd={(event) => {
              const touch = event.changedTouches[0];
              const start = swipe.current;
              swipe.current = null;
              if (!start || !touch) return;
              const dx = touch.clientX - start.x;
              if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(touch.clientY - start.y) * 1.5) {
                go(dx < 0 ? 1 : -1);
              }
            }}
          >
            {/* The neighbours, loaded and decoded but not shown. */}
            <div aria-hidden="true" className="pointer-events-none invisible absolute inset-0">
              {neighbours.map((neighbour) =>
                neighbour ? (
                  <div key={neighbour.src} className="absolute inset-0 flex items-center justify-center">
                    <StagedPrint photo={neighbour} locale={locale} />
                  </div>
                ) : null,
              )}
            </div>
            <AnimatePresence initial={false} custom={direction}>
                <Motion.div
                  key={photo.src}
                  custom={direction}
                  variants={turn}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <StagedPrint
                    photo={photo}
                    locale={locale}
                    onOpen={(origin) => {
                      openLightbox({ photos, index, origin, locale });
                    }}
                  />
                </Motion.div>
            </AnimatePresence>
          </div>

          {/* The count, the caption, the way through. */}
          <div className="col-span-4 mt-6 tablet:col-span-8 desktop:col-span-4 desktop:row-start-2 desktop:mt-0 desktop:self-end">
            <div className="flex items-end justify-between gap-6 desktop:block">
              <div className="min-w-0 flex-1">
                <p className="figures label text-ink-3">
                  <span className="text-ink">{String(index + 1).padStart(2, '0')}</span>
                  <span aria-hidden="true"> / </span>
                  {String(count).padStart(2, '0')}
                </p>
                {/* Every caption sits in the SAME grid cell, all but the
                    current one invisible — so the block is always exactly
                    as tall as the longest caption at this width and in this
                    language, and turning a page never moves the page. (A
                    fixed two-line reserve was not enough: on a 320px phone
                    the Indonesian captions wrap to three.) */}
                <div className="mt-3 grid max-w-[32ch] font-text text-body text-ink-2">
                  {photos.map((entry, position) => (
                    <p
                      key={entry.src}
                      aria-hidden={position !== index}
                      {...(position === index && { 'aria-live': 'polite' as const })}
                      className={`col-start-1 row-start-1 ${position === index ? '' : 'invisible'}`}
                    >
                      {entry.alt[locale]}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 desktop:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    go(-1);
                  }}
                  aria-label={practice.previous[locale]}
                  className={arrow}
                >
                  <Arrow className="w-[20px] rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    go(1);
                  }}
                  aria-label={practice.next[locale]}
                  className={arrow}
                >
                  <Arrow className="w-[20px]" />
                </button>
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

/* ================================================================== *
 * HOME — NEW DIRECTIONS
 * ================================================================== */

/**
 * Where the studio is going next: Larkscapes.id and Larkworks.id, the
 * permanent home of the announcement (same content, `directions` in
 * content/site.ts), between the studio at work and the closing statement.
 *
 * NOT PROJECTS, SO NOT PROJECT CARDS. Each initiative is an editorial
 * spread — a set of whole prints on one side, the field, the name and a
 * short statement on the other — mirrored for the second so the two read
 * as siblings: same type, same rhythm, same furniture, different
 * photographs. Larkscapes' renders are wide, so its spread is a large
 * print over a row of three; Larkworks' photographs are tall, so its
 * spread is three portrait prints in a row, the middle one set lower,
 * like prints laid on a table. Every print opens the lightbox on the
 * initiative's whole library.
 */
type DirectionItem = (typeof directions.initiatives)[number];

function DirectionSpread({ item, locale }: { item: DirectionItem; locale: Locale }) {
  const [lead, ...rest] = item.feature;
  const open = (photo: Photograph) => (origin: HTMLElement) => {
    openLightbox({ photos: item.library, index: item.library.indexOf(photo), origin, locale });
  };
  const wide = lead.width > lead.height;

  if (wide) {
    return (
      <div>
        <Reveal>
          <Print photo={lead} locale={locale} sizes="(min-width: 1024px) 54vw, 92vw" rotate={-0.4} onOpen={open(lead)} />
        </Reveal>
        <div className="mt-5 grid grid-cols-3 gap-3 tablet:mt-6 tablet:gap-5">
          {rest.map((photo, i) => (
            <Reveal key={photo.src} delay={0.08 * (i + 1)}>
              <Print
                photo={photo}
                locale={locale}
                sizes="(min-width: 1024px) 18vw, 31vw"
                rotate={[0.9, -0.6, 1.1][i] ?? 0}
                onOpen={open(photo)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    );
  }

  /* Portraits: three in a row, the middle one set lower. */
  return (
    <div className="grid grid-cols-3 items-start gap-3 tablet:gap-5">
      {[lead, ...rest].slice(0, 3).map((photo, i) => (
        <Reveal key={photo.src} delay={0.08 * i} className={i === 1 ? 'mt-8 tablet:mt-10' : ''}>
          <Print
            photo={photo}
            locale={locale}
            sizes="(min-width: 1024px) 18vw, 31vw"
            rotate={[-0.8, 0.6, -1][i] ?? 0}
            onOpen={open(photo)}
          />
        </Reveal>
      ))}
    </div>
  );
}

export function Directions({ locale }: { locale: Locale }) {
  return (
    <Section id="directions" rhythm="default" label={directions.title[locale]}>
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-4">
            <Eyebrow>{directions.title[locale]}</Eyebrow>
          </div>
          <div className="col-span-4 mt-7 tablet:col-span-8 desktop:col-span-8 desktop:mt-0">
            <Reveal>
              <p className="max-w-[30ch] font-display text-statement text-ink">{directions.story[locale]}</p>
            </Reveal>
          </div>
        </Grid>

        <div className="mt-10 flex flex-col gap-11 desktop:mt-11 desktop:gap-12">
          {directions.initiatives.map((item, index) => {
            const mirror = index % 2 === 1;
            return (
              <article
                key={item.key}
                aria-labelledby={`direction-${item.key}`}
                className="grid grid-cols-4 gap-x-4 tablet:grid-cols-8 tablet:gap-x-5 desktop:grid-cols-12 desktop:items-center"
              >
                <div
                  className={`col-span-4 tablet:col-span-8 desktop:col-span-7 desktop:row-start-1 ${
                    mirror ? 'desktop:col-start-6' : 'desktop:col-start-1'
                  }`}
                >
                  <DirectionSpread item={item} locale={locale} />
                </div>
                <div
                  className={`col-span-4 mt-8 tablet:col-span-6 desktop:col-span-4 desktop:row-start-1 desktop:mt-0 ${
                    mirror ? 'desktop:col-start-1' : 'desktop:col-start-9'
                  }`}
                >
                  <Reveal>
                    <p className="label flex items-center gap-2 text-ink-2">
                      <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-brass" />
                      {item.field[locale]}
                    </p>
                    <h3
                      id={`direction-${item.key}`}
                      className="mt-4 font-display text-[clamp(2.5rem,1.4rem+3.6vw,4.5rem)] font-medium leading-[1.02] text-ink"
                    >
                      {item.name}
                    </h3>
                    <p className="mt-5 max-w-[40ch] font-text text-body text-ink-2">{item.body[locale]}</p>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                      <Action href={paths.contact(locale)}>{item.action[locale]}</Action>
                      <button
                        type="button"
                        onClick={(event) => {
                          openLightbox({ photos: item.library, index: 0, origin: event.currentTarget, locale });
                        }}
                        className="sweep inline-flex min-h-[44px] items-center font-text text-spec text-ink-2 transition-colors duration-300 ease-expo hover:text-ink"
                      >
                        {directions.viewAll[locale]}
                        <span className="figures ml-2 text-ink-3">{String(item.library.length).padStart(2, '0')}</span>
                      </button>
                    </div>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
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
 * A PROJECT OPENS ON ITS LEAD PHOTOGRAPH, WHOLE.
 *
 * This used to be a full-bleed cover with the name set over it — which on
 * a phone meant the 4:5 export, a 53% centre crop of the render enlarged
 * 1.7×, under a 60% scrim. Now the name comes first, on the page, and the
 * lead photograph follows as a large print: its own 3:2, in its border,
 * as big as the screen allows without cropping a pixel — and it can be
 * picked up and enlarged like every print on the site.
 */
export function ProjectHero({ project, locale }: { project: Project; locale: Locale }) {
  const opening = project.images[0];
  if (!opening) return null;
  const photos = projectPhotographs(project);
  const lead = photos[0];
  if (!lead) return null;

  return (
    <section className="relative pb-8 pt-10 tablet:pb-9 desktop:pt-[9.5rem]">
      <Container>
        <Motion.p
          className="label text-ink-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE.expo, delay: 0.35 }}
        >
          {project.type[locale]} · {project.location[locale]}
        </Motion.p>
        <SplitText
          as="h1"
          text={project.name[locale]}
          mode="chars"
          immediate
          delay={0.45}
          className="mt-4 font-display text-hero text-ink"
        />

        {/* As wide as the column, and never so tall that the print runs
            under the fold on a laptop: the width is capped by the small
            viewport height, less the ~25rem the header and title take,
            at the print's own ratio. */}
        <Motion.div
          className="mx-auto mt-8 w-full desktop:mt-9 desktop:w-[min(100%,calc((100svh-25rem)*1.45))]"
          initial={{ opacity: 0, y: 28, rotate: -1.4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.4, ease: EASE.expo, delay: 0.5 }}
        >
          <Print
            photo={lead}
            locale={locale}
            sizes="(min-width: 1760px) 1600px, 92vw"
            priority
            rotate={-0.4}
            onOpen={(origin) => {
              openLightbox({ photos, index: 0, origin, locale });
            }}
          />
        </Motion.div>
      </Container>
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
  /* Only what the studio has stated: a project with no recorded area
     shows three facts, never a placeholder. */
  const facts = [
    { key: 'type', label: ui.type[locale], value: project.type[locale] },
    { key: 'location', label: ui.location[locale], value: project.location[locale] },
    ...(project.area === undefined
      ? []
      : [{ key: 'area', label: ui.area[locale], value: formatArea(project.area, locale) }]),
    { key: 'year', label: ui.year[locale], value: String(project.year) },
  ];

  return (
    <Section rhythm="default">
      <Container>
        <Eyebrow>{ui.details[locale]}</Eyebrow>
        <Stagger className="mt-8" each={0.08}>
          <Grid>
            {facts.map((fact) => (
              /* Two by two until 1024px. Four across on a tablet gave
                 each fact ~150px, and a `title`-size "Coffee Shop" or
                 "Denpasar, Bali" broke onto a second line in all four. */
              <Item key={fact.key} className="col-span-2 tablet:col-span-4 desktop:col-span-3">
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
 * A plate: one photograph as a print, at the size its master can carry,
 * with its caption beneath.
 *
 * `lead` spans the column, `wide` is held to 80% of it, and a pair of
 * consecutive `detail` frames is set as a diptych. Every print is the
 * whole photograph at its own ratio — nothing is cropped to a slot — and
 * every one opens the lightbox on the project's full set, so the gallery
 * can be read one photograph at a time, large.
 *
 * Prints alternate a fraction of a degree either way: enough to read as
 * paper laid on a surface, never enough to put a building on a slant.
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
  const photos = projectPhotographs(project);

  const figure = (image: ProjectImage, sizes: string) => {
    const index = project.images.findIndex((candidate) => candidate.id === image.id);
    const photo = photos[index];
    if (!photo) return null;
    return (
      <figure key={image.id}>
        <Reveal>
          <Print
            photo={photo}
            locale={locale}
            sizes={sizes}
            rotate={index % 2 === 0 ? 0.4 : -0.4}
            onOpen={(origin) => {
              openLightbox({ photos, index, origin, locale });
            }}
          />
        </Reveal>
        {image.caption !== undefined && (
          <Reveal delay={0.1}>
            <figcaption className="mt-4 font-text text-caption text-ink-3">
              {image.caption[locale]}
            </figcaption>
          </Reveal>
        )}
      </figure>
    );
  };

  return (
    <Container>
      {diptych ? (
        <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:gap-6 desktop:gap-8">
          {images.map((image) => figure(image, '(min-width: 640px) 46vw, 92vw'))}
        </div>
      ) : (
        <div className={full ? '' : 'mx-auto desktop:w-[80%]'}>
          {figure(first, full ? '(min-width: 1760px) 1600px, 92vw' : '(min-width: 1024px) 74vw, 92vw')}
        </div>
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
  /* No write-up yet: the section is left out, not filled. */
  if (!project.outcome) return null;
  const outcome = project.outcome[locale];
  return (
    <Section rhythm="loose">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-3">
            <Eyebrow>{ui.result[locale]}</Eyebrow>
          </div>
          <div className="col-span-4 mt-7 tablet:col-span-8 desktop:col-span-8 desktop:col-start-5 desktop:mt-0">
            <ScrollText
              text={outcome}
              className="font-display text-statement text-ink"
            />
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

/**
 * The next project, as its lead print beside its name. The whole block is
 * the link; the print is the photograph whole, as everywhere else.
 */
export function NextProject({ project, locale }: { project: Project; locale: Locale }) {
  const photos = projectPhotographs(project);
  const lead = photos[0];
  if (!lead) return null;

  return (
    <Section rhythm="tight">
      <Container>
        <Eyebrow>{ui.nextProject[locale]}</Eyebrow>
        <CursorLabel label={ui.viewProject[locale]} className="mt-8 block">
          <Link
            href={paths.project(locale, project.slug)}
            className="group grid grid-cols-1 items-end gap-6 tablet:grid-cols-12 tablet:gap-7"
          >
            <Reveal className="tablet:col-span-7 desktop:col-span-6">
              <Print
                photo={lead}
                locale={locale}
                sizes="(min-width: 640px) 56vw, 92vw"
                rotate={0.8}
                className="transition-transform duration-700 ease-expo group-hover:-translate-y-[6px]"
              />
            </Reveal>
            <div className="flex items-end justify-between gap-5 tablet:col-span-5 tablet:pb-4 desktop:col-span-5 desktop:col-start-8">
              <h2 className="font-display text-display text-ink">{project.name[locale]}</h2>
              <Arrow className="mb-3 shrink-0 text-ink transition-transform duration-500 ease-expo group-hover:translate-x-3" />
            </div>
          </Link>
        </CursorLabel>
      </Container>
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
