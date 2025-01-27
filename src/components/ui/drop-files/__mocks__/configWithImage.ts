import type { DropFilesProps } from '#ds/index';

const size24MB = 24 * 1024 * 1024;

export const configWithImage: DropFilesProps = {
  allowedFormats: ['image/svg+xml', 'image/png', 'image/gif', 'image/jpeg', 'image/pjpeg'],
  maxFileSize: size24MB,
  label: 'Imagem para o anúncio',
  subtitle: 'SVG, PNG ou GIF com até 24MB com dimensões recomendadas de 2000x2000px',
  maxDimensions: { width: 2000, height: 2000 },
  maxFileNameLength: 200,
  disabled: false,
  texts: {
    selectImage: 'Selecione uma Imagem',
    selectFile: 'Selecione um arquivo',
    clickOrientation: 'Clique para selecionar',
    dragOrientation: 'ou arraste e solte',
    errors: {
      descriptionForCorruptedFile: 'Arquivo corrompido',
      incompatibleDimensions: 'Dimensões incompatíveis. Recomendamos {{dimensions}}.',
      sizeExceeded: 'Tamanho máximo de {{size}} excedido.',
      invalidFormat: 'O formato do arquivo {{format}} não é aceito.',
      emptyFile: 'O arquivo enviado não contém dados.',
      largeFileName: 'O nome do arquivo é muito longo. Renomeie e tente novamente.',
      readingFailure: 'Não foi possível carregar o arquuivo.',
    },
  },
};
