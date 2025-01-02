<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, shallowRef, watch } from 'vue';
import * as Choices from 'choices.js';
import FormLabel from '../form-label/FormLabel.vue';
import { cloneDeep, isArray } from 'lodash-es';
import Button from '../button/Button.vue';
import type { FormTagsProps } from './types';

const Plugin = Choices?.default || Choices;
const emit = defineEmits(['update:modelValue', 'update', 'open', 'close', 'add', 'remove']);

const props = withDefaults(defineProps<FormTagsProps>(), {
  placeholder: 'Criar tags',
  create: true,
  options: [],
});

const uid = `ui-form-select-${getCurrentInstance()?.uid}`;
const element = shallowRef();
let el: HTMLElement | null;

const update = (val: string) => {
  emit('update:modelValue', val);
  emit('update', val);
};

const init = () => {
  nextTick(() => {
    if (element.value) {
      element.value.destroy();
    }

    if (el) {
      const settings: any = {
        searchEnabled: true,
        searchChoices: true,
        removeItems: true,
        removeItemButton: true,
        addItems: true,
        position: 'bottom',
        create: false,
        placeholder: true,
        placeholderValue: props.placeholder || 'Selecione',
        noResultsText: 'Nenhum resultado encontrado',
        noChoicesText: 'Sem opções para escolher',
        items: [],
        choices: cloneDeep(props.options),
        allowHTML: true,
      };
      element.value = new Plugin(el, settings);

      checkModelValue();
      if (props.options.length && getValueArray().length) setSelectedValue();
    }
  });
};

const setSelectedValue = () => {
  getValueArray().map((value: number) => {
    element.value.setChoiceByValue(Number(value));
  });
};

const checkModelValue = () => {
  nextTick(() => {
    if (element.value) {
      const data = getValueArray();

      if (data == null) {
        element.value.clearStore();
      }

      if (props.create && isArray(data)) {
        element.value.clearStore();
        element.value.setValue(data);
      }
    }
  });
};

const getValueArray = () => {
  if (props.modelValue && !isArray(props.modelValue)) {
    return props.modelValue.split(',');
  }

  return props.modelValue ?? [];
};

onMounted(() => {
  el = document.querySelector(`#${uid}`);

  if (el) {
    el.addEventListener(
      'change',
      function (event) {
        const val = element.value.getValue(true);

        update(val.join(','));

        if (props.closeOnSelect) {
          element.value.hideDropdown();
        }
      },
      false
    );
    el.addEventListener(
      'addItem',
      function (event: any) {
        emit('add', event.detail);
      },
      false
    );
    el.addEventListener(
      'removeItem',
      function (event: any) {
        emit('remove', event.detail);
      },
      false
    );
  }

  watch(
    () => props.modelValue,
    () => checkModelValue(),
    { immediate: true }
  );

  watch(
    () => [props.options],
    () => init(),
    { immediate: true, deep: true }
  );
});
</script>

<template>
  <div class="ui-form-tags" :class="{ '-has-value': modelValue?.length, 'mb-0': last, variant: `-${variant}` }">
    <FormLabel
      v-if="label"
      :label="label"
      :action="{
        label: 'Remover',
      }" />
    <div class="ui-form-tags-content">
      <input
        v-if="props.create"
        ref="selectRef"
        :id="uid"
        type="text"
        autocomplete="off"
        :placeholder="placeholder"
        :disabled="disabled" />
      <select v-else multiple ref="selectRef" :id="uid" autocomplete="off" />
      <div v-if="actions" class="ui-form-tags-actions">
        <Button v-for="(item, index) in actions" :key="index" :label="item.label" @click="item.onAction" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'choices.js/src/styles/choices.scss';
@import './FormTags.scss';
</style>
