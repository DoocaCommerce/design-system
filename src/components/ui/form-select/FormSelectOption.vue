<script setup lang="ts">
import { isObject } from 'lodash-es';
import type { FormSelectOptionProps } from './types';

defineProps<FormSelectOptionProps>();

const stringifyValue = (val?: string | object | number) => {
  if (isObject(val)) {
    return JSON.stringify(val);
  }

  return val;
};
</script>

<template>
  <option class="form-select-option" :value="stringifyValue(value)">
    <slot />
  </option>
</template>
