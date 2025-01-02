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
  to?: any;
  target?: Target;
  class?: string;
  size?: Size;
}

export interface ActionButton extends Omit<Action, 'variant'> {
  variant?: ButtonVariant;
}
