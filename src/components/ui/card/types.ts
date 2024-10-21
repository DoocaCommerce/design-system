import type { IAction } from '../../../types';

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
  actions?: IAction[];
}

export interface CardSectionProps {
  title?: string;
  actions?: IAction[];
}
