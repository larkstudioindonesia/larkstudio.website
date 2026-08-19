'use client';

/**
 * LARK STUDIO — MOTION
 *
 * Framer Motion is imported exactly once in this codebase: here. Every
 * other file imports from `@/lib/motion`, and ESLint fails the build on
 * a direct import anywhere else. One import site, one set of curves,
 * one variant library, one place to look when something feels wrong.
 *
 * This file also owns every piece of shared browser state — scroll,
 * pointer, intersection, focus, the scroll lock. The rule it exists to
 * enforce: ONE LISTENER PER CONCERN, FOR THE WHOLE DOCUMENT. Twelve
 * components each attaching a `pointermove` handler is how a site that
 * animates well on a laptop stops animating well on a phone, and it is
 * invisible in review because each addition looks reasonable alone.
 *
 * THE PERFORMANCE CONTRACT
 *
 * Every variant here animates `opacity`, `transform`, `clip-path` or
 * `filter` — compositor properties. Nothing in this file can shift the
 * page, which is what makes it safe to have this much motion on a site
 * with a CLS budget of zero.
 *
 * WHAT REMAINS PROHIBITED
 *
 *   layout / layoutId   Layout projection measures the DOM every frame
 *                       and is the one Framer feature that can move a
 *                       box without a transform.
 *   Bounce / elastic    Overshoot reads as playful. Springs are used
 *                       critically damped, for pointer following only.
 *   Scale on content    Photographs zoom under a pointer, at 1.04, and
 *                       nowhere else. Text never scales.
 */

import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  motionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Transition,
  type Variants,
} from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react';
import Lenis from 'lenis';

/* ================================================================== *
 * TOKENS — mirrored from app/globals.css
 * ================================================================== */

/** Two durations, because only two are ever asked for by name. Everything
 *  else states its own, at the point where the timing is the design. */
const DUR = {
  /** A section arriving on scroll. */
  reveal: 0.9,
  /** The cinematic register: hero curtain, page wipe. */
  cinematic: 1.2,
} as const;

/**
 * `expo` does most of the work here. A near-instant start followed by a
 * long settle is the difference between motion that feels engineered
 * and motion that feels linear. `quart` is the symmetrical one, for
 * things that loop.
 */
export const EASE = {
  expo: [0.16, 1, 0.3, 1],
  quart: [0.76, 0, 0.24, 1],
} as const;

/** Critically damped — approaches its target and stops. */
export const SPRING = {
  /** Cursor and magnetic pull. Fast enough to feel attached. */
  pointer: { stiffness: 420, damping: 38, mass: 0.6 },
  /** Scroll smoothing. Slower, so parallax lags the page. */
  scroll: { stiffness: 110, damping: 28, mass: 0.5 },
  /** The progress rail and other long travels. */
  rail: { stiffness: 90, damping: 30, mass: 0.4 },
  /** The horizontal portfolio track. Heavier than anything else here:
   *  a whole screen of work is moving, and it should read as weight. */
  track: { stiffness: 120, damping: 34, mass: 0.9 },
} as const satisfies Record<string, Transition>;

/* ================================================================== *
 * VARIANTS
 * ================================================================== */

const reveal = (duration: number = DUR.reveal, delay = 0): Transition => ({
  duration,
  ease: EASE.expo,
  delay,
});

/** The house entrance. Everything with no reason to be special. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: reveal() },
};

/**
 * A line of type rising from behind its own top edge. The mask is the
 * parent's `overflow: hidden` (the `mask` utility); this animates the
 * child. `110%` rather than `100%` so descenders clear the edge.
 */
export const maskUp: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: reveal(1) },
};

/** The curtain. `clip-path` inset, so pixels never change size — only
 *  how much of the frame is visible. Reserved for full-bleed media. */
export const curtainUp: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: reveal(DUR.cinematic),
  },
};

/** Horizontal wipe. Same mechanism, different axis, so the two never
 *  appear on one screen. */
export const wipeRight: Variants = {
  hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: reveal(1.15),
  },
};

/** Navigation panel: a full surface drawn down over the page. */
export const panel: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: reveal(0.8) },
  exit: {
    clipPath: 'inset(0% 0% 100% 0%)',
    transition: { duration: 0.55, ease: EASE.quart },
  },
};

/**
 * Parent for a staggered group whose animated elements are its DIRECT
 * children. `SplitText` deliberately does not use this — see its
 * docblock for why an explicit per-index delay is preferred there.
 */
export const stagger = (each = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren } },
});

/* ================================================================== *
 * INTERSECTION
 * ================================================================== */

/**
 * Plain `IntersectionObserver`, returning a boolean the caller drives
 * `animate={inView ? … : …}` with.
 *
 * `threshold: 0` is the default on purpose. A percentage threshold is
 * relative to the TARGET's height, so on a target several viewports
 * tall — the homepage stacks eight full-bleed frames — a short viewport
 * can physically never cross `0.2`, and the section stays invisible
 * forever. This was a real bug.
 */
export function useInView<T extends Element>({
  threshold = 0,
  rootMargin = '0px 0px -12% 0px',
  once = true,
  initial = false,
}: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  initial?: boolean;
} = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);

    /**
     * THE FAILSAFE, and the reason it is not optional.
     *
     * Everything this drives starts at `opacity: 0`. That is fine while
     * the mechanism works and catastrophic if it does not: the failure
     * mode of a scroll reveal is not a missing animation, it is a blank
     * page with the copy still in the DOM. The timer is gated on
     * visibility because a backgrounded tab delivers no intersection
     * callbacks at all.
     */
    let timer = 0;
    const arm = () => {
      if (document.hidden) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setInView(true);
        observer.disconnect();
      }, 3000);
    };
    arm();
    document.addEventListener('visibilitychange', arm);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', arm);
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView } as const;
}

/* ================================================================== *
 * SCROLL
 * ================================================================== */

/**
 * Vertical parallax for an element, driven by its own pass through the
 * viewport. `distance` is total travel: 80 means 40px low on entry and
 * 40px high on exit. The container must already own that slack or the
 * translate will expose the surface behind it.
 *
 * The spring is what makes this read as expensive rather than
 * mechanical: a raw scroll-linked transform is exactly correct at every
 * scroll position and therefore feels welded to the scrollbar.
 */
export function useParallax(
  target: RefObject<HTMLElement | null>,
  distance = 80,
): MotionValue<number> {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end start'],
  });
  const travel = reduced === true ? 0 : distance;
  return useSpring(
    useTransform(scrollYProgress, [0, 1], [travel / 2, -travel / 2]),
    SPRING.scroll,
  );
}

type Edge = 'start' | 'end' | 'center' | `${number}%`;
/** e.g. `'start 90%'` — the target's start edge against 90% of the viewport. */
export type ScrollOffset = `${Edge} ${Edge}`;

/** Progress of an element through the viewport, 0 → 1, unsprung. */
export function useProgress(
  target: RefObject<HTMLElement | null>,
  offset: [ScrollOffset, ScrollOffset] = ['start end', 'end start'],
) {
  return useScroll({ target, offset }).scrollYProgress;
}

/** True once the document has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);
  return scrolled;
}

/**
 * Scroll direction, in a form a component can animate on. `up` while at
 * the very top so the header never hides over the hero.
 */
export function useScrollDirection(): 'up' | 'down' {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - previous) > 8) {
        setDirection(y > previous && y > 120 ? 'down' : 'up');
        previous = y;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return direction;
}

/* ================================================================== *
 * POINTER
 * ================================================================== */

/**
 * THE ONE POINTER LISTENER ON THE SITE.
 *
 * Module-level motion values with a ref-counted listener, rather than a
 * hook that attaches its own. The depth stages, the cursor and the
 * discipline preview all want the pointer; before this, each `usePointer`
 * call installed another global `pointermove` handler, and the cost of
 * that is invisible on a laptop and obvious on a phone.
 *
 * `active` is a motion value, not React state, so moving the mouse never
 * renders a component.
 */
const pointer = {
  x: motionValue(0),
  y: motionValue(0),
  /** 0 or 1 — whether the pointer is currently over the document. */
  active: motionValue(0),
};

let pointerRefs = 0;
let detachPointer: (() => void) | null = null;

function attachPointer() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const onMove = (event: PointerEvent) => {
    pointer.x.set(event.clientX);
    pointer.y.set(event.clientY);
    pointer.active.set(1);
  };
  const onLeave = () => {
    pointer.active.set(0);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  detachPointer = () => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
  };
}

function usePointerSource() {
  useEffect(() => {
    pointerRefs += 1;
    if (pointerRefs === 1) attachPointer();
    return () => {
      pointerRefs -= 1;
      if (pointerRefs === 0 && detachPointer) {
        detachPointer();
        detachPointer = null;
      }
    };
  }, []);
  return pointer;
}

/** Viewport pointer position. Shares the single document listener. */
export function usePointer() {
  const source = usePointerSource();
  const [active, setActive] = useState(false);
  useMotionValueEvent(source.active, 'change', (value) => {
    setActive(value === 1);
  });
  return { x: source.x, y: source.y, active } as const;
}

/**
 * Magnetic pull toward the pointer. Returns a ref plus two motion values
 * for the element's transform.
 *
 * Listeners are attached to the element's own catchment, NOT the
 * document — a magnetic button that costs a global handler is not worth
 * having, and with several on a page the cost compounds. Fine pointers
 * only: on touch there is no hover state for this to belong to, and
 * running it would make the first tap feel like a miss.
 */
export function useMagnetic(strength = 0.3, padding = 28) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING.pointer);
  const y = useSpring(rawY, SPRING.pointer);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced === true) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const inside =
        Math.abs(event.clientX - cx) < box.width / 2 + padding &&
        Math.abs(event.clientY - cy) < box.height / 2 + padding;
      rawX.set(inside ? (event.clientX - cx) * strength : 0);
      rawY.set(inside ? (event.clientY - cy) * strength : 0);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    /* `pointermove` on the element only fires inside its box, so the
       padded catchment needs the parent. */
    const catchment = node.parentElement ?? node;
    catchment.addEventListener('pointermove', onMove);
    catchment.addEventListener('pointerleave', onLeave);
    return () => {
      catchment.removeEventListener('pointermove', onMove);
      catchment.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, strength, padding, rawX, rawY]);

  return { ref, x, y } as const;
}

/**
 * THE CURSOR LABEL CHANNEL.
 *
 * A module-level store rather than context, so a project tile can say
 * what the cursor should read while it is hovered without a provider
 * wrapping the tree and without re-rendering anything except the cursor.
 */
let cursorLabel: string | null = null;
const cursorListeners = new Set<() => void>();

export function setCursorLabel(label: string | null): void {
  if (cursorLabel === label) return;
  cursorLabel = label;
  for (const listener of cursorListeners) listener();
}

export function useCursorLabel(): string | null {
  return useSyncExternalStore(
    (listener) => {
      cursorListeners.add(listener);
      return () => cursorListeners.delete(listener);
    },
    () => cursorLabel,
    () => null,
  );
}

/* ================================================================== *
 * REVEAL SCALE
 * ================================================================== */

/**
 * The settle: a photograph arrives very slightly over-size and comes to
 * rest.
 *
 * This replaces the perspective rig that was here before — stages,
 * planes, pointer tilt, per-frame banking. That system produced real
 * depth and the wrong impression: rotated frames and tilted cards read
 * as an experiment about the web rather than as a studio presenting
 * buildings. An architectural photograph should be shown square, at
 * size, and allowed to breathe.
 *
 * What survives is the part that was actually doing the work: a slow
 * settle on arrival, and vertical parallax. Both keep the page alive
 * without ever putting the architecture on an angle.
 */
/* The arrival over-size. At 1.06 every plate spent its first 1.6s
 * showing 94% of the frame; at 1.02 the settle still reads as movement
 * and the composition stays effectively intact throughout. */
export const SETTLE = 1.02;

/* ================================================================== *
 * DOCUMENT
 * ================================================================== */

/**
 * Locks body scroll, and tells Lenis to stop as well — `overflow:
 * hidden` alone does not stop a smooth-scroll library driving
 * `scrollTop` itself. The scrollbar's width is replaced as padding so
 * locking does not shift the layout sideways.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement: root } = document;
    const overflow = body.style.overflow;
    const padding = body.style.paddingRight;
    const gutter = window.innerWidth - root.clientWidth;

    body.style.overflow = 'hidden';
    if (gutter > 0) body.style.paddingRight = `${String(gutter)}px`;
    root.classList.add('lenis-stopped');

    return () => {
      body.style.overflow = overflow;
      body.style.paddingRight = padding;
      root.classList.remove('lenis-stopped');
    };
  }, [locked]);
}

/** Traps Tab within a container, restoring focus on release. Escape is
 *  the caller's business — this owns focus, not dismissal. */
export function useFocusTrap(
  container: RefObject<HTMLElement | null>,
  active: boolean,
): void {
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const node = container.current;
      if (!node) return;
      const focusable = node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, [container, active]);
}

/** Fires `onEscape` while active. Split from the focus trap because the
 *  menu wants both and the preloader wants neither. */
export function useEscape(active: boolean, onEscape: () => void): void {
  const handler = useRef(onEscape);
  handler.current = onEscape;
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);
}

/**
 * True only for the first page view of a browsing session — the
 * preloader's gate. A full opening sequence is an asset on arrival and
 * an obstacle on every navigation after it; `sessionStorage` survives
 * client-side routing and a refresh, and resets when the tab closes.
 */
/**
 * Resolved ONCE per document and cached at module scope.
 *
 * This used to read and write `sessionStorage` inside the hook, which
 * made it single-consumer by accident: the first component to mount
 * claimed the flag and every later caller was told it was a repeat
 * visit. That was invisible while the overture was the only consumer.
 * It stops being invisible the moment anything else needs to know
 * whether the overture is running — see `useStageDelay`.
 */
let firstVisit: boolean | null = null;

function resolveFirstVisit(): boolean {
  if (firstVisit !== null) return firstVisit;
  try {
    const unseen = window.sessionStorage.getItem('lark-visited') === null;
    if (unseen) window.sessionStorage.setItem('lark-visited', '1');
    firstVisit = unseen;
  } catch {
    /* Private mode and blocked storage both land here. Never showing the
       overture is a smaller cost than showing it every time. */
    firstVisit = false;
  }
  return firstVisit;
}

/**
 * REPLAY_OVERTURE — the single switch that decides whether the opening
 * sequence is shown once per session or on every single load.
 *
 * It is `true`, which means EVERY REFRESH PLAYS THE INTRO. That is
 * deliberate and it is the current requirement: an opening sequence
 * gated behind `sessionStorage` is invisible to the person building the
 * site, because the second page load they ever do is the last time they
 * see it. "The code exists" and "the visitor sees it" are different
 * claims, and only the second one matters.
 *
 * Flip this to `false` to restore once-per-session behaviour for
 * production. Nothing else has to change: `useFirstVisit` keeps its
 * storage logic and simply stops being consulted.
 */
/* Annotated `: boolean` rather than left to inference. A bare `= true`
   narrows to the literal type `true`, and the ternary below then reads
   as a constant condition that lint rejects — which would make the
   switch impossible to flip without also editing its use site. */
export const REPLAY_OVERTURE: boolean = true;

export function useFirstVisit(): boolean {
  const [first, setFirst] = useState(false);
  useEffect(() => {
    setFirst(REPLAY_OVERTURE ? true : resolveFirstVisit());
  }, []);
  return first;
}

/**
 * THE STAGE CLOCK — how long the landing page waits before it performs.
 *
 * The overture holds a fixed overlay for 5.6s, and the aperture that
 * uncovers the page starts opening at 4.6s. Without this, every
 * first-paint entrance on the site — the header stagger, the hero's
 * nine-cue score — ran on its own clock from mount, which means it ran
 * to completion BEHIND the overlay and the visitor arrived on a page
 * that had already finished animating. The intro would have ended in
 * exactly the hard cut the whole sequence exists to avoid.
 *
 * Adding this to an entrance delay parks it until the aperture is open,
 * so the page performs INTO the opening rather than behind it. 4.8s sits
 * just after the aperture starts moving, which is what makes the two
 * read as one continuous camera move instead of two events.
 *
 * Returns 0 on every repeat visit and under reduced motion, where there
 * is no overture to wait for.
 */
/* `OVERTURE_HOLD` / `useStageDelay` are gone. They implemented Act II
   as a DELAYED animation rather than a GATED one, which is what let the
   opening and the landing page run over each other. Use `useActTwo()`. */

/**
 * True when the viewport matches. Used by exactly one thing: the
 * horizontal portfolio, which needs to know whether to translate its
 * track at all.
 *
 * It starts `false` on the server and on the first client paint, which is
 * correct rather than merely safe: the mobile layout is the fallback, and
 * at scroll position zero the desktop track is at x=0 anyway — so the
 * upgrade after mount is invisible. The tall wrapper height is done in
 * CSS, not here, so nothing reflows when this flips.
 */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => {
      setMatches(media.matches);
    };
    sync();
    media.addEventListener('change', sync);
    return () => {
      media.removeEventListener('change', sync);
    };
  }, [query]);
  return matches;
}

/** A boolean and a stable toggle. Used by the menu. */
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => {
    setOn((value) => !value);
  }, []);
  const off = useCallback(() => {
    setOn(false);
  }, []);
  return { on, toggle, off } as const;
}

/* ================================================================== *
 * PROVIDER
 * ================================================================== */

/**
 * Lenis, mounted once.
 *
 * It interpolates the *settle* of a scroll: it does not change how far
 * a gesture travels, does not snap, does not pin, and does not take
 * over the scrollbar. The reader still decides where the page goes. It
 * declines to mount at all under `prefers-reduced-motion`, so that
 * preference gets native scrolling rather than a gentler imitation of
 * the thing they switched off.
 *
 * While running it publishes document progress to `--scroll` once per
 * frame, so CSS-driven effects can read scroll position without any
 * component adding a listener of its own.
 */
let lenis: Lenis | null = null;

/**
 * Scroll the document, through Lenis when it is mounted.
 *
 * The horizontal portfolio is driven by page scroll, so its arrows, dots,
 * keyboard and drag all have to move the page rather than the track. They
 * cannot call `window.scrollTo` directly: Lenis is animating `scrollTop`
 * itself, and the two fight — the page jumps and then snaps back. This is
 * the one sanctioned way to move the reader.
 */
export function scrollToY(y: number, immediate = false): void {
  if (lenis) lenis.scrollTo(y, immediate ? { immediate: true } : { duration: 1 });
  else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
}

/**
 * Scroll to a section by id, reporting whether it was there.
 *
 * The caller needs the boolean: the header's Work item scrolls to the
 * portfolio when the reader is already on the homepage and navigates to
 * it otherwise, and the difference is exactly "is this element in this
 * document". Returning false lets the click fall through to the `Link`
 * that was going to handle it anyway.
 */
export function scrollToId(id: string): boolean {
  const node = document.getElementById(id);
  if (!node) return false;
  scrollToY(node.getBoundingClientRect().top + window.scrollY);
  return true;
}

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced === true) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      /* Touch keeps native scrolling. Momentum there is an OS behaviour
         the browser already does better, and intercepting it is what
         makes smooth-scroll libraries feel broken on phones. */
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });

    lenis = instance;
    const root = document.documentElement;
    let frame = 0;
    const onScroll = ({ progress }: { progress: number }) => {
      root.style.setProperty('--scroll', progress.toFixed(4));
    };
    instance.on('scroll', onScroll);

    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.off('scroll', onScroll);
      instance.destroy();
      lenis = null;
      root.style.removeProperty('--scroll');
    };
  }, [reduced]);

  return <>{children}</>;
}

/**
 * `domAnimation` only — roughly 15kb rather than 34kb. No layout
 * projection, no drag, no 3D, and `strict` makes an accidental
 * `motion.*` a runtime error rather than a silent 20kb regression.
 *
 * `reducedMotion="user"` disables transform and opacity animation for
 * anyone who asks. Combined with the global media query in globals.css
 * and SmoothScroll declining to mount, a reduced-motion visitor gets a
 * completely static site with every word and image in place.
 */
/* ================================================================== *
 * THE INTRO STATE MACHINE
 * ================================================================== */

/**
 * TWO ACTS, AND THEY MUST NEVER SHARE THE STAGE.
 *
 * The previous revision handled this with a DELAY: master-page entrances
 * kept their own clocks and simply started later. That is not the same
 * thing, and the difference is exactly what went wrong. A delayed
 * animation is still running — it just runs where nobody can see it, and
 * any drift between the two clocks (a slow image decode, a dropped
 * frame, a device that throttles timers) puts the hero mid-settle at the
 * moment the overlay lifts. The two acts visibly collided.
 *
 * This replaces the delay with a GATE. The overture owns a three-state
 * lifecycle, and Act II is not late — it has not begun:
 *
 *   opening        the montage and the brand reveal. Master-page
 *                  entrance variants are pinned to `hidden`.
 *   transitioning  the overture's exit wipe is playing.
 *   complete       the overlay is gone. ONLY NOW do master-page
 *                  entrances animate, from their own t=0.
 *
 * `useActTwo()` is what every master-page entrance reads. It returns
 * false until the curtain is fully clear, so an entrance cannot start
 * early no matter how the timings drift — there is no timing to drift.
 * On a repeat load with the overture disabled, or under reduced motion,
 * it returns true immediately and the page behaves as if there were
 * never an intro at all.
 */
export type IntroPhase = 'opening' | 'transitioning' | 'complete';

const IntroContext = createContext<{
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
}>({ phase: 'complete', setPhase: () => undefined });

function IntroProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  /* Starts `complete` on the server and for reduced motion, so nothing
     is ever gated behind an overture that will not play. The overture
     itself moves it to `opening` on mount when it decides to run. */
  const [phase, setPhase] = useState<IntroPhase>('complete');

  useEffect(() => {
    if (reduced === true) setPhase('complete');
  }, [reduced]);

  return (
    <IntroContext.Provider value={{ phase, setPhase }}>{children}</IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}

/** True once the overture has fully left. The single condition every
 *  master-page entrance animation is allowed to depend on. */
export function useActTwo(): boolean {
  return useContext(IntroContext).phase === 'complete';
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <IntroProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </IntroProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

/* ================================================================== *
 * EXPORTS
 * ================================================================== */

export {
  m as Motion,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
};
export type { MotionValue, Transition, Variants };
