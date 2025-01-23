<script setup lang="ts">
import type { TableProps } from './types';

defineProps<TableProps>();
</script>

<template>
  <div class="table-responsive">
    <div class="ui-table" :class="{ '-hover': hover, '-no-padding': noPadding, '-tiny': tiny }">
      <div v-if="$slots.header" class="ui-table-header">
        <div class="ui-table-row -head">
          <slot name="header" />
        </div>
      </div>
      <slot name="body" />
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@use 'Table';
</style>
