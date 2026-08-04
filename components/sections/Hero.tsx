import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { HeroMedia, type HeroMediaSource } from '@/components/primitives/HeroMedia';
import { StaggerText } from '@/components/primitives/StaggerText';
import { FramedAction } from '@/components/primitives/FramedAction';

/**
 * Section type 9 — the full-viewport cinematic opening. The homepage's
 * first section; the fixed, scroll-aware Header (chrome, not page
 * content — see components/chrome/Header.tsx) overlays it on Home only.
 *
 * `min-h-dvh`, not `min-h-screen`: `dvh` accounts for mobile browser
 * chrome collapsing on scroll, so the hero doesn't visibly resize
 * under the reader's thumb.
 *
 * The content wrapper is promoted into its own stacking context
 * (`relative z-10`) so it paints above `HeroMedia`'s `absolute inset-0`
 * layer regardless of DOM order — `Container` itself doesn't accept a
 * className, so the promotion happens on a plain wrapping div.
 */
export function Hero({
  headline,
  subhead,
  actionLabel,
  actionHref,
  media,
}: {
  headline: string;
  subhead: string;
  actionLabel: string;
  actionHref: string;
  media: HeroMediaSource;
}) {
  return (
    <section className="relative flex min-h-dvh items-end">
      <HeroMedia media={media} priority />

      <div className="relative z-10 w-full">
        <Container>
          <Grid>
            <Measure>
              <div className="pb-10 tablet:pb-11 desktop:pb-12">
                <StaggerText
                  as="h1"
                  text={headline}
                  className="font-serif text-hero font-medium text-ink desktop:text-hero-desktop"
                />
                <p className="mt-5 max-w-[38ch] text-lead text-ink-2 desktop:text-lead-desktop">
                  {subhead}
                </p>
                <div className="mt-7">
                  <FramedAction href={actionHref}>{actionLabel}</FramedAction>
                </div>
              </div>
            </Measure>
          </Grid>
        </Container>
      </div>
    </section>
  );
}
