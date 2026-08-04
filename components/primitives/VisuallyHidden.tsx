import type { ReactNode } from 'react';

/**
 * Available to screen readers, removed from visual layout. Used for
 * context that sighted readers get from position or adjacency.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
      {children}
    </span>
  );
}
