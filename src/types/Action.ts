import type { ButtonVariant } from '#ds/components/ui/button/types';
import type { Size, Target, Variant } from './general';

export interface Action {
  leadingIcon?: string;
  label?: string;
  onAction?(): void;
  form?: string;
  disabled?: boolean;
  type?: string;
  variant?: Variant;
  /**
   * Propriedade que transforma o botão em um router-link
   * **Deprecated:** essa propriedade está depreciado e será removido em versões futuras. Use `href` ou trate via evento.
   *
   * @deprecated essa propriedade está depreciado e será removido em versões futuras. Use `href` ou trate via evento
   */
  to?: any;
  href?: string;
  target?: Target;
  class?: string;
  size?: Size;
}

export interface ActionButton extends Omit<Action, 'variant'> {
  variant?: ButtonVariant;
}
