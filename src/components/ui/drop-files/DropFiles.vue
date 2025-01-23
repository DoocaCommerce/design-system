<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { Button, Icon } from '#ds/index';
import { useDropFiles } from './composables/useDropFiles';
import type { DropFilesEmits, DropFilesProps } from './types';
import DropFilesFileAndName from './file-and-name/DropFilesFileAndName.vue';

const props = withDefaults(defineProps<DropFilesProps>(), {
  label: '',
  subtitle: '',
  disabled: false,
  maxFileNameLength: 100,
  texts: () => ({
    selectImage: 'Selecione uma Imagem',
    selectFile: 'Selecione um arquivo',
    clickOrientation: 'Clique para selecionar',
    dragOrientation: 'ou arraste e solte',
    errors: {
      incompatibleDimensions: 'Dimensões incompatíveis. Recomendamos {{dimensions}}.',
      sizeExceeded: 'Tamanho máximo de {{size}} excedido.',
      invalidFormat: 'O formato de arquivo {{format}} não é aceito.',
      emptyFile: 'O arquivo enviado não contém dados.',
      largeFileName: 'O nome do arquivo é muito longo. Renomeie e tente novamente.',
      readingFailure: 'Não foi possível carregar o arquivo.',
      descriptionForCorruptedFile: 'Arquivo corrompido',
    },
  }),
});

const emit = defineEmits<DropFilesEmits>();

const {
  isPng,
  fileInput,
  fileList,
  uploadError,
  isDragging,
  textSelect,
  icon,
  acceptFormats,
  multiple,
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
  <div class="drop-files" data-test-drop-files="main" :class="$attrs.class">
    <label v-if="props.label" class="drop-files-label" data-test-drop-files="label">
      {{ props.label }}
    </label>

    <div
      class="drop-files-select"
      :class="{
        '-dragging': isDragging,
        '-disabled': disabled,
        '-error': uploadError,
        '-with-files': fileList.length > 0,
        '-transparent-bg': isPng,
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
        :multiple
        :disabled="props.disabled"
        hidden
        @change="handleFileChange" />

      <template v-if="!fileList.length || uploadError">
        <Icon :name="icon" size="24" />

        <div class="drop-files-text" data-test-drop-files="empty">
          <p class="drop-files-text-select">{{ textSelect }}</p>

          <p v-if="!disabled" class="drop-files-text-orientation">
            <span class="drop-files-text-click">
              {{ texts!.clickOrientation }}
            </span>
            {{ texts!.dragOrientation }}
          </p>
        </div>

        <p class="drop-files-error">
          {{ uploadError }}
        </p>
      </template>

      <template v-else>
        <div
          v-for="(data, index) in fileList"
          :key="'file-' + index"
          class="drop-files-content"
          :class="{ '-corrupted': data.error }"
          data-test-drop-files="content">
          <template v-if="data.preview">
            <img
              v-if="data.preview && !data.error"
              class="drop-files-image"
              :src="data.preview"
              alt="Pré-visualização da imagem"
              @error="handleCorruptedImage(index)" />
            <DropFilesFileAndName v-else :errors="texts.errors" :data="data" type="image" :corrupted="true" />
          </template>

          <template v-else>
            <DropFilesFileAndName v-if="data.file && !data.error" :errors="texts.errors" :data="data" />
            <DropFilesFileAndName v-else :errors="texts.errors" :data="data" :corrupted="true" />
          </template>

          <Button class="drop-files-button-delete" :only-icon="true" :disabled @click.stop="deleteFile(index)">
            <Icon name="delete" size="20" />
          </Button>
        </div>
      </template>
    </div>

    <p v-if="props.subtitle" class="drop-files-subtitle" data-test-drop-files="subtitle">
      {{ props.subtitle }}
    </p>
  </div>
</template>

<style lang="scss">
@use 'DropFiles';
</style>
