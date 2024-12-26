import type { Meta, StoryObj } from '@storybook/vue3';

import Alert from './Alert.vue';
import type { AlertVariant } from './types';

const variants: AlertVariant[] = ['default', 'success', 'warning', 'critical', 'highlight'];

const meta = {
  title: 'Ui/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    show: true,
    title: 'Alert title',
    label: 'My content',
    icon: '',
    dismissible: false,
  },
  argTypes: {
    icon: {
      control: 'radio',
      options: [null, 'warning', 'error', 'check_circle'],
      description:
        'Todos os ícones disponíveis são os de estilo `Outlined` encontrados em [Material Symbols](https://fonts.google.com/icons).',
    },
    variant: {
      control: 'radio',
      options: variants,
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Para visualizar as cores do componente reflitadas para cada organização, alterne a organização selecionada no topo.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const minimum: Story = {
  args: {
    variant: 'default',
  },
};

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

export const warning: Story = {
  args: {
    variant: 'warning',
  },
};

export const critical: Story = {
  args: {
    variant: 'critical',
  },
};
