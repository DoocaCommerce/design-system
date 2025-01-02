import type { IndexTableProps, KeyLabelDefault } from '../types';
import { completeIndexTableProps, type ItemInTable } from './completeIndexTableArgs';

export const allItems: ItemInTable[] = [
  {
    id: 1,
    name: 'Product 1',
    price: 'R$ 100,00',
  },
  {
    id: 2,
    name: 'Product 2',
    price: 'R$ 200,00',
  },
  {
    id: 3,
    name: 'Product 3',
    price: 'R$ 300,00',
  },
  {
    id: 4,
    name: 'Product 4',
    price: 'R$ 400,00',
  },
  {
    id: 5,
    name: 'Product 5',
    price: 'R$ 500,00',
  },
  {
    id: 6,
    name: 'Product 6',
    price: 'R$ 600,00',
  },
  {
    id: 7,
    name: 'Product 7',
    price: 'R$ 700,00',
  },
  {
    id: 8,
    name: 'Product 8',
    price: 'R$ 800,00',
  },
  {
    id: 9,
    name: 'Product 9',
    price: 'R$ 900,00',
  },
  {
    id: 10,
    name: 'Product 10',
    price: 'R$ 1000,00',
  },
];

export const itemsActive = [allItems[1], allItems[2], allItems[5]];
export const filterTagsActiveTab = [
  {
    key: 'status_active',
    label: 'Status: Ativo',
  },
];

export const itemsInactive = [
  allItems[0],
  allItems[3],
  allItems[4],
  allItems[6],
  allItems[7],
  allItems[8],
  allItems[9],
];
export const filterTagsInactiveTab = [
  {
    key: 'status_inactive',
    label: 'Status: Inativo',
  },
];

export const flowForChangingTabsAndRemovingFiltersIndexTableProps: IndexTableProps<ItemInTable> = {
  ...completeIndexTableProps,
  items: allItems,
  tabs: [
    {
      label: 'Todos',
      key: 'all',
      active: true,
    },
    {
      label: 'Produtos ativos',
      key: 'active_products',
      active: false,
    },
    {
      label: 'Produtos inativos',
      key: 'inactive_products',
      active: false,
    },
  ],
  activeFilterTags: [],
  loadingText: 'Carregando produtos',
};

export const wrapperToChangeTab = (key: string, args: IndexTableProps<ItemInTable>) => {
  args.isInternalLoading = true;
  console.info('Changing tab >>>>', key);
  // TODO: adicionar troca de paginação

  setTimeout(() => {
    if (key === 'active_products') {
      args.activeFilterTags = filterTagsActiveTab;
      args.items = itemsActive;
    }

    if (key === 'inactive_products') {
      args.activeFilterTags = filterTagsInactiveTab;
      args.items = itemsInactive;
    }

    if (key === 'all') {
      args.activeFilterTags = [];
      args.items = allItems;
    }

    args.isInternalLoading = false;
  }, 2000);
};

export const wrapperToRemoveFilter = (tagFilter: KeyLabelDefault, args: IndexTableProps<ItemInTable>) => {
  console.info('Removing filter >>>>', tagFilter);

  args.activeFilterTags = [];
  args.items = allItems;
  args.tabs = args.tabs.map((tab) => ({ ...tab, active: tab.key === 'all' }));
};
