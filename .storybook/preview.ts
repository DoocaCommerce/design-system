import type { Preview } from '@storybook/vue3';
import { schema, schemaMode } from './decorators/schemaMode';
import { brand, brandMode } from './decorators/brandMode';
import './theme.scss';
import '../src/scss/theme.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [schemaMode, brandMode],
  globalTypes: {
    schema,
    brand,
  },
};

export default preview;
