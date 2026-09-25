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
  MotionGlobalConfig,
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
  /** A board turning on a hinge: a slow lift, a long even swing, and a
   *  soft landing — never a snap at either end. */
  page: [0.62, 0.02, 0.24, 1],
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
   *  a whole screen of work is moving, and it should read as weight.
   *
   *  The rest thresholds are the precision. This spring runs on a 0–1
   *  progress value that maps to ~8,500px of travel, and Framer's
   *  default `restDelta` of 0.01 let it come to rest up to 1% short —
   *  a panel parked 20–85px off centre when the visitor stopped. */
  track: { stiffness: 120, damping: 34, mass: 0.9, restDelta: 0.00005, restSpeed: 0.0001 },
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
 * THE PAGE TURN, for anything read one sheet at a time (the In Practice
 * photographs, the New Directions announcement). The outgoing sheet eases
 * 48px away and fades while the next settles in from the other side.
 * `custom` is the direction: 1 forward, -1 back.
 */
export const turn: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.95, ease: EASE.expo } },
  exit: (direction: number) => ({
    x: direction >= 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.55, ease: EASE.quart },
  }),
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

    let reported = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        reported = true;
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
     *
     * IT FIRES ONLY IF THE OBSERVER HAS NEVER REPORTED. An observer always
     * delivers one callback on `observe()`, intersecting or not, so
     * silence is the one honest signal that the mechanism is broken. The
     * previous timer fired on everything still off-screen after three
     * seconds — which, behind a seven-second overture, was every reveal
     * on the page: they all completed where nobody could see them, and
     * every lazy photograph below the fold switched to eager and
     * downloaded at once.
     */
    let timer = 0;
    const arm = () => {
      if (document.hidden) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (reported) return;
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
 * REPLAY_OVERTURE — whether a RELOAD replays the opening sequence.
 *
 * `true` is the current requirement: the person building the site has
 * to be able to see the overture on every refresh, and "the code exists"
 * is not the same claim as "the visitor sees it". What it no longer does
 * is replay on an ordinary navigation. The first view of a browsing
 * session always plays; after that only `reload` does, so switching
 * language, following a link or going back never sits the visitor
 * through seven seconds they have already watched — which read as the
 * intro "randomly restarting".
 *
 * Flip to `false` for strict once-per-session behaviour.
 */
/* Annotated `: boolean` so the switch can be flipped without lint
   reading the ternary in `INTRO_SCRIPT` as a constant condition. */
export const REPLAY_OVERTURE: boolean = true;

/**
 * THE DECISION IS MADE BEFORE FIRST PAINT, IN THE DOCUMENT HEAD.
 *
 * The overture is in the server HTML, because an overlay that mounts
 * after hydration shows a frame of the bare page first — the flash.
 * But the server cannot know whether this visitor should see it: that
 * needs `sessionStorage`, the navigation type, the URL hash and the
 * reduced-motion preference, all of which are client facts. Deciding in
 * a React effect means deciding after the first paint, which is exactly
 * the flash again, the other way round.
 *
 * So this runs as a blocking inline script at the top of `<body>`,
 * before anything paints, and writes one attribute to `<html>`:
 *
 *   data-intro="play"   the overture runs; CSS locks scroll
 *   data-intro="skip"   CSS removes the overlay before it is ever drawn
 *   (absent)            JavaScript is off; CSS removes it as well
 *
 * React reads the same attribute when it hydrates, so the stylesheet and
 * the state machine can never disagree. `<html>` carries
 * `suppressHydrationWarning` for this one attribute.
 */
export const INTRO_SCRIPT = `(function(){var d=document.documentElement,p=false;try{var s=window.sessionStorage,n=performance.getEntriesByType('navigation')[0],seen=s.getItem('lark-overture')==='1';p=!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.hash&&(!seen||(${String(REPLAY_OVERTURE)}&&!!n&&n.type==='reload'));if(p){s.setItem('lark-overture','1');history.scrollRestoration='manual';}}catch(e){p=false}d.setAttribute('data-intro',p?'play':'skip')})();`;

/* ------------------------------------------------------------------ *
 * Reduced motion, globally and before the first animation.
 *
 * `MotionConfig reducedMotion="user"` only drops TRANSFORM animation —
 * every opacity fade on the site still ran its full 0.9s, which is not
 * "show content normally". Skipping at the engine resolves every
 * animation to its end state in the same frame, so a reduced-motion
 * visitor gets the finished page immediately. Set at module evaluation,
 * because a provider effect runs after its children have already
 * started animating.
 * ------------------------------------------------------------------ */
if (typeof window !== 'undefined') {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  MotionGlobalConfig.skipAnimations = query.matches;
  query.addEventListener('change', () => {
    MotionGlobalConfig.skipAnimations = query.matches;
  });
}

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
  /* Scroll snapping (the portfolio's stops on touch screens) would
     re-snap a frame-by-frame smooth scroll at every step, so it is held
     off until the move lands. */
  const root = document.documentElement;
  root.classList.add('snap-off');
  const release = () => {
    root.classList.remove('snap-off');
  };
  if (lenis) {
    lenis.scrollTo(y, immediate ? { immediate: true, onComplete: release } : { duration: 1, onComplete: release });
    if (immediate) requestAnimationFrame(release);
  } else {
    window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
    window.setTimeout(release, immediate ? 0 : 900);
  }
}

/**
 * THE HEADER HOLD — a module-level store, like the cursor label. The
 * portfolio sets it while it is pinned on a phone, where the site header
 * would otherwise sit over the showcase's own masthead.
 */
let headerHeld = false;
const headerListeners = new Set<() => void>();

export function setHeaderHeld(held: boolean): void {
  if (headerHeld === held) return;
  headerHeld = held;
  for (const listener of headerListeners) listener();
}

export function useHeaderHeld(): boolean {
  return useSyncExternalStore(
    (listener) => {
      headerListeners.add(listener);
      return () => headerListeners.delete(listener);
    },
    () => headerHeld,
    () => false,
  );
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

/**
 * WHO IS HOLDING THE PAGE STILL. Two things stop scrolling: the overture
 * while it plays, and any modal surface (the photo lightbox). Lenis drives
 * `scrollTo` itself, so `overflow: hidden` alone does not stop a wheel
 * gesture — it has to be told, and only released when BOTH have let go.
 */
let introHeld = true;
let modalHolds = 0;

function applyHold(): void {
  const held = introHeld || modalHolds > 0;
  document.documentElement.classList.toggle('is-held', modalHolds > 0);
  if (!lenis) return;
  if (held) lenis.stop();
  else lenis.start();
}

/**
 * Holds the page still while `active`, and gives back exactly the scroll
 * position it had: nothing is moved, only frozen. `scrollbar-gutter:
 * stable` on the document means hiding the scrollbar shifts nothing
 * sideways either.
 */
export function useScrollHold(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    modalHolds += 1;
    applyHold();
    return () => {
      modalHolds -= 1;
      applyHold();
    };
  }, [active]);
}

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const { phase } = useContext(IntroContext);

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
    applyHold();
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

  /* The stylesheet locks native scroll while the overture plays; Lenis
     drives `scrollTo` itself and has to be told separately, or a wheel
     gesture scrolls the page underneath the overlay. */
  useEffect(() => {
    introHeld = phase !== 'complete';
    applyHold();
  }, [phase, reduced]);

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

/**
 * Whether this document has already resolved its intro. Module scope, so
 * it survives the provider REMOUNTING — which it does on a language
 * switch, because the provider lives in the `[lang]` layout.
 */
let introResolved = false;

function IntroProvider({ children }: { children: ReactNode }) {
  /**
   * THE FIRST RENDER MUST SAY `opening`, and the previous revision's
   * first render said `complete`.
   *
   * That was the overlap. The server rendered `complete`, so on the
   * first client render every gated entrance — the header, the hero's
   * whole score — was told Act II had begun and started animating; one
   * effect later the overture set `opening` and they were yanked back to
   * hidden. The page performed a fraction of its entrance underneath the
   * overlay on every load, and on a slow device a visible fraction.
   *
   * Now the server and the hydrating client both start `opening` (they
   * must agree, or hydration fails), and nothing gated can start until
   * the head script's verdict is read. A remount after hydration starts
   * wherever the document already is.
   */
  const [phase, setPhase] = useState<IntroPhase>(() =>
    introResolved ? 'complete' : 'opening',
  );

  useEffect(() => {
    if (introResolved) return;
    introResolved = true;
    if (document.documentElement.getAttribute('data-intro') !== 'play') {
      setPhase('complete');
    }
  }, []);

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
