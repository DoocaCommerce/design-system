import type { DropFilesProps } from '../../types';
import { imageMimeTypes, otherMimeTypes } from '../../mimeTypes';

/**
 * Verifica a compatibilidade do formato do arquivo.
 *
 * @param props Propriedades do componente.
 * @param file Arquivo a ser verificado.
 * @returns mensagem de erro ou nulo.
 */
export const checkFormatCompatibility = (props: DropFilesProps, file: File): string | null => {
  const allowedExtensions = props.allowedFormats.flatMap(
    (format) => imageMimeTypes[format] || otherMimeTypes[format] || [format]
  );
  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

  if (!props.allowedFormats.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    return props.texts!.errors.invalidFormat.replace('{{format}}', fileExtension.toUpperCase());
  }

  return null;
};
