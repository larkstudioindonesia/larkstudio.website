import type { Meta, StoryObj } from '@storybook/react';
import { FramedAction } from '../components/primitives/FramedAction';
import { InlineLink } from '../components/primitives/InlineLink';
import { NavLink } from '../components/chrome/NavLink';

/**
 * "Button variants" on this site means ROLE, not visual weight.
 *
 * There is no primary/secondary/tertiary, and no filled button at all:
 * a filled button is a commercial pressure device, and a studio that
 * asks is a studio that needs. Three interactive text objects exist,
 * and nothing else.
 *
 * Nothing moves in any state. Across every interactive element, state
 * is communicated through colour and border weight exclusively.
 */
const meta: Meta = { title: 'Primitives/Actions' };
export default meta;

export const AllThree: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-9 p-8">
      <section>
        <p className="mb-4 font-grotesque text-caption text-ink-3">
          Framed action — the single CTA object. One per reading unit.
        </p>
        <FramedAction href="#">Write to us</FramedAction>
      </section>

      <section>
        <p className="mb-4 font-grotesque text-caption text-ink-3">
          Inline link — 1px rule at 4px offset, moving to ink on hover.
        </p>
        <p className="font-serif text-body">
          The contractor was <InlineLink href="#">named on the page</InlineLink>,
          which is rare and disproportionately persuasive.
        </p>
      </section>

      <section>
        <p className="mb-4 font-grotesque text-caption text-ink-3">
          Navigation item — ink-2 to ink, 120ms. No sliding indicator.
        </p>
        <NavLink href="#">Approach</NavLink>
      </section>
    </div>
  ),
};

/** Tab through this story to review focus rings over paper. */
export const FocusStates: StoryObj = {
  render: () => (
    <div className="flex flex-col items-start gap-5 p-8">
      <p className="font-grotesque text-caption text-ink-3">
        Focus never animates: a keyboard user tabbing quickly needs the
        ring present on arrival, not 120ms later.
      </p>
      <FramedAction href="#">Framed action</FramedAction>
      <InlineLink href="#">Inline link</InlineLink>
      <NavLink href="#">Navigation item</NavLink>
    </div>
  ),
};
