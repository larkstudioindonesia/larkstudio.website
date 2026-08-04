import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '../components/primitives/Container';
import { Grid } from '../components/primitives/Grid';
import { Measure } from '../components/primitives/Measure';
import { MarginColumn } from '../components/primitives/MarginColumn';

const meta: Meta = { title: 'Foundation/Layout' };
export default meta;

/**
 * The asymmetry is the whole point: the measure sits LEFT OF CENTRE,
 * leaving a wide quiet right field. A centred measure inside a wide
 * frame reads as a template.
 */
export const GridZones: StoryObj = {
  render: () => (
    <div className="py-9">
      <Container>
        <Grid>
          <Measure>
            <div className="border border-structural p-5">
              <p className="font-grotesque text-caption text-ink-3">
                Measure — columns 3–8
              </p>
              <p className="mt-3 font-serif text-body">
                Sixty-two to seventy-two characters. Text never runs full
                width: the tension between a viewport-wide image and a
                narrow, disciplined column is the entire editorial effect.
              </p>
            </div>
          </Measure>
          <MarginColumn>
            <div className="border border-hairline p-5">
              <p className="font-grotesque text-caption text-ink-3">
                Margin column — columns 9–11. Frequently empty. The
                emptiness is the point.
              </p>
            </div>
          </MarginColumn>
        </Grid>
      </Container>
    </div>
  ),
};

export const ColumnRuler: StoryObj = {
  render: () => (
    <div className="py-9">
      <Container>
        <Grid>
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={`h-24 bg-sunk ${index >= 4 ? 'hidden tablet:block' : ''} ${index >= 8 ? 'tablet:hidden desktop:block' : ''}`}
            >
              <span className="figures block p-2 font-grotesque text-label text-ink-3">
                {index + 1}
              </span>
            </div>
          ))}
        </Grid>
      </Container>
    </div>
  ),
};
