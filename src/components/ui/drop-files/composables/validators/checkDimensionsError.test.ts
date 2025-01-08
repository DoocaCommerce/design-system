import { checkDimensionsError } from './checkDimensionsError';
import type { DropFilesProps } from '../../types';
import { beforeEach, describe, expect, test } from 'vitest';

describe('checkDimensionsError', () => {
  let props: DropFilesProps;

  beforeEach(() => {
    props = {
      maxDimensions: { width: 1920, height: 1080 },
      texts: {
        errors: {
          incompatibleDimensions: 'Dimensões incompatíveis. Recomendamos {{dimensions}}.',
        },
      },
    } as DropFilesProps;
  });

  const createMockImage = (width: number, height: number): HTMLImageElement => {
    const img = new Image();
    Object.defineProperty(img, 'width', { value: width });
    Object.defineProperty(img, 'height', { value: height });
    return img;
  };

  test('Dado que o usuário faça o upload de uma imagem, Quando possuir as dimensões válidas, Então não deve retornar a mensagem de erro', () => {
    const img = createMockImage(1920, 1080);
    const error = checkDimensionsError(props, img);

    expect(error).toBeNull();
  });

  test('Dado que o usuário faça o upload de uma imagem, Quando a largura for maior que o permitido, Então deve retornar a mensagem de erro de dimensões incompatíveis', () => {
    const img = createMockImage(2000, 1080);
    const error = checkDimensionsError(props, img);

    expect(error).toBe('Dimensões incompatíveis. Recomendamos 1920x1080px.');
  });

  test('Dado que o usuário faça o upload de uma imagem, Quando a altura for maior que o permitido, Então deve retornar a mensagem de erro de dimensões incompatíveis', () => {
    const img = createMockImage(1920, 1200);
    const error = checkDimensionsError(props, img);

    expect(error).toBe('Dimensões incompatíveis. Recomendamos 1920x1080px.');
  });

  test('Dado que o usuário faça o upload de uma imagem, Quando a largura e a altura forem maiores que o permitido, Então deve retornar a mensagem de erro de dimensões incompatíveis', () => {
    const img = createMockImage(2000, 1200);
    const error = checkDimensionsError(props, img);

    expect(error).toBe('Dimensões incompatíveis. Recomendamos 1920x1080px.');
  });
});
