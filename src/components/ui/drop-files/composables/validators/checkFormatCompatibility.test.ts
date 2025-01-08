import { checkFormatCompatibility } from './checkFormatCompatibility';
import type { DropFilesProps } from '../../types';
import { beforeEach, describe, expect, test } from 'vitest';

describe('checkFormatCompatibility', () => {
  let props: DropFilesProps;

  beforeEach(() => {
    props = {
      allowedFormats: ['image/jpeg', 'image/png', '.gif'],
      texts: {
        errors: {
          invalidFormat: 'O formato do arquivo {{format}} não é aceito.',
        },
      },
    } as DropFilesProps;
  });

  const createMockFile = (name: string, type: string): File => {
    return new File([''], name, { type });
  };

  test('Dado que o usuário faça o upload de um arquivo, Quando o formato for permitido, Então não deve retornar a mensagem de erro', () => {
    const file = createMockFile('test.jpg', 'image/jpeg');
    const error = checkFormatCompatibility(props, file);

    expect(error).toBeNull();
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o formato não for permitido, Então deve retornar a mensagem de erro de formato inválido', () => {
    const file = createMockFile('test.txt', 'text/plain');
    const error = checkFormatCompatibility(props, file);

    expect(error).toBe('O formato do arquivo .TXT não é aceito.');
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando a extensão não for permitida, Então deve retornar a mensagem de erro de formato inválido', () => {
    const file = createMockFile('test.bmp', 'image/bmp');
    const error = checkFormatCompatibility(props, file);

    expect(error).toBe('O formato do arquivo .BMP não é aceito.');
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando a extensão for permitida, Então não deve retornar a mensagem de erro', () => {
    const file = createMockFile('test.gif', 'image/gif');
    const error = checkFormatCompatibility(props, file);

    expect(error).toBeNull();
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o tipo MIME do arquivo não for permitido, Então deve retornar a mensagem de erro de formato inválido', () => {
    const file = createMockFile('test.png', 'image/apng');
    const error = checkFormatCompatibility(props, file);

    expect(error).toBe('O formato do arquivo .PNG não é aceito.');
  });
});
