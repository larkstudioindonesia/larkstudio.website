import type { StorybookConfig } from '@storybook/nextjs';

/**
 * Storybook exists here for one reason: to review components against
 * the design system before any page is assembled. It is a review
 * surface, not a documentation product.
 *
 * The a11y addon is not optional — focus states, contrast on the
 * inverse surface, and the mobile menu's focus trap are all easier to
 * check in isolation than in a page.
 */
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
