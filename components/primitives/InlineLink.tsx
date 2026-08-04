import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * A 1px rule at 4px offset, moving to ink on hover over 120ms.
 * Nothing shifts, scales or moves — hover is information, never
 * reward.
 *
 * Mobile is the primary surface and mobile has no hover, so hover can
 * never carry necessary information.
 */
export function InlineLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    'text-ink underline decoration-structural decoration-1 underline-offset-4 transition-colors duration-response ease-response hover:decoration-emphasis';

  if (external) {
    return (
      <a
        href={href}
        className={className}
        rel="noreferrer noopener"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
