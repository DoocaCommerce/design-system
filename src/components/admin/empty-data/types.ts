import type { ActionButton } from '../../../types/Action';

export interface EmptyDataProps {
  label?: string;
  icon?: string;
  caption?: string;
  iconType?: 'outlined' | 'filled' | 'rounded' | 'twotone' | undefined;
  link?: boolean;
  actions?: ActionButton;
  noBorder?: boolean;
}
