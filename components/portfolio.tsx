'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EASE,
  Motion,
  SPRING,
  scrollToY,
  stagger,
  useInView,
  useMedia,
  useMagnetic,
  useMotionValueEvent,
  useProgress,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from '@/lib/motion';
import { crop, type Locale, type Project } from '@/content/types';
import { ui } from '@/content/site';
import { firstSentence, ordinal, paths } from '@/lib/site';
import { Arrow, Container, CursorLabel, Eyebrow, Fill } from '@/components/ui';

/**
 * LARK STUDIO — THE HORIZONTAL PORTFOLIO
 *
 * The work is laid out side by side and travelled through horizontally,
 * driven by ordinary vertical scroll.
 *
 * WHY THIS IS THE RIGHT SHAPE FOR THIS CONTENT. A vertical list of eight
 * buildings is a list; you scroll it the way you scroll anything. Laid
 * across, each project gets a whole screen to itself and the next one is
 * always visible at the edge — so the page states how much work there is
 * without a counter having to say it. It is also how a studio shows work
 * in a room: side by side, at eye level, one at a time.
 *
 * HOW IT WORKS, AND WHY THERE IS NO GSAP.
 *
 * The section is a tall spacer with a `sticky` viewport inside it. As the
 * spacer passes the window, its scroll progress maps to a horizontal
 * translate on the track. That is precisely what ScrollTrigger's pin +
 * scrub does, and Framer Motion's `useScroll` already gives the progress
 * value — adding GSAP would mean a second animation runtime (~50kb) and a
 * second source of truth for scroll position, next to the Lenis instance
 * that is already smoothing it.
 *
 * THE HEIGHT IS CSS, NOT MEASURED. Panel widths are viewport units, so
 * the travel distance is known without measuring anything:
 *
 *     track  = n·PANEL + (n−1)·GAP + 2·EDGE   (vw)
 *     travel = track − 100                    (vw)
 *     height = 100vh + travel                 (1:1 with the page)
 *
 * A measured height would need a layout pass, a ResizeObserver and a
 * reflow on every resize, and would shift the page on first paint. This
 * way the spacer is the right height in the first frame, and one vertical
 * pixel moves the track one horizontal pixel — which is what makes the
 * gesture feel direct rather than geared.
 *
 * EVERY WAY IN. Wheel and trackpad vertical (native), trackpad
 * horizontal, drag, arrow keys, the tick marks, and the two arrow
 * buttons. All of them move the PAGE. The track is a pure function of
 * scroll position, so moving it directly would desynchronise the two the
 * moment the gesture ended.
 *
 * MOBILE DOES NOT DO THIS. Below 1024px the wrapper is auto-height, the
 * viewport is static, the track is a column and the translate is zero.
 * Horizontal scroll hijacking on a touch device fights the OS gesture and
 * loses; the same panels stacked vertically are a perfectly good phone
 * experience.
 */

const PANEL = 76; // vw — one project
const GAP = 4; // vw — between panels
const EDGE = 4; // vw — before the first and after the last

/** Movement past which a pointer gesture is a drag rather than a click. */
const DRAG_SLOP = 6; // px

export function Portfolio({
  projects,
  locale,
}: {
  projects: readonly Project[];
  locale: Locale;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const desktop = useMedia('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const count = projects.length;
  const travel = count * PANEL + (count - 1) * GAP + 2 * EDGE - 100;

  const progress = useProgress(wrapper, ['start start', 'end end']);
  const smooth = useSpring(progress, SPRING.track);
  const x = useTransform(smooth, [0, 1], ['0vw', `-${String(travel)}vw`]);
  /* The warm field travels the opposite way to the track and at a
     fraction of its rate, so it reads as depth behind the work rather
     than as a layer glued to it. */
  const washX = useTransform(smooth, [0, 1], ['-18%', '18%']);
  const washOpacity = useTransform(smooth, [0, 0.5, 1], [0.55, 1, 0.55]);

  /* The active panel is derived from progress, not from an observer:
     the panels are inside a translated track, so their intersection with
     the viewport is not what the reader perceives as "current". */
  useMotionValueEvent(progress, 'change', (value) => {
    const index = Math.round(value * (count - 1));
    setActive((current) => (current === index ? current : index));
  });

  /** Page offset that puts panel `index` in the viewport. */
  const offsetFor = useCallback((index: number) => {
    const node = wrapper.current;
    if (!node) return 0;
    const top = node.getBoundingClientRect().top + window.scrollY;
    const distance = node.offsetHeight - window.innerHeight;
    return top + (index / Math.max(1, count - 1)) * distance;
  }, [count]);

  const go = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(count - 1, index));
      scrollToY(offsetFor(target));
    },
    [count, offsetFor],
  );

  const { ref: viewport, inView } = useInView<HTMLDivElement>({
    once: false,
    rootMargin: '-40% 0px -40% 0px',
  });

  /**
   * Deep link. `/en#work` from another page, or the header's Work item
   * arriving from a route change, both land here rather than at the top
   * of the homepage.
   */
  useEffect(() => {
    if (window.location.hash !== '#work') return;
    const node = wrapper.current;
    if (!node) return;
    const timer = window.setTimeout(() => {
      scrollToY(node.getBoundingClientRect().top + window.scrollY, true);
    }, 80);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* Keyboard, but only while the section actually owns the screen. */
  useEffect(() => {
    if (!inView || !desktop) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      /* Never steal an arrow key from something being typed into, or
         from a control that uses arrows itself. */
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      go(active + (event.key === 'ArrowRight' ? 1 : -1));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [inView, desktop, active, go]);

  /**
   * Trackpad, sideways.
   *
   * A two-finger horizontal swipe produces `deltaX` and no vertical
   * scroll at all, so without this the most natural gesture for a
   * horizontal layout is the one gesture that does nothing. Only claimed
   * when the swipe is more horizontal than vertical — a diagonal scroll
   * stays the page's.
   */
  useEffect(() => {
    const node = viewport.current;
    if (!node || !desktop) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      scrollToY(window.scrollY + event.deltaX, true);
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      node.removeEventListener('wheel', onWheel);
    };
  }, [desktop, viewport]);

  /**
   * DRAG, AND THE BUG THAT MADE EVERY BUTTON IN HERE DEAD.
   *
   * The previous version called `setPointerCapture` on `pointerdown`.
   * Capture retargets both `pointerdown` and `pointerup` to the capturing
   * element, and the browser fires `click` on the nearest common ancestor
   * of those two — which was therefore always this container. Every link
   * and every button inside the portfolio received a `pointerdown` and
   * then nothing: View Project, all eight panels, both arrows and all
   * eight tick marks silently did nothing on desktop, while looking
   * perfectly interactive.
   *
   * So: no capture until the pointer has actually travelled DRAG_SLOP,
   * and when it has, the click that the gesture ends with is swallowed on
   * the way down. A press that does not move stays an ordinary click.
   */
  const drag = useRef<{ x: number; y: number; scroll: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!desktop || event.pointerType === 'touch' || event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, scroll: window.scrollY, moved: false };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (!start.moved) {
      if (Math.abs(dx) < DRAG_SLOP || Math.abs(dx) < Math.abs(event.clientY - start.y)) return;
      start.moved = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    scrollToY(start.scroll - dx, true);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    if (start.moved) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      setDragging(false);
    }
    /* Cleared by the click handler below, which fires after pointerup. */
    drag.current = start.moved ? start : null;
  };

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current?.moved !== true) return;
    drag.current = null;
    event.preventDefault();
    event.stopPropagation();
  };

  if (count === 0) return null;

  return (
    <section
      id="work"
      ref={wrapper}
      aria-label={ui.selectedWork[locale]}
      className="relative desktop:h-[calc(100vh+var(--travel))]"
      style={{ ['--travel' as string]: `${String(travel)}vw` }}
    >
      {/*
        THREE ROWS, NOT THREE ABSOLUTE POSITIONS.

        Masthead, track, controls — a flex column inside the sticky
        viewport. The first version floated the masthead and the controls
        over an absolutely-sized panel, and the arrows landed on top of
        the next project's year. Letting flexbox own the vertical
        distribution means the panel is whatever height is left, and the
        three rows cannot collide at any viewport height.
      */}
      <div
        ref={viewport}
        className={`relative desktop:sticky desktop:top-0 desktop:flex desktop:h-screen desktop:flex-col desktop:overflow-hidden ${
          dragging ? 'desktop:cursor-grabbing desktop:select-none' : ''
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(event) => {
          /* Native image dragging would otherwise start its own gesture
             and leave a ghost thumbnail floating over the page. */
          event.preventDefault();
        }}
      >
        {/*
          §23 — THE WARM FIELD.

          The homepage is one dark surface from the hero to the footer,
          and that is what reads as "monochrome". This is a single
          scroll-linked radial in the studio's own brass — the accent
          that already exists in the token set, and the colour that is
          already in every timber and daylight render on the page. It
          slides across the viewport as the horizontal track travels, so
          the work moves through a warm field rather than across a flat
          black one. One element, one gradient, `opacity` and `x` only.
        */}
        <Motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(200,160,106,0.13),transparent_70%)]"
          style={{ x: washX, opacity: washOpacity }}
        />
        <div className="shrink-0 pt-9 desktop:pb-4 desktop:pt-[5.5rem]">
          <Container>
            <div className="flex items-baseline justify-between gap-5">
              <div className="flex-1">
                <Eyebrow>{ui.selectedWork[locale]}</Eyebrow>
              </div>
              <p className="figures label shrink-0 text-ink-3">
                <span className="text-ink">{ordinal(active)}</span>
                <span aria-hidden="true"> / </span>
                {ordinal(count - 1)}
              </p>
            </div>
          </Container>
        </div>

        <Motion.div
          className="flex flex-col gap-9 px-5 tablet:px-7 desktop:min-h-0 desktop:flex-1 desktop:flex-row desktop:items-stretch desktop:gap-[4vw] desktop:px-[4vw]"
          style={{ x: desktop && reduced !== true ? x : '0vw' }}
        >
          {projects.map((project, index) => (
            <Panel
              key={project.slug}
              project={project}
              locale={locale}
              index={index}
              active={!desktop || index === active}
            />
          ))}
        </Motion.div>

        <Controls count={count} active={active} locale={locale} onGo={go} />
      </div>
    </section>
  );
}

/**
 * The meta column's arrival.
 *
 * Four blocks on a stagger rather than one column changing opacity: a
 * panel that is being travelled TO should assemble itself, because that
 * is what makes arriving somewhere feel different from a slide changing.
 * The dimmed state holds them in place at low opacity — nothing slides
 * back out, because reversing a stagger on scroll-back reads as a
 * flicker.
 */
/**
 * THE PANEL CONTENT STATES.
 *
 * These used to move 0px and 12px, which meant switching project changed
 * an opacity and nothing else — technically a transition, visually a
 * cross-fade. The travel is now large enough to read as the old project
 * LEAVING and the next one ARRIVING: the number and the fact list rise
 * 18px, the name and the sentence rise 34px, and the whole group is
 * staggered by its parent so they arrive in reading order rather than
 * together.
 *
 * `dim` also drops further (0.22 → 0.12) and pushes the inactive panel
 * DOWN rather than leaving it in place, so a half-visible neighbouring
 * panel reads as waiting rather than as a dimmed copy of the live one.
 */
const META: Variants = {
  dim: { opacity: 0.2, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE.expo } },
};

const META_LEAD: Variants = {
  dim: { opacity: 0.2, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE.expo } },
};

/**
 * One project.
 *
 * Meta on the left, the rendering on the right, at a fixed proportion —
 * the same furniture in the same place in every panel, so travelling
 * through eight of them is reading rather than re-orienting.
 *
 * The panel is 76vw so roughly a fifth of the next one shows at the right
 * edge. That sliver is the whole navigational affordance: it says there
 * is more this way without a hint, an arrow or a nudge animation.
 */
function Panel({
  project,
  locale,
  index,
  active,
}: {
  project: Project;
  locale: Locale;
  index: number;
  active: boolean;
}) {
  /* Declared ABOVE the early return — a hook after a conditional
     `return null` is a rules-of-hooks violation and would desync the
     hook order the first time a project shipped with no images. */
  const plate = useMagnetic(0.035, 0);

  const opening = project.images[0];
  if (!opening) return null;

  const facts = [
    { label: ui.type[locale], value: project.type[locale] },
    { label: ui.location[locale], value: project.location[locale] },
    { label: ui.year[locale], value: String(project.year) },
  ];

  return (
    <article className="w-full shrink-0 desktop:h-full desktop:w-[76vw]">
      <CursorLabel label={ui.viewProject[locale]} className="h-full">
        <Link
          href={paths.project(locale, project.slug)}
          className="group flex h-full flex-col gap-6 desktop:flex-row desktop:gap-[3vw]"
        >
          {/* Meta */}
          <Motion.div
            className="order-2 flex flex-col justify-between desktop:order-1 desktop:w-[24%] desktop:py-1"
            variants={stagger(0.09)}
            initial={false}
            animate={active ? 'visible' : 'dim'}
          >
            <div>
              <Motion.span
                aria-hidden="true"
                variants={META}
                className="figures label block text-brass"
              >
                {ordinal(index)}
              </Motion.span>
              <Motion.h3
                variants={META_LEAD}
                className="mt-3 font-display text-statement text-ink"
              >
                {project.name[locale]}
              </Motion.h3>
              <Motion.p
                variants={META_LEAD}
                className="mt-4 max-w-[34ch] font-text text-spec text-ink-2 desktop:mt-5"
              >
                {firstSentence(project.outcome[locale])}
              </Motion.p>
            </div>

            <Motion.div variants={META} className="mt-6 desktop:mt-0">
              <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-4 desktop:block desktop:space-y-2 desktop:border-0 desktop:pt-0">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="desktop:flex desktop:justify-between desktop:gap-4 desktop:border-t desktop:border-line desktop:pt-2"
                  >
                    <dt className="label text-ink-3">{fact.label}</dt>
                    <dd className="figures font-text text-spec text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <span className="mt-5 inline-flex items-center gap-3 font-text text-spec text-ink-2 transition-colors duration-500 ease-expo group-hover:text-ink desktop:mt-6">
                <span className="sweep">{ui.viewProject[locale]}</span>
                <Arrow className="transition-transform duration-500 ease-expo group-hover:translate-x-2" />
              </span>
            </Motion.div>
          </Motion.div>

          {/* The rendering. It gets the rest of the panel — on desktop
              that is roughly three quarters of the width and the full
              height between masthead and controls. */}
          <div className="relative order-1 aspect-[4/5] overflow-hidden bg-sunk tablet:aspect-[3/2] desktop:order-2 desktop:aspect-auto desktop:h-full desktop:min-h-0 desktop:flex-1">
            {/* §17 — THE PHOTOGRAPH ANSWERS THE POINTER.
                `useMagnetic` at 0.035 moves the plate by at most a few
                pixels inside its own frame, which is enough to read as
                the image being alive under the cursor and far too little
                to distort the architecture. It self-disables on coarse
                pointers and under reduced motion, so touch devices and
                the accessibility setting need no branch here. */}
            <Motion.div
              className="absolute inset-0"
              ref={plate.ref as React.RefObject<HTMLDivElement>}
              style={{ x: plate.x, y: plate.y }}
              initial={false}
              /* 0.8, NOT 0.45. The inactive state has to say "waiting",
                 not "empty". These are dark architectural renders on a
                 near-black ground, so at 0.45 a neighbouring panel stops
                 reading as a dimmed photograph and starts reading as a
                 broken image — which is exactly how it was reported. The
                 distinction is carried by the METADATA instead, which
                 can drop much further without looking like a failure. */
              animate={{ scale: active ? 1 : 1.02, opacity: active ? 1 : 0.8 }}
              transition={{ duration: 1.15, ease: EASE.expo }}
            >
              <Fill
                src={crop(project.slug, opening.id, 'landscape')}
                portrait={crop(project.slug, opening.id, 'portrait')}
                alt={opening.alt[locale]}
                sizes="(min-width: 1024px) 58vw, 100vw"
                focal={opening.focal}
                /*
                 * THE TRACK IS TRANSLATED, NOT SCROLLED, so a panel that
                 * is off to the right sits outside the viewport's
                 * `overflow-hidden` and reports an empty intersection —
                 * its lazy image will not fetch until the track has
                 * already begun sliding it in. The first three are
                 * therefore loaded up front (the visible one plus the two
                 * the reader reaches first), and the sliver of the next
                 * panel that is always on screen gives the rest a head
                 * start of roughly one panel before they are centred.
                 */
                priority={index === 0}
                eager={index < 3}
                className="transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.02]"
              />
            </Motion.div>
            {/* Inactive panels sit back a step. Opacity, not a filter:
                `brightness()` forces a new raster on every frame of the
                transition, and there are eight of these. */}
            <Motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-paper"
              initial={false}
              animate={{ opacity: active ? 0 : 0.55 }}
              transition={{ duration: 0.9, ease: EASE.expo }}
            />
          </div>
        </Link>
      </CursorLabel>
    </article>
  );
}

/**
 * The instrument: eight ticks, a pair of arrows, and nothing else.
 *
 * Desktop only, because on mobile the panels are a normal column and the
 * scrollbar already says where you are.
 */
function Controls({
  count,
  active,
  locale,
  onGo,
}: {
  count: number;
  active: number;
  locale: Locale;
  onGo: (index: number) => void;
}) {
  return (
    <div className="hidden shrink-0 pb-7 pt-4 desktop:block">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <ol className="flex items-center gap-2">
            {Array.from({ length: count }, (_, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => {
                    onGo(index);
                  }}
                  aria-label={`${ui.selectedWork[locale]} ${ordinal(index)}`}
                  aria-current={index === active ? 'true' : undefined}
                  /* Pixels, not scale steps: `h-6 w-8` would be 32px and
                     64px on this project's spacing scale, which made the
                     eight ticks a 590px band of hairlines. */
                  className="group flex h-[40px] items-center px-[3px]"
                >
                  <span
                    className={`block h-px w-[26px] transition-colors duration-500 ease-expo ${
                      index === active ? 'bg-brass' : 'bg-line-strong group-hover:bg-ink-3'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>

          <div className="flex items-center gap-2">
            {([-1, 1] as const).map((step) => {
              const disabled = step === -1 ? active === 0 : active === count - 1;
              return (
                <button
                  key={step}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onGo(active + step);
                  }}
                  aria-label={step === -1 ? 'Previous project' : 'Next project'}
                  /* 44px, not `h-11 w-11` — which is 144px here and gave
                     the portfolio two enormous squares in its corner. */
                  className="flex h-[44px] w-[44px] items-center justify-center border border-line text-ink-2 transition-colors duration-300 ease-expo hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                >
                  <Arrow className={step === -1 ? 'w-[20px] rotate-180' : 'w-[20px]'} />
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
