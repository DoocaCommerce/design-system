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
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Design Tokens', ['Primitivos', '*'], 'UI', 'Admin', 'Components'],
      },
    },
  },
  decorators: [schemaMode, brandMode],
  globalTypes: {
    schema,
    brand,
  },
  tags: ['autodocs'],
};

export default preview;
