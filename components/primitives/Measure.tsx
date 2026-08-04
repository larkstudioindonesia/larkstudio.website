import type { ReactNode } from 'react';

/**
 * The reading column: 62–72 characters, columns 3–8 on desktop.
 *
 * LEFT OF CENTRE, NOT CENTRED. This asymmetry is the single decision
 * that produces the editorial register — it creates a wide, quiet
 * right field that carries captions, specification, and frequently
 * nothing at all. A centred measure inside a wide frame reads as a
 * template.
 *
 * Text never runs full width.
 */
export function Measure({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-4 tablet:col-span-6 tablet:col-start-1 desktop:col-span-6 desktop:col-start-3">
      {children}
    </div>
  );
}
