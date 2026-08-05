import type { ReactNode } from 'react';

/**
 * A project-detail-page-only variant of `Measure`. Identical column
 * span at every breakpoint — same reading width, same wrapping, same
 * spacing — the only difference is `desktop:col-start-1` instead of
 * `desktop:col-start-3`, so text content on the project page shares
 * its left edge with `MaterialPalette`'s image grid (which has always
 * started at column 1, having no `col-start` override of its own)
 * instead of sitting indented two columns to its right.
 *
 * `Measure` itself is untouched and keeps its asymmetric, indented
 * column everywhere else on the site — this exists specifically so
 * that decision doesn't have to change globally to fix one page's
 * internal alignment.
 */
export function ProjectMeasure({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-4 tablet:col-span-6 tablet:col-start-1 desktop:col-span-6 desktop:col-start-1">
      {children}
    </div>
  );
}
