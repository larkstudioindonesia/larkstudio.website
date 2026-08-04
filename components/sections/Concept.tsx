import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { Label } from '@/components/primitives/Figures';
import type { ResolvedPassage } from '@/components/sections/Prose';

/**
 * Section type 13 — Concept. Renders a project's named decisions
 * (exactly 2–3, enforced by the `Decisions` tuple union in
 * content/types.ts) as a parallel grid rather than Prose's sequential
 * column: these are independent judgement calls, not one unfolding
 * argument.
 */
export function Concept({
  eyebrow,
  decisions,
}: {
  eyebrow: string;
  decisions: readonly ResolvedPassage[];
}) {
  return (
    <section className="pb-9 pt-9 tablet:pb-10 tablet:pt-10 desktop:pb-11 desktop:pt-11">
      <Container>
        <Grid>
          <Measure>
            <Label>{eyebrow}</Label>
          </Measure>
        </Grid>

        <div className="mt-7 tablet:mt-8">
          <Grid>
            {decisions.map((decision) => (
              <div key={decision.id} className="col-span-4 tablet:col-span-4 desktop:col-span-4">
                {decision.heading !== undefined && (
                  <h3 className="font-serif text-lead font-medium text-ink desktop:text-lead-desktop">
                    {decision.heading}
                  </h3>
                )}
                <p className="mt-3 font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                  {decision.body}
                </p>
              </div>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}
