<script lang="ts">
/**
 * @deprecated Este componente está depreciado e será removido em versões futuras.
 */
export default {};
</script>

<script setup lang="ts">
import StatsItem from '../../ui/stats-item/StatsItem.vue';
import type { StatsGroupProps } from './types';

const props = defineProps<StatsGroupProps>();
</script>

<template>
  <div class="stats-group">
    <div class="stats-group-wrapper" v-if="infos">
      <StatsItem
        v-for="item in infos"
        :key="item.label"
        :value="item.value"
        :label="item.label"
        :primaryAction="item.primaryAction"
        :text="item.text" />
      <slot />
    </div>
    <div class="stats-group-wrapper" v-else>
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import './StatsGroup.scss';
</style>
