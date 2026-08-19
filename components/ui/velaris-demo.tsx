import Velaris from '@/components/ui/velaris';

/**
 * VELARIS — DEMO.
 *
 * Not a route. Mount it from a page when you want to see the component;
 * this file exists so the demo markup lives next to what it demonstrates
 * rather than in a throwaway `/app` folder on a client's live site.
 *
 * EVERY CLASS HERE IS TRANSLATED, and that is worth reading before
 * copying more components in from the same source. `app/globals.css`
 * begins by setting `--color-*`, `--text-*`, `--radius-*`, `--blur-*`,
 * `--breakpoint-*`, `--container-*` and `--spacing` to `initial`, which
 * DELETES the stock Tailwind scales rather than extending them. The
 * demo as published leans almost entirely on utilities that no longer
 * exist here, and would have rendered as unstyled black-on-black text:
 *
 *   text-white, bg-white/10, border-white/20  no `white` token
 *   text-xs / text-sm / text-base             the scale is micro,
 *   text-4xl / text-6xl                         label, caption, spec,
 *                                               body, lead, title,
 *                                               statement, display,
 *                                               hero, mega
 *   sm:                                       breakpoints are tablet,
 *                                               desktop, wide
 *   max-w-2xl / max-w-md                      no container scale
 *   rounded-xl                                only none and full
 *   backdrop-blur                             only sm, md, lg, xl
 *   font-semibold                             only regular and medium
 *
 * The replacements are the site's own tokens, so the demo now reads in
 * the studio's voice: `text-display` is fluid and needs no breakpoint
 * jump, and `text-ink` is the warm off-white the whole site is set in
 * rather than a pure #fff that glares at full-bleed scale.
 */
export default function VelarisDemo() {
  return (
    <Velaris height="500px" className="rounded-none">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-5 text-center">
        <span className="rounded-full border border-line-strong bg-ink/10 px-4 py-1 font-text text-label font-medium text-ink/80 backdrop-blur-md">
          Powered by WebGL
        </span>
        <h1 className="max-w-[42rem] font-display text-display tracking-tight text-ink">
          Living gradients in motion
        </h1>
        <p className="max-w-[30rem] font-text text-body text-ink/75">
          An animated simplex-noise background with colour blending, vignette glow and film
          grain.
        </p>
      </div>
    </Velaris>
  );
}
