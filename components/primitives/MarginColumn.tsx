import type { ReactNode } from 'react';

/**
 * Columns 9–11: captions, credits, annotation. Frequently empty.
 * The emptiness is the point.
 *
 * Below desktop it falls beneath the content it annotates.
 */
export function MarginColumn({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-4 tablet:col-span-6 desktop:col-span-3 desktop:col-start-9">
      {children}
    </div>
  );
}
