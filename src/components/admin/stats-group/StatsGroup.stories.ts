import StatsGroup from './StatsGroup.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

/**
 * **Deprecated:** Este componente está depreciado e será removido em versões futuras.
 */
const meta: Meta<typeof StatsGroup> = {
  title: 'admin/StatsGroup',
  component: StatsGroup,
  tags: ['autodocs', 'deprecated'],
  args: {
    infos: [{ label: '', text: 'Hello', value: 'valor' }],
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
