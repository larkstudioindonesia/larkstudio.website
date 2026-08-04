import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';

/** A passage resolved to one locale — same shape as content/types.ts's
 *  `Passage`, with `Localized<string>` fields already read down to
 *  plain strings by the caller, matching how Statement receives
 *  `paragraphs` pre-resolved rather than `Localized<string>[]`. */
export interface ResolvedPassage {
  readonly id: string;
  readonly heading?: string;
  readonly body: string;
}

/**
 * Section type 6 of the permitted eight.
 *
 * A statement paragraph followed by named passages — heading (optional)
 * and body, set in the measure column like Statement. Used for pages
 * built from prose rather than a project's image sequence: Approach's
 * stages, Studio's values.
 */
export function Prose({
  statement,
  passages,
}: {
  statement: string;
  passages: readonly ResolvedPassage[];
}) {
  return (
    <section className="pb-9 pt-9 tablet:pb-10 tablet:pt-10 desktop:pb-11 desktop:pt-11">
      <Container>
        <Grid>
          <Measure>
            <p className="text-lead text-ink-2 desktop:text-lead-desktop">{statement}</p>

            {passages.length > 0 && (
              <div className="mt-8 flex flex-col gap-7 tablet:mt-9">
                {passages.map((passage) => (
                  <div key={passage.id}>
                    {passage.heading !== undefined && (
                      <h2 className="font-serif text-title text-ink desktop:text-title-desktop">
                        {passage.heading}
                      </h2>
                    )}
                    <p className="mt-3 text-body text-ink desktop:text-body-desktop">
                      {passage.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Measure>
        </Grid>
      </Container>
    </section>
  );
}
