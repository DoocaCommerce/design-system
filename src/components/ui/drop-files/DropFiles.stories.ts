import { completeOnlyFilesDropFiles } from './__mocks__/completeFilesDropFiles';
import { completeOnlyImagesDropFiles } from './__mocks__/completeOnlyImagesDropFiles';
import DropFiles from './DropFiles.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof DropFiles> = {
  title: 'ui/DropFiles',
  component: DropFiles,
  render: (args) =>
    ({
      components: { DropFiles },
      setup() {
        return { args };
      },
      template: /* html */ `
        <div style="max-width: 400px;">
          <DropFiles v-bind="args" />
        </div>
      `,
    }) as any,
  argTypes: {},
  args: {
    disabled: false,
  },
  parameters: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

const size2MB = 2 * 1024 * 1024;

export const minimumOnlyImages: Story = {
  args: {
    allowedFormats: ['image/jpeg', 'image/png', '.gif'],
    maxFileSize: size2MB,
    subtitle: 'JPEG, JPG, PNG ou GIF com até 2MB com dimensões recomendadas de 1920x1920px',
  },
};

export const completeOnlyImages: Story = {
  args: {
    ...completeOnlyImagesDropFiles,
  },
};

export const completeOnlyImagesDisabled: Story = {
  args: {
    ...completeOnlyImagesDropFiles,
    disabled: true,
  },
};

export const completeFiles: Story = {
  args: {
    ...completeOnlyFilesDropFiles,
  },
};

export const completeFilesDisabled: Story = {
  args: {
    ...completeOnlyFilesDropFiles,
    disabled: true,
  },
};
