<script setup lang="ts">
import Icon from '../icon/Icon.vue';
import type { TagProps } from './types';

withDefaults(defineProps<TagProps>(), {
  variant: 'default',
});

const emit = defineEmits(['remove']);

const onRemove = () => emit('remove');
</script>

<template>
  <span class="ui-tag" :class="{ [`-variant-${variant}`]: variant }">
    <slot>{{ label }}</slot>
    <Icon name="close" size="16" class="ui-tag-close" tabindex="0" @keyup.enter="onRemove" @click="onRemove" />
  </span>
</template>

<style lang="scss">
@import './Tag.scss';
</style>
