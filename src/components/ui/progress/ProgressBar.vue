<script setup lang="ts">
import type { ProgressBarProps } from './types';

withDefaults(defineProps<ProgressBarProps>(), {
  height: '3px',
  max: 100,
});
</script>

<template>
  <progress class="ui-progress-bar" :value="value" :max="max" />
</template>

<style lang="scss">
.ui-progress-bar {
  height: v-bind(height);
}
@import './ProgressBar.scss';
</style>
