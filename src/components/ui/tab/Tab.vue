<script setup lang="ts">
import { getCurrentInstance, provide, reactive, watchEffect, computed } from 'vue';
import type { TabProps, TabProviderInterface } from './types';

const props = defineProps<TabProps>();
const emit = defineEmits(['update:modelValue']);
const uid = `ui-tab-${getCurrentInstance()?.uid}`;

const state = reactive<TabProviderInterface>({
  tabs: [],
  activeTabIndex: computed(() => props.modelValue).value,
  active: (index: number, evt: MouseEvent) => {
    emit('update:modelValue', index);

    const ele: HTMLElement | null = document.getElementById(uid);

    if (ele && ele.offsetWidth + ele.scrollLeft > evt.clientX - evt.offsetX) {
      const scroll = evt.clientX - evt.offsetX;
      ele.scrollTo({ left: scroll, behavior: 'smooth' });
    }
  },
});

provide('tabs', state);

watchEffect(() => {
  state.activeTabIndex = props.modelValue;
});
</script>

<template>
  <div :id="uid" class="ui-tab">
    <slot />
  </div>
</template>

<style lang="scss">
@use 'Tab';
</style>
