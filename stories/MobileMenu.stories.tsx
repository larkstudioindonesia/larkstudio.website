import type { Meta, StoryObj } from '@storybook/react';
import { MobileMenu } from '../components/chrome/MobileMenu';
import { site } from '../content/site';

/**
 * Behaviour 6 of the motion budget — 240ms in, 180ms out.
 *
 * Review checklist for this story:
 *   · Trigger is the word `Menu`, not an icon.
 *   · Panel arrives as a full paper surface. Nothing behind it dims,
 *     blurs or scales.
 *   · Contents are present on arrival — items do NOT stagger in.
 *   · Escape closes. Tab is trapped. Focus returns to the trigger.
 *   · Label changes instantly; it does not crossfade between words.
 */
const meta: Meta = {
  title: 'Shell/Mobile Menu',
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
export default meta;

export const English: StoryObj = {
  render: () => (
    <div className="px-5 py-5">
      <MobileMenu
        locale="en"
        email={site.email}
        whatsappHref="https://wa.me/628110000000"
        instagramHref={site.instagram.href}
      />
    </div>
  ),
};

/**
 * Bahasa runs 15–20% longer. Every label, measure and nav item is
 * sized to the Indonesian string so English sits comfortably inside
 * it — never the reverse.
 */
export const Bahasa: StoryObj = {
  render: () => (
    <div lang="id" className="px-5 py-5">
      <MobileMenu
        locale="id"
        email={site.email}
        whatsappHref="https://wa.me/628110000000"
        instagramHref={site.instagram.href}
      />
    </div>
  ),
};
