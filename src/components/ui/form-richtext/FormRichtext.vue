<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import type { FormRichtextProps, RedactorLibraryType } from './';
import Redactor from './redactor/redactor.usm';

const props = withDefaults(defineProps<FormRichtextProps>(), {
  height: 120,
});

const emit = defineEmits(['update:modelValue']);

const model = defineModel<string | number | readonly string[] | null | undefined>();

let redactor: RedactorLibraryType;
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

onUnmounted(() => {
  setTimeout(() => {
    Redactor(`#${uid}`, 'destroy');
    redactor?.stop();

    redactor = null;
  }, 300);
});
</script>

<template>
  <div class="ui-form-richtext">
    <label v-if="label" :for="name" class="form-control-label" @click="focus">{{ label }}</label>

    <textarea :id="uid" v-model="model" :name="name" :placeholder="placeholder" />
  </div>
</template>

<style lang="scss">
@import './FormRichtext.scss';
</style>
