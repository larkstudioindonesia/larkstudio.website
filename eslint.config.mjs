import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import next from '@next/eslint-plugin-next';

/**
 * LARK STUDIO — LINT AS DESIGN GOVERNANCE
 *
 * The prohibitions below are not code style. Each one is a design
 * decision that was written as prose and would otherwise survive about
 * eight months. Prose does not hold up on a rushed Tuesday in year
 * three; a failing build does.
 *
 *   1. THE SINGLE IMPORT SITE. `lib/motion.tsx` is the only file that
 *      may import from `framer-motion` or `lenis`. Every curve,
 *      duration and variant on this site is defined once, in a file
 *      whose header explains each one. A component that wants a new
 *      gesture edits that file, which is a visible, reviewable act — as
 *      opposed to inventing a cubic-bezier inline, which is how a
 *      design system acquires fourteen easing curves without anyone
 *      deciding to.
 *
 *   2. LAYOUT PROJECTION. Layout projection is the only Framer feature
 *      that moves an element by changing its box rather than its
 *      transform, which makes it the only one that can produce
 *      cumulative layout shift. The CLS budget here is 0, not 0.1, and
 *      it is enforced nowhere else at build time.
 *
 *   3. DRAG. Not a document behaviour. A visitor who drags a
 *      photograph on an architecture site has been given a toy.
 *
 *   4. RAW EASING. Inline `cubic-bezier(...)` in a component is how the
 *      curve library drifts. Use EASE from lib/motion, or an --ease-*
 *      token from globals.css.
 */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    plugins: { '@next/next': next },
    rules: { ...next.configs.recommended.rules },
  },
  {
    languageOptions: {
      parserOptions: { projectService: true },
    },
    rules: {
      /* ------------------------------------------------------------
         Rule 1 — the single import site.
         ------------------------------------------------------------ */
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'framer-motion',
              message:
                'Import from @/lib/motion instead. Framer Motion has a single entry point by design — see that file’s header.',
            },
            {
              name: 'motion/react',
              message:
                'Import from @/lib/motion instead. Framer Motion has a single entry point by design.',
            },
            {
              name: 'lenis',
              message:
                'Lenis is mounted once, by MotionProvider in @/lib/motion. A second instance would fight the first for the scroll position.',
            },
          ],
        },
      ],

      /* ------------------------------------------------------------
         Rules 2–4 — the prohibitions that outlived the old budget.
         ------------------------------------------------------------ */
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXAttribute[name.name=/^(layout|layoutId|drag|dragConstraints|dragElastic|whileDrag)$/]",
          message:
            'Layout projection can move an element without a transform, which is the one way Framer Motion can produce layout shift — and CLS is 0 here, not 0.1. Drag is not a document behaviour. See the header of eslint.config.mjs.',
        },
        {
          selector: "Property[key.name=/^(layout|layoutId|drag)$/]",
          message:
            'Layout projection and drag are prohibited. See the header of eslint.config.mjs.',
        },
        {
          /* Easing lives in EASE (lib/motion) and in @theme
             (globals.css). A literal curve in a component is outside
             both, and invisible in review. */
          selector: "Literal[value=/cubic-bezier\\(/]",
          message:
            'Use EASE from @/lib/motion, or an --ease-* token from globals.css. Inline curves are how a system acquires fourteen of them.',
        },
      ],

      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      'jsx-a11y/alt-text': 'off',
    },
  },
  {
    /* The quarantine file itself is the one place the libraries and
       the raw easing curves may be referenced. */
    files: ['lib/motion.tsx'],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    /* Root config files are not part of the app's type-aware program.
       Linting them with the type-checked rules reports parser errors
       rather than problems. */
    files: ['*.mjs', '*.ts'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'public/**'],
  },
);
