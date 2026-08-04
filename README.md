# Lark Studio

Next.js · TypeScript · Tailwind CSS · Framer Motion (constrained) · Vercel

Fully static. Every route prerendered at build; content lives in the
repository as typed modules. No CMS, no runtime data fetching, no
environment variables required to build. The site compiles and deploys
in ten years with nothing but Node and the source.

---

## The three budgets

Every constraint in this repository resolves to one of these. They are
enforced by tooling rather than memory, because design systems do not
fail through a single bad decision — they fail through twelve
reasonable additions made over three years by people who each judged
their own case on its merits.

### 1. The motion budget — thirteen behaviours

| # | Behaviour | Duration | Mechanism |
|---|---|---|---|
| 1 | Pointer response | 120ms | CSS |
| 2 | Focus ring | instant | CSS |
| 3 | Field focus | 120ms | CSS |
| 4 | Error appearance | instant | CSS |
| 5 | Image on decode | 240ms | `lib/motion.tsx` |
| 6 | Navigation panel | 240 / 180ms | `lib/motion.tsx` |
| 7 | Page transition | 300ms | `lib/motion.tsx` |
| 8 | Section reveal on scroll | 400ms | `lib/useInView.ts` + `lib/motion.tsx` |
| 9 | Hero word stagger | ≤500ms | CSS (`StaggerText`) |
| 10 | Hero mask reveal | 800ms, once per load | `lib/motion.tsx` |
| 11 | Gallery hover zoom | 700ms | CSS (`RevealImage` `hoverZoom`) |
| 12 | Navbar background fade | 240ms | CSS + `lib/useInView.ts` |
| 13 | Underline sweep on hover | 200ms | CSS |

**No fourteenth behaviour is added without removing one of these.**

Behaviours 8 and 10 are deliberate, narrow reversals of two rules this
budget used to state absolutely: images no longer *only* reveal on
decode (`sectionReveal` is scroll-triggered, opt-in, via a plain
`IntersectionObserver` — not Framer's `useScroll`/`whileInView`), and
not everything stays under 300ms (`maskReveal` runs 800ms, exactly
once per page load, reserved for the hero). Both are documented in
`lib/motion.tsx`'s own header comment, which is the place to read the
full reasoning.

Framer Motion is imported exactly once, in `lib/motion.tsx`. ESLint
fails the build on any other import, and on `whileInView`, `layoutId`,
`useScroll`, `whileTap`, `staggerChildren` and their relatives — the
features whose defaults are the opposite of this system's
specification. None of those ESLint rules changed to add behaviours
8–13: each routes through a mechanism the rules already permitted.

### 2. The section budget — fourteen types

`Statement`, `FullBleedImage`, `CaptionedImage`, `Prose`,
`ClosingBlock`, `Hero`, `Services`, `Process`, `Testimonials`,
`Concept`, `MaterialPalette`, `Plans`, `Specification`, `Credits`.

`MaterialPalette` and `Plans` render nothing until a project supplies
the underlying images — true for all 8 current projects, so they are
currently invisible without being dead code.

Nothing outside `components/sections/` renders page content. Adding a
fifteenth requires adding a file to that directory — a visible,
reviewable act.

### 3. The performance budget

| Metric | Budget | Measured on |
|---|---|---|
| LCP | < 1.5s | mid-range Android, 4G |
| **CLS** | **0** | not 0.1 |
| INP | < 200ms | |
| JS shipped | < 65kb | |
| Route HTML | < 15kb | |

CLS of zero is load-bearing. Layout shift destroys the impression of
precision faster than any aesthetic error, and it is the one failure
guaranteed to occur on the networks our primary visitor uses.

---

## What is enforced where

| Rule | Enforced by |
|---|---|
| Bilingual parity | `Localized<T>` — a missing translation will not compile |
| Two art-directed image ratios | `ProjectImage` type + `scripts/audit-assets.ts` |
| Contractor credited | required field on `Credits` |
| Two or three decisions per project | `Decisions` tuple union |
| Buyer-appropriate specification | discriminated union on `Specification` |
| Image ratios, resolution, colour profile | `npm run audit:assets`, run before every build |
| Declared dimensions match files on disk | asset audit — reserved space depends on it |
| Alt text present and substantive | asset audit |
| No radius, no shadow, no arbitrary colour | `app/globals.css` — Tailwind v4 CSS-first `@theme`, defaults removed, not extended |
| Framer Motion quarantine | `eslint.config.mjs` |

---

## Commands

```bash
npm run dev        # development
npm run verify     # typecheck + lint + asset audit
npm run build      # asset audit, then build. Audit failure stops the build.
```

---

## Before first build

1. Typefaces: Montserrat (heading/display/hero) and Manrope (body/UI),
   both loaded via `next/font/google` in `lib/fonts.ts` — no licensed
   files to place. See `public/fonts/README.md` for the history.
2. Replace `content/projects/sudirman-restaurant.ts`. It is a schema
   fixture with invented figures, marked `published: false`.
3. Set the real origin in `lib/paths.ts`.

---

## Notes on things deliberately absent

**No journal, news or insights section.** A dormant journal is the
fastest-ageing element on a studio site: a most-recent post dated two
years ago tells a visitor the studio has lost momentum. Emptiness we
chose reads as confidence; emptiness that accumulated reads as decline.

**No work index page.** With four to six projects, an index exists only
to hold six links. Home is the index.

**No icon library.** One glyph, `ArrowGlyph.tsx`, drawn to the
grotesque's stroke weight so it reads as typography.

**No cards.** Cards are dashboard vocabulary — containers that make
heterogeneous content look uniform in a grid. There is no grid.

**One surface, and it is dark.** `#1A1A1A` paper, `#F5F5F5` ink — a
deliberate repositioning from the site's original light paper. The
"one surface" discipline is unchanged: there is still exactly one
inverted surface (the footer), no toggle, no per-user preference —
just a different single surface than before.

**No cookie banner.** Analytics are cookieless, so consent is not
required. A banner would be exactly the interruption refused when the
chat widget and the newsletter were cut.

**No `utils/`, `hooks/` or `constants/`.** At eleven pages, premature
abstraction is the risk, not duplication.
