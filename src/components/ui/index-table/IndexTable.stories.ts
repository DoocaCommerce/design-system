import type { Meta, StoryObj } from '@storybook/vue3';
import Button from '../button/Button.vue';
import {
  completeIndexTableActions,
  completeIndexTableProps,
  type ItemInTable,
} from './__mocks__/completeIndexTableArgs';
import { customLineWidthAndHeightIndexTableProps } from './__mocks__/customLineWidthAndHeightIndexTableArgs';
import { customSlotsIndexTableProps } from './__mocks__/customSlotsArgs';
import './__mocks__/CustomStyleIndexTable.css';
import { filterTabWithoutItemsIndexTableProps } from './__mocks__/filterTabWithoutItemsArgs';
import {
  flowForChangingTabsAndRemovingFiltersIndexTableProps,
  wrapperToChangeTab,
  wrapperToRemoveFilter,
} from './__mocks__/flowForChangingTabsAndRemovingFiltersArgs';
import { changeLoading, initializationLoadingDataTableProps } from './__mocks__/initializationLoadingDataArgs';
import { minimumIndexTableProps } from './__mocks__/minimumIndexTableArgs';
import { handlePageChange, paginationChangeIndexTableProps } from './__mocks__/paginationChangeIndexTableArgs';
import { orderByName, sortItemsIndexTableProps, wrapperOrderBy } from './__mocks__/sortItemsIndexTableArgs';
import IndexTable from './IndexTable.vue';
import type { KeyLabelDefault } from './types';

const templateIndexTable = /* html */ `
  <IndexTable v-bind="args">
    <template v-for="(content, name) in args.slots" #[name]="propsSlot">
      {{ content }}
    </template>
  </IndexTable>
`;

const meta: Meta<typeof IndexTable<ItemInTable>> = {
  title: 'ui/IndexTable',
  tags: ['beta'],
  component: IndexTable as any,
  render: (args) =>
    ({
      components: { IndexTable },
      setup() {
        return { args };
      },
      template: templateIndexTable,
    }) as any,
  argTypes: {
    pagination: { control: { type: 'object' } },
    ordination: { control: { type: 'object' } },
    searchValue: { control: { type: 'text' }, if: { arg: 'show.search' } },
    isLoading: { control: { type: 'boolean' } },
    isInternalLoading: { control: { type: 'boolean' } },
    emptyResultDisplay: { control: { type: 'object' } },
    checkboxSelectAllValue: { control: { type: 'select' }, options: [true, false, null] },
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      controls: { exclude: '^on.*' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const complete: Story = {
  args: {
    ...completeIndexTableProps,
    ...completeIndexTableActions,
  },
};

export const filterTabWithoutItems: Story = {
  args: {
    ...filterTabWithoutItemsIndexTableProps,
    ...completeIndexTableActions,
  },
};

export const initializationLoadingData: Story = {
  args: {
    ...initializationLoadingDataTableProps,
    ...completeIndexTableActions,
  },
  render: (args) =>
    ({
      components: { IndexTable },
      setup() {
        changeLoading(args as any);

        return { args };
      },
      template: templateIndexTable,
    }) as any,
};

export const flowForChangingTabsAndRemovingFilters: Story = {
  args: {
    ...flowForChangingTabsAndRemovingFiltersIndexTableProps,
    ...completeIndexTableActions,
  },
  render: (args: any) =>
    ({
      components: { IndexTable },
      setup() {
        const handleOpenTab = (key: string) => {
          wrapperToChangeTab(key, args);
        };

        args.onOpenTab = handleOpenTab;

        const handleRemoveFilter = (tagFilter: KeyLabelDefault) => {
          wrapperToRemoveFilter(tagFilter, args);
        };

        args.onRemoveFilter = handleRemoveFilter;

        return { args };
      },
      template: templateIndexTable,
    }) as any,
};

export const customSlots: Story = {
  args: {
    ...customSlotsIndexTableProps,
    ...completeIndexTableActions,
  },
  render: (args) =>
    ({
      components: { IndexTable, Button },
      setup() {
        return { args };
      },
      template: /* html */ `
        <IndexTable v-bind="args">
          <template #head(price)="propsSlot">
            {{propsSlot.label}} (R$)
          </template>

          <template #actions="{ item }">
            <Button style="text-wrap-mode: nowrap;" size="sm" label="Outra ação" @click="console.log('outra ação adicionada')" />
          </template>

          <template #bulk-actions>
            <Button style="text-wrap-mode: nowrap;" size="sm" label="Visualizar item" @click="console.log('visualizar item do slot bulk-actions')" />
          </template>

          <template #action-pagination>
            <Button style="text-wrap-mode: nowrap;" size="sm" label="Ver no dashboard" @click="console.log('ver no dashboard')" />
          </template>

          <template #cell(name)="propsSlot">
            <div style="display: flex; align-items: center;">
              <img v-if="propsSlot.item.image" :src="propsSlot.item.image"> {{propsSlot.item.name}} <b v-if="propsSlot.item.model">- Modelo: {{propsSlot.item.model}}</b>
            </div>
          </template>

          <template #footer-actions>
            <Button style="text-wrap-mode: nowrap;" size="sm" label="Ação do Rodapé" @click="console.log('ação do rodapé')" />
          </template>

        </IndexTable>
      `,
    }) as any,
};

export const sortItems: Story = {
  args: {
    ...sortItemsIndexTableProps,
    ...completeIndexTableActions,
  },
  render: (args: any) =>
    ({
      components: { IndexTable },
      setup() {
        orderByName(args);
        const handleSortItems = (key: string) => {
          wrapperOrderBy(key, args);
        };

        args.onOrderBy = handleSortItems;

        return { args };
      },
      template: templateIndexTable,
    }) as any,
};

export const paginationChange: Story = {
  args: {
    ...paginationChangeIndexTableProps,
    ...completeIndexTableActions,
  },
  render: (args: any) =>
    ({
      components: { IndexTable },
      setup() {
        const handleNextPage = () => {
          handlePageChange(args, 'next-page');
        };

        const handlePreviousPage = () => {
          handlePageChange(args, 'previous-page');
        };

        args.onNextPage = handleNextPage;
        args.onPreviousPage = handlePreviousPage;

        return { args };
      },
      template: templateIndexTable,
    }) as any,
};

export const customLineWidthAndHeight: Story = {
  args: {
    ...customLineWidthAndHeightIndexTableProps,
    ...completeIndexTableActions,
  },
};

export const minimum: Story = {
  args: {
    ...minimumIndexTableProps,
    ...completeIndexTableActions,
  },
};
