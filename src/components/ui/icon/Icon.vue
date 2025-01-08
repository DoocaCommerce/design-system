<script setup lang="ts">
import { computed, type StyleValue } from 'vue';
import DSIcons from './snipets/ds-icons.json';
import type { DSIconsType, IconProps } from './types';

const props = withDefaults(defineProps<IconProps>(), {
  size: 16,
});

const isDSIcon = computed(() => !!props.name && (props.name as DSIconsType) in DSIcons);

const iconStyleList = computed(() => {
  const styles: StyleValue = {};

  if (props.filled) {
    styles.fontVariationSettings = "'FILL' 1";
  }

  if (props.size) {
    styles.fontSize = props.size + 'px';
    styles.height = props.size + 'px';
  }

  if (isDSIcon.value) {
    delete styles.fontSize;
    styles.width = props.size + 'px';
  }

  return styles;
});
</script>

<template>
  <i
    :class="{ 'ui-ds-icon': isDSIcon, 'ui-icon material-symbols-outlined': !isDSIcon }"
    :style="iconStyleList"
    v-html="isDSIcon ? DSIcons[name as DSIconsType] : name">
  </i>
</template>

<style lang="scss">
.ui-ds-icon {
  display: inline-block;
  color: inherit;
  fill: currentColor;
}
.ui-icon {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 200,
    'opsz' 32;
  width: auto;
  align-items: center;
  color: inherit;
}
</style>
