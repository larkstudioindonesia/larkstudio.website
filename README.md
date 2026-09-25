# Lark Studio

Architecture and interior design studio, Bogor. Bilingual (EN / ID), fully
static, no CMS — content lives in the repository as typed modules.

```
npm install
npm run dev        # http://localhost:3000 → redirects to /en
npm run verify     # typecheck + lint
npm run build      # prerenders every route in both languages
```

## The whole codebase

Twenty-one files. Each opens with a header explaining what it holds and why it
is not three files.

```
app/
  globals.css            design tokens — the single source of truth
  icon.png  robots.ts  sitemap.ts
  [lang]/                layout, template, and the five routes
components/
  ui.tsx                 layout, type, actions, media, motion wrappers
  sections.tsx           every block of page content, in reading order
  portfolio.tsx          the horizontal work index — one self-contained system
  chrome.tsx             header, menu, footer, preloader, cursor, transitions
content/
  types.ts  site.ts  projects.ts
lib/
  motion.tsx             the motion vocabulary and all shared browser state
  site.ts                fonts, locale, routes, metadata
```

Four rules hold the shape:

1. **Framer Motion is imported once**, in `lib/motion.tsx`. ESLint fails the
   build on a direct import anywhere else.
2. **One listener per concern, for the whole document.** Scroll, pointer,
   intersection and the scroll lock all live in `lib/motion.tsx`. The pointer
   is a module-level store with a ref-counted listener, so the cursor and
   the discipline preview share one `pointermove`.
3. **No two sections arrive the same way.** Each section in `sections.tsx`
   names its own device in its docblock; no device appears twice.
4. **Weight decides placement** — see Images, below.
5. **Control sizes are written in pixels.** `--spacing-*` here is an
   editorial rhythm, not Tailwind's default scale: `h-11` is **144px**,
   `w-8` is 64px, and `h-14` does not exist at all. That is right for
   page rhythm and wrong for a 44px button, so anything whose size is a
   real measurement — buttons, icons, the logo, the scroll rail — uses
   `h-[44px]`. Three controls had silently been three times their
   intended size and one had no height at all.

## The horizontal portfolio

The homepage's centrepiece. Eleven projects laid side by side and
travelled through horizontally, driven by ordinary vertical scroll.

The section is a tall spacer with a `sticky` viewport inside it; the
spacer's scroll progress maps to a horizontal translate on the track.
That is what GSAP ScrollTrigger's pin + scrub does, and Framer Motion's
`useScroll` already provides the progress value — a second animation
runtime would mean a second source of truth for scroll position next to
the Lenis instance already smoothing it.

**One rig, every breakpoint.** Every length is a custom property in the
`work-rig` utility (globals.css):

```
travel = (n − 1) · (panel + gap)    panel i is centred at stop i
span   = (n − 1) · step             vertical scroll for the whole journey
height = 100svh + span
```

- **Desktop (≥1024px):** a text column beside an exact 3:2 frame;
  `step = panel + gap`, so one vertical pixel moves the track one
  horizontal pixel. Below 1280px wide or 740px tall the facts move to a
  hairline under the frame (the laptop composition).
- **Compact (<1024px):** one project per screen, frame over caption. The
  frame fills whatever the caption leaves, through a size container, and
  takes the 4:5 or 3:2 crop depending on which can be shown larger while
  still whole. `step = 70svh`, and on touch screens every stop is a
  `scroll-snap` point (proximity), so a flick comes to rest centred.

**Progress is measured, not taken from `useScroll`.** Element progress
divides by the live viewport height, which on a phone changes as the
toolbar collapses. Here progress is `(scrollY − top) / span`: the
section's layout top (offset chain, never `getBoundingClientRect`,
which includes the page's arrival transform) and the span are measured
on mount and whenever the body resizes. Every stop lands within a pixel.

Navigation: native vertical scroll on every input, horizontal trackpad,
a sideways swipe on glass, mouse drag, arrow keys, ticks (a progress
rail on phones) and prev/next buttons. All of them move the **page**
through `scrollToY()`; the track is a pure function of scroll position.
A swipe is dispatched on the next frame, because Lenis handles the same
`touchend` on the window afterwards and would cancel a scroll started
inside it.

**Drag must not capture the pointer on press.** Capture retargets both
`pointerdown` and `pointerup`, and the browser fires `click` on their
common ancestor — every link in the portfolio went dead. Capture is
taken only after 6px of travel, and the click that ends a real drag is
swallowed in the capture phase.

## Composition

The page is a monograph, not an experiment. Three rules, and they are
narrow on purpose:

1. **Two placements, not five.** A frame is either full bleed or a
   centred 76% column. Nothing is offset, indented, rotated or skewed.
   Rhythm comes from scale and from the space between things.
2. **The same furniture every time.** Index, name, then type, location
   and year, on a hairline, in the same place under every frame.
3. **Nothing competes with a photograph.** Where an image is large, the
   type near it is small, quiet and to one side.

An earlier revision put the whole page on a CSS perspective rig — stages,
planes, pointer tilt, frames banking as they passed. It produced real
depth and the wrong impression: a rotated photograph of a building reads
as an experiment about the web, where the same photograph shown square
and surrounded by space reads as a studio confident in its work. The rig
is gone. What replaced it is the part that was actually doing the work —
a slow settle on arrival (`SETTLE`, 6%), vertical parallax, clip reveals
and scroll-lit copy. No axis but the one the visitor is already
travelling along.

## Images

**The photograph is the artwork; the frame adapts to it.** Every project
photograph on the site is presented as a `Print` (`components/ui`): the
whole render at its own ratio, in an off-white border, scaled DOWN to fit
the space it is given. Nothing is cropped to fill a rectangle and nothing
is enlarged. Every print can be tapped open in the shared `Lightbox`,
which grows it from where it lies (a hand-rolled FLIP — no layout
projection) and shows the full file uncropped.

**Only the `-3x2` exports are used.** They are each render's own
composition (2700×1800; leads 4200×2800). The `-4x5` exports are centre
crops of those scaled up about 1.7× (2448×3060 cut from 1800px of
height) — exactly the cropped, enlarged look this rule exists to prevent.
They remain on disk and are referenced by nothing. `photograph()` in
`content/types.ts` is the one place a frame becomes a `Photograph`.

`content/projects.ts` → `ARCHIVE` lists the renders used only in the
opening album (Larkscapes, Peeps Cafe, Stoma Museum, Capt. Bubbles).
`kegiatan/`, `larkworksid/` and the loose concept images in
`waroeng-andalan/` were audited and deliberately left out.

The home hero plate is the one full-bleed photograph: on a landscape
screen it covers with under 2% lost; on a phone it is shown whole as a
band at its own ratio.

**Never put source files in `public/`.** Anything under `public/` is
served verbatim and ships in the deploy.

## Before launch

- **Project years** are all 2025 and were not stated in the source material.
- **Photography credits** are not modelled. Placeholder contractor and
  photographer names were removed rather than left for a client to find.
- **Testimonials** were two placeholder quotes; the section is gone. Add it
  back when there are real ones.
- `content/site.ts` → `origin` must match the production domain before the
  sitemap, canonicals and hreflang are correct.

## Accessibility and motion

Everything degrades under `prefers-reduced-motion`: Lenis does not mount, the
looping animations stop, the cursor and grain are removed, and every duration
collapses. Because nothing here is positioned by an animation, the composition
survives intact — it simply stops moving.

Split text renders the whole string once for screen readers and marks every
generated span `aria-hidden`. A `<noscript>` block resets every reveal's
initial state. The page transition is a **CSS** animation, not a React one,
because it covers the viewport until it finishes: a frame loop that never
starts must not be able to leave the site as a black rectangle.
