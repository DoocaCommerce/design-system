<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import Button from '../button/Button.vue';
import FormTextfield from '../form-textfield/FormTextfield.vue';
import type { DialogProps } from './types';

const props = withDefaults(defineProps<DialogProps>(), {
  promptType: 'text',
  cancelLabel: 'Cancelar',
  destructLabel: 'Deletar',
  destructVariant: 'critical',
});

const emit = defineEmits(['close', 'callback']);
const closed = ref(false);
const classList = ref<string[]>([]);
const isPrompt = ref(false);

const style = ref<{
  transform?: string;
}>({});

const prompt = ref();

const state = reactive({
  option: {},
  showing: false,
  timer: null,
});
const dialogRef = ref();
const config = reactive({
  destructLabel: props.destructLabel,
  destructIcon: props.destructIcon,
  destructVariant: props.destructVariant,
});

const close = (val?: boolean) => {
  document.body.classList.remove('dialog-open');
  window.removeEventListener('keydown', listener, false);
  closed.value = true;
  state.timer = null;
  state.showing = false;

  emit('close', val);

  if (val) {
    emit('callback', val);
  }

  setTimeout(() => {
    if (props.id) {
      const ele = document.getElementById(props.id);
      if (ele) {
        document.body.removeChild(ele);
      }
    }
  }, 300);
};

const onConfirm = () => {
  close(prompt.value || true);
};

const onClickBackdrop = () => {
  if (props.closeOnBackdrop) {
    close();
  } else {
    style.value.transform = 'scale(1.03)';

    setTimeout(() => {
      style.value.transform = 'scale(1)';
    }, 100);
  }
};

if (props.type == 'prompt') {
  isPrompt.value = true;
}

const listener = (e: { key: string }) => {
  if (e.key == 'Escape') {
    onClickBackdrop();
  }
};

const open = () => {
  state.showing = true;
  window.addEventListener('keydown', listener, false);
  document.body.classList.add('dialog-open');

  nextTick(() => {
    dialogRef.value.focus();
  });
};

onMounted(() => {
  props.opened && open();
});

defineExpose({
  open,
});
</script>

<template>
  <div v-if="state.showing" ref="dialogRef" class="ui-dialog -show" :class="classList" tabindex="0">
    <div class="ui-dialog-wrapper" :style="style">
      <div class="ui-dialog-overlay" @click="onClickBackdrop"></div>
      <form class="ui-dialog-content" @submit.prevent="onConfirm" ref="form">
        <div v-if="title" class="ui-dialog-header">
          <h4 class="title" v-html="title" />
        </div>
        <div class="ui-dialog-body">
          <slot />
          <div class="ui-dialog-message" v-html="message" />
          <div v-if="isPrompt" class="ui-dialog-prompt mt-5">
            <FormTextfield
              id="prompt"
              v-model="prompt"
              :label="promptLabel"
              :placeholder="promptPlaceholder"
              :type="promptType"
              size="sm"
              required
              last />
          </div>
        </div>
        <div v-if="!hideFooter" class="ui-dialog-footer">
          <Button
            :leading-icon="config.destructIcon"
            :variant="destructVariant"
            type="submit"
            class="btn-destruct"
            tabindex="0">
            {{ config.destructLabel }}
          </Button>
          <Button v-if="type != 'confirm' && !hideCancel" class="ui-dialog-btn-cancel" @click="() => close(false)">
            {{ cancelLabel }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
@import './Dialog.scss';
</style>
