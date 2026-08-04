import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '../components/chrome/Header';
import { Footer } from '../components/chrome/Footer';
import { site } from '../content/site';

const meta: Meta = { title: 'Shell/Header & Footer' };
export default meta;

const whatsappHref = 'https://wa.me/628110000000';

/**
 * On every route except Home, the header is `static`, not `sticky`.
 * Scroll this story: it leaves and does not come back. A header that
 * follows you is application behaviour, and on project pages a
 * persistent bar over full-bleed photography would be a permanent
 * contrast problem. `Header` detects the route via `usePathname()`
 * (Storybook's default mock pathname is not `/en`, so this story
 * renders the non-Home behaviour — see `HeaderHome` below for the
 * scroll-aware variant).
 */
export const HeaderDesktop: StoryObj = {
  render: () => (
    <>
      <Header
        locale="en"
        email={site.email}
        whatsappHref={whatsappHref}
        instagramHref={site.instagram.href}
      />
      <div className="h-[150vh] px-8 pt-9">
        <p className="font-grotesque text-caption text-ink-3">
          Scroll — the header does not return. Every page ends with
          complete navigation instead, which is the mitigation.
        </p>
      </div>
    </>
  ),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

/** Below desktop the trigger is the word `Menu`, never an icon. */
export const HeaderMobile: StoryObj = {
  ...HeaderDesktop,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

/**
 * Behaviour 12 of the motion budget — the Home-only scroll-aware
 * header. Fixed over the page, transparent at the top (the hero's own
 * dark scrim keeps nav text legible, so the header never changes text
 * colour, only background), crossfading to solid `bg-paper` once
 * scrolled roughly one viewport height down. Uses `@storybook/nextjs`'s
 * navigation mock to report the pathname as Home.
 */
export const HeaderHome: StoryObj = {
  render: () => (
    <>
      <Header
        locale="en"
        email={site.email}
        whatsappHref={whatsappHref}
        instagramHref={site.instagram.href}
      />
      <div className="flex h-[250vh] flex-col gap-9 px-8 pt-9">
        <p className="font-grotesque text-caption text-ink-3">
          Scroll — the bar crossfades from transparent to solid `bg-paper`
          around one viewport down, then back on scroll-up. Padding/height
          stay identical between states; only background-color transitions.
        </p>
      </div>
    </>
  ),
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    nextjs: { navigation: { pathname: '/en' } },
  },
};

/**
 * The one inverse surface on the site, used as a closing gesture and
 * nowhere else. On the dark palette this inversion produces the
 * site's one bright surface. Run the a11y panel here: paper on ink is
 * 15.96:1 and ink-3-inverse is 4.68:1, both above AA at all sizes.
 */
export const FooterInverse: StoryObj = {
  render: () => (
    <Footer
      locale="en"
      email={site.email}
      whatsappHref={whatsappHref}
      instagramHref={site.instagram.href}
      address={site.address}
    />
  ),
};

export const FooterBahasa: StoryObj = {
  render: () => (
    <div lang="id">
      <Footer
        locale="id"
        email={site.email}
        whatsappHref={whatsappHref}
        instagramHref={site.instagram.href}
        address={site.address}
      />
    </div>
  ),
};
