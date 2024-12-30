<script setup lang="ts">
import { watchEffect, ref, computed, onBeforeMount, watch } from 'vue';
import Icon from '../icon/Icon.vue';
import type { AlertProps } from './types';

const slots = defineSlots<{
  default(): void;
}>();

const props = withDefaults(defineProps<AlertProps>(), {
  show: false,
  dismissible: false,
  variant: 'default',
});
const emit = defineEmits(['dismissed']);

const open = ref(false);

const iconsByVariant: Record<string, string | null> = {
  default: 'info',
  success: 'check_circle',
  critical: 'error',
  warning: 'warning',
  highlight: 'info',
};

const close = () => {
  open.value = false;
  emit('dismissed');
};

const currentIcon = computed(() => {
  let icon = props.icon;
  if (!props.icon && props.icon !== null && props.variant && iconsByVariant[props.variant]) {
    icon = iconsByVariant[props.variant];
  }
  return icon;
});

onBeforeMount(() => {
  open.value = props.show;
});

const hasDefaultSlot = computed(() => !!slots.default);

const validationOfContent = () => {
  if (!hasDefaultSlot.value && !props.label) {
    throw new Error('[Design-System Component] The `label` prop or default slot is required.');
  }
};
validationOfContent();

watch(
  () => props.label,
  () => {
    validationOfContent();
  }
);

watchEffect(() => {
  open.value = Boolean(props.show);
});
</script>

<template>
  <div
    v-if="open"
    class="ui-alert"
    :class="{
      '-dismissible': dismissible,
      [`-${variant}`]: true,
    }">
    <Icon v-if="currentIcon" class="ui-alert-icon" filled :name="currentIcon" size="24" />

    <div class="ui-alert-content">
      <h5 v-if="title" class="ui-alert-title">
        {{ title }}
      </h5>

      <div class="ui-alert-text">
        <slot>{{ label }}</slot>
      </div>
    </div>

    <button v-if="dismissible" type="button" class="ui-alert-close" @click="close">
      <Icon name="close" />
    </button>
  </div>
</template>

<style lang="scss">
@import './Alert.scss';
</style>
