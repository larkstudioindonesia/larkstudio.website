'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  EASE,
  Motion,
  SPRING,
  scrollToY,
  setHeaderHeld,
  stagger,
  useInView,
  useMedia,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from '@/lib/motion';
import type { Locale, Project } from '@/content/types';
import { projectPhotographs } from '@/content/projects';
import { ui } from '@/content/site';
import { firstSentence, ordinal, paths } from '@/lib/site';
import { Arrow, Container, CursorLabel, Eyebrow, Print, openLightbox, printAspect } from '@/components/ui';

/**
 * LARK STUDIO — THE HORIZONTAL PORTFOLIO
 *
 * The work is laid out side by side and travelled through horizontally,
 * driven by ordinary vertical scroll — at EVERY size. A phone gets the
 * same interaction as a desktop, with its own proportions.
 *
 * WHY THIS IS THE RIGHT SHAPE FOR THIS CONTENT. A vertical list of eight
 * buildings is a list; you scroll it the way you scroll anything. Laid
 * across, each project gets a whole screen to itself and the next one is
 * always visible at the edge — so the page states how much work there is
 * without a counter having to say it. An earlier revision fell back to a
 * vertical list below 1024px, and on a phone the site stopped feeling
 * like the same site.
 *
 * HOW IT WORKS, AND WHY THERE IS NO GSAP. The section is a tall spacer
 * with a `sticky` viewport inside it; as the spacer passes, the scroll
 * position maps to a horizontal translate on the track. That is what
 * ScrollTrigger's pin + scrub does, and a second animation runtime would
 * mean a second source of truth for scroll next to Lenis.
 *
 * ONE RIG, RESPONSIVE PARAMETERS. Every length is a custom property in
 * `work-rig` (globals.css), so the spacer is the right height in the
 * first painted frame:
 *
 *     travel = (n − 1) · (panel + gap)     panel i centred at stop i
 *     span   = (n − 1) · step              vertical scroll per journey
 *     height = 100svh + span
 *
 *   desktop  panel = text column + 3:2 frame; step = pitch, so one
 *            vertical pixel moves the track one horizontal pixel
 *   compact  panel = the screen less a margin, frame above caption;
 *            step = 70svh, so a flick on glass moves one project, not
 *            three — and each stop is a scroll-snap point
 *
 * PROGRESS IS COMPUTED FROM TWO LENGTHS THAT NEVER MOVE. Framer's
 * element progress divides by the LIVE viewport height, which on a phone
 * changes as the toolbar collapses — so the same scroll position meant a
 * different progress before and after the bar hid, and a snapped panel
 * came to rest 30–50px off centre. Here progress is
 * `(scrollY − top) / span`: the section's top and the span (in `svh`)
 * are measured once and on resize, never per frame, and a snap point at
 * `top + i · step` is exactly stop `i`, whatever the toolbar is doing.
 *
 * EVERY WAY IN. Vertical wheel, trackpad and touch scroll (native),
 * horizontal trackpad, a horizontal swipe on glass, mouse drag, arrow
 * keys, the tick marks / progress rail, and the two arrow buttons. All of
 * them move the PAGE. The track is a pure function of scroll position, so
 * moving it directly would desynchronise the two the moment the gesture
 * ended. Vertical touch scrolling is never intercepted: the browser owns
 * it, and a swipe is only claimed when it is clearly sideways.
 */

/** Movement past which a pointer gesture is a drag rather than a click. */
const DRAG_SLOP = 6; // px
/** A touch that travels this far, mostly sideways, is a swipe. */
const SWIPE = 48; // px

export function Portfolio({
  projects,
  locale,
}: {
  projects: readonly Project[];
  locale: Locale;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const desktop = useMedia('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const count = projects.length;

  /* THE MEASUREMENT: the section's document top and its scroll span.
     Taken on mount and on resize — both are layout facts that do not
     change while scrolling. */
  const geometry = useRef({ top: 0, span: 1 });
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);

  const sync = useCallback(() => {
    const { top, span } = geometry.current;
    const value = Math.min(1, Math.max(0, (scrollY.get() - top) / span));
    progress.set(value);
  }, [progress, scrollY]);

  const measure = useCallback(() => {
    const node = wrapper.current;
    const marker = end.current;
    if (!node || !marker) return;
    /* The LAYOUT position, from the offset chain — not
       `getBoundingClientRect`, which includes transforms. The page's
       arrival animation translates everything by up to 28px while it
       plays, and a measurement taken during it parked every stop that
       many pixels (scaled to the track) off centre for the whole visit. */
    let top = 0;
    for (let el: HTMLElement | null = node; el; el = el.offsetParent as HTMLElement | null) {
      top += el.offsetTop;
    }
    geometry.current = { top, span: Math.max(1, marker.offsetTop) };
    sync();
  }, [sync]);

  useEffect(() => {
    measure();
    /* The BODY as well as the section: the section's top moves whenever
       anything above it changes height — the hero settling after its
       fonts and images, a late reveal — and its own size does not change
       when that happens. Watching only the section left every stop 3–5px
       off centre on a page whose hero grew after mount. */
    const observer = new ResizeObserver(measure);
    if (wrapper.current) observer.observe(wrapper.current);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useMotionValueEvent(scrollY, 'change', sync);

  const smooth = useSpring(progress, SPRING.track);
  /* The travel is a CSS length the browser resolves, so the translate is
     written in terms of it rather than in pixels. Under reduced motion the
     track follows the scroll directly — it is still the reader moving it,
     just without the eased lag. */
  const x = useTransform(reduced === true ? progress : smooth, (p) =>
    `calc(var(--work-travel) * ${(-p).toFixed(5)})`,
  );
  const washX = useTransform(smooth, [0, 1], ['-18%', '18%']);
  const washOpacity = useTransform(smooth, [0, 0.5, 1], [0.55, 1, 0.55]);

  /* The active panel, and whether the section owns the screen. Only a
     change of index renders — scrolling within a panel costs nothing. */
  useMotionValueEvent(progress, 'change', (value) => {
    const index = Math.round(value * (count - 1));
    setActive((current) => (current === index ? current : index));
    /* On a phone the site header would sit over the showcase's own
       masthead; it stays out of the way while the section is pinned and
       comes back the moment the reader leaves it. */
    setHeaderHeld(!desktop && value > 0.0005 && value < 0.9995);
  });
  useEffect(
    () => () => {
      setHeaderHeld(false);
    },
    [],
  );

  const go = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(count - 1, index));
      measure();
      const { top, span } = geometry.current;
      scrollToY(top + (target / Math.max(1, count - 1)) * span);
    },
    [count, measure],
  );

  /* Latest values for listeners that are attached once. */
  const live = useRef({ active, go });
  live.current = { active, go };

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
    if (!inView) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      /* Never steal an arrow key from something being typed into, or
         from a control that uses arrows itself. */
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable]')) return;
      /* A dialog (the lightbox, the announcement) owns the arrow keys
         while it is open. */
      if (document.querySelector('[role="dialog"]')) return;
      event.preventDefault();
      live.current.go(live.current.active + (event.key === 'ArrowRight' ? 1 : -1));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [inView]);

  /**
   * Trackpad sideways, and a sideways swipe on glass.
   *
   * A two-finger horizontal swipe produces `deltaX` and no vertical
   * scroll, so without this the most natural gesture for a horizontal
   * layout would do nothing. Only claimed when it is more horizontal than
   * vertical. On touch, `touch-action: pan-y` hands vertical panning to
   * the browser untouched and leaves the sideways gesture to us; a swipe
   * steps one project, and a mostly-vertical drag is never interpreted.
   */
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      scrollToY(window.scrollY + event.deltaX, true);
    };
    let from: { x: number; y: number } | null = null;
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      from = touch && event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!from || !touch) return;
      const dx = touch.clientX - from.x;
      const dy = touch.clientY - from.y;
      from = null;
      if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      const step = dx < 0 ? 1 : -1;
      /* Next frame, not now: Lenis handles the same `touchend` on the
         window after this element has, and stops any scroll animation
         in flight — so a step started here was cancelled before it ran. */
      requestAnimationFrame(() => {
        live.current.go(live.current.active + step);
      });
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchend', onTouchEnd);
    };
  }, [viewport]);

  /**
   * DRAG, AND THE BUG THAT MADE EVERY BUTTON IN HERE DEAD.
   *
   * An earlier version called `setPointerCapture` on `pointerdown`.
   * Capture retargets both `pointerdown` and `pointerup` to the capturing
   * element, and the browser fires `click` on the nearest common ancestor
   * of those two — which was therefore always this container, and every
   * link and button inside the portfolio silently did nothing.
   *
   * So: no capture until the pointer has actually travelled DRAG_SLOP,
   * and when it has, the click that the gesture ends with is swallowed on
   * the way down. Mouse and pen only — touch is the browser's.
   */
  const drag = useRef<{ x: number; y: number; scroll: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
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
    /* Drag distance is horizontal; the page distance it corresponds to
       is scaled by the rig's step-to-pitch ratio so the track stays under
       the pointer on every breakpoint. */
    const { span } = geometry.current;
    const track = end.current?.parentElement?.querySelector<HTMLElement>('[data-track]');
    const travel = track ? track.scrollWidth - window.innerWidth : span;
    scrollToY(start.scroll - dx * (span / Math.max(1, travel)), true);
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
      className="work-rig relative h-[var(--work-length)]"
      style={{ ['--work-count' as string]: count }}
    >
      {/*
        THE STOPS. One zero-size marker per intermediate project, at
        exactly the scroll position that centres it. On touch screens
        below 1024px they are `scroll-snap` points (proximity, so a slow
        drag is never fought), which is what makes every project come to
        rest dead centre instead of wherever the flick happened to end.
        The first and last need no marker — progress clamps there — so
        entering and leaving the section never feels sticky. The 6rem is
        the document's `scroll-padding-top`, which snap alignment honours.
      */}
      {projects.slice(1, -1).map((project, i) => (
        <div
          key={project.slug}
          aria-hidden="true"
          className="work-snap pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `calc(${String(i + 1)} * var(--work-step) + 6rem)` }}
        />
      ))}
      {/* The end of the journey. Its offset IS the span. */}
      <div
        ref={end}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[var(--work-span)] h-0 w-0"
      />

      {/*
        THREE ROWS WITH STATED HEIGHTS, NOT THREE ABSOLUTE POSITIONS.
        Masthead, stage, controls — each a height from the rig, so the
        stage is exactly the space left between the other two and nothing
        can collide at any viewport height.
      */}
      <div
        ref={viewport}
        className={`sticky top-0 flex h-[100svh] touch-pan-y flex-col overflow-hidden ${
          dragging ? 'cursor-grabbing select-none' : ''
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
          §23 — THE WARM FIELD. A scroll-linked radial in the studio's
          brass, travelling against the track so the work moves through a
          warm field rather than across a flat black one. Desktop only:
          on a phone the panel fills the screen and there is no field left
          to see.
        */}
        <Motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden bg-[radial-gradient(70%_60%_at_50%_45%,rgba(200,160,106,0.13),transparent_70%)] desktop:block"
          style={{ x: washX, opacity: washOpacity }}
        />

        <div className="relative flex h-[var(--work-head)] shrink-0 items-end pb-3 desktop:pb-5">
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

        <div className="relative flex h-[var(--work-stage)] shrink-0 items-center">
          <Motion.div
            data-track=""
            className="flex w-max flex-row items-center gap-[var(--work-gap)] px-[var(--work-edge)]"
            style={{ x }}
          >
            {projects.map((project, index) => (
              <Panel
                key={project.slug}
                project={project}
                locale={locale}
                index={index}
                desktop={desktop}
                active={index === active}
              />
            ))}
          </Motion.div>

          {/*
            THE EDGES. The neighbouring panels show at both sides — that
            sliver is the navigational affordance — but a line of type cut
            dead by the edge of the screen reads as a layout error. So the
            edges dissolve, across the margin, over the neighbours only.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[var(--work-side)] bg-gradient-to-r from-paper to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[var(--work-side)] bg-gradient-to-l from-paper to-transparent"
          />
        </div>

        <Controls count={count} active={active} progress={smooth} locale={locale} onGo={go} />
      </div>
    </section>
  );
}

/**
 * THE PANEL CONTENT STATES.
 *
 *   dim      a neighbour: held low and pushed down, so a half-visible
 *            panel reads as waiting rather than as a dimmed copy
 *   visible  the current panel
 *
 * The travel is large enough to read as the old project LEAVING and the
 * next one ARRIVING, and the group is staggered by its parent so it
 * arrives in reading order.
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
 * THE SPREAD — a project's photographs laid out as prints on a table.
 *
 * Every project carries five photographs, and every one of them is shown
 * WHOLE, at its own 3:2 ratio, in an off-white print border. The spread is
 * an art-directed box of a fixed ratio; the prints are placed inside it in
 * percentages, so the whole arrangement scales DOWN as one to fit the space
 * it is given, and no photograph is ever enlarged or cropped to fill a
 * rectangle.
 *
 * Two arrangements, chosen by the shape of the space (a container query,
 * `frame-tall`), not by the device:
 *
 *   WIDE (3:2 box — desktop, and any wide space)
 *     the lead print large at left, four more around it — overlapping at
 *     the corners, stepped down the page, each turned a degree or two
 *
 *   TALL (9:10 box — a phone or tablet column above the caption)
 *     the lead print across the top, two beneath it, overlapping its lower
 *     edge; the other two are in the lightbox, one tap away
 *
 * Overlaps are held to a corner or an edge strip: every print stays
 * readable as a photograph. Rotations alternate by project so eight
 * spreads side by side do not repeat one gesture.
 *
 * Outer print height as a share of the box, for a 3:2 photograph:
 * `w × box / 1.4535` — 1.03w in the wide box, 0.62w in the tall one.
 * The positions below were set with that arithmetic and checked by eye.
 */
type Slot = {
  /** Left, top, width — % of the spread box. */
  wide: readonly [number, number, number] | null;
  tall: readonly [number, number, number] | null;
  rotate: number;
  z: number;
  /** Display width hint, desktop and compact. */
  sizes: string;
};

const SLOTS: readonly Slot[] = [
  { wide: [2, 17, 54], tall: [3, 3, 94], rotate: -1.1, z: 3, sizes: '(min-width: 1024px) 34vw, 94vw' },
  { wide: [50, 3, 33], tall: [2, 57, 50], rotate: 1.3, z: 2, sizes: '(min-width: 1024px) 21vw, 50vw' },
  { wide: [60, 39, 37], tall: [48, 63, 50], rotate: -0.7, z: 4, sizes: '(min-width: 1024px) 23vw, 50vw' },
  { wide: [33, 68, 27], tall: null, rotate: 1.6, z: 5, sizes: '(min-width: 1024px) 17vw, 30vw' },
  { wide: [5, 75, 22], tall: null, rotate: -1.8, z: 1, sizes: '(min-width: 1024px) 14vw, 25vw' },
];

function Spread({
  project,
  locale,
  index,
  desktop,
  active,
}: {
  project: Project;
  locale: Locale;
  index: number;
  desktop: boolean;
  active: boolean;
}) {
  const photos = projectPhotographs(project);
  const mirror = index % 2 === 0 ? 1 : -1;
  /* A panel translated off to the right reports an empty intersection,
     so its lazy images would not start until it was already sliding in.
     The first few are loaded up front. */
  const eager = index < (desktop ? 3 : 2);

  return (
    <div className="relative aspect-[3/2] w-[min(100cqw,150cqh)] frame-tall:aspect-[9/10] frame-tall:w-[min(100cqw,90cqh)] desktop:col-[2] desktop:row-[1] desktop:aspect-auto desktop:h-full desktop:w-full">
      {SLOTS.map((slot, i) => {
        const photo = photos[i];
        if (!photo) return null;
        /* The slots were drawn for 3:2 photographs. A taller one (a 5:4
           interior, say) is lifted until its foot clears the box — it
           keeps its own shape and its slot's width, and moves rather than
           being cropped to fit. `box` is the spread's width ÷ height. */
        const place = (
          at: readonly [number, number, number] | null,
          prefix: string,
          box: number,
        ) => {
          if (!at) return {};
          const height = (at[2] * box) / printAspect(photo);
          const top = Math.max(1, Math.min(at[1], 98 - height));
          return {
            [`--${prefix}x`]: `${String(at[0])}%`,
            [`--${prefix}y`]: `${String(top)}%`,
            [`--${prefix}w`]: `${String(at[2])}%`,
          };
        };
        return (
          <Print
            key={photo.src}
            photo={photo}
            locale={locale}
            sizes={slot.sizes}
            eager={eager}
            rotate={slot.rotate * mirror}
            onOpen={(origin) => {
              openLightbox({ photos, index: i, origin, locale });
            }}
            className={`absolute left-[var(--wx)] top-[var(--wy)] w-[var(--ww)] ${
              slot.wide ? '' : 'hidden'
            } ${
              slot.tall
                ? 'frame-tall:left-[var(--tx)] frame-tall:top-[var(--ty)] frame-tall:w-[var(--tw)]'
                : 'frame-tall:hidden'
            }`}
            style={{ ...place(slot.wide, 'w', 1.5), ...place(slot.tall, 't', 0.9), zIndex: slot.z } as CSSProperties}
          />
        );
      })}
      {/* Neighbours sit back a step. One layer over the whole spread —
          opacity only — and it never catches a click. */}
      <Motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[3%] z-10 bg-paper"
        initial={false}
        animate={{ opacity: active ? 0 : 0.55 }}
        transition={{ duration: 0.9, ease: EASE.expo }}
      />
    </div>
  );
}

/**
 * One project.
 *
 * DESKTOP: text column left, the spread right in a 3:2 box sized to the
 * stage, facts on the column's baseline (or on a hairline under the
 * spread in the laptop composition).
 *
 * COMPACT (below 1024px): the spread on top, taking every pixel the
 * caption leaves — a size container, so the arrangement fits whole at the
 * largest scale the space allows — then name, sentence, facts, the way in.
 *
 * The panel is no longer one big link: the prints open the lightbox, and
 * the name and "View" go to the project.
 */
function Panel({
  project,
  locale,
  index,
  desktop,
  active,
}: {
  project: Project;
  locale: Locale;
  index: number;
  desktop: boolean;
  active: boolean;
}) {
  const facts = [
    { label: ui.type[locale], value: project.type[locale] },
    { label: ui.location[locale], value: project.location[locale] },
    { label: ui.year[locale], value: String(project.year) },
  ];
  const href = paths.project(locale, project.slug);

  return (
    <article className="h-[var(--work-stage)] w-[var(--work-panel)] shrink-0 desktop:h-[var(--work-height)]">
      <div
        /* Compact: a column, spread over caption. Desktop: a two-by-two
           grid — text column | spread, over nothing | facts row. */
        className="group flex h-full flex-col gap-4 tablet:gap-6 desktop:grid desktop:grid-cols-[var(--work-meta)_var(--work-image)] desktop:grid-rows-[var(--work-image-h)_var(--work-facts)] desktop:gap-x-[var(--work-inner)] desktop:gap-y-0"
      >
        {/* Caption. It animates nothing itself; it only orchestrates.
            On desktop it runs the height of the spread, or dissolves
            (`contents`) in the laptop composition so the facts can take
            the row under it. */}
        <Motion.div
          className="order-2 grid shrink-0 grid-cols-1 gap-y-4 tablet:grid-cols-8 tablet:gap-x-6 desktop:contents roomy:col-[1] roomy:row-[1/span_2] roomy:flex roomy:flex-col roomy:justify-between roomy:gap-y-5"
          variants={stagger(0.09)}
          initial={false}
          animate={active ? 'visible' : 'dim'}
        >
          <div className="tablet:col-span-5 desktop:col-[1] desktop:row-[1/span_2] roomy:flex-1">
            <Motion.span
              aria-hidden="true"
              variants={META}
              className="figures label block text-brass"
            >
              {ordinal(index)}
            </Motion.span>
            <Motion.h3
              variants={META_LEAD}
              className="mt-2 font-display text-title font-medium text-ink desktop:mt-3 desktop:text-work"
            >
              <CursorLabel label={ui.viewProject[locale]} className="inline">
                <Link href={href} className="transition-colors duration-300 ease-expo hover:text-ink-2">
                  {project.name[locale]}
                </Link>
              </CursorLabel>
            </Motion.h3>
            {/* The sentence, when the project has a write-up. Without
                one the caption is name and facts — nothing stands in. */}
            {project.outcome && (
              <Motion.p
                variants={META_LEAD}
                /* 13px only on a SHORT phone (≤700px tall), where the
                   spread would otherwise be squeezed; the full sentence
                   is always shown, never truncated. */
                className="mt-2 max-w-[38ch] font-text text-spec text-ink-2 short:text-caption tablet:mt-3 desktop:mt-4"
              >
                {firstSentence(project.outcome[locale])}
              </Motion.p>
            )}
          </div>

          {/* Facts: a row on a phone, a column on a tablet, a row under
              the spread in the laptop composition, a column on the
              baseline of the text on a roomy desktop. */}
          <Motion.div
            variants={META}
            className="flex items-end justify-between gap-5 tablet:col-span-3 tablet:block desktop:col-[2] desktop:row-[2] desktop:flex desktop:items-end desktop:gap-8 desktop:pr-[7rem] desktop:pt-4 roomy:block roomy:pr-0 roomy:pt-0"
          >
            <dl className="grid flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto] gap-x-4 border-t border-line pt-3 tablet:block tablet:space-y-2 tablet:border-0 tablet:pt-0 desktop:grid desktop:flex-1 desktop:space-y-0 desktop:border-t desktop:pt-3 roomy:block roomy:space-y-2 roomy:border-0 roomy:pt-0">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="tablet:flex tablet:items-baseline tablet:justify-between tablet:gap-4 tablet:border-t tablet:border-line tablet:pt-2 desktop:block desktop:border-0 desktop:pt-0 roomy:flex roomy:border-t roomy:pt-2"
                >
                  <dt className="label text-ink-3">{fact.label}</dt>
                  <dd className="figures mt-1 font-text text-spec text-ink short:text-caption tablet:mt-0 tablet:text-right desktop:mt-1 desktop:text-left roomy:mt-0 roomy:text-right">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Motion.div>

          {/* The way in. Its own row everywhere except the laptop
              composition, where it closes the facts row. */}
          <Motion.span
            variants={META}
            className="-mt-1 self-start tablet:col-span-8 tablet:mt-0 desktop:col-[2] desktop:row-[2] desktop:mb-[2px] desktop:self-end desktop:justify-self-end roomy:mb-0 roomy:mt-3 roomy:self-start"
          >
            <CursorLabel label={ui.viewProject[locale]} className="inline-block">
              <Link
                href={href}
                className="group/view inline-flex min-h-[40px] items-center gap-3 font-text text-spec text-ink-2 transition-colors duration-500 ease-expo hover:text-ink desktop:min-h-0 roomy:min-h-[44px]"
              >
                <span className="sweep">{ui.viewProject[locale]}</span>
                <Arrow className="transition-transform duration-500 ease-expo group-hover/view:translate-x-2" />
              </Link>
            </CursorLabel>
          </Motion.span>
        </Motion.div>

        {/* The spread's space: every pixel the caption leaves, as a size
            container, so the arrangement inside fits whole at the largest
            scale available. On desktop it dissolves and the spread is a
            grid cell. */}
        <div className="relative order-1 flex min-h-0 flex-1 items-center justify-center [container:work-frame/size] desktop:contents">
          <Spread project={project} locale={locale} index={index} desktop={desktop} active={active} />
        </div>
      </div>
    </article>
  );
}

/**
 * The instrument: the stops, a pair of arrows, and nothing else.
 *
 * From 640px, eight ticks. On a phone eight ticks and two 44px arrows do
 * not fit beside each other at 320px, so the ticks become one hairline
 * rail whose brass fill is the scroll progress — a motion value, so it
 * moves without rendering anything.
 */
function Controls({
  count,
  active,
  progress,
  locale,
  onGo,
}: {
  count: number;
  active: number;
  progress: ReturnType<typeof useSpring>;
  locale: Locale;
  onGo: (index: number) => void;
}) {
  const fill = useTransform(progress, (p) => (1 + p * (count - 1)) / count);
  return (
    <div className="relative flex h-[var(--work-foot)] shrink-0 items-center">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <ol className="hidden items-center gap-2 tablet:flex">
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
                     64px on this project's spacing scale. */
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

          <div aria-hidden="true" className="relative h-px flex-1 bg-line-strong tablet:hidden">
            <Motion.span
              className="absolute inset-y-0 left-0 w-full origin-left bg-brass"
              style={{ scaleX: fill }}
            />
          </div>

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
                  /* 44px, not `h-11 w-11` — which is 144px here. */
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
