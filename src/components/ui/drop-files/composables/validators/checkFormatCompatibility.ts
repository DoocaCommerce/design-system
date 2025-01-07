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
  const extension = file.name.split('.').pop()?.toLowerCase();
  const fileExtension = `.${extension}`;

  const allExtensionsByType = [...(imageMimeTypes[file.type] || []), ...(otherMimeTypes[file.type] || [])];

  const hasTheExtensionCompatibleWithMimeOfFile = allExtensionsByType.includes(fileExtension);

  const hasValidMimeType = props.allowedFormats.includes(file.type);
  const hasValidExtension = props.allowedFormats.includes(fileExtension);

  if (hasValidMimeType || (hasTheExtensionCompatibleWithMimeOfFile && hasValidExtension)) {
    return null;
  }

  return props.texts!.errors.invalidFormat.replace('{{format}}', fileExtension.toUpperCase());
};
