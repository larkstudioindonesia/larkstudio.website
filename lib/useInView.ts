'use client';

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  readonly threshold?: number;
  readonly rootMargin?: string;
  /** Stop observing after the first intersection. Default true —
   *  sections reveal once and stay; they do not replay on scroll-back. */
  readonly once?: boolean;
  /** State to assume before the observer's first callback fires.
   *  Matters for anything read during the initial render — e.g. the
   *  scroll-aware header assumes it starts over the hero (true) rather
   *  than defaulting to "not yet observed" and flashing solid for a
   *  frame. Default false, correct for reveal-on-scroll consumers. */
  readonly initialInView?: boolean;
}

/**
 * Plain `IntersectionObserver`, not Framer Motion's `useInView`.
 *
 * Keeping scroll-position detection out of the Framer Motion quarantine
 * means `sectionReveal` (lib/motion.tsx) and the scroll-aware header
 * need no ESLint carve-out for `useScroll`/`whileInView` — those stay
 * banned exactly as documented. This is the one scroll-detection
 * mechanism in the codebase; every new scroll-aware behaviour shares it
 * rather than adding its own listener.
 */
export function useInView<T extends Element>({
  threshold = 0.2,
  rootMargin = '0px',
  once = true,
  initialInView = false,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(initialInView);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

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
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView } as const;
}
