<script lang="ts">
/**
 * @deprecated Este componente está depreciado e será removido em versões futuras.
 */
export default {};
</script>

<script setup lang="ts">
import { useSlots } from 'vue';
import type { CardAnnotationProps } from './types';

defineProps<CardAnnotationProps>();

const slots = useSlots();

type SlotType = keyof typeof slots;

const haveSlot = (name: SlotType = 'default') => {
  return !!slots[name];
};
</script>

<template>
  <div class="ui-card-annotation">
    <h5 v-if="title" class="ui-card-annotation-title">{{ title }}</h5>
    <div class="ui-card-annotation-text">
      <slot />
    </div>
    <div v-if="haveSlot('link')" class="ui-card-annotation-link">
      <slot name="link" />
    </div>
  </div>
</template>

<style lang="scss">
@import './CardAnnotation.scss';
</style>
