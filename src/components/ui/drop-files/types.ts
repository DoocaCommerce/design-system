export interface FileData {
  file: File;
  preview: string | null;
  error: boolean;
}

export interface DropFilesFileAndNameProps {
  data: FileData;
  corrupted?: boolean;
  type?: 'image' | 'file';
  errors: DropFilesErrorsMessageProp;
}

export interface DropFilesErrorsMessageProp {
  /** Texto para o erro de dimensão de imagem não permitida. Use o `{{dimensions}}` para substituição automática das dimensões definidas por prop. */
  incompatibleDimensions: string;
  /** Texto para o erro de tamanho máximo de arquivo permitido. Use o `{{size}}` para substituição automática do tamanho limite definido por prop. */
  sizeExceeded: string;
  /** Texto para o erro de formato não suportado. Use o `{{format}}` para substituição automática do formato de imagem carregada. */
  invalidFormat: string;
  /** Texto para o erro de arquivo vazio. */
  emptyFile: string;
  /** Texto para o erro de nome de arquivo muito grande. */
  largeFileName: string;
  /** Texto para o erro de falha ao ler o arquivo. */
  readingFailure: string;
  /** Texto para o arquivo corrompido que não foi possível ler o nome. */
  descriptionForCorruptedFile: string;
}

export interface DropFilesDimensionsProp {
  width: number;
  height: number;
}

export interface DropFilesTextsProp {
  selectImage: string;
  selectFile: string;
  clickOrientation: string;
  dragOrientation: string;
  errors: DropFilesErrorsMessageProp;
}

export interface DropFilesProps {
  /** Rótulo principal do componente */
  label?: string;
  /** Breve descrição sobre as extensões e informações necessárias sobre o arquivo permitido para upload */
  subtitle?: string;
  /**
   * Defina os formatos de arquivos permitidos, utilize a extensão do arquivo ou o MIME
   * type.
   */
  allowedFormats: string[];
  /** Tamanho máximo permitido para o arquivo em bytes. */
  maxFileSize?: number;
  /**
   * Para travar as dimensões máximas permitidas para imagens.
   */
  maxDimensions?: DropFilesDimensionsProp | null;
  /** Define o tamanho máximo do nome do arquivo. */
  maxFileNameLength?: number;
  /** Desabilita o componente para upload de arquivos. */
  disabled?: boolean;
  /** Define todos os textos do componente, bem como as mensagens de erro a exibir. */
  texts?: DropFilesTextsProp;
}

export interface DropFilesUpdatePayload {
  fileName: string | null;
  file: File | null;
}

export interface DropFilesEmits {
  /** Emite as atualizações de adição e exclusão de arquivos */
  (e: 'update', payload: DropFilesUpdatePayload): void;
}
