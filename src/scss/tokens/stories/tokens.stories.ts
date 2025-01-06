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

const loadTokens = (type: string, group: string, subgroup: string | null = null) => {
  const itens = (tokens as any)[type][group];

  if (!subgroup) {
    return itens;
  }

  const filteredItens = Object.entries(itens).filter(([key]) => key.includes(subgroup));
  return Object.fromEntries(filteredItens);
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
      <div style="width: 80px; height: 80px; border: var(--s-border-light); background-color: #fff; border-radius: ${value}px"/>
    `;
  } else if (token.includes('width')) {
    return `
      <div style="width:100%; height:30px; border: var(--s-border-light); background-color: #fff; border-width: ${value}px"/>
    `;
  }
};

const loadZIndexPreview = (value: any) => {
  return `
    <div style="width: 60px; height: 60px; border: var(--s-border-light); background-color: #fff; margin: 10px 0; box-shadow: #ccc 0px 0px ${value * 3}px"/>
  `;
};

const loadTypographyPreview = (token: string, value: any) => {
  if (token.includes('family')) {
    const family = (value as string).charAt(0).toUpperCase() + value.slice(1);
    return `
      <link href="https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
      <span style="font-family: Roboto, serif; font-weight: 400; font-style: normal; font-size: 14px;">Design System Commerce Suite</span>
    `;
  } else if (token.includes('size')) {
    return `     
      <span style="font-weight: 400; font-style: normal; font-size: ${value}px;">Design System Commerce Suite</span>
    `;
  } else if (token.includes('weight')) {
    return `     
      <span style="font-weight: ${value}; font-style: normal; font-size: 14px;">Design System Commerce Suite</span>
    `;
  }
};

const loadLineHeightPreview = (value: string) => {
  return `<div style=" background-color: #d6eeff; width: 30px; height: ${value}px;"></div>`;
};

const loadMotionPreview = (token: string, value: string) => {
  if (token.includes('duration')) {
    return `<div style="width:30px; height:30px; border: var(--s-border-light); background-color: #fff; animation: ${value} linear 0s infinite normal both running spin"/>`;
  }

  return `<div style="width:30px; height:30px; border: var(--s-border-light); background-color: #fff; animation: 2s ${value} 0s infinite alternate both running slide"/>`;
};

const loadPreview = ({ type, value, index }: LoadPreviewParams): string | undefined => {
  switch (type) {
    case 'color':
      return loadColorPreview(value);
    case 'spacing':
      return loadSpagingPreview(value);
    case 'border':
      return loadBorderPreview(index, value);
    case 'z-index':
      return loadZIndexPreview(value);
    case 'font':
      return loadTypographyPreview(index, value);
    case 'line-height':
      return loadLineHeightPreview(value);
    case 'motion':
      return loadMotionPreview(index, value);
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
