<script setup lang="ts">
import TableListNavLoader from '../table-list-nav-loader/TableListNavLoader.vue';
import type { TableListNavProps } from '../types';

defineProps<TableListNavProps>();
</script>

<template>
  <div class="table-list-nav">
    <div class="table-list-nav-wrapper">
      <div class="table-list-nav-content">
        <slot />
      </div>
      <TableListNavLoader :loading="loading" />
    </div>
  </div>
</template>

<style lang="scss">
@import './TableListNav.scss';
</style>
