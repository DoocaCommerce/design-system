<script setup lang="ts">
import { each } from 'lodash-es';
import { watchEffect } from 'vue';
import Alert from '../alert/Alert.vue';
import type { FormValidationProps } from './types';

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<FormValidationProps>(), {
  title: 'Erros encontrados',
});

const trans = (val: string) => {
  if (!props.translate) return val;

  const modelValueKeys = val.split('.');
  if (modelValueKeys.length >= 3) {
    const key = modelValueKeys[0];
    const line = Number(modelValueKeys[1]) + 1;
    const field = modelValueKeys[2];
    const object: any = props.translate[key];
    if (object[field]) {
      const name = object[key];
      return `${name}: ${object[field]} #${line}`;
    } else {
      return val;
    }
  }
  return props.translate[val] || val;
};

const removemodelValue = () => {
  emit('update:modelValue', null);
};

watchEffect(() => {
  const newVal = props.modelValue;
  const items: NodeListOf<HTMLElement> | undefined = document.querySelectorAll("[class*='form-error-']");

  each(items, (item: HTMLElement) => {
    item.classList.remove('-invalid');
  });

  if (newVal && props.scrollToTop) {
    window.scrollTo(0, 0);
    each(newVal, (item, key) => {
      const ele = document.getElementsByClassName(`error.${key}`);
      if (ele[0]) {
        ele[0].classList.add('-invalid');
      }
    });
  }
});
</script>

<template>
  <div v-if="modelValue != null" class="ui-form-validation">
    <Alert
      variant="critical"
      :show="Boolean(modelValue)"
      :title="title"
      :dismissible="!noDismissible"
      @dismissed="removemodelValue">
      <ul v-for="(item, key) in modelValue" :key="key">
        <li v-for="val in item" :key="val">
          <b v-if="!hideKey" class="ui-form-validation-key">{{ trans(String(key)) }}:</b>
          {{ val }}
        </li>
      </ul>
    </Alert>
  </div>
</template>
