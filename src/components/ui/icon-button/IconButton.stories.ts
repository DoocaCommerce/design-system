import IconButton from './IconButton.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

/**
 * Icon buttons are often in app bars and toolbars. They're good for toggle buttons, like adding or removing something.
 *
 * **Deprecated:** este componente está depreciado e será removido em breve. Use o Button com a propriedade `only-icon` no lugar.
 */
const meta: Meta<typeof IconButton> = {
  title: 'Ui/Button/⛔ IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    icon: 'close',
    onColor: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'danger', 'link', 'plain', 'default'],
    },
    disabled: {
      defaultValue: false,
      control: 'boolean',
    },
    fab: {
      defaultValue: false,
      control: 'boolean',
    },
    onColor: {
      defaultValue: false,
      control: 'boolean',
    },

    size: {
      defaultValue: 'md',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnColor: Story = {
  args: {
    onColor: true,
  },
};
