import BrowserSelect from './BrowserSelect.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { service } from './__mocks__/BrowserSelect';

const serviceFiltered = {
  async get(params: any) {
    const res = await service.get(params);

    if (params.ids) {
      const ids = params.ids.split(',');
      res.data = res.data.filter((data: any) => {
        return ids.indexOf(String(data.id)) !== -1;
      });
    }

    return res;
  },
};

const meta: Meta<typeof BrowserSelect> = {
  title: 'Components/BrowserSelect',
  tags: ['deprecated'],
  component: BrowserSelect,
  args: {
    title: 'BrowserSelect title',
    service: serviceFiltered,
    modelValue: [1, 3],
  },
};

export default meta;
type Story = StoryObj<typeof BrowserSelect>;
export const defaultStory: Story = {
  name: 'Default',
  render: (args) => ({
    components: { BrowserSelect },
    setup() {
      return { args };
    },
    template: `<BrowserSelect v-bind="args" />`,
  }),
};

export const Button: Story = {
  args: {
    selectType: 'btn',
  },
  render: (args) => ({
    components: { BrowserSelect },
    setup() {
      return { args };
    },
    template: `<BrowserSelect v-bind="args" />`,
  }),
};
