import type { Locale } from '@/content/types';
import { paths } from '@/lib/paths';
import { ui } from '@/content/ui';
import { NavLink } from '@/components/chrome/NavLink';

/**
 * Four items. Global priority: Work → Approach → Studio → Contact.
 *
 * Work first because evidence outranks assertion. Approach second
 * because it carries the differentiating claim and is the page most
 * likely to be sent as a link during fee negotiation. Studio third.
 * Contact last, because it should be found when wanted, not pushed.
 *
 * Note there is no /work route: with four to six projects, an index
 * page exists only to hold six links. Home is the index.
 */
export function navigationItems(locale: Locale) {
  return [
    { href: paths.home(locale), label: ui.navWork[locale], key: 'work' },
    { href: paths.approach(locale), label: ui.navApproach[locale], key: 'approach' },
    { href: paths.studio(locale), label: ui.navStudio[locale], key: 'studio' },
    { href: paths.contact(locale), label: ui.navContact[locale], key: 'contact' },
  ] as const;
}

/**
 * Desktop: fully exposed, text only, no hamburger. Hiding four links
 * behind a menu icon on a 1440px screen is decoration pretending to be
 * minimalism — it costs a click and signals that the site is more
 * interested in itself than in the visitor. Persona C, comparing in
 * parallel tabs, must see the full scope of the site at a glance.
 */
export function Navigation({
  locale,
  currentPath,
  orientation = 'horizontal',
  inverse = false,
}: {
  locale: Locale;
  currentPath?: string;
  orientation?: 'horizontal' | 'vertical';
  inverse?: boolean;
}) {
  const items = navigationItems(locale);

  return (
    <nav aria-label={orientation === 'vertical' ? 'Primary' : 'Primary'}>
      <ul
        className={
          orientation === 'horizontal'
            ? 'flex items-center gap-6'
            : 'flex flex-col gap-2'
        }
      >
        {items.map((item) => (
          <li key={item.key}>
            <NavLink
              href={item.href}
              current={currentPath === item.href}
              inverse={inverse}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
