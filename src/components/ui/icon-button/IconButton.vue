<script lang="ts">
/**
 * @deprecated Este componente está depreciado e será removido em versões futuras. Use o Button com a propriedade `only-icon` no lugar.
 */
export default {};
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Icon from '../icon/Icon.vue';
import Button from '../button/Button.vue';
import type { IconButtonProps } from './types';

const props = withDefaults(defineProps<IconButtonProps>(), {
  size: 'md',
});

const styleClass = ref(['ui-icon-button', props.customClass]);

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 16;
    case 'md':
      return 24;
    case 'lg':
      return 24;
  }
});
</script>

<template>
  <Button
    :class="[styleClass, fab ? '-fab' : '', onColor ? '-on-color' : '']"
    :size="size"
    :variant="variant"
    :disabled="disabled">
    <Icon :name="icon" :size="iconSize" />
  </Button>
</template>

<style lang="scss">
@import './IconButton.scss';
</style>
