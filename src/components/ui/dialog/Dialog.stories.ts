import Dialog from './Dialog.vue';
import Button from '../button/Button.vue';
import { $dialog } from './index';
import type { DialogConfig } from './index';
import type { StoryObj, Meta } from '@storybook/vue3';

interface MergedType extends Meta<typeof Dialog>, DialogConfig {}

const meta: MergedType = {
  title: 'Ui/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: {
    title: 'Dialog Title',
    message: 'Dialog message here...',
    closeOnBackdrop: true,
    cancelLabel: 'Cancel',
    destructIcon: '',
    destructLabel: 'Deletar',
    destructVariant: 'critical',
    hideFooter: false,
    hideCancel: false,
    opened: true,
    promptType: 'text',
  },
  argTypes: {
    destructVariant: {
      control: {
        type: 'select',
        options: ['success', 'danger', 'primary'],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const minimum: Story = {
  render: (args) => ({
    components: { Dialog, Button },
    setup() {
      const onClick = () => {
        $dialog.open(args);
      };
      return { args, onClick };
    },
    template: `
    <Button variant="highlight" @click="onClick" label="open" />
    `,
  }),
};

export const defaultPrompt: Story = {
  args: {
    type: 'prompt',
    promptLabel: 'Prompt Label',
    promptPlaceholder: 'Placeholder here...',
    hideFooter: true,
  },
  render: minimum.render,
};

export const promptWithFooter: Story = {
  args: {
    type: 'prompt',
    promptLabel: 'Prompt Label',
    promptPlaceholder: 'Placeholder here...',
  },
  render: minimum.render,
};
