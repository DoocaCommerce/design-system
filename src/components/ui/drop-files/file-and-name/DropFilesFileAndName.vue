<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '#ds/index';
import type { DropFilesFileAndNameProps } from '../types';

const props = withDefaults(defineProps<DropFilesFileAndNameProps>(), {
  type: 'file',
  corrupted: false,
});

const icon = computed(() => {
  const isImage = props.type === 'image';
  if (isImage && props.corrupted) {
    return 'broken_image';
  }

  if (!isImage && props.corrupted) {
    return 'scan_delete';
  }

  return 'draft';
});
</script>

<template>
  <Icon :name="icon" size="24" />

  <p v-if="data.file && data.file.name" class="drop-files-file-name">{{ data.file.name }}</p>
  <p v-else class="drop-files-file-name">{{ errors.descriptionForCorruptedFile }}</p>
</template>
