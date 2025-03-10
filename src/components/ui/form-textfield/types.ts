import type { MaskType } from 'maska';
import type { Size } from '../../../types';
import type { ActionButton } from '#ds/types';

export interface FormTextfieldProps {
  leadingIcon?: string;
  trailingIcon?: string;
  labelInfo?: string;
  trailingText?: string;
  state?: boolean;
  invalidFeedback?: string;
  loading?: boolean;
  last?: boolean;
  float?: boolean;
  modelValue?: string | number | null;
  label?: string;
  id?: string;
  placeholder?: string;
  step?: string | number;
  tabindex?: string;
  inputmode?: 'text' | 'search' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal';
  size?: Size;
  pattern?: string;
  title?: string;
  name?: string;
  clearable?: boolean;
  autocomplete?: string;
  minlength?: string | number;
  maxlength?: string | number;
  autofocus?: boolean;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  type?: string;
  mask?: MaskType;
  raw?: any;
  actions?: ActionButton[];
  max?: string | number;
  min?: string | number;
  dataMaskaTokens?: string;
}
