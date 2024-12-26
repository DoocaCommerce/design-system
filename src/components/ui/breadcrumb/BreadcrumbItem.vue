<script lang="ts">
/**
 * ### BreadcrumbItem Component
 *
 * @deprecated Este componente está depreciado e será removido em versões futuras.
 */
export default {};
</script>

<script setup lang="ts">
import type { BreadcrumbItemProps } from './types';

defineProps<BreadcrumbItemProps>();
</script>

<template>
  <div class="ui-breadcrumb-item">
    <router-link :to="to" v-if="to">
      <slot />
    </router-link>
    <slot v-else />
  </div>
</template>

<style lang="scss">
@import './BreadCrumbItem.scss';
</style>
