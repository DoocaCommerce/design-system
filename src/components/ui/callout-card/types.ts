import type { ActionButton } from '#ds/types/Action.js';

export interface CalloutCardProps {
  title?: string;
  icon?: string;
  primaryAction?: ActionButton;
  justifyCardActions?: string;
  bgColorIconPrimary?: boolean;
}
