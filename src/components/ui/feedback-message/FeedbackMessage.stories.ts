import type { Meta, StoryObj } from '@storybook/vue3';
import FeeedbackMessage from './FeedbackMessage.vue';
import { fn } from '@storybook/test';

const meta: Meta<typeof FeeedbackMessage> = {
  title: 'ui/FeeedbackMessage',
  component: FeeedbackMessage,
  render: (args) => ({
    components: { FeeedbackMessage },
    setup() {
      return { args };
    },
    template: '<FeeedbackMessage v-bind="args" />',
  }),
  argTypes: {},
  parameters: {
    controls: { expanded: true },
    docs: {
      controls: { exclude: '^on.*' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const minimum: Story = {
  args: {
    title: 'Nenhum resultado encontrado',
    subtitle:
      'Não encontramos nenhum item que corresponda à sua pesquisa.<br>Verifique o termo digitado ou tente um filtro diferente.',
    button: {
      label: 'Limpar filtros',
      variant: 'highlight',
    },
    showIcon: true,
    showButton: true,
    onAction: fn(),
  },
};
