import { ref } from 'vue';
import Aside from './Aside.vue';
import Button from '../button/Button.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof Aside> = {
  title: 'Ui/Aside',
  component: Aside,
  tags: ['autodocs'],
  args: {
    modelValue: false,
    title: 'Aside title',
    subtitle: 'Aside subtitle',
    size: 'md',
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      defaultValue: false,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    inner: {
      control: 'boolean',
      defaultValue: false,
    },
    scrollable: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Aside, Button },
    setup() {
      const modelValue = ref(args.modelValue);
      const onUpdateModelValue = (value: boolean) => {
        modelValue.value = value;
      };

      return { args, modelValue, onUpdateModelValue };
    },
    template: `
    <div>
      <Button variant="highlight" v-on:click="modelValue = true" >Open aside</Button>
      <Aside v-bind="args" v-model="modelValue" @update:modelValue="onUpdateModelValue"/>
    </div>`,
  }),
};

export const WithButtons: Story = {
  args: {
    primaryAction: {
      label: 'Primary action',
      onAction: () => {},
    },
    secondaryActions: [
      {
        label: 'Secondary actions',
        onAction: () => {},
      },
    ],
  },
  render: Default.render,
};

export const Scrollable: Story = {
  args: {
    scrollable: true,
  },
  render: Default.render,
};

export const ScrollableWithButtons: Story = {
  args: {
    scrollable: true,
    primaryAction: {
      label: 'Primary action',
      onAction: () => {},
    },
    secondaryActions: [
      {
        label: 'Secondary actions',
        onAction: () => {},
      },
    ],
  },
  render: Default.render,
};
