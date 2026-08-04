'use client';

import type { ReactNode } from 'react';
import { Motion, sectionReveal } from '@/lib/motion';
import { useInView } from '@/lib/useInView';

/**
 * Behaviour 8 of the motion budget — section reveal on scroll, 400ms.
 *
 * Opt-in: a section calls this explicitly rather than the reveal being
 * an implicit property of every section, keeping the reversal of "no
 * scroll-triggered reveal" scoped to exactly the call sites that use
 * it. Fires once per section, driven by `lib/useInView.ts`'s
 * IntersectionObserver rather than a Framer scroll hook.
 * `prefers-reduced-motion` is handled by `MotionConfig` in
 * `lib/motion.tsx` — nothing extra to do here.
 *
 * `threshold: 0` — fires as soon as any pixel of the wrapped content
 * enters the viewport, deliberately NOT a percentage of its area. This
 * wraps content of very different heights (a single Services grid vs.
 * the full homepage project list, which stacks 8 full-bleed images and
 * can run several viewport-heights tall). IntersectionObserver's area-
 * ratio threshold is relative to the TARGET's total height, so on a
 * tall target a wide/short viewport can physically never show enough
 * of it to cross a percentage threshold — the section stays invisible
 * forever. `threshold: 0` has no such dependency on content height.
 */
export function ScrollReveal({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0 });

  return (
    <Motion.div
      ref={ref}
      variants={sectionReveal}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </Motion.div>
  );
}
