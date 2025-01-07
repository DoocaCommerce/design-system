import type { DropFilesProps } from '../../types';

/**
 * Verificações de tamanhos para o arquivo
 *
 * @param props
 * @param file
 * @returns
 */
export const checkSizeError = (props: DropFilesProps, file: File): string | null => {
  if (props.maxFileNameLength && file.name.length > props.maxFileNameLength) {
    return props.texts!.errors.largeFileName;
  }

  if (file.size === 0) {
    return props.texts!.errors.emptyFile;
  }

  if (props.maxFileSize && file.size > props.maxFileSize) {
    const sizeInMB = (props.maxFileSize / 1024 / 1024).toString();

    return props.texts!.errors.sizeExceeded.replace('{{size}}', `${sizeInMB}MB`);
  }

  return null;
};
