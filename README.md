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

The homepage's centrepiece. Eight projects laid side by side and
travelled through horizontally, driven by ordinary vertical scroll.

The section is a tall spacer with a `sticky` viewport inside it; the
spacer's scroll progress maps to a horizontal translate on the track.
That is what GSAP ScrollTrigger's pin + scrub does, and Framer Motion's
`useScroll` already provides the progress value — a second animation
runtime would mean a second source of truth for scroll position next to
the Lenis instance already smoothing it.

**The height is CSS, not measured.** Panel widths are viewport units, so
the travel is known without touching the DOM:

```
track  = n·76vw + (n−1)·4vw + 2·4vw
travel = track − 100vw          →  544vw for eight projects
height = 100vh + travel         →  one vertical pixel moves the track one
                                   horizontal pixel
```

A measured height would need a layout pass, a ResizeObserver and a reflow
on every resize, and would shift the page on first paint.

Navigation: wheel and vertical trackpad (native), **horizontal**
trackpad, drag, arrow keys while the section owns the screen, tick
marks, and prev/next buttons. All of them move the **page** through
`scrollToY()` — the track is a pure function of scroll position, so
moving it directly would desynchronise the two the moment the gesture
ended.

**Drag must not capture the pointer on press.** An earlier revision
called `setPointerCapture` in `pointerdown`. Capture retargets both
`pointerdown` and `pointerup` to the capturing element, and the browser
fires `click` on the nearest common ancestor of the two — so every click
inside the portfolio was delivered to the sticky container instead of to
what was under the cursor. View Project, all eight panels, both arrows
and all eight tick marks did nothing on desktop while looking perfectly
interactive. Capture is now taken only after the pointer has travelled
6px, and the click that ends a real drag is swallowed in the capture
phase.

**Below 1024px none of this applies:** auto height, static viewport,
column track, zero translate. Hijacking horizontal scroll on a touch
device fights the OS gesture and loses.

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

`content/projects.ts` carries eight projects and 36 frames. Every frame was
reviewed individually — resolution, real detail per pixel, subject position —
and carries the result:

```ts
{ id: 'amadya-01', weight: 'lead', focal: [50, 46], alt: {…} }
```

- **`weight`** is the largest placement the layout may give a frame:
  `lead` runs full bleed, `wide` is held to the container, `detail` is a
  half-width plate (set as a diptych when two fall together). Measured
  across the set, real detail ranges from 1.58 bits/pixel down to 0.42.
- **`focal`** is the subject as `[x%, y%]`. It drives the export crop and the
  rendered `object-position`, so a frame dropped into a container of any ratio
  still holds what the photograph is of.

**Weight caps placement, not file size.** An earlier pipeline also capped the
exported width of soft masters, some as low as 1200px, on the theory that a
low-detail render should not ship large. That made them blurrier: a 1200px file
drawn in a 1300px CSS box on a 2x display is upscaled by the browser. Softness
in the master is a fact about the master. Every frame now exports at the
largest honest size — 2560 / 2160 / 1800 by tier, never exceeding the master —
and `sizes` carries the ceiling so the browser cannot ask for more than exists.

Paths and dimensions are derived by `crop()` in `content/types.ts`:

```
public/images/projects/<slug>/<slug>-01-3x2.jpg   landscape, ≥ 640px viewports
public/images/projects/<slug>/<slug>-01-4x5.jpg   portrait, below 640px
```

Both crops are art-directed, not centre-cropped, and **both components serve
both**. `Frame` always did; `Fill` — which draws the hero, the portfolio
panels, the project cover and the next-project teaser, i.e. every place a
photograph is largest — used to serve only the landscape crop, so the eight
portrait masters of the opening frames were exported, deployed and never
requested by anything. Phones got a 3:2 frame in a tall box.

A project page shows **every** frame it has, each at the largest size its
master supports — cover, facts, then plates. Nothing is a thumbnail. All 72
files under `public/images` are referenced by a rendered page; there are no
orphans.

**Four masters are deliberately unpublished** out of the forty that exist:
`amadya-05`, `mrs-d-house-05` and `the-prasetyos-05` are macroblocked phone
snapshots, and `ms-ra-house-03` is a clean render cropped through the middle of
a television. They are in `../_image-originals-backup/`, not deleted.

**Never put source files in `public/`.** A 132MB SketchUp model was found in
`public/images/projects/amadya/` and moved to `../_design-sources/`; anything
under `public/` is served verbatim and ships in the deploy.

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
