import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useDropFiles } from './useDropFiles';
import type { DropFilesProps, DropFilesEmits } from '../types';

describe('useDropFiles', () => {
  let props: DropFilesProps;
  let emit: DropFilesEmits;

  beforeEach(() => {
    props = {
      allowedFormats: ['image/jpeg', 'image/png', '.gif'],
      maxFileSize: 2 * 1024 * 1024, // 2MB
      maxDimensions: { width: 1920, height: 1080 },
      maxFileNameLength: 100,
      texts: {
        selectImage: 'Selecione uma Imagem',
        selectFile: 'Selecione um arquivo',
        clickOrientation: 'Clique para selecionar',
        dragOrientation: 'ou arraste e solte',
        errors: {
          incompatibleDimensions: 'Dimensões incompatíveis. Recomendamos {{dimensions}}.',
          sizeExceeded: 'Tamanho máximo de {{size}} excedido.',
          invalidFormat: 'O formato do arquivo {{format}} não é aceito.',
          emptyFile: 'O arquivo enviado não contém dados.',
          largeFileName: 'O nome do arquivo é muito longo. Renomeie e tente novamente.',
          readingFailure: 'Não foi possível carregar o arquuivo.',
          descriptionForCorruptedFile: 'Arquivo corrompido',
        },
      },
    } as DropFilesProps;

    emit = vi.fn();
  });

  const createMockFile = (name: string, size: number, type: string): File => {
    const blob = new Blob(['a'.repeat(size)], { type });
    return new File([blob], name);
  };

  test('Dado que o usuário faça o upload de um arquivo, Quando o formato for permitido, Então deve adicionar o arquivo à lista', () => {
    const { handleFileChange, fileList } = useDropFiles(props, emit);
    const file = createMockFile('test.jpg', 1 * 1024 * 1024, 'image/jpeg'); // 1MB

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    expect(fileList.value).toHaveLength(1);
    expect(fileList.value[0].file).toBe(file);
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o formato não for permitido, Então deve retornar a mensagem de erro de formato inválido', () => {
    const { handleFileChange, uploadError } = useDropFiles(props, emit);
    const file = createMockFile('test.txt', 1 * 1024 * 1024, 'text/plain'); // 1MB

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    expect(uploadError.value).toBe('O formato do arquivo .TXT não é aceito.');
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o tamanho for maior que o permitido, Então deve retornar a mensagem de erro de tamanho excedido', () => {
    const { handleFileChange, uploadError } = useDropFiles(props, emit);
    const file = createMockFile('test.jpg', 3 * 1024 * 1024, 'image/jpeg'); // 3MB

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    expect(uploadError.value).toBe('Tamanho máximo de 2MB excedido.');
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o arquivo estiver vazio, Então deve retornar a mensagem de erro de arquivo vazio', () => {
    const { handleFileChange, uploadError } = useDropFiles(props, emit);
    const file = createMockFile('test.jpg', 0, 'image/jpeg'); // 0 bytes

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    expect(uploadError.value).toBe('O arquivo enviado não contém dados.');
  });

  test('Dado que o usuário faça o upload de um arquivo, Quando o nome do arquivo for muito longo, Então deve retornar a mensagem de erro de nome de arquivo longo', () => {
    const { handleFileChange, uploadError } = useDropFiles(props, emit);
    const file = createMockFile('a'.repeat(101) + '.jpg', 1 * 1024 * 1024, 'image/jpeg'); // Nome com 101 caracteres

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    expect(uploadError.value).toBe('O nome do arquivo é muito longo. Renomeie e tente novamente.');
  });

  test('Dado que o usuário faça o upload de uma imagem, Quando possuir as dimensões válidas, Então deve adicionar a imagem à lista', () => {
    const { handleFileChange, fileList } = useDropFiles(props, emit);
    const file = createMockFile('test.jpg', 1 * 1024 * 1024, 'image/jpeg'); // 1MB

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        expect(fileList.value).toHaveLength(1);
        expect(fileList.value[0].file).toBe(file);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

  test('Dado que o usuário faça o upload de uma imagem, Quando a largura for maior que o permitido, Então deve retornar a mensagem de erro de dimensões incompatíveis', () => {
    const { handleFileChange, uploadError } = useDropFiles(props, emit);
    const file = createMockFile('test.jpg', 1 * 1024 * 1024, 'image/jpeg'); // 1MB

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        Object.defineProperty(img, 'width', { value: 2000 });
        Object.defineProperty(img, 'height', { value: 1080 });
        expect(uploadError.value).toBe('Dimensões incompatíveis. Recomendamos 1920x1080px.');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

  test('Dado que o usuário faça o upload de uma imagem, Quando a altura for maior que o permitido, Então deve retornar a mensagem de erro de dimensões incompatíveis', () => {
    const { handleFileChange, uploadError } = useDropFiles(props, emit);
    const file = createMockFile('test.jpg', 1 * 1024 * 1024, 'image/jpeg'); // 1MB

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        Object.defineProperty(img, 'width', { value: 1920 });
        Object.defineProperty(img, 'height', { value: 1200 });
        expect(uploadError.value).toBe('Dimensões incompatíveis. Recomendamos 1920x1080px.');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

  test('Dado que o usuário faça o upload de uma imagem, Quando a largura e a altura forem maiores que o permitido, Então deve retornar a mensagem de erro de dimensões incompatíveis', () => {
    const { handleFileChange, uploadError } = useDropFiles(props, emit);
    const file = createMockFile('test.jpg', 1 * 1024 * 1024, 'image/jpeg'); // 1MB

    const event = { target: { files: [file] } } as unknown as Event;
    handleFileChange(event);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        Object.defineProperty(img, 'width', { value: 2000 });
        Object.defineProperty(img, 'height', { value: 1200 });
        expect(uploadError.value).toBe('Dimensões incompatíveis. Recomendamos 1920x1080px.');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
});
