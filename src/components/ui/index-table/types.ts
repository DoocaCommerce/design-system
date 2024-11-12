export interface KeyLabelDefault {
  label: string;
  key: string;
}

export interface Tab extends KeyLabelDefault {
  active: boolean;
}

export interface IndexTableTabsProps {
  tabs: Tab[];
}

export interface IndexTableTabsEmits {
  /** Quando as abas estão visíveis essa ação é disparada ao clicar em uma aba  */
  (event: 'open-tab', key: string): void;
}

export interface ActionsToShow {
  select: boolean;
  reload: boolean;
  search: boolean;
  customFilters: boolean;
  filters: boolean;
  bulkActionDelete: boolean;
}

export interface IndexTablePaginationItemProps {
  from: number;
  to: number;
  page: number;
  size: number;
  total: number;
}

export interface ActionOrdination extends KeyLabelDefault {
  active: boolean;
}

export interface IndexTableOrderButtonProps {
  ordination: null | ActionOrdination[];
}

export interface IndexTableActionsProps extends IndexTableOrderButtonProps {
  /** Define quais elementos internos serão exibidos no componente */
  show: ActionsToShow;
  /** Quando o valor null é passado libera o slot #pagination para o uso do componente desejado */
  pagination: null | IndexTablePaginationItemProps;
  /** Define quais tags de filtros estão aplicados a tabela no momento */
  activeFilterTags: KeyLabelDefault[];
  /** Define quais ações em massa serão exibidas ao selecionar itens da listagem */
  bulkActions: KeyLabelDefault[];
  isLoading: boolean;
  /** Usado para simular a aplicação de uma busca desejada na listagem, como no caso de obter a busca de query params da URL por exemplo */
  searchValue?: string;
  /** Usado para definir o valor do checkbox responsável por selecionar todos os itens. Quando `null` tem o aspecto indeterminate e quando `true` é exibido como checado */
  checkboxSelectAllValue?: boolean | null;
}

export interface IndexTableOrderButtonEmits {
  /** Ação disparada ao clicar em um botão de ordenação */
  (event: 'order-by', key: string): void;
}

export interface IndexTableActionsSlots {
  actions(): unknown;
  ['action-pagination'](): unknown;
  ['bulk-actions'](): unknown;
}

export interface IndexTablePaginationItemEmits {
  /** Ação disparada quando o componente tem a paginação padrão e clica para avançar para a próxima página */
  (event: 'next-page'): void;
  /** Ação disparada quando o componente tem a paginação padrão e clica para voltar para a página anterior */
  (event: 'previous-page'): void;
}

export interface IndexTableActionsEmits extends IndexTableOrderButtonEmits, IndexTablePaginationItemEmits {
  /** Ação disparada no clique para limpar o campo de pesquisa */
  (event: 'clear-search'): void;
  /** Ação disparada ao efetuar uma pesquisa */
  (event: 'search', word: string): void;
  /** Ação disparada no clique para recarregar a listagem */
  (event: 'reload'): void;
  /** Ação disparada no botão `Filtros`, não necessário se o mesmo estiver oculto. */
  (event: 'filters'): void;
  /** Ação disparada no botão `Salvar` do dropdown pertencente aos filtros customizados do botão `Salvar filtro`, enviando os filtros customizados ativos no momento. */
  (event: 'save-custom-filter', activeFilters: KeyLabelDefault[]): void;
  /** Ação disparada ao clicar no checkbox da seção de ações que seleciona todos os itens da listagem, não necessário se o mesmo estiver oculto. Envia o valor setado no checkbox. */
  (event: 'select-all', value: boolean | null): void;
  /** Ação disparada ao clicar no botão "Deletar" exibido ao selecionar itens da tabela */
  (event: 'delete-selected-items'): void;
  /** Ação disparada ao clicar em uma das ações em massa listadas por padrão no componente */
  (event: 'bulk-action', key: string): void;
}

export interface ColsToShow {
  select: boolean;
}

export interface IndexTableListProps<T> {
  items: T[];
  fields?: KeyLabelDefault[];
  show?: ColsToShow;
}

export interface IndexTablePropShow extends ActionsToShow {
  tabs: boolean;
}

export interface IndexTableProps<T> extends IndexTableTabsProps, Omit<IndexTableActionsProps, 'show'>, IndexTableListProps<T> {
  show?: IndexTablePropShow;
}

export interface IndexTableEmits extends IndexTableTabsEmits, IndexTableActionsEmits {}

export type IndexTableSlots = IndexTableActionsSlots;
