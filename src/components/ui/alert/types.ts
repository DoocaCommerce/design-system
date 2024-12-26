export type AlertVariant = 'success' | 'critical' | 'default' | 'warning' | 'highlight';

export interface AlertProps {
  title?: string;
  variant?: AlertVariant;
  icon?: string | null;
  dismissible?: boolean;
  show?: boolean;
  label?: string;
}
