import type { IndexTableEmptyResultProps } from '../types';

export const defaultPropEmptyResultDisplay: IndexTableEmptyResultProps = {
  title: 'Nenhum resultado encontrado',
  subtitle:
    'Não encontramos nenhum item que corresponda à sua pesquisa.<br>Verifique o termo digitado ou tente um filtro diferente.',
  button: {
    label: 'Limpar filtros',
    variant: 'highlight',
  },
  showIcon: true,
  showButton: true,
  show: false,
};
