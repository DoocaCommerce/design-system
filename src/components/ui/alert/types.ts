export type AlertVariant = 'success' | 'critical' | 'default' | 'warning' | 'highlight';

export interface AlertProps {
  title?: string;
  variant?: AlertVariant;
  icon?: string | null;
  dismissible?: boolean;
  show?: boolean;
  /** Texto para o conteúdo do alerta, que é opcional, porém quando não passado como prop deve ser usado o slot padrão do componente para definir o texto do mesmo. */
  label?: string;
}
