/**
 * Tailwind v4 moved the Tailwind processing into its own PostCSS
 * plugin, and handles vendor prefixing internally. Autoprefixer is no
 * longer required and has been removed.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
