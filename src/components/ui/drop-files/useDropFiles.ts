import { ref, computed } from 'vue';
import { imageMimeTypes } from './mimeTypes';
import type { DropFilesEmits, DropFilesProps, FileData } from './types';
import { checkSizeError } from './checkSizeError';
import { checkFormatCompatibility } from './checkFormatCompatibility';
import { checkDimensionsError } from './checkDimensionsError';

export const useDropFiles = (props: DropFilesProps, emit: DropFilesEmits) => {
  const fileInput = ref<HTMLInputElement | null>(null);
  const fileList = ref<FileData[]>([]);
  const errorMessages = ref<string[]>([]);
  const isDragging = ref<boolean>(false);

  const onlyAllowsImages = computed(() => {
    const allImageFormats = Object.keys(imageMimeTypes).flatMap((key) => imageMimeTypes[key]);

    const isImage = props.allowedFormats.every((format) => {
      const extensionIsCompatible = allImageFormats.includes(format);
      const mimeTypeIsCompatible = Object.keys(imageMimeTypes).includes(format);

      return extensionIsCompatible || mimeTypeIsCompatible;
    });

    return isImage;
  });

  const textSelect = computed(() => {
    return onlyAllowsImages.value ? props.texts!.selectImage : props.texts!.selectFile;
  });

  const icon = computed(() => (onlyAllowsImages.value ? 'add_a_photo' : 'file_upload'));

  const acceptFormats = computed(() => props.allowedFormats.join(', '));

  /**
   * Abre a janela de seleção de arquivos
   */
  const openFileDialog = () => {
    const singleFile = !props.multiple;
    const notHasFiles = fileList.value.length === 0;

    if (!props.disabled && singleFile && notHasFiles) {
      fileInput.value?.click();
    }
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0 && props.multiple) {
      Array.from(target.files).forEach(validateAndProcessFile);

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

    if (props.multiple) {
      Array.from(event.dataTransfer.files).forEach(validateAndProcessFile);

      return;
    }

    validateAndProcessFile(event.dataTransfer.files[0]);
  };

  const isImageByFile = computed(() => (file: File) => {
    return file.type.startsWith('image/');
  });

  const handleCorruptedImage = (index: number) => {
    fileList.value[index] = { ...fileList.value[index], preview: null, error: true };
  };

  const handleCorruptedFile = (index: number) => {
    fileList.value[index] = { ...fileList.value[index], preview: null, error: true };
  };

  const validateAndProcessFile = (file: File) => {
    let errorMessage = null;
    let filePreview = null;

    errorMessage = checkFormatCompatibility(props, file);

    if (!errorMessage) errorMessage = checkSizeError(props, file);

    if (!props.multiple) fileList.value = [];

    const isImage = isImageByFile.value(file);
    if (!errorMessage && isImage) {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          errorMessage = checkDimensionsError(props, img);

          if (errorMessage) return;

          if (!props.multiple) fileList.value = [];

          filePreview = reader.result as string;
          fileList.value.push({ file, preview: filePreview, error: false });

          emit('update', { fileName: file.name, file });
        };

        img.onerror = () => handleCorruptedImage(fileList.value.length);

        img.src = reader.result as string;
      };

      reader.onerror = () => (errorMessage = props.texts!.errors.readingFailure);

      reader.readAsDataURL(file);
    } else if (!errorMessage) {
      const reader = new FileReader();

      reader.onerror = () => handleCorruptedFile(fileList.value.length);

      reader.readAsDataURL(file);

      fileList.value.push({ file, preview: null, error: false });

      emit('update', { fileName: file.name, file });
    }

    if (!props.multiple) errorMessages.value = [];

    if (errorMessage) {
      errorMessages.value.push(errorMessage);

      if (!props.multiple) fileList.value = [];

      emit('update', { fileName: file.name, file: null });
    }
  };

  const handleDragOver = () => {
    if (!props.disabled) isDragging.value = true;
  };

  const handleDragLeave = () => {
    if (!props.disabled) isDragging.value = false;
  };

  const deleteFile = (index: number) => {
    const fileName = fileList.value[index]?.file.name ?? null;

    fileList.value.splice(index, 1);

    if (fileInput.value) fileInput.value.value = '';

    emit('update', { fileName, file: null });
  };

  return {
    fileInput,
    fileList,
    acceptFormats,
    errorMessages,
    isDragging,
    onlyAllowsImages,
    textSelect,
    icon,
    isImageByFile,
    openFileDialog,
    handleFileChange,
    handleDrop,
    handleCorruptedImage,
    handleDragOver,
    handleDragLeave,
    deleteFile,
  };
};
