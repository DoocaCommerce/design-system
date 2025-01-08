import type { GenerateTemplateParams } from './types';

export const generateTemplate = ({ type, columnWidth }: GenerateTemplateParams = { type: '' }) => {
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
