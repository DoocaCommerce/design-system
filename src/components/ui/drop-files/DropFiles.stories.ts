import { completeOnlyFilesDropFiles } from './__mocks__/completeFilesDropFiles';
import { completeOnlyImagesDropFiles } from './__mocks__/completeOnlyImagesDropFiles';
import { configWithImage } from './__mocks__/configWithImage';
import DropFiles from './DropFiles.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import ImageTest from './__mocks__/image-drop-files-test.jpg';
import DogImage from './__mocks__/dog-drop-files-test.jpg';
import { createLocalFile } from './__mocks__/createLocalFile';
import { completeDropFilesActions } from './__mocks__/completeDropFilesActions';
import { configWithFile } from './__mocks__/configWithFile';
import { createMockFile } from './__mocks__/createMockFile';

const templateDropFiles = /* html */ `
<div style="max-width: 400px;">
<DropFiles v-bind="args" :class="args.classes" />
</div>
`;

const meta: Meta<typeof DropFiles> = {
  title: 'ui/DropFiles',
  tags: ['beta'],
  component: DropFiles,
  render: (args) => ({
    components: { DropFiles },
    setup() {
      return { args };
    },
    template: templateDropFiles,
  }),
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
    ...completeDropFilesActions,
  },
};

export const completeOnlyImagesDisabled: Story = {
  args: {
    ...completeOnlyImagesDropFiles,
    disabled: true,
    ...completeDropFilesActions,
  },
};

export const completeFiles: Story = {
  args: {
    ...completeOnlyFilesDropFiles,
    ...completeDropFilesActions,
  },
};

export const completeFilesDisabled: Story = {
  args: {
    ...completeOnlyFilesDropFiles,
    disabled: true,
    ...completeDropFilesActions,
  },
};

export const withImage: Story = {
  render: (args: any) => ({
    components: { DropFiles },
    setup() {
      createLocalFile(ImageTest).then((file: File) => {
        args.file = file;
      });

      return { args };
    },
    template: templateDropFiles,
  }),
  args: {
    ...configWithImage,
    ...completeDropFilesActions,
  },
};

export const changeImages: Story = {
  render: (args: any) => ({
    components: { DropFiles },
    setup() {
      createLocalFile(ImageTest).then((file: File) => {
        args.file = file;
      });

      setTimeout(() => {
        createLocalFile(DogImage).then((file: File) => {
          args.file = file;
        });
      }, 3000);

      return { args };
    },
    template:
      templateDropFiles +
      '<b style="display: block; margin-top: 20px; background: #a9a9a92b; border-radius: 30px; width: fit-content; padding: 10px;">Observe que a imagem será alterada em 3 segundos!</b>',
  }),
  args: {
    ...configWithImage,
    ...completeDropFilesActions,
  },
};

export const withFile: Story = {
  render: (args: any) => ({
    components: { DropFiles },
    setup() {
      const file = createMockFile({ name: 'example.txt', size: 1024, type: 'text/plain' });
      args.file = file;

      return { args };
    },
    template: templateDropFiles,
  }),
  args: {
    ...configWithFile,
    ...completeDropFilesActions,
  },
};

export const withFileAndCustomClass: Story = {
  render: (args: any) => ({
    components: { DropFiles },
    setup() {
      const file = createMockFile({ name: 'example.txt', size: 1024, type: 'text/plain' });
      args.file = file;

      return { args };
    },
    template:
      templateDropFiles +
      '<b style="display: block; margin-top: 20px; background: #a9a9a92b; border-radius: 30px; width: fit-content; padding: 10px;">Nesse componente foi adicionado uma classe <code>-personalized-style</code> inspecione o código para visualizar</b>',
  }),
  args: {
    classes: {
      '-personalized-style': true,
    },
    ...configWithFile,
    ...completeDropFilesActions,
  } as any,
};
