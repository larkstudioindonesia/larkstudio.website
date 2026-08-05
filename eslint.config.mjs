import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import next from '@next/eslint-plugin-next';

/**
 * LARK STUDIO — LINT AS DESIGN GOVERNANCE
 *
 * The prohibitions below are not code style. Each one is a design
 * decision that was written as prose and would otherwise survive
 * about eight months. Prose does not hold up on a rushed Tuesday in
 * year three; a failing build does.
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
         Framer Motion has exactly one import site in the codebase.
         Its most-used features are the ones our motion language
         prohibits most emphatically, so the library is quarantined
         behind lib/motion.ts, which exports a closed set of four
         variants (imageReveal, panelSurface, pageEnter, sectionReveal
         — the motion budget in lib/motion.tsx documents all twelve
         behaviours built from them). Adding a fifth variant means
         editing that file — a visible, reviewable act.
         ------------------------------------------------------------ */
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'framer-motion',
              message:
                'Import from @/lib/motion instead. Framer Motion has a single entry point by design.',
            },
            {
              name: 'motion/react',
              message:
                'Import from @/lib/motion instead. Framer Motion has a single entry point by design.',
            },
          ],
        },
      ],

      /* ------------------------------------------------------------
         The motion budget is seven behaviours. Every identifier below
         is a prohibition from the motion language:

           whileInView / viewport  — scroll-triggered reveals
           layoutId / layout       — shared-element transitions
           useScroll / useTransform— scroll-linked animation
           drag                    — not a document behaviour
           whileTap                — nothing moves on press
           stagger* / delayChildren— staggered cascades
         ------------------------------------------------------------ */
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXAttribute[name.name=/^(whileInView|viewport|layoutId|layout|drag|dragConstraints|whileTap|whileDrag)$/]",
          message:
            'Prohibited by the Lark motion language. See the motion budget in README.md.',
        },
        {
          selector:
            "Property[key.name=/^(staggerChildren|delayChildren|whileInView|layoutId)$/]",
          message:
            'Prohibited by the Lark motion language. See the motion budget in README.md.',
        },
        {
          /* The scroll/spring hooks are prohibited everywhere. AnimatePresence
             is prohibited everywhere EXCEPT as the sanctioned re-export from
             lib/motion — the selector below excludes that one import source
             rather than the identifier itself, so consuming components can
             import { AnimatePresence } from '@/lib/motion' without tripping
             this rule, while a direct import from 'framer-motion' still does. */
          selector:
            "ImportDeclaration[source.value!='@/lib/motion'] > ImportSpecifier[imported.name=/^(useScroll|useTransform|useSpring|useAnimationFrame|AnimatePresence)$/]",
          message:
            'Scroll-linked and spring motion are prohibited. AnimatePresence is permitted only via the re-export from lib/motion.',
        },
      ],

      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      'jsx-a11y/alt-text': 'off',
    },
  },
  {
    /* The quarantine file itself is the one place the library and
       AnimatePresence may be referenced. */
    files: ['lib/motion.ts', 'lib/motion.tsx'],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
);
