import type { Size } from '../../../types';

export type ButtonVariant = 'default' | 'highlight' | 'plain' | 'link' | 'success' | 'critical';

export interface ButtonProps {
  variant?: ButtonVariant;
  label?: string;
  /** Ícone a esquerda do botão */
  leadingIcon?: string;
  /** Ícone a direta do botão */
  trailingIcon?: string;
  size?: Size;
  href?: string;
  block?: boolean;
  /** Propriedade que transforma o botão em um router-link
   * **Deprecated:** essa propriedade está depreciado e será removido em versões futuras. Use `href` ou trate via evento.
   *
   * @deprecated essa propriedade está depreciado e será removido em versões futuras. Use `href` ou trate via evento */
  to?: object;
  /** Propriedade que adiciona uma borda específica ao spinner quando o botão está em
   * estado de loading
   * **Deprecated:** essa propriedade está depreciada e será removida em versões futuras.
   *
   * @deprecated essa propriedade está depreciada e será removida em versões futuras. */
  spinnerBorder?: number | string;
  type?: string;
  loading?: boolean;
  target?: '_blank' | '_self';
  disabled?: boolean;
  /** Habilita o botão com apenas o ícone, ocultando a label do mesmo */
  onlyIcon?: boolean;
}
