<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import Spinner from '../spinner/Spinner.vue';
import Icon from '../icon/Icon.vue';
import Button from '../button/Button.vue';
import type { FormSpinbuttonProps } from './types';

const emit = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<FormSpinbuttonProps>(), {
  step: 1,
  modelValue: 1,
});
const disabledDecrement = ref(false);
const disabledIncrement = ref(false);

const update = (val: number) => {
  emit('update:modelValue', val);
  emit('change', val);
};

const increase = () => {
  if (props.max === undefined || props.modelValue < Number(props.max)) {
    update(Number(props.modelValue) + Number(props.step));
  }
};

const decrease = () => {
  if (props.min === undefined || props.modelValue > Number(props.min)) {
    update(Number(props.modelValue) - Number(props.step));
  }
};

const classList = computed(() => {
  const data = [];
  if (props.size) {
    data.push(`-${props.size}`);
  }

  if (props.disabled) {
    data.push(`-disabled`);
  }

  return data;
});

const updateInput = (e: FocusEvent) => {
  let val = Number((e.target as HTMLInputElement).value);

  if (props.max && val > Number(props.max)) {
    val = Number(props.max);
  }

  if (props.min && val < Number(props.min)) {
    val = Number(props.min);
  }

  (e.target as HTMLInputElement).value = val.toString();

  if (val != props.modelValue) {
    update(val);
  }
};

const inputFocus = (event: FocusEvent) => {
  (event.target as HTMLInputElement)?.select();
};

watchEffect(() => {
  disabledIncrement.value = false;
  disabledDecrement.value = false;

  if (props.max && props.modelValue >= Number(props.max)) {
    disabledIncrement.value = true;
  }

  if (props.max && props.modelValue <= Number(props.min)) {
    disabledDecrement.value = true;
  }
});
</script>

<template>
  <div role="group" tabindex="-1" class="ui-form-spinbutton" :class="classList">
    <div class="ui-form-spinbutton-loader" v-if="loading">
      <Spinner class="ui-form-spinbutton-loader-spin" size="18" />
    </div>
    <Button
      :disabled="disabled || disabledDecrement"
      tabindex="-1"
      type="button"
      aria-controls="demo-sb"
      aria-label="Decrement"
      aria-keyshortcuts="ArrowDown"
      :class="classList"
      class="ui-form-spinbutton-action-decrease"
      @click="decrease">
      <Icon name="remove"></Icon>
    </Button>
    <div
      :disabled="disabled"
      class="output"
      dir="ltr"
      role="spinbutton"
      tabindex="0"
      aria-live="off"
      aria-valuemin="1"
      aria-valuemax="100"
      aria-valuenow="50"
      aria-valuetext="50">
      <input
        type="tel"
        :value="modelValue"
        :readonly="!inputable"
        :placeholder="placeholder"
        @blur="updateInput"
        @focus="inputFocus" />
    </div>
    <Button
      tabindex="-1"
      :disabled="disabled || disabledIncrement"
      type="button"
      aria-controls="demo-sb"
      aria-label="Increment"
      aria-keyshortcuts="ArrowUp"
      :class="classList"
      class="ui-form-spinbutton-action-increase"
      @click="increase">
      <Icon name="add"></Icon>
    </Button>
  </div>
</template>

<style lang="scss">
@import './FormSpinbutton.scss';
</style>
