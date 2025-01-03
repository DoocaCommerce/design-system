import type { DropFilesProps } from './types';
import { imageMimeTypes } from './mimeTypes';

export const checkFormatCompatibility = (props: DropFilesProps, file: File): string | null => {
  const allowedExtensions = props.allowedFormats.flatMap((format) => imageMimeTypes[format] || [format]);
  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

  if (!props.allowedFormats.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    return props.texts!.errors.invalidFormat.replace('{{format}}', file.type);
  }

  return null;
};
