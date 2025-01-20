import type { ConfigCallbacksRedactor, ConfigRedactor } from './redactor/Redactor';

export interface FormRichtextProps {
  /** Nome para a identificação na label do campo */
  name?: string;
  /** Texto de orientação para preenchimento do componente */
  placeholder?: string;
  /** Etiqueta de identificação do campo */
  label?: string;
  /** Define a altura mínima do bloco do componente */
  height?: string | number;
  /** Define todas as configurações do editor Redactor */
  config?: Partial<ConfigRedactor>;
  /** Define as callbacks do editor Redactor */
  configCallbacks?: ConfigCallbacksRedactor;
}
