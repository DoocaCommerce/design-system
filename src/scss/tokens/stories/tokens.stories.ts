import type { Meta, StoryObj } from '@storybook/vue3';

import Table from '#ds/components/admin/table/Table.vue';
import TableBody from '#ds/components/admin/table/TableBody.vue';
import TableCell from '#ds/components/admin/table/TableCell.vue';
import TableHeadCell from '#ds/components/admin/table/TableHeadCell.vue';
import TableRow from '#ds/components/admin/table/TableRow.vue';
import { loadPreview } from './utils/loadPreview';
import { generateTemplate } from './utils/generateTemplate';
import { loadTokens } from './utils/loadTokens';

const components = { Table, TableHeadCell, TableBody, TableRow, TableCell };

const meta: Meta<typeof Table> = {
  tags: ['hideInSidebar'],
  component: Table,
  render: () => ({
    components,
    template: generateTemplate(),
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const primitiveColors: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('primitives', 'color');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'color',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const primitiveSpacing: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('primitives', 'spacing');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'spacing',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const primitiveBordersRadius: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('primitives', 'border', 'radius');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'border',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const primitiveBordersWidth: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('primitives', 'border', 'width');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'border',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const primitiveZIndex: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('primitives', 'z-index');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'z-index',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const brandTray: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('brand', 'tray');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'brand',
      columnWidth: {
        value: 200,
        preview: 300,
      },
    }),
  }),
};

export const brandBagy: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('brand', 'bagy');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'brand',
      columnWidth: {
        value: 200,
        preview: 300,
      },
    }),
  }),
};

export const brandSuiteCommerce: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('brand', 'suite-commerce');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'brand',
      columnWidth: {
        value: 200,
        preview: 300,
      },
    }),
  }),
};

export const semanticsColors: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'color');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'color',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const semanticsBordersWidth: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'border', 'width');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'border',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const semanticsBordersRadius: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'border', 'radius');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'border',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const semanticsSpacing: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'spacing');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'spacing',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const semanticsZIndex: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'z-index');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'z-index',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const semanticsTypographyFamily: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'font', 'family');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'font',
      columnWidth: {
        value: 150,
        preview: 400,
      },
    }),
  }),
};

export const semanticsTypographySize: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'font', 'size');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'font',
      columnWidth: {
        value: 150,
        preview: 400,
      },
    }),
  }),
};

export const semanticsTypographyWeight: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'font', 'weight');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'font',
      columnWidth: {
        value: 150,
        preview: 400,
      },
    }),
  }),
};

export const semanticsLineHeight: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('semantics', 'line-height');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'line-height',
      columnWidth: {
        value: 150,
        preview: 300,
      },
    }),
  }),
};

export const semanticsMotion: Story = {
  render: (args) => ({
    setup() {
      const css = `
        @keyframes slide {
          to {        
            transform: translatex(150px)
          }
        }
        @keyframes spin {
          from {		
            transform: rotate(0deg)
          }
          to {		
            transform: rotate(360deg)
          }
        }
      `;

      const styleTag = document.createElement('style');
      styleTag.textContent = css;
      document.head.appendChild(styleTag);

      const tokens = loadTokens('semantics', 'motion');
      return { args, tokens, loadPreview };
    },
    components,
    template: generateTemplate({
      type: 'motion',
      columnWidth: {
        value: 300,
        preview: 200,
      },
    }),
  }),
};
