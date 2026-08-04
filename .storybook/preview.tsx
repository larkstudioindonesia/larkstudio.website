import type { Preview } from '@storybook/react';
import type { ReactNode } from 'react';
import { MotionProvider } from '../lib/motion';
import '../app/globals.css';

/**
 * Two things are deliberately configured here.
 *
 * 1. THE VIEWPORTS ARE OUR BREAKPOINTS, NOT DEVICE NAMES. They are set
 *    by measure — the point at which the reading column stops working
 *    — so reviewing at `iPhone 14 Pro` would tell us nothing useful.
 *
 * 2. THERE IS NO BACKGROUND SWITCHER. The site has one paper — a dark
 *    surface as of the current direction — and the inverse surface is
 *    reserved for the footer alone. Offering a toggle would imply a
 *    light/dark theme choice that does not exist.
 */

function Frame({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="bg-paper font-serif text-ink">{children}</div>
    </MotionProvider>
  );
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    controls: { expanded: true },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile — below 600',
          styles: { width: '390px', height: '844px' },
        },
        tablet: {
          name: 'Tablet — 600',
          styles: { width: '760px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop — 1024',
          styles: { width: '1280px', height: '900px' },
        },
        wide: {
          name: 'Wide — 1440',
          styles: { width: '1680px', height: '1000px' },
        },
      },
    },
    a11y: {
      config: {
        rules: [
          /* Focus visibility and contrast are design decisions here,
             and both must pass rather than be waived. */
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
};

export default preview;
