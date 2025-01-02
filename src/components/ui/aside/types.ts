import type { ActionButton } from '#ds/types';
import type { Action, Size } from '../../../types';

export interface AsideProps {
  modelValue?: boolean;
  title?: string;
  subtitle?: string;
  scrollable?: boolean;
  noCloseOnBackdrop?: boolean;
  size?: Size;
  tag?: string;
  inner?: boolean;
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
  scrollableContentId?: string;
}

export interface AsideSectionProps {
  title?: string;
  actions?: Action[];
}
