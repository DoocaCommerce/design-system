import type { Meta, StoryObj } from '@storybook/vue3';

import ProgressIndeterminate from './ProgressIndeterminate.vue';

const meta: Meta<typeof ProgressIndeterminate> = {
  title: 'Ui/Progress Indeterminate',
  component: ProgressIndeterminate,
  tags: ['deprecated'],
  args: {},
  argTypes: {},
};

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {},
};
