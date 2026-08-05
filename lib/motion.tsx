'use client';

/**
 * LARK STUDIO — MOTION QUARANTINE
 *
 * Framer Motion is imported exactly once in this codebase: here.
 * Every other file imports from `@/lib/motion`, and ESLint fails the
 * build on any direct import elsewhere.
 *
 * The reason is not bundle size. Framer Motion's most-used features —
 * `whileInView`, `layoutId`, `useScroll` — are precisely the
 * behaviours the motion language prohibits. A project with the library
 * installed and unguarded acquires scroll reveals within a year, not
 * through a bad decision but through twelve reasonable ones.
 *
 * THE MOTION BUDGET — twelve behaviours, complete:
 *
 *   1.  Pointer response, 120ms ............... CSS
 *   2.  Focus ring, instant .................... CSS (never animates)
 *   3.  Field focus, 120ms ..................... CSS
 *   4.  Error appearance, instant .............. CSS
 *   5.  Image on decode, 240ms ................. here — imageReveal
 *   6.  Navigation panel, 240/180ms ............ here — panelSurface
 *   7.  Page transition, 300ms ................. here — pageEnter
 *   8.  Section reveal on scroll, 400ms ........ here — sectionReveal
 *   9.  Hero word rise, ≤500ms ................. CSS (StaggerText)
 *   10. Gallery hover zoom, 700ms .............. CSS (RevealImage hoverZoom)
 *   11. Navbar background fade, 240ms .......... CSS + useInView
 *   12. Underline sweep on hover, 200ms ........ CSS
 *
 * No thirteenth behaviour is added without removing one of these.
 *
 * Behaviour 8 is a DELIBERATE, NARROW REVERSAL of a rule this file
 * used to state absolutely: "The reveal is triggered by decode, not
 * by scroll" (still true for every `RevealImage` use site).
 * `sectionReveal` is scroll-triggered, on purpose, via
 * `lib/useInView.ts` — a plain `IntersectionObserver`, not Framer's
 * `useScroll`/`whileInView`. It is opt-in per section (`ScrollReveal`),
 * fires once, and still respects `prefers-reduced-motion` through
 * `MotionConfig` below.
 *
 * RETIRED: a `maskReveal` `clip-path` curtain used to run once on the
 * hero image, decode-gated, 800ms — the one documented exception to
 * the 300ms ceiling. It was removed after Lighthouse identified the
 * hero image as the homepage's Largest Contentful Paint element: a
 * `clip-path` starting fully closed gives the browser zero visible
 * pixels to score until the animation resolves, so LCP simply waited
 * for it. There is no version of "hide most of the image, then reveal
 * it" that doesn't cost LCP time — the two goals were exclusive, and
 * the measured page-speed impact outweighed the effect. See
 * `components/primitives/HeroMedia.tsx`.
 *
 * CONCURRENCY, absolute: at most one Tier 2 or Tier 3 motion runs at
 * any moment. If a page transition is in flight, images arrive
 * resolved rather than fading.
 */

import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from 'framer-motion';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ *
 * Tokens — mirrored from app/globals.css
 * ------------------------------------------------------------------ */

export const DURATION = {
  /** Tier 1 — pointer response. Handled in CSS; here for reference. */
  response: 0.12,
  /** Tier 2 — state. */
  state: 0.24,
  /** Tier 2 exit. Departures run at 0.75x: leaving needs only to get
   *  out of the way, arriving needs to be understood. */
  exit: 0.18,
  /** Tier 3 — passage. The longest thing under the 300ms ceiling. */
  passage: 0.3,
  /** Tier 3-adjacent — scroll-triggered section entrance. */
  reveal: 0.4,
} as const;

export const EASE = {
  /** Decelerating. No overshoot — bounce and elastic are prohibited. */
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
} as const;

/** No element travels more than 16px. Ever. */
export const TRAVEL = { hint: 8 } as const;

/* ------------------------------------------------------------------ *
 * The closed variant set
 * ------------------------------------------------------------------ */

/**
 * Behaviour 5 — image on decode.
 *
 * Triggered by the image's own load event, NOT by scroll position.
 * This distinction is the entire scroll-reveal prohibition:
 *
 *   Permitted  — the image appears when it becomes available.
 *                Two genuine states: unavailable, available.
 *   Prohibited — the image is available, held hidden, and released
 *                when scroll crosses a threshold. One real state,
 *                performing as two.
 *
 * Opacity only. Scale is prohibited on all content: it is the
 * defining gesture of decorative web motion and dates fastest.
 */
export const imageReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.state, ease: EASE.standard },
  },
};

/**
 * Behaviour 6 — navigation panel.
 *
 * A full paper surface arriving over the page, which is why it is
 * exempt from the 16px travel budget: it is not travelling within the
 * page. Nothing behind it dims, blurs or scales.
 */
export const panelSurface: Variants = {
  hidden: { y: '-100%' },
  visible: {
    y: '0%',
    transition: { duration: DURATION.state, ease: EASE.standard },
  },
  exit: {
    y: '-100%',
    transition: { duration: DURATION.exit, ease: EASE.exit },
  },
};

/**
 * Behaviour 7 — page transition.
 *
 * Entry only. App Router does not reliably keep the outgoing page
 * mounted, and the 8px directional hint reads correctly on entry alone.
 *
 * Deliberately NOT a shared-element transition, despite that being the
 * obvious choice: most arrivals are deep links with no origin element,
 * the art-directed portrait crops share no continuous geometry with
 * the landscape frames, and a transition that stutters on a mid-range
 * Android destroys more precision than a perfect one creates.
 */
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: TRAVEL.hint },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.passage, ease: EASE.standard },
  },
};

/**
 * Behaviour 8 — section reveal on scroll.
 *
 * Driven by `lib/useInView.ts`'s boolean the same way `imageReveal` is
 * driven by an `onLoad` boolean: `animate={inView ? 'visible' : 'hidden'}`,
 * not a Framer scroll hook. Opacity + the same 8px travel hint used
 * everywhere else in the system — this is a scroll-gated version of
 * `pageEnter`, not a new gesture.
 *
 * Opt-in via the `ScrollReveal` wrapper. Not applied to `RevealImage`:
 * an image still reveals on its own decode, never on scroll position.
 */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: TRAVEL.hint },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE.standard },
  },
};

/* ------------------------------------------------------------------ *
 * Provider
 * ------------------------------------------------------------------ */

/**
 * `domAnimation` only — roughly 15kb rather than 34kb. We need no
 * layout projection, no drag, no 3D. `reducedMotion="user"` removes
 * all three behaviours above when the visitor asks; nothing is lost,
 * because motion never carries information.
 *
 * Mounted once in the root layout so every `m` component shares it.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/**
 * The animation primitive. `m` rather than `motion`, which is what
 * keeps the bundle at the LazyMotion size — `strict` above makes
 * accidental use of the full `motion` component a runtime error.
 */
export { m as Motion, AnimatePresence };
