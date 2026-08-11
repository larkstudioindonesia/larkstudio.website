'use client';

import type { ReactNode } from 'react';
import { PageTransition } from '@/components/chrome';

/** `template.tsx` rather than `layout.tsx` because a template remounts
 *  on navigation, which is what makes the entry animation fire at all. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
