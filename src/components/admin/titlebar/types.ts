import type { ActionButton } from '#ds/types/Action.js';

export interface TitlebarProps {
  title?: string | null;
  to?: Record<string, any>;
  backlink?: { to: string };
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
  groupActions?: {
    name: string;
    actions: ActionButton[];
  };
}
