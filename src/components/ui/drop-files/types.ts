export interface FileData {
  file: File;
  preview: string | null;
  error: boolean;
}

export interface DropFilesButtonDelete extends Pick<DropFilesProps, 'disabled'> {}

export interface DropFilesFileAndNameProps {
  data: FileData;
  corrupted?: boolean;
  type?: 'image' | 'file';
}

export interface DropFilesErrorsMessageProp {
  /** Texto para o erro de dimensão de imagem não permitida. Use o `{{dimensions}}` para substituição automática das dimensões definidas por prop. */
  incompatibleDimensions: string;
  /** Texto para o erro de tamanho máximo de arquivo permitido. Use o `{{size}}` para substituição automática do tamanho limite definido por prop. */
  sizeExceeded: string;
  /** Texto para o erro de formato não suportado. Use o `{{format}}` para substituição automática do formato de imagem carregada. */
  invalidFormat: string;
  emptyFile: string;
  largeFileName: string;
  readingFailure: string;
}

export interface DropFilesDimensionsProp {
  width: number;
  height: number;
}

export interface DropFilesProps {
  label?: string;
  showLabel?: boolean;
  subtitle?: string;
  showSubtitle?: boolean;
  /**
   * Para os formatos de arquivo permitidos, utilize a extensão do arquivo ou o MIME type.
   */
  allowedFormats: string[];
  maxFileSize?: number | null;
  /**
   * Para travar as dimensões máximas permitidas para imagens.
   */
  maxDimensions?: DropFilesDimensionsProp | null;
  maxFileNameLength?: number;
  multiple?: boolean;
  disabled?: boolean;
  texts?: {
    selectImage: string;
    selectFile: string;
    clickOrientation: string;
    dragOrientation: string;
    errors: DropFilesErrorsMessageProp;
  };
}

export interface DropFilesUploadPayload {
  fileName: string | null;
  file: File | null;
}

export interface DropFilesEmits {
  (e: 'update', payload: DropFilesUploadPayload): void;
}

export interface DropFilesPreviewEmits {
  (e: 'remove'): void;
  (e: 'corrupt-file-error'): void;
}
