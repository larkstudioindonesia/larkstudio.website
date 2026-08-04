import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Figures } from '@/components/primitives/Figures';

export interface ProcessStage {
  readonly id: string;
  readonly number: string;
  readonly heading: string;
  readonly body: string;
}

/**
 * Section type 11 — Process. An editorial timeline: numbered stages
 * laid across the grid rather than Prose's single sequential column,
 * since these read as parallel steps in an order, not as one unfolding
 * argument. Reuses `ApproachContent.stages` — no separate content model.
 */
export function Process({
  eyebrow,
  stages,
}: {
  eyebrow: string;
  stages: readonly ProcessStage[];
}) {
  return (
    <section className="pb-9 pt-9 tablet:pb-10 tablet:pt-10 desktop:pb-11 desktop:pt-11">
      <Container>
        <Grid>
          <div className="col-span-4 tablet:col-span-8 desktop:col-span-12">
            <span className="label-case font-grotesque text-caption font-semibold text-ink-3 desktop:text-caption-desktop">
              {eyebrow}
            </span>
          </div>
        </Grid>

        <div className="mt-7 tablet:mt-8">
          <Grid>
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="col-span-4 border-t border-hairline pt-5 tablet:col-span-4 desktop:col-span-4"
              >
                <Figures>
                  <span className="font-grotesque text-caption text-ink-3 desktop:text-caption-desktop">
                    {stage.number}
                  </span>
                </Figures>
                <h3 className="mt-3 font-serif text-lead font-medium text-ink desktop:text-lead-desktop">
                  {stage.heading}
                </h3>
                <p className="mt-3 font-grotesque text-spec text-ink-2 desktop:text-spec-desktop">
                  {stage.body}
                </p>
              </div>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}
