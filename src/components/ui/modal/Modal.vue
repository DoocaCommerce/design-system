<script setup lang="ts">
import { getCurrentInstance, watchEffect, ref, useSlots, shallowRef } from 'vue';
import IconButton from '../icon-button/IconButton.vue';
import type { ModalProps } from './types';

const props = defineProps<ModalProps>();
const emit = defineEmits(['update:modelValue', 'close', 'open']);
const slots = useSlots();
const showDialog = ref(false);
const classList = ref<string[]>([]);
const style = ref<{
  maxWidth?: string;
}>({});
const onClickBackdrop = () => {
  if (!props.noCloseOnBackdrop) {
    close();
  }
};

const uid = shallowRef(props.id);

if (!props.id) {
  uid.value = `modal-${getCurrentInstance()?.uid}`;
}

const close = () => {
  showDialog.value = false;
  setTimeout(() => {
    emit('update:modelValue', false);
    emit('close');
  }, 300);
};

const haveSlot = (name: string) => {
  return !!slots[name as keyof typeof slots];
};

if (props.size) {
  classList.value.push(`-${props.size}`);
}

if (props.class) {
  classList.value.push(props.class);
}

if (props.width) {
  style.value.maxWidth = `${props.width}px`;
}

const listener = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClickBackdrop();
  }
};

watchEffect(() => {
  if (props.modelValue) {
    window.addEventListener('keydown', listener, false);
    document.body.classList.add('modal-open');
    showDialog.value = true;
    emit('open');
  } else {
    window.removeEventListener('keydown', listener, false);
    document.body.classList.remove('modal-open');
  }
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      :id="uid"
      class="ui-modal"
      :class="[
        classList,
        {
          '-hide': !showDialog,
          '-scrollable': scrollable,
          '-inner': inner,
        },
      ]">
      <div class="ui-modal-overlay" :class="{ '-closable': !noCloseOnBackdrop }" @click="onClickBackdrop"></div>

      <div class="ui-modal-dialog" :style="style">
        <div class="ui-modal-content">
          <div class="ui-modal-header" v-if="!hideHeader">
            <div class="ui-modal-header-wrapper">
              <h4 class="ui-modal-title">{{ title }}</h4>
              <span v-if="caption" class="ui-modal-caption"> {{ caption }}</span>
              <slot name="caption" />
            </div>

            <IconButton
              v-if="!hideClose"
              class="ui-modal-close"
              id="btn-close"
              @click="close"
              size="md"
              variant="plain"
              icon="close" />
          </div>

          <div class="ui-modal-body">
            <slot v-bind="params" v-if="modelValue" />
          </div>

          <div class="ui-modal-footer" v-if="haveSlot('footer')">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
@import './Modal.scss';
</style>
