import FormColorpicker from './FormColorpicker.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

/** The color picker is used to set and select a color. */
const meta: Meta<typeof FormColorpicker> = {
  title: 'Ui/Form/FormColorpicker',
  component: FormColorpicker,
  render: (args) => ({
    components: { FormColorpicker },
    setup() {
      return { args };
    },
    template: /* html */ `<FormColorpicker v-bind="args" v-model="args.modelValue" />`,
  }),
  tags: ['autodocs'],
  args: {
    modelValue: '',
    label: 'label',
    placeholder: 'placeholder',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const minimum: Story = {};

export const withInput: Story = {
  args: {
    withInput: true,
  },
};
