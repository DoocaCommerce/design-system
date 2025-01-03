<script setup lang="ts">
import { TextStyle, Page } from '#ds/index';
import DropFiles from './components/ui/drop-files/DropFiles.vue';
import type { DropFilesUploadPayload } from './components/ui/drop-files/types';
import type { ActionButton } from './types/Action';

const action: ActionButton = {
  label: 'Bagy',
};

const allowedFormats = ['image/jpeg', 'image/png', '.gif'];
const maxFileSize = 2 * 1024 * 1024; // 2MB
const maxDimensions = { width: 1920, height: 1080 }; // Example dimensions
const maxFileNameLength = 100; // Example file name length
const multiple = false; // Allow multiple file uploads
const label = 'Teste de upload'; // Example label
const showLabel = true; // Show label
const subtitle =
  'Recomendações: Use arquivos JPEG, PNG ou GIF com tamanho máximo de 2MB e dimensões máximas de 1920x1080 pixels.'; // Example subtitle
const showSubtitle = true; // Show subtitle

const handleUpdate = (payload: DropFilesUploadPayload) => {
  console.info('File update:', payload);
};
</script>

<template>
  <Page title="Bagy Design System" size="full" :primary-action="action">
    <TextStyle variant="muted">Inicie seus testes por aqui...</TextStyle>
    <DropFiles
      :allowed-formats="allowedFormats"
      :max-file-size="maxFileSize"
      :max-dimensions="maxDimensions"
      :max-file-name-length="maxFileNameLength"
      :multiple="multiple"
      :label="label"
      :show-label="showLabel"
      :subtitle="subtitle"
      :show-subtitle="showSubtitle"
      :disabled="false"
      @update="handleUpdate" />
  </Page>
</template>
