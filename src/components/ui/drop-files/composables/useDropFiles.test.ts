import { afterEach, describe, expect, test, vi } from 'vitest';
import { useDropFiles } from './useDropFiles';
import type { DropFilesProps } from '../types';
import { checkSizeError } from './validators/checkSizeError';
import { checkFormatCompatibility } from './validators/checkFormatCompatibility';
import { checkDimensionsError } from './validators/checkDimensionsError';
import { createMockFile } from '../__mocks__/createMockFile';

vi.mock('./validators/checkSizeError', () => ({
  checkSizeError: vi.fn(),
}));

vi.mock('./validators/checkFormatCompatibility', () => ({
  checkFormatCompatibility: vi.fn(),
}));

vi.mock('./validators/checkDimensionsError', () => ({
  checkDimensionsError: vi.fn(),
}));

interface MockReturns {
  checkFormatCompatibility?: string | null;
  checkSizeError?: string | null;
  checkDimensionsError?: string | null;
}

const setup = (overrides: Partial<DropFilesProps> = {}, mockReturns: MockReturns = {}) => {
  const props: DropFilesProps = {
    allowedFormats: ['image/jpeg', 'image/png', '.gif'],
    maxFileSize: 2 * 1024 * 1024,
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
        readingFailure: 'Não foi possível carregar o arquivo.',
        descriptionForCorruptedFile: 'Arquivo corrompido',
      },
    },
    ...overrides,
  };

  const emit = vi.fn();

  if (mockReturns.checkFormatCompatibility !== undefined) {
    vi.mocked(checkFormatCompatibility).mockReturnValue(mockReturns.checkFormatCompatibility);
  }

  if (mockReturns.checkSizeError !== undefined) {
    vi.mocked(checkSizeError).mockReturnValue(mockReturns.checkSizeError);
  }

  if (mockReturns.checkDimensionsError !== undefined) {
    vi.mocked(checkDimensionsError).mockReturnValue(mockReturns.checkDimensionsError);
  }

  return { props, emit, ...useDropFiles(props, emit) };
};

const mockEvent = (file: File) => ({ target: { files: [file] } }) as unknown as Event;

afterEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
});

describe('useDropFiles', () => {
  describe('handleFileChange', () => {
    test('Dado que o usuário faça o upload de um arquivo, Quando o formato não for permitido, Então deve retornar a mensagem de erro de formato inválido', () => {
      const { handleFileChange, uploadError } = setup(
        {},
        { checkFormatCompatibility: 'O formato do arquivo .TXT não é aceito.' }
      );
      const file = createMockFile({ name: 'test.txt', size: 1 * 1024 * 1024, type: 'text/plain' });

      const event = mockEvent(file);
      handleFileChange(event);

      expect(uploadError.value).toBe('O formato do arquivo .TXT não é aceito.');
    });

    test('Dado que o usuário faça o upload de um arquivo, Quando o tamanho for maior que o permitido, Então deve retornar a mensagem de erro de tamanho excedido', () => {
      const error = 'Tamanho máximo de 2MB excedido.';
      const { handleFileChange, uploadError } = setup({}, { checkFormatCompatibility: null, checkSizeError: error });
      const file = createMockFile({ name: 'test.jpg', size: 3 * 1024 * 1024, type: 'image/jpeg' });

      const event = mockEvent(file);
      handleFileChange(event);

      expect(uploadError.value).toBe(error);
    });

    test('Dado que o usuário faça o upload de um arquivo, Quando o arquivo estiver vazio, Então deve retornar a mensagem de erro de arquivo vazio', () => {
      const error = 'O arquivo enviado não contém dados.';
      const { handleFileChange, uploadError } = setup({}, { checkFormatCompatibility: null, checkSizeError: error });
      const file = createMockFile({ name: 'test.jpg', size: 0, type: 'image/jpeg' });

      const event = mockEvent(file);
      handleFileChange(event);

      expect(uploadError.value).toBe(error);
    });

    test('Dado que o usuário faça o upload de um arquivo, Quando o nome do arquivo for muito longo, Então deve retornar a mensagem de erro de nome de arquivo longo', () => {
      const error = 'O nome do arquivo é muito longo. Renomeie e tente novamente.';
      const { handleFileChange, uploadError } = setup({}, { checkFormatCompatibility: null, checkSizeError: error });
      const nameWith101Chars = 'a'.repeat(101) + '.jpg';
      const file = createMockFile({ name: nameWith101Chars, size: 1 * 1024 * 1024, type: 'image/jpeg' });

      const event = mockEvent(file);
      handleFileChange(event);

      expect(uploadError.value).toBe(error);
    });
  });

  describe('openFileDialog', () => {
    test('Dado que o componente não esteja desabilitado, Quando não houver arquivos selecionados, Então deve abrir a janela de seleção de arquivos', () => {
      const { openFileDialog, fileInput } = setup();
      fileInput.value = { click: vi.fn() } as any;

      openFileDialog();

      expect(fileInput.value?.click).toHaveBeenCalled();
    });

    test('Dado que o componente esteja desabilitado, Então não deve abrir a janela de seleção de arquivos', () => {
      const { openFileDialog, fileInput } = setup({ disabled: true });
      fileInput.value = { click: vi.fn() } as any;

      openFileDialog();

      expect(fileInput.value?.click).not.toHaveBeenCalled();
    });

    test('Dado que o componente não permita múltiplos arquivos, Quando houver arquivos selecionados, Então não deve abrir a janela de seleção de arquivos', () => {
      const { openFileDialog, fileInput, fileList } = setup();
      fileInput.value = { click: vi.fn() } as any;
      fileList.value.push({
        file: createMockFile({ name: 'test.jpg', size: 1 * 1024 * 1024, type: 'image/jpeg' }),
        preview: null,
        error: false,
      });

      openFileDialog();

      expect(fileInput.value?.click).not.toHaveBeenCalled();
    });
  });

  describe('onlyAllowsImages', () => {
    test('Dado que todos os formatos permitidos sejam de imagem, Então onlyAllowsImages deve retornar true', () => {
      const { onlyAllowsImages } = setup({
        allowedFormats: ['image/jpeg', 'image/png', 'image/gif'],
      });

      expect(onlyAllowsImages.value).toBe(true);
    });

    test('Dado que nem todos os formatos permitidos sejam de imagem, Então onlyAllowsImages deve retornar false', () => {
      const { onlyAllowsImages } = setup({
        allowedFormats: ['image/jpeg', 'application/pdf'],
      });

      expect(onlyAllowsImages.value).toBe(false);
    });

    test('Dado que todos os formatos permitidos sejam extensões de imagem, Então onlyAllowsImages deve retornar true', () => {
      const { onlyAllowsImages } = setup({
        allowedFormats: ['.jpeg', '.png', '.gif'],
      });

      expect(onlyAllowsImages.value).toBe(true);
    });

    test('Dado que nem todos os formatos permitidos sejam extensões de imagem, Então onlyAllowsImages deve retornar false', () => {
      const { onlyAllowsImages } = setup({
        allowedFormats: ['.jpeg', '.pdf'],
      });

      expect(onlyAllowsImages.value).toBe(false);
    });
  });

  describe('fileList ref', () => {
    test('Dado que o componente seja inicializado, Quando validar o fileList, Então deve ser um array vazio', () => {
      const { fileList } = setup();
      expect(fileList.value).toEqual([]);
    });

    test('Dado o uso do fileList, Quando adicionado um arquivo, Então deve conter o arquivo em seu valor', () => {
      const { fileList } = setup();
      const file = createMockFile({ name: 'test.jpg', size: 1 * 1024 * 1024, type: 'image/jpeg' });

      fileList.value.push({
        file,
        preview: null,
        error: false,
      });

      expect(fileList.value).toHaveLength(1);
      expect(fileList.value[0].file).toBe(file);
    });
  });

  describe('isPng', () => {
    test('Dado que o usuário faça o upload de um arquivo, Quando o formato for PNG, Então isPng deve retornar true', () => {
      const { fileList, isPng } = setup();
      const file = createMockFile({ name: 'test.png', size: 1 * 1024 * 1024, type: 'image/png' });

      fileList.value.push({
        file,
        preview: null,
        error: false,
      });

      expect(isPng.value).toBe(true);
    });

    test('Dado que o usuário faça o upload de um arquivo, Quando o formato não for PNG, Então isPng deve retornar false', () => {
      const { fileList, isPng } = setup();
      const file = createMockFile({ name: 'test.jpg', size: 1 * 1024 * 1024, type: 'image/jpeg' });

      fileList.value.push({
        file,
        preview: null,
        error: false,
      });

      expect(isPng.value).toBe(false);
    });

    test('Dado que o usuário faça o upload de um arquivo, Quando o formato for APNG, Então isPng deve retornar true', () => {
      const { fileList, isPng } = setup();
      const file = createMockFile({ name: 'test.apng', size: 1 * 1024 * 1024, type: 'image/apng' });

      fileList.value.push({
        file,
        preview: null,
        error: false,
      });

      expect(isPng.value).toBe(true);
    });
  });

  describe('textSelect', () => {
    test('Dado que onlyAllowsImages seja true, Então textSelect deve retornar o texto de seleção de imagem', () => {
      const { textSelect } = setup({
        allowedFormats: ['image/jpeg', 'image/png', 'image/gif'],
      });

      expect(textSelect.value).toBe('Selecione uma Imagem');
    });

    test('Dado que onlyAllowsImages seja false, Então textSelect deve retornar o texto de seleção de arquivo', () => {
      const { textSelect } = setup({
        allowedFormats: ['image/jpeg', 'application/pdf'],
      });

      expect(textSelect.value).toBe('Selecione um arquivo');
    });
  });

  describe('icon', () => {
    test('Dado que onlyAllowsImages seja true, Então icon deve retornar "add_a_photo"', () => {
      const { icon } = setup({
        allowedFormats: ['image/jpeg', 'image/png', 'image/gif'],
      });

      expect(icon.value).toBe('add_a_photo');
    });

    test('Dado que onlyAllowsImages seja false, Então icon deve retornar "file_upload"', () => {
      const { icon } = setup({
        allowedFormats: ['image/jpeg', 'application/pdf'],
      });

      expect(icon.value).toBe('file_upload');
    });
  });

  describe('acceptFormats', () => {
    test('Dado que existam formatos permitidos, Então acceptFormats deve retornar uma string com os formatos separados por vírgula', () => {
      const { acceptFormats } = setup({
        allowedFormats: ['image/jpeg', 'image/png', 'image/gif'],
      });

      expect(acceptFormats.value).toBe('image/jpeg, image/png, image/gif');
    });

    test('Dado que não existam formatos permitidos, Então acceptFormats deve retornar uma string vazia', () => {
      const { acceptFormats } = setup({
        allowedFormats: [],
      });

      expect(acceptFormats.value).toBe('');
    });
  });

  describe('handleDragOver', () => {
    test('Dado que o componente não esteja desabilitado, Quando o usuário arrastar um arquivo sobre o componente, Então isDragging deve ser true', () => {
      const { handleDragOver, isDragging } = setup();

      handleDragOver();

      expect(isDragging.value).toBe(true);
    });

    test('Dado que o componente esteja desabilitado, Quando o usuário arrastar um arquivo sobre o componente, Então isDragging deve permanecer false', () => {
      const { handleDragOver, isDragging } = setup({ disabled: true });

      handleDragOver();

      expect(isDragging.value).toBe(false);
    });
  });

  describe('handleDragLeave', () => {
    test('Dado que o componente não esteja desabilitado, Quando o usuário arrastar um arquivo para fora do componente, Então isDragging deve ser false', () => {
      const { handleDragLeave, isDragging } = setup();
      isDragging.value = true;

      handleDragLeave();

      expect(isDragging.value).toBe(false);
    });

    test('Dado que o componente esteja desabilitado, Quando o usuário arrastar um arquivo para fora do componente, Então isDragging deve permanecer true', () => {
      const { handleDragLeave, isDragging } = setup({ disabled: true });
      isDragging.value = true;

      handleDragLeave();

      expect(isDragging.value).toBe(true);
    });
  });

  describe('deleteFile', () => {
    test('Dado que o usuário delete um arquivo, Então deve emitir o evento de atualização com o nome do arquivo e null', () => {
      const { deleteFile, fileList, emit } = setup();
      const file = createMockFile({ name: 'test.jpg', size: 1 * 1024 * 1024, type: 'image/jpeg' });

      fileList.value.push({
        file,
        preview: null,
        error: false,
      });

      deleteFile(0);

      expect(emit).toHaveBeenCalledWith('update', { fileName: 'test.jpg', file: null });
      expect(fileList.value).toHaveLength(0);
    });

    test('Dado que o usuário delete um arquivo inexistente, Então não deve emitir o evento de atualização', () => {
      const { deleteFile, emit } = setup();

      deleteFile(0);

      expect(emit).toHaveBeenCalledWith('update', { fileName: null, file: null });
    });
  });
});
