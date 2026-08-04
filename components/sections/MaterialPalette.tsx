import Image from 'next/image';
import { Container } from '@/components/primitives/Container';
import { Grid } from '@/components/primitives/Grid';
import { Measure } from '@/components/primitives/Measure';
import { Label } from '@/components/primitives/Figures';

export interface MaterialItem {
  readonly id: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly caption?: string;
}

/**
 * Section type 14 — Material Palette. Conditional: renders nothing if
 * a project has no `details` images (`content/types.ts`'s
 * `DetailImage[]` — true for all 8 current projects). 1:1 crops only,
 * per `DetailImage`'s own constraint; no aspect-ratio-reserving
 * `RevealImage` needed here since the ratio is fixed and singular,
 * unlike `ProjectImage`'s two art-directed crops.
 */
export function MaterialPalette({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: readonly MaterialItem[];
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

        <div className="mt-6">
          <Grid>
            {items.map((item) => (
              <figure key={item.id} className="col-span-2 tablet:col-span-2 desktop:col-span-3">
                <div className="relative bg-sunk" style={{ aspectRatio: '1 / 1' }}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                {item.caption !== undefined && (
                  <figcaption className="mt-2 font-grotesque text-caption text-ink-3 desktop:text-caption-desktop">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}
