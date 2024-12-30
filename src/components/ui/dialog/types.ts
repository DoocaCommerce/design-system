import type { ButtonVariant } from '../button/types';

export interface DialogConfig {
  id?: string;
  title?: string;
  hideFooter?: boolean;
  message?: string;
  onCallback?(val: string | boolean): void;
  onClose?(val: string | boolean): void;
  closeOnBackdrop?: boolean;
  promptLabel?: string;
  promptType?: string;
  promptPlaceholder?: string;
  cancelLabel?: string;
  destructLabel?: string;
  destructVariant?: ButtonVariant;
  destructIcon?: string;
  type?: 'prompt' | 'confirm';
  opened?: boolean;
  hideCancel?: boolean;
}

export type DialogProps = DialogConfig;
