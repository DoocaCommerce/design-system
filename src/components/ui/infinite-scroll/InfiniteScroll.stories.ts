import type { Meta, StoryObj } from '@storybook/vue3';

import InfiniteScroll from './InfiniteScroll.vue';

const meta = {
  title: 'Ui/Infinite Scroll',
  component: InfiniteScroll,
  tags: ['deprecated'],
  args: {
    load: () => {
      return;
    },
    spinnerSize: 30,
    scrollableElementId: undefined,
  },
  argTypes: {
    spinnerSize: {
      control: 'number',
    },
  },
} satisfies Meta<typeof InfiniteScroll>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {},
};
