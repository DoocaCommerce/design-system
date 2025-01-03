import type { Meta, StoryObj } from '@storybook/vue3';
import ListGroupItem from './ListGroupItem.vue';

import ListGroup from './ListGroup.vue';

const meta = {
  title: 'Ui/⛔ List Group',
  component: ListGroup,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ListGroup>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  render: () => ({
    components: { ListGroup, ListGroupItem },
    template: `
    <ListGroup>
      <ListGroupItem>ListGroup item</ListGroupItem>
      <ListGroupItem>ListGroup item</ListGroupItem>
    </ListGroup>`,
  }),
};
