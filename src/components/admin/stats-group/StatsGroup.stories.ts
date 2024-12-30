import StatsGroup from './StatsGroup.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

/**
 * **Deprecated:** este componente está depreciado e será removido em breve.
 */
const meta: Meta<typeof StatsGroup> = {
  title: 'admin/⛔ StatsGroup',
  component: StatsGroup,
  tags: ['autodocs'],
  args: {
    infos: [
      { text: 'Hello', value: 'valor' },
      { text: 'Hello', value: 'valor' },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
