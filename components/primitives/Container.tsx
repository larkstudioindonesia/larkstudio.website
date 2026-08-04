import type { ReactNode } from 'react';

/**
 * Structural content caps at 1800px, centred. Images are exempt and
 * run to the viewport — the tension between a viewport-wide image and
 * a narrow disciplined text column is the entire editorial effect.
 *
 * Margins: 24 / 40 / 64 / 96 across the four breakpoints.
 */
export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-structure px-5 tablet:px-7 desktop:px-8 wide:px-9">
      {children}
    </div>
  );
}
