'use client';

import type { ReactNode } from 'react';
import { Motion, pageEnter } from '@/lib/motion';

/**
 * Behaviour 7 of the motion budget — page transition, 300ms.
 *
 * Entry only. App Router does not reliably keep the outgoing page
 * mounted for an exit animation, and the 8px directional hint reads
 * correctly on entry alone.
 *
 * `template.tsx` rather than `layout.tsx` because a template remounts
 * on navigation, which is what makes the entry fire.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <Motion.div variants={pageEnter} initial="hidden" animate="visible">
      {children}
    </Motion.div>
  );
}
