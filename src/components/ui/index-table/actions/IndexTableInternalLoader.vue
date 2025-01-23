<script setup lang="ts">
import Spinner from '#ds/components/ui/spinner/Spinner.vue';
import type { IndexTableInternalLoaderProps } from '../types';

withDefaults(defineProps<IndexTableInternalLoaderProps>(), {
  loadingText: 'Carregando dados da tabela',
});
</script>

<template>
  <div class="table-list-loader" :class="{ '-show': isInternalLoading }" data-test-index-table="internal-loading">
    <Spinner class="table-list-loader-spinner" size="24" />
    <span>{{ loadingText }}</span>
  </div>
</template>

<style lang="scss">
@use 'IndexTableInternalLoader';
</style>
