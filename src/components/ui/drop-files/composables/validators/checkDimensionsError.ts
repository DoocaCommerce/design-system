import type { DropFilesProps } from '../../types';

/**
 * Verificações de erro de dimensões para a imagem
 */
export const checkDimensionsError = (props: DropFilesProps, img: HTMLImageElement): string | null => {
  if (props.maxDimensions && (img.width > props.maxDimensions.width || img.height > props.maxDimensions.height)) {
    const dimensions = `${props.maxDimensions.width}x${props.maxDimensions.height}px`;

    return props.texts!.errors.incompatibleDimensions.replace('{{dimensions}}', dimensions);
  }

  return null;
};
