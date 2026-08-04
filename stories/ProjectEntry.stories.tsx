import type { Meta, StoryObj } from '@storybook/react';
import { ProjectEntry } from '../components/primitives/ProjectEntry';
import { NextProject } from '../components/primitives/NextProject';
import { waroengAndalan } from '../content/projects/waroeng-andalan';

/**
 * WHAT THIS SITE HAS INSTEAD OF CARDS.
 *
 * Cards are dashboard vocabulary: containers that make heterogeneous
 * content look uniform in a grid. There is no grid here — four to six
 * projects at full-viewport scale — so there is nothing to contain,
 * and a card would reintroduce the border, radius, shadow and
 * background the system removed.
 *
 * Two composite forms exist, and no third:
 *   ProjectEntry — full-bleed, the home index
 *   NextProject  — thumbnail scale, the closing block
 *
 * Hover moves the identification line only. The image does nothing.
 *
 * Note: images will not render until real assets are placed under
 * public/images/. The reserved space is visible regardless, which is
 * itself worth reviewing — the layout must not shift when they load.
 */
const meta: Meta = { title: 'Composites/Project Entry' };
export default meta;

export const Entry: StoryObj = {
  render: () => (
    <div className="py-9">
      <ProjectEntry project={waroengAndalan} locale="en" priority />
    </div>
  ),
};

export const EntryBahasa: StoryObj = {
  render: () => (
    <div lang="id" className="py-9">
      <ProjectEntry project={waroengAndalan} locale="id" priority />
    </div>
  ),
};

export const NextPreview: StoryObj = {
  render: () => (
    <div className="max-w-[420px] px-5 py-9">
      <NextProject project={waroengAndalan} locale="en" />
    </div>
  ),
};
