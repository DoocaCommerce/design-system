import type { Meta, StoryObj } from '@storybook/vue3';

import CalloutCard from './CalloutCard.vue';

/**
 * **Deprecated:** este componente está depreciado e será removido em breve.
 */
const meta: Meta<typeof CalloutCard> = {
  title: 'Ui/⛔ Callout Card',
  component: CalloutCard,
  tags: ['autodocs'],
  args: {
    title: 'Callout card title',
    icon: 'house',
    primaryAction: undefined,
    justifyCardActions: undefined,
    bgColorIconPrimary: undefined,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { CalloutCard },
    setup() {
      return { args };
    },
    template: `
      <CalloutCard v-bind="args">Callout card content</CalloutCard>
      `,
  }),
};
