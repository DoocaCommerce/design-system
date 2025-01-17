import FormRichtext from './FormRichtext.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

/**
 * O componente FormRichtext é um campo de texto que oferece alinhamento de texto, upload
 * de imagens, links de texto e um editor HTML. Ele é normalmente usado para criar
 * descrições personalizadas.
 *
 * > Atenção: Nem todas as tags HTML são permitidas no editor como a `doctype`, `html`
 * ou `head`. Portanto, ele não é adequado para a edição de e-mails completos, sendo mais
 * indicado para necessidades simples de edição de HTML.
 *
 * Para utilizá-lo confira a documentação da bibliteca
 * [Redactor](https://imperavi.com/legacy/redactor-classic/) na versão usada nesse
 * componente.
 */
const meta: Meta<typeof FormRichtext> = {
  title: 'Ui/Form/FormRichtext',
  component: FormRichtext,
  render: (args) => ({
    components: { FormRichtext },
    setup() {
      return { args };
    },
    template: /* html */ `<FormRichtext v-bind="args" v-model="args.modelValue" />`,
  }),
  tags: ['autodocs'],
  argTypes: {
    modelValue: { type: 'string' },
  },
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const minimum: Story = {};

export const withValue: Story = {
  args: {
    modelValue: '<div><strong>Hello World!</strong></div>',
  },
};
