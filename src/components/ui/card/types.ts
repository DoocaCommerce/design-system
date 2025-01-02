import type { Action } from '../../../types';

export interface CardProps {
  title?: string | null;
  titleMuted?: string | null;
  caption?: string;
  dropdown?: boolean;
  dropdownLabel?: string;
  dropdownClosed?: boolean;
  fullHeight?: boolean;
  fullWidth?: boolean;
  noBorder?: boolean;
  noPadding?: boolean;
  closeCaption?: string;
  gray?: boolean;
  last?: boolean;
  loading?: boolean;
  transparent?: boolean;
  plain?: boolean;
  actions?: Action[];
}

export interface CardSectionProps {
  title?: string;
  actions?: Action[];
}
