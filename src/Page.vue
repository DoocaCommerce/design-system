<script setup lang="ts">
import Page from './components/admin/page/Page.vue';
import type { DropFilesUpdatePayload } from './components/ui/drop-files';
import DropFiles from './components/ui/drop-files/DropFiles.vue';
import type { ActionButton } from './types/Action';

const action: ActionButton = {
  label: 'Bagy',
};

const allowedFormats = ['image/jpeg', 'image/png', '.gif', '.html'];
const maxFileSize = 2 * 1024 * 1024; // 2MB
const maxDimensions = { width: 1920, height: 1080 }; // Example dimensions
const maxFileNameLength = 100; // Example file name length
const label = 'Teste de upload'; // Example label
const showLabel = true; // Show label
const subtitle = 'JPEG, JPG, PNG ou GIF com até 2MB com dimensões recomendadas de 1920x1920px'; // Example subtitle
const showSubtitle = true; // Show subtitle

const texts = {
  selectImage: 'Selecione uma Imagem',
  selectFile: 'Selecionar um arquivo',
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
};

const handleUpdate = (payload: DropFilesUpdatePayload) => {
  console.log('File update:', payload);
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
      :label="label"
      :show-label="showLabel"
      :subtitle="subtitle"
      :show-subtitle="showSubtitle"
      :texts="texts"
      :disabled="false"
      @update="handleUpdate" />
  </Page>
</template>
