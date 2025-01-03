<script setup lang="ts">
import { computed } from 'vue';
import Spinner from '../spinner/Spinner.vue';
import Icon from '../icon/Icon.vue';
import type { ButtonProps } from './types';

const props = withDefaults(defineProps<ButtonProps>(), {
  spinnerBorder: 2,
  variant: 'default',
  type: 'button',
  size: 'md',
  loading: false,
  disabled: false,
  onlyIcon: false,
});

const componentType = computed(() => {
  if (props.to) return 'router-link';

  if (props.href) return 'a';

  return 'BUTTON';
});
</script>

<template>
  <component
    :is="componentType"
    class="ui-button"
    :type="type"
    :class="{
      '-loading': loading,
      '-disabled': disabled,
      '-block': block,
      '-icon': leadingIcon,
      '-only-icon': ((trailingIcon || leadingIcon) && !label) || onlyIcon,
      [`-${variant}`]: variant,
      [`-${size}`]: size,
    }"
    :disabled="disabled"
    :to="to"
    :href="href"
    :target="target">
    <div class="ui-button-content">
      <Icon v-if="leadingIcon" :name="leadingIcon" />

      <Spinner v-if="loading" :size="16" :border="spinnerBorder" />

      <div v-if="label || $slots.default" class="ui-button-label">
        <slot>{{ label }}</slot>
      </div>

      <Icon v-if="trailingIcon" :name="trailingIcon" />
    </div>
  </component>
</template>

<style lang="scss">
@import './Button.scss';
</style>
