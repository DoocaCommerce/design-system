<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, onUnmounted, watchEffect } from 'vue';
import type { FormRichtextProps, TRedactor } from './types';
import Redactor from './redactor/redactor.usm';

const props = withDefaults(defineProps<FormRichtextProps>(), {
  height: 120,
});

const emit = defineEmits(['update:modelValue']);

let redactor: TRedactor;
let focused = false;
const uid = `ui-form-richtext-${getCurrentInstance()?.uid}`;
const config = computed(() => {
  return Object.assign(
    {
      lang: 'pt_br',
      toolbarFixed: false,
      imagePosition: true,
      imageResizable: true,
      tabAsSpaces: 4,
      plugins: ['source', 'video', 'table', 'alignment', 'fullscreen', 'imagemanager'],
      buttons: ['html', 'formatting', 'bold', 'italic', 'lists', 'link', 'horizontalrule', 'image'],
      maxHeight: '600px',
      minHeight: `${props.height}px`,
      multipleUpload: false,
      callbacks: Object.assign(
        {
          focus: function () {
            focused = true;
          },
          blur: function () {
            focused = false;
          },
          changed: (html: string) => {
            emit('update:modelValue', html);
            return html;
          },
        },
        props.configCallbacks
      ),
    },
    props.config
  );
});

const focus = () => {
  if (redactor) {
    redactor.editor.focus();
  }
};

onMounted(() => {
  redactor = Redactor(`#${uid}`, config.value);
});

watchEffect(() => {
  const value = props.modelValue;
  if (redactor && !focused) {
    redactor.editor.source.setCode(value);
  }
});

onUnmounted(() => {
  setTimeout(() => {
    Redactor(`#${uid}`, 'destroy');
    redactor = null;
  }, 300);
});
</script>

<template>
  <div class="ui-form-richtext">
    <label v-if="label" :for="name" class="form-control-label" @click="focus">{{ label }}</label>
    <textarea :id="uid" :name="name" :placeholder="placeholder" :value="modelValue" />
  </div>
</template>

<style lang="scss">
@import './FormRichtext.scss';
</style>
