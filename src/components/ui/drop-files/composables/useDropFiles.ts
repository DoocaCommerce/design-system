import { ref, computed, readonly } from 'vue';
import { imageMimeTypes } from '../mimeTypes';
import type { DropFilesEmits, DropFilesProps, FileData } from '../types';
import { checkSizeError } from './validators/checkSizeError';
import { checkFormatCompatibility } from './validators/checkFormatCompatibility';
import { checkDimensionsError } from './validators/checkDimensionsError';

/**
 * Lógica para o componente de upload de arquivos.
 *
 * @param props - Propriedades do componente.
 * @param emit - Emits do componente.
 * @returns Propriedades e métodos necessários para o componente de upload de arquivos.
 */
export const useDropFiles = (props: DropFilesProps, emit: DropFilesEmits) => {
  const fileInput = ref<HTMLInputElement | null>(null);
  const fileList = ref<FileData[]>([]);
  const uploadError = ref<string | null>(null);
  const isDragging = ref<boolean>(false);

  /** Esse componente até o momento não suporta o upload de múltiplos arquivos mas esse ref foi implementado para garantir uma lógica mais preparada para isso caso mude no futuro. */
  const multiple = readonly(ref<boolean>(false));

  const onlyAllowsImages = computed(() => {
    const allImageFormats = Object.keys(imageMimeTypes).flatMap((key) => imageMimeTypes[key]);

    const isImage = props.allowedFormats.every((format) => {
      const extensionIsCompatible = allImageFormats.includes(format);
      const mimeTypeIsCompatible = Object.keys(imageMimeTypes).includes(format);

      return extensionIsCompatible || mimeTypeIsCompatible;
    });

    return isImage;
  });

  const isPng = computed(() =>
    fileList.value.some(
      (currentFile) =>
        currentFile.file && (currentFile.file.type === 'image/png' || currentFile.file.type === 'image/apng')
    )
  );

  const textSelect = computed(() => {
    return onlyAllowsImages.value ? props.texts!.selectImage : props.texts!.selectFile;
  });

  const icon = computed(() => (onlyAllowsImages.value ? 'add_a_photo' : 'file_upload'));

  const acceptFormats = computed(() => props.allowedFormats.join(', '));

  /**
   * Abre a janela de seleção de arquivos nos cenários permitidos, quando o componente
   * não está desabilitado ou quando é permitido apenas um arquivo e não há arquivos
   * selecionados.
   */
  const openFileDialog = () => {
    const singleFile = !multiple.value;
    const notHasFiles = fileList.value.length === 0;

    if (props.disabled) return;

    if ((singleFile && notHasFiles) || !singleFile) {
      fileInput.value?.click();
    }
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0 && multiple.value) {
      Array.from(target.files).forEach((file) => validateAndProcessFile(file));

      return;
    }

    if (target.files && target.files.length > 0) {
      validateAndProcessFile(target.files[0]);
    }
  };

  const handleDrop = (event: DragEvent) => {
    if (props.disabled) return;

    isDragging.value = false;

    if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) return;

    if (multiple.value) {
      Array.from(event.dataTransfer.files).forEach((file) => validateAndProcessFile(file));

      return;
    }

    validateAndProcessFile(event.dataTransfer.files[0]);
  };

  const isImageByFile = computed(() => (file: File) => {
    return file.type.startsWith('image/');
  });

  const handleCorruptedImage = (index: number) => {
    fileList.value[index] = { ...fileList.value[index], error: true };
  };

  const handleCorruptedFile = (index: number) => {
    fileList.value[index] = { ...fileList.value[index], preview: null, error: true };
  };

  const validateAndProcessFile = (file: File, hasUpdate = true) => {
    let errorMessage = null;
    let filePreview = null;

    errorMessage = checkFormatCompatibility(props, file);

    if (!errorMessage) errorMessage = checkSizeError(props, file);

    if (!multiple.value) fileList.value = [];

    if (!file.type && !errorMessage) errorMessage = props.texts!.errors.readingFailure;

    const isImage = isImageByFile.value(file);
    if (!errorMessage && isImage) {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          errorMessage = checkDimensionsError(props, img);

          if (errorMessage) {
            uploadError.value = errorMessage;
            return;
          }

          if (!multiple.value) fileList.value = [];

          filePreview = reader.result as string;

          fileList.value.push({ file, preview: filePreview, error: false });

          if (hasUpdate) emit('update', { fileName: file.name, file });
        };

        img.onerror = () => handleCorruptedImage(fileList.value.length);

        img.src = reader.result as string;
      };

      reader.onerror = () => {
        uploadError.value = props.texts!.errors.readingFailure;

        emit('update', { fileName: file.name, file: null });
      };

      reader.readAsDataURL(file);
    } else if (!errorMessage) {
      const reader = new FileReader();

      reader.onload = () => {
        if (!reader.result) {
          handleCorruptedFile(fileList.value.length);
          return;
        }

        fileList.value.push({ file, preview: null, error: false });

        if (hasUpdate) emit('update', { fileName: file.name, file });
      };

      reader.onerror = () => handleCorruptedFile(fileList.value.length);

      reader.readAsDataURL(file);
    }

    if (!multiple.value) uploadError.value = null;

    if (errorMessage) {
      uploadError.value = errorMessage;

      if (!multiple.value) fileList.value = [];

      emit('update', { fileName: file.name, file: null });
    }
  };

  const startFile = () => {
    if (props.file) validateAndProcessFile(props.file, false);
  };

  const handleDragOver = () => {
    if (!props.disabled) isDragging.value = true;
  };

  const handleDragLeave = () => {
    if (!props.disabled) isDragging.value = false;
  };

  const deleteFile = (index: number) => {
    const fileName = fileList.value[index]?.file?.name ?? null;

    fileList.value.splice(index, 1);

    if (fileInput.value) fileInput.value.value = '';

    emit('update', { fileName, file: null });
  };

  return {
    isPng,
    fileInput,
    fileList,
    acceptFormats,
    uploadError,
    isDragging,
    onlyAllowsImages,
    textSelect,
    icon,
    isImageByFile,
    multiple,
    openFileDialog,
    handleFileChange,
    handleDrop,
    handleCorruptedImage,
    handleDragOver,
    handleDragLeave,
    deleteFile,
    startFile,
  };
};
