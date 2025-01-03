<script setup lang="ts">
import { ref } from 'vue';
import { each, clone, isFunction, keys } from 'lodash-es';
import Icon from '../../../ui/icon/Icon.vue';
import Button from '../../../ui/button/Button.vue';
import Aside from '../../../ui/aside/Aside.vue';
import FormTextfield from '../../../ui/form-textfield/FormTextfield.vue';
import FormRadio from '../../../ui/form-radio/FormRadio.vue';
import FormCheckbox from '../../../ui/form-checkbox/FormCheckbox.vue';
import FormDatepicker from '../../../ui/form-datepicker/FormDatepicker.vue';
import BrowserSelect from '../../../admin/browser-select/BrowserSelect.vue';
import type { TableListNavFilterSidebarProps } from '../types';

const props = defineProps<TableListNavFilterSidebarProps>();
const emit = defineEmits(['close']);
const selected = ref<Record<string, any>>({});
const aside = ref(false);
const accordion = ref<Record<string, any>>({});
let selectedDefault: Record<string, any> | null = null;
const datePickerRef = ref<any>([null]);

const reset = () => {
  const newSelected: Record<string, any> = {};
  each(props.filters, (filter, key) => {
    clearPickerDate();
    if (filter.type == 'checkbox') {
      newSelected[key] = [];
    } else {
      newSelected[key] = null;
    }
  });
  selected.value = Object.assign({}, newSelected);
  selectedDefault = Object.assign({}, clone(newSelected));
};

const onCollapse = (key: string) => {
  if (!accordion.value[key]) {
    if (isFunction(props.filters[key].filters)) {
      props.filters[key].filters = props.filters[key].filters();
    }
  }
  accordion.value[key] = !accordion.value[key];
};

const onClearAll = reset;
const onApply = () => {
  emit('close', selected.value);
  aside.value = false;
};

const hasSelected = () => {
  return JSON.stringify(selected.value) != JSON.stringify(selectedDefault);
};

const onClearFilter = (filter: { type: string }, key: string | number) => {
  switch (filter.type) {
    case 'checkbox':
      selected.value[key] = [];
      break;

    case 'date_range':
      clearPickerDate();
      break;

    default:
      selected.value[key] = null;
      break;
  }
};

const clearPickerDate = () => {
  datePickerRef.value[0] && datePickerRef.value[0].clearDate();
};

const hasFilterSelected = (filter: { type: string }, key: string | number) => {
  if (filter.type == 'checkbox') {
    return Boolean(selected.value[key].length);
  }
  return selected.value[key] !== null && selected.value[key] !== undefined;
};

const setCurrentFilters = () => {
  const newCurrentFilters: Record<string, any> = {};
  each(props.currentFilters, (item, key) => {
    if (props.filters[key] !== undefined && ['checkbox', 'browser'].indexOf(props.filters[key].type) >= 0) {
      item = item.split(',');
    }
    newCurrentFilters[key] = item;
  });

  selected.value = Object.assign(selected.value, newCurrentFilters);

  if (Object.keys(props.filters).length == 1) {
    const key = keys(props.filters)[0];
    onCollapse(key);
  }
};

const open = () => {
  reset();
  setCurrentFilters();
  aside.value = true;
};

defineExpose({
  open,
});
</script>

<template>
  <Aside v-model="aside" title="Filtros" scrollable>
    <form @submit.prevent="onApply" id="form-filter">
      <div class="filter-list">
        <div
          v-for="(filter, key) in filters"
          :key="filter.name"
          class="filter-list-item"
          :class="{ '-active': accordion[key], '-checked': hasFilterSelected(filter, key) }">
          <div class="filter-list-title" @click="onCollapse(String(key))">
            <span>{{ filter.name }}</span>
            <Icon name="expand_more" />
          </div>
          <div v-if="accordion[key]" v-show="accordion[key]" class="filter-list-accordion">
            <div v-if="filter.type == 'browser'">
              <BrowserSelect
                v-model="selected[key]"
                :name="`check_${key}`"
                :type="filter.model"
                :service="filter.service"
                placeholder="selecione"
                title="Selecione"
                select-type="input" />
            </div>

            <div v-if="filter.type == 'date_range'">
              <FormDatepicker ref="datePickerRef" v-model="selected[key]" range />
            </div>

            <div v-else-if="['text', 'number'].indexOf(filter.type) >= 0">
              <FormTextfield
                v-model="selected[key]"
                class="d-block mb-2"
                :name="`check_${key}`"
                :placeholder="filter.placeholder"
                :type="filter.type" />
            </div>

            <div v-else v-for="item in filter.filters" :key="item.key">
              <div v-if="filter.type == 'radio'" class="d-block mb-2">
                <FormRadio
                  v-model="selected[key]"
                  :name="`radio_${key}`"
                  :value="item.value"
                  tabindex="1"
                  :label="item.name" />
              </div>
              <div v-if="filter.type == 'checkbox'" class="d-block mb-2">
                <FormCheckbox
                  v-model="selected[key]"
                  :name="`check_${key}`"
                  :value="item.value"
                  tabindex="1"
                  :label="item.name" />
              </div>
            </div>
            <div class="mt-4">
              <Button
                size="md"
                variant="link"
                :disabled="!hasFilterSelected(filter, key)"
                label="Limpar"
                @click="onClearFilter(filter, key)" />
            </div>
          </div>
        </div>
      </div>
    </form>
    <template #footer>
      <div class="filter-list-actions">
        <Button size="md" type="submit" form="form-filter" variant="highlight" leading-icon="check">Aplicar</Button>
        <Button size="md" :disabled="!hasSelected()" @click="onClearAll">Limpar os filtros</Button>
      </div>
    </template>
  </Aside>
</template>

<style lang="scss">
@import './TableListNavFilterSidebar.scss';
</style>
