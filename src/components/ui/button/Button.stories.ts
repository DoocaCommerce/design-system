import Button from './Button.vue';
import Icon from '../icon/Icon.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { ButtonVariant } from './types';

const variants: ButtonVariant[] = ['highlight', 'success', 'critical', 'plain', 'link', 'default'];

/** Buttons are used to initialize an action. The words on a button tell you what will happen when you click it. */
const meta: Meta<typeof Button> = {
  title: 'Ui/Button/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    type: 'button',
    label: 'Button',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      options: ['button', 'submit'],
      control: { type: 'select' },
    },
    variant: {
      control: 'select',
      options: variants,
    },
    target: {
      control: 'select',
      options: ['_blank', '_self'],
    },
    block: {
      control: 'boolean',
      defaultValue: false,
    },
    spinnerBorder: {
      control: 'number',
      defaultValue: 2,
    },
    loading: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const minimum: Story = {};

export const highlight: Story = {
  args: {
    variant: 'highlight',
  },
};

export const success: Story = {
  args: {
    variant: 'success',
  },
};

export const critical: Story = {
  args: {
    variant: 'critical',
  },
};

export const plain: Story = {
  args: {
    variant: 'plain',
  },
};

export const link: Story = {
  args: {
    variant: 'link',
    target: '_blank',
  },
};

export const loading: Story = {
  args: {
    loading: true,
  },
};

export const disabled: Story = {
  args: {
    disabled: true,
  },
};

export const trailingIcon: Story = {
  args: {
    trailingIcon: 'check',
  },
};

export const leadingIcon: Story = {
  args: {
    leadingIcon: 'check',
  },
};

export const onlyIcon: Story = {
  args: {
    label: '',
    leadingIcon: 'token',
    onlyIcon: true,
  },
};

export const withLargerIconAddedInSlot: Story = {
  render: (args) => ({
    components: { Button, Icon },
    setup() {
      return { args };
    },
    template: `
      <Button v-bind="args">
        <Icon name="check" size="20" />
        {{ args.label }}
      </Button>
    `,
  }),
  args: {
    label: '',
    onlyIcon: true,
  },
};
