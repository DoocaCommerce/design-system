import type { Action } from '../../../types';

export interface FormTagsProps {
  modelValue?: any;
  placeholder?: string;
  label?: string;
  closeOnSelect?: boolean;
  last?: boolean;
  actions?: Action[];
  options?: any;
  create?: boolean;
  variant?: string;
  disabled?: boolean;
}

export interface SettingsInterface {
  persist: boolean;
  createOnBlur: boolean;
  create: boolean;
  plugins: string[];
  onChange(val: string): void;
}
