import Breadcrumb from './UiBreadcrumb.vue';
import BreadcrumbItem from './BreadcrumbItem.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Ui/⛔ Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Breadcrumb, BreadcrumbItem },
    template: `
    <Breadcrumb>
      <BreadcrumbItem><a>Item1</a></BreadcrumbItem>
      <BreadcrumbItem><a>Item2</a></BreadcrumbItem>
      <BreadcrumbItem><a>Item3</a></BreadcrumbItem>
    </Breadcrumb>
    `,
  }),
};
