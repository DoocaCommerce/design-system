import type { Meta, StoryObj } from '@storybook/vue3';

import StatsItem from './StatsItem.vue';

/**
 * Base component used for the Stats Group.
 *
 * **Deprecated:** Este componente está depreciado e será removido em versões futuras.
 */
const meta = {
  title: 'Ui/Stats Item',
  component: StatsItem,
  tags: ['deprecated'],
  args: {
    label: 'StatsItem label',
    value: 'R$ 10',
    perc: undefined,
    info: undefined,
    primaryAction: undefined,
    text: undefined,
  },
  argTypes: {},
} satisfies Meta<typeof StatsItem>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {},
};
