<script setup lang="ts">
import { watchEffect, ref, useSlots, computed } from 'vue';
import Button from '../button/Button.vue';
import IconButton from '../icon-button/IconButton.vue';
import type { AsideProps } from './types';

const emit = defineEmits(['update:modelValue', 'open', 'close', 'save']);
const props = defineProps<AsideProps>();

const slots = useSlots();
const isOpen = ref(false);
const modalSize = computed(() => {
  return props.size ? `-${props.size}` : '-md';
});

const haveSlot = (name = 'default') => {
  return !!slots[name as keyof typeof slots];
};

const close = () => {
  window.removeEventListener('keydown', listener, false);
  document.body.classList.remove('aside-open');
  setTimeout(() => {
    emit('close');
    isOpen.value = false;
  }, 300);
};

const open = () => {
  isOpen.value = true;
  window.addEventListener('keydown', listener, false);
  document.body.classList.add('aside-open');
  emit('open');
};

const onClickBackdrop = () => {
  if (!props.noCloseOnBackdrop) {
    emit('update:modelValue', false);
  }
};

const onClose = () => emit('update:modelValue', false);

const listener = (e: { key: string }) => {
  if (e.key === 'Escape') {
    onClickBackdrop();
  }
};

watchEffect(() => {
  if (props.modelValue) {
    open();
  } else {
    close();
  }
});
</script>

<template>
  <Teleport to="body">
    <component :is="tag ? tag : 'div'" class="ui-aside" @submit.prevent="$emit('save')">
      <div
        v-if="isOpen"
        class="ui-aside-wrapper"
        :class="[
          modalSize,
          {
            '-hide': !modelValue,
            '-scrollable': scrollable,
            '-inner': inner,
          },
        ]">
        <div class="ui-aside-overlay" :class="{ '-close': !noCloseOnBackdrop }" @click="onClickBackdrop"></div>

        <div :id="scrollableContentId" class="ui-aside-content">
          <div class="ui-aside-header" :style="subtitle ? 'align-items: flex-start' : 'align-items: center'">
            <div class="header-wrapper">
              <h4 class="title">
                {{ title }}
              </h4>
              <p v-if="subtitle" class="d-block text-muted mb-0">{{ subtitle }}</p>
            </div>
            <IconButton id="btn-close" icon="close" variant="plain" type="rounded" @click="onClose" />
          </div>

          <div class="ui-aside-body">
            <slot name="default" />
          </div>

          <div v-if="primaryAction" class="ui-aside-footer">
            <Button
              type="submit"
              :label="primaryAction.label"
              :disabled="primaryAction.disabled"
              :variant="primaryAction.variant ?? 'highlight'"
              :form="primaryAction.form"
              @click="primaryAction.onAction" />

            <Button
              v-for="(item, index) in secondaryActions"
              :key="index"
              type="button"
              :label="item.label"
              @click="item.onAction" />
          </div>
          <div v-if="haveSlot('footer')" class="ui-aside-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </component>
  </Teleport>
</template>

<style lang="scss">
@import './Aside.scss';
</style>
