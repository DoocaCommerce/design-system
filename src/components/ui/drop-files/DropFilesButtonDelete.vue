<script setup lang="ts">
import { Button, Icon } from '#ds/index';
import type { DropFilesButtonDelete } from './types';

defineProps<DropFilesButtonDelete>();
</script>

<template>
  <Button class="drop-files-button-delete" :only-icon="true" :disabled>
    <Icon name="delete" size="20" />
  </Button>
</template>
