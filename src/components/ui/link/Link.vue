<script lang="ts" setup>
import { computed } from 'vue';
import Icon from '../icon/Icon.vue';
import type { LinkProps } from './types';

const props = defineProps<LinkProps>();

const linkComponent = computed(() => {
  if (props.to) {
    return 'router-link';
  }
  return 'a';
});

const linkClassList = computed(() => {
  let classes = [];

  if (props.external) {
    classes.push('-external');
  }

  if (props.disabled) {
    classes.push('-disabled');
  }

  if (props.wrapText) {
    classes.push('-wrap');
  }

  return classes;
});

const linkAttributeList = computed(() => {
  let attributes = {};

  if (props.href) {
    Object.assign(attributes, { href: props.href });
  }

  if (props.to) {
    Object.assign(attributes, { to: props.to });
  }

  if (props.external) {
    Object.assign(attributes, { target: '_blank' });
  }

  return attributes;
});
</script>

<template>
  <component :is="linkComponent" class="ui-link" :class="linkClassList" v-bind="linkAttributeList">
    <span class="ui-link-content">
      <slot>
        {{ label }}
      </slot>
    </span>
    <Icon v-if="external" name="open_in_new" class="ui-link-icon" :size="14" />
  </component>
</template>

<style lang="scss">
@import './Link.scss';
</style>
