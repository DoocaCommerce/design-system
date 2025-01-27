import { completeOnlyFilesDropFiles } from './__mocks__/completeFilesDropFiles';
import { completeOnlyImagesDropFiles } from './__mocks__/completeOnlyImagesDropFiles';
import { configWithImage } from './__mocks__/configWithImage';
import DropFiles from './DropFiles.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import ImageTest from './__mocks__/image-drop-files-test.jpg';
import DogImage from './__mocks__/dog-drop-files-test.jpg';
import ExampleText from './__mocks__/example.txt';
import { createLocalFile } from './__mocks__/createLocalFile';
import { completeDropFilesActions } from './__mocks__/completeDropFilesActions';
import { configWithFile } from './__mocks__/configWithFile';

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

      setTimeout(() => {
        createLocalFile(DogImage).then((file: File) => {
          args.file = file;
        });
      }, 10000);

      return { args };
    },
    template: templateDropFiles,
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
      createLocalFile(ExampleText).then((file: File) => {
        args.file = file;
      });

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
      createLocalFile(ExampleText).then((file: File) => {
        args.file = file;
      });

      return { args };
    },
    template: templateDropFiles,
  }),
  args: {
    classes: {
      'classe-adicionada-via-attrs': true,
    },
    ...configWithFile,
    ...completeDropFilesActions,
  } as any,
};
