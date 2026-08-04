import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * The only call-to-action object on the site. There are no filled
 * buttons: a filled button is a commercial pressure device, and a
 * studio that asks is a studio that needs.
 *
 * 1px structural border moving to ink on hover. Radius 0. No shadow,
 * no fill sweep, no lift, no depress, no arrow sliding out.
 * Minimum touch target 44px.
 */
export function FramedAction({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    'inline-flex min-h-[44px] items-center border border-structural px-5 py-3 font-grotesque text-spec font-regular text-ink transition-colors duration-response ease-response hover:border-emphasis';

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
