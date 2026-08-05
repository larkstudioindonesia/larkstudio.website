import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { ProjectMeasure } from '@/components/primitives/ProjectMeasure';
import { Label } from '@/components/primitives/Figures';

/**
 * Section type 1 of the permitted eight.
 *
 * Serif, measure column, space-11 above and below on desktop. The
 * measure sits left of centre, which is the decision that produces
 * the editorial register: it leaves a wide quiet right field.
 *
 * The first paragraph is set at lead size in ink-2, the rest at body
 * in ink. Space above a section is always greater than space below
 * its opening, which binds the statement to the work that follows.
 *
 * Optional `eyebrow`: reused for the project page's Challenge and
 * Result sections, both of which are structurally identical to a
 * Statement — a short paragraph in the measure column — differing
 * only in the small label above it.
 *
 * Optional `align`: defaults to `'measure'`, the original indented
 * column — every existing call site (home, contact, the project
 * page's Result) keeps rendering byte-for-byte the same. `'left'`
 * swaps in `ProjectMeasure` instead, used only by the project page's
 * Challenge section so its left edge matches `MaterialPalette`.
 */
export function Statement({
  paragraphs,
  eyebrow,
  align = 'measure',
}: {
  paragraphs: readonly string[];
  eyebrow?: string;
  align?: 'measure' | 'left';
}) {
  const MeasureColumn = align === 'left' ? ProjectMeasure : Measure;

  return (
    <section className="pb-9 pt-9 tablet:pb-10 tablet:pt-10 desktop:pb-11 desktop:pt-11">
      <Container>
        <Grid>
          <MeasureColumn>
            {eyebrow !== undefined && (
              <div className="mb-5">
                <Label>{eyebrow}</Label>
              </div>
            )}
            <div className="flex flex-col gap-5">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className={
                    index === 0
                      ? 'text-lead text-ink-2 desktop:text-lead-desktop'
                      : 'text-body text-ink desktop:text-body-desktop'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </MeasureColumn>
        </Grid>
      </Container>
    </section>
  );
}
