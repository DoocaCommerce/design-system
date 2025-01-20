import type { FeedbackMessageProps } from '../feedback-message/types';

export interface KeyLabelDefault {
  label: string;
  key: string;
}

export interface TabIndexTable extends KeyLabelDefault {
  active: boolean;
  disabled?: boolean;
  badge?: string;
}

export interface IndexTableTabsProps {
  /** Abas a exibir no componente que podem ser desabilitadas ou definidas como ativas conforme necessidade e também disponibiliza a `badge` da mesma forma que o componente `TabItem` */
  tabs: TabIndexTable[];
}

export interface IndexTableTabsEmits {
  /** Quando as abas estão visíveis essa ação é disparada ao clicar em uma aba  */
  (event: 'open-tab', key: string): void;
}

export interface ActionsToShow {
  select: boolean;
  reload: boolean;
  search: boolean;
  filters: boolean;
  bulkActionDelete: boolean;
}

export interface IndexTableInternalLoaderProps {
  /** Estado de carregamento interno do componente, deve ser usado para troca entre abas no componente IndexTable, ele permite a visualização do loading dentro do componente */
  isInternalLoading: boolean;
  /** Texto para o estado de carregamento interno do componente, se nada for passado assume um valor padrão */
  loadingText?: string;
}

export interface IndexTablePaginationProp {
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
  /** Define as opções de ordenação a serem exibidas no componente, sempre deve ser definida uma opção como ativa, se nenhuma for definida seleciona a primeira. Uma característica da lista de opções de ordenação é não permitir seleção múltipla, assim ao selecionar uma opção desmarca a anterior. */
  ordination: null | ActionOrdination[];
}

export interface IndexTableEmptyMessageProps extends FeedbackMessageProps {}

export interface IndexTableEmptyResultProps extends Partial<IndexTableEmptyMessageProps> {
  /** Define se irá exibir a visualização do resultado de pesquisa vazio */
  show: boolean;
}

interface IndexTableEmptyResultDisplayProps {
  /** Permite configurar se será exibido o resultado de pesquisa vazio e personalizar a mensagem, ícone e botão de acordo com a necessidade. */
  emptyResultDisplay: IndexTableEmptyResultProps;
}

/** Propriedades para determinar a paginação no componente interno */
export type IndexTablePaginationItemProps = IndexTableInternalLoaderProps &
  IndexTablePaginationProp &
  IndexTableEmptyResultDisplayProps;

export interface IndexTableActionsProps
  extends IndexTableOrderButtonProps,
    IndexTableEmptyResultDisplayProps,
    IndexTableInternalLoaderProps {
  show: ActionsToShow;
  /** Quando o valor `null` é passado libera o slot `#pagination` para o uso do componente desejado, se houver. Interface para implementação da prop `pagination` é a `IndexTablePaginationProp`. */
  pagination: null | IndexTablePaginationProp;
  /** Define quais tags de filtros estão aplicados a tabela no momento. Interface para implementação é a `KeyLabelDefault[]`. */
  activeFilterTags: KeyLabelDefault[];
  /** Define quais ações em massa serão exibidas ao selecionar itens da listagem */
  bulkActions: KeyLabelDefault[];
  /** Usado para simular a aplicação de uma busca inicial desejada na listagem, como no caso de obter a busca de query params da URL por exemplo */
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
  /** Ação disparada ao clicar no checkbox da seção de ações que seleciona todos os itens da listagem, não necessário se o mesmo estiver oculto. Envia o valor setado no checkbox. */
  (event: 'select-all', value: boolean | null): void;
  /** Ação disparada ao clicar no botão "Deletar" exibido ao selecionar itens da tabela */
  (event: 'delete-selected-items'): void;
  /** Ação disparada ao clicar em uma das ações em massa listadas por padrão no componente */
  (event: 'bulk-action', key: string): void;
  /** Ação disparada ao clicar no botão fechar de uma tag de filtro da listagem */
  (event: 'remove-filter', tagFilter: KeyLabelDefault): void;
}

export interface ColsToShow {
  select: boolean;
}

export interface IndexTableListProps<T> extends IndexTableEmptyResultDisplayProps {
  /** Lista de items a serem exibidos na tabela com o tipo de objeto que for desejado. Para que os dados sejam exibidos corretamente, é necessário que o objeto tenha as chaves correspondentes aos campos de `key` definidos na prop `fields`, se uma chave não corresponder a um `field` o dado não será exibido. */
  items: T[];
  /**
   * Cada item na lista de fields representa uma coluna da tabela, e a ordem no array
   * define a sequência de exibição na tabela. Será gerada uma classe para cada coluna
   * com o key da mesma que permite a personalização via css, esta classe terá o padrão
   * `ui-index-table-list-head-{key}`.
   */
  fields: KeyLabelDefault[];
  show?: ColsToShow;
  /** Usado para definir o valor do checkbox responsável por selecionar todos os itens. Quando `null` tem o aspecto indeterminate e quando `true` é exibido como checado */
  checkboxSelectAllValue?: boolean | null;
  /** Define uma classe para o cabeçalho da tabela com um objeto onde a chave é o nome da classe e o valor é um booleano para adicionar a tratativa de ativar ou não a classe */
  headClass?: Record<string, boolean> | null;
  /** Define uma classe para a célula da tabela com um objeto onde a chave é o nome da classe e o valor é um booleano para adicionar a tratativa de ativar ou não a classe */
  cellClass?: Record<string, boolean> | null;
}

export interface IndexTablePropShow extends ActionsToShow {
  tabs: boolean;
}

export interface IndexTableEmptyMessageEmits {
  /** Quando existem 0 itens passados para o componente e a props emptyResultDisplay.show está ativa e o usuário clicou no item `outra opção de filtro` emite a ação para indicar que os filtros devem ser removidos */
  (event: 'reset-filters'): void;
}

/** Nome do item selecionado na tabela, contendo o seu indice na tabela */
export type NameItemTableSelected = `item-${number}`;

/**
 * Emits privados usados internamente pelo componente
 */
export interface IndexTableListPrivateEmits {
  /** Quando todos itens são selecionados, emite essa ação para indicar a seleção do checkbox geral para o componente superior, serve apenas para controlar isso */
  (event: 'selected-all-items', key: boolean | null): void;
}

/**
 * Emits públicos usados externamente pelo componente
 */
export interface IndexTableListPublicEmits<T> extends IndexTableEmptyMessageEmits {
  /** Quando um item é selecionado é emitida essa ação mandando a key que consiste de uma string `item-{index}` sendo index o número do índice do item na lista  */
  (event: 'selected-items', items: T[]): void;
  /** Quando um item é clicado é emitida essa ação mandando o item clicado */
  (event: 'open-item', item: T): void;
}

export interface IndexTableListEmits<T> extends IndexTableListPrivateEmits, IndexTableListPublicEmits<T> {}

interface IndexTableSlotCellProps<T> {
  item: T;
  row: number;
}

interface IndexTableSlotHeadProps {
  field: KeyLabelDefault;
  label: string;
}

export interface IndexTableListSlots<T> {
  [key: `cell(${string})`]: (props: IndexTableSlotCellProps<T>) => void;
  [key: `head(${string})`]: (props: IndexTableSlotHeadProps) => void;
}

export interface IndexTableProps<T>
  extends IndexTableTabsProps,
    Omit<IndexTableActionsProps, 'show'>,
    IndexTableListProps<T> {
  /** Define quais elementos internos serão exibidos no componente */
  show?: IndexTablePropShow;
  /** Estado de carregamento global do componente, deve ser usado no primeiro carregamento, quando ainda não há nenhum dado carregado nas abas do IndexTable */
  isLoading: boolean;
}

export interface IndexTableEmits<T> extends IndexTableTabsEmits, IndexTableActionsEmits, IndexTableListPublicEmits<T> {}

export interface IndexTableSlots<T> extends IndexTableActionsSlots, IndexTableListSlots<T> {
  ['footer-actions']: () => void;
}
