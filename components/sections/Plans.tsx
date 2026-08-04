import Image from 'next/image';
import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { Label } from '@/components/primitives/Figures';

export interface PlanItem {
  readonly id: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly caption?: string;
}

/**
 * Section type 15 — Plans & Drawings. Conditional: renders nothing
 * until a project has real `plans` data (`content/types.ts`'s
 * `PlanImage` — a genuine data-model gap today, 0 of 8 projects
 * populated). One ratio-agnostic image per plan, unlike
 * `ProjectImage`'s forced 3:2/4:5 pair — a floor plan is a single
 * deliverable, and cropping it to an art-directed ratio would be
 * destructive. `next/image`'s own width/height reserve the space;
 * no manual aspect-ratio box is needed for a fixed, known image.
 */
export function Plans({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: readonly PlanItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="pb-9 tablet:pb-10 desktop:pb-11">
      <Container>
        <Grid>
          <Measure>
            <Label>{eyebrow}</Label>
          </Measure>
        </Grid>

        <div className="mt-6 flex flex-col gap-7">
          {items.map((item) => (
            <figure key={item.id}>
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(min-width: 1024px) 75vw, 100vw"
                loading="lazy"
                className="w-full bg-sunk"
              />
              {item.caption !== undefined && (
                <figcaption className="mt-2 font-grotesque text-caption text-ink-3 desktop:text-caption-desktop">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
