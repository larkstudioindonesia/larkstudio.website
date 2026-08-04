import type { ReactNode } from 'react';

/**
 * Tabular lining figures, so specification columns align without
 * manual intervention. Applied to every stated fact: areas, seats,
 * durations, dates, unit counts.
 *
 * Figures never animate. Facts do not count up — and Persona C reads
 * these in ninety seconds.
 */
export function Figures({ children }: { children: ReactNode }) {
  return <span className="figures">{children}</span>;
}

/**
 * Uppercase grotesque at 11/12px with 0.08em tracking. The only
 * place letterspacing is permitted: never on lowercase.
 */
export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="label-case font-grotesque text-label text-ink-3 desktop:text-label-desktop">
      {children}
    </span>
  );
}
