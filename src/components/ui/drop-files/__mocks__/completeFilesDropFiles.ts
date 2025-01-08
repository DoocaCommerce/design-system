import type { DropFilesProps } from '#ds/index';

const size1GB = 1 * 1024 * 1024 * 1024;

export const completeOnlyFilesDropFiles: DropFilesProps = {
  allowedFormats: ['.csv', '.pdf'],
  maxFileSize: size1GB,
  label: 'Arquivo para importação',
  subtitle: 'CSV ou PDF com até 1GB',
  maxFileNameLength: 50,
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
