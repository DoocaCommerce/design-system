import type { ActionButton } from '#ds/types/Action.js';

export interface PageActionsProps {
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
}
