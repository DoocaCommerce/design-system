import type { Meta, StoryObj } from '@storybook/vue3';

import Table from '#ds/components/admin/table/Table.vue';
import TableBody from '#ds/components/admin/table/TableBody.vue';
import TableCell from '#ds/components/admin/table/TableCell.vue';
import TableHeadCell from '#ds/components/admin/table/TableHeadCell.vue';
import TableRow from '#ds/components/admin/table/TableRow.vue';
import tokens from '../../../../.storybook/tokens.parsed.json';

type GenerateTemplateParams = {
  type: string;
  columnWidth?: {
    key?: number;
    value?: number;
    preview?: number;
  };
};

type LoadPreviewParams = {
  type: string;
  value: any;
  index: any;
};

const components = { Table, TableHeadCell, TableBody, TableRow, TableCell };

const loadTokens = (type: string, group: string) => {
  return (tokens as any)[type][group];
};

const loadColorPreview = (color: string) => {
  return `<div style="width:100%; height:30px; border: var(--s-border-light); background-color: ${color};"/>`;
};

const loadSpagingPreview = (spacing: string) => {
  return `
    <div style=" background-color: #d6eeff; width: ${spacing}px; height: 30px;"></div>
  `;
};

const loadBorderPreview = (token: string, value: any) => {
  if (token.includes('radius')) {
    return `
      <div style="width:30px; height:30px; border: var(--s-border-light); background-color: #fff; border-radius: ${value}px"/>
    `;
  } else if (token.includes('width')) {
    return `
      <div style="width:100%; height:30px; border: var(--s-border-light); background-color: #fff; border-width: ${value}px"/>
    `;
  }
};

const loadPreview = ({ type, value, index }: LoadPreviewParams): string | undefined => {
  switch (type) {
    case 'color':
      return loadColorPreview(value);
    case 'spacing':
      return loadSpagingPreview(value);
    case 'border':
      return loadBorderPreview(index, value);
    default:
      return;
  }
};

const generateTemplate = ({ type, columnWidth }: GenerateTemplateParams = { type: '' }) => {
  return `
    <Table v-bind="args">
      <template #header>
        <TableHeadCell>Token</TableHeadCell>
        <TableHeadCell>Valor</TableHeadCell>
        <TableHeadCell>Preview</TableHeadCell>
      </template>
      <TableBody>
        <TableRow v-for="(token, index) in tokens">
          <TableCell ${columnWidth?.key ? `width="${columnWidth?.key}"` : ''}>
            {{ index }}
          </TableCell>
          <TableCell ${columnWidth?.value ? `width="${columnWidth?.value}"` : ''}>            
            {{ token }}
          </TableCell>
          <TableCell ${columnWidth?.preview ? `width="${columnWidth?.preview}"` : ''}>
            ${type ? `<div v-html="loadPreview({ type: '${type}', value: token, index})"/>` : '---'}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  `;
};

const meta: Meta<typeof Table> = {
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

export const primitiveBorders: Story = {
  render: (args) => ({
    setup() {
      const tokens = loadTokens('primitives', 'border');
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
