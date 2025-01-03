import type { Size } from '../../../types';
import type { ButtonVariant } from '../button/types';

export interface IconButtonProps {
  icon?: string;
  variant?: ButtonVariant;
  size?: Size;
  fab?: boolean;
  disabled?: boolean;
  onColor?: boolean;
  customClass?: string;
}
