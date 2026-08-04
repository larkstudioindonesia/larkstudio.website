import type { ReactNode } from 'react';

/**
 * 4 / 8 / 12 columns. Breakpoints are set by measure, not by device:
 * each is the point at which the reading column stops working.
 */
export function Grid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-mobile gap-4 tablet:grid-cols-tablet tablet:gap-5 desktop:grid-cols-desktop wide:gap-6">
      {children}
    </div>
  );
}
