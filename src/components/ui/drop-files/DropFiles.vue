<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { Icon } from '#ds/index';
import { useDropFiles } from './useDropFiles';
import DropFilesButtonDelete from './DropFilesButtonDelete.vue';
import DropFilesFileAndName from './DropFilesFileAndName.vue';
import type { DropFilesEmits, DropFilesProps } from './types';

const props = withDefaults(defineProps<DropFilesProps>(), {
  label: 'Teste',
  showLabel: false,
  subtitle: '',
  showSubtitle: true,
  disabled: false,
  multiple: false,
  maxFileSize: null,
  maxFileNameLength: 100,
  maxDimensions: null,
  texts: () => ({
    selectImage: 'Selecione uma Imagem',
    selectFile: 'Selecione um arquivo',
    clickOrientation: 'Clique para selecionar',
    dragOrientation: 'ou arraste e solte',
    errors: {
      incompatibleDimensions: 'Dimensões incompatíveis. Recomendamos {{dimensions}}',
      sizeExceeded: 'Tamanho máximo de {{size}} excedido.',
      invalidFormat: 'O formato do arquivo {{format}} não é aceito.',
      emptyFile: 'O arquivo enviado não contém dados.',
      largeFileName: 'O nome do arquivo é muito longo. Renomeie e tente novamente.',
      readingFailure: 'Não foi possível carregar o arquivo.',
    },
  }),
});

const emit = defineEmits<DropFilesEmits>();

const {
  fileInput,
  fileList,
  errorMessages,
  isDragging,
  textSelect,
  icon,
  acceptFormats,
  isImageByFile,
  openFileDialog,
  handleFileChange,
  handleDrop,
  handleCorruptedImage,
  handleDragOver,
  handleDragLeave,
  deleteFile,
} = useDropFiles(props, emit);

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div class="drop-files" data-test-drop-files="main">
    <label v-if="props.showLabel" class="drop-files-label" data-test-drop-files="label">
      {{ props.label }}
    </label>

    <div
      class="drop-files-select"
      :class="{
        '-dragging': isDragging,
        '-disabled': props.disabled,
        '-error': errorMessages.length > 0,
      }"
      tabindex="0"
      data-test-drop-files="select"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="openFileDialog"
      @keydown.enter="openFileDialog">
      <input
        ref="fileInput"
        v-bind="$attrs"
        type="file"
        :accept="acceptFormats"
        :multiple="props.multiple"
        :disabled="props.disabled"
        hidden
        @change="handleFileChange" />

      <template v-if="!fileList.length">
        <Icon :name="icon" size="24" />

        <div class="drop-files-text" data-test-drop-files="empty">
          <p class="drop-files-text-select">{{ textSelect }}</p>

          <p v-if="!disabled" class="drop-files-text-orientation">
            <span class="drop-files-text-click">
              {{ props.texts.clickOrientation }}
            </span>
            {{ props.texts.dragOrientation }}
          </p>
        </div>

        <p v-for="(errorMessage, index) in errorMessages" :key="'error-' + index" class="drop-files-error">
          {{ errorMessage }}
        </p>
      </template>

      <template v-else>
        <div
          v-for="(data, index) in fileList"
          :key="'file-' + index"
          class="drop-files-content"
          :class="{ '-corrupted': data.error }"
          data-test-drop-files="content">
          <template v-if="isImageByFile(data.file)">
            <img
              v-if="data.preview"
              class="drop-files-image"
              :src="data.preview"
              alt="Pré-visualização da imagem"
              @error="handleCorruptedImage(index)" />
            <DropFilesFileAndName v-else :data="data" type="image" :corrupted="true" />

            <DropFilesButtonDelete :disabled @click.stop="deleteFile(index)" />
          </template>

          <template v-else>
            <DropFilesFileAndName v-if="data.file && !data.error" :data="data" />
            <DropFilesFileAndName v-else :data="data" :corrupted="true" />

            <DropFilesButtonDelete :disabled @click.stop="deleteFile(index)" />
          </template>
        </div>
      </template>
    </div>

    <p v-if="props.showSubtitle && props.subtitle" class="drop-files-subtitle" data-test-drop-files="subtitle">
      {{ props.subtitle }}
    </p>
  </div>
</template>

<style lang="scss">
@import 'DropFiles.scss';
</style>
