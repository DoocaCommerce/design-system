import { checkSizeError } from './checkSizeError';
import type { DropFilesProps } from '../../types';
import { beforeEach, describe, expect, test } from 'vitest';
import { createMockFile } from '../../__mocks__/createMockFile';

describe('checkSizeError', () => {
  let props: DropFilesProps;

  beforeEach(() => {
    const size2MB = 2 * 1024 * 1024;
    props = {
      maxFileSize: size2MB,
      maxFileNameLength: 100,
      texts: {
        errors: {
          sizeExceeded: 'Tamanho máximo de {{size}} excedido.',
          emptyFile: 'O arquivo enviado não contém dados.',
          largeFileName: 'O nome do arquivo é muito longo. Renomeie e tente novamente.',
        },
      },
    } as DropFilesProps;
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o tamanho for permitido, Então não deve retornar a mensagem de erro', () => {
    const size1MB = 1 * 1024 * 1024;
    const file = createMockFile({ name: 'test.jpg', size: size1MB, type: 'image/jpeg' });
    const error = checkSizeError(props, file);

    expect(error).toBeNull();
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o tamanho for maior que o permitido, Então deve retornar a mensagem de erro de tamanho excedido', () => {
    const size3MB = 3 * 1024 * 1024;
    const file = createMockFile({ name: 'test.jpg', size: size3MB, type: 'image/jpeg' });
    const error = checkSizeError(props, file);

    expect(error).toBe('Tamanho máximo de 2MB excedido.');
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o arquivo estiver vazio, Então deve retornar a mensagem de erro de arquivo vazio', () => {
    const size0Bytes = 0;
    const file = createMockFile({ name: 'test.jpg', size: size0Bytes, type: 'image/jpeg' });
    const error = checkSizeError(props, file);

    expect(error).toBe('O arquivo enviado não contém dados.');
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o nome do arquivo for muito longo, Então deve retornar a mensagem de erro de nome de arquivo longo', () => {
    const nameWith101Chars = 'a'.repeat(101) + '.jpg';
    const size1MB = 1 * 1024 * 1024;
    const file = createMockFile({ name: nameWith101Chars, size: size1MB, type: 'image/jpeg' });
    const error = checkSizeError(props, file);

    expect(error).toBe('O nome do arquivo é muito longo. Renomeie e tente novamente.');
  });
});
