import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Navigation item — the third of the three interactive text objects.
 *
 * ink-2 at rest, ink on hover, 120ms. No underline appearing, no
 * movement, no sliding indicator between items: a sliding underline
 * is agency vocabulary and it draws the eye to the least important
 * content on any page.
 *
 * `current` marks the active page for assistive technology. It is
 * deliberately not given a distinct visual treatment — with four
 * items, the page heading already answers the question.
 */
export function NavLink({
  href,
  children,
  current = false,
  inverse = false,
}: {
  href: string;
  children: ReactNode;
  current?: boolean;
  inverse?: boolean;
}) {
  const tone = inverse
    ? 'text-ink-3-inverse hover:text-ink-inverse'
    : 'text-ink-2 hover:text-ink';

  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      className={`inline-flex min-h-[44px] items-center font-grotesque text-nav transition-colors duration-120 ease-response desktop:min-h-0 desktop:text-nav-desktop ${tone}`}
    >
      {children}
    </Link>
  );
}
