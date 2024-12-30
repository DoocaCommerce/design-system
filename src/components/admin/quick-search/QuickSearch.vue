<script setup lang="ts">
import { computed, onMounted, ref, withDefaults } from 'vue';
import Modal from '../../ui/modal/Modal.vue';
import FormLayoutItem from '../../ui/form-layout/FormLayoutItem.vue';
import FormTextfield from '../../ui/form-textfield/FormTextfield.vue';
import Stack from '../../ui/stack/Stack.vue';
import Button from '../../ui/button/Button.vue';
import FormSelect from '../../ui/form-select/FormSelect.vue';
import mobileDetector from '../../../services/MobileDetector';
import { MOBILE_WIDTH } from '../../../constants';
import type { IQuickSearchFormValue, QuickSearchProps } from './types';

const props = withDefaults(defineProps<QuickSearchProps>(), {
  title: 'Busca rápida',
  caption: 'Encontre o que precisa na sua loja virtual.',
  placeholder: 'Ex: Camiseta Bagy',
  buttonLabel: 'Pesquisar',
});
const emit = defineEmits(['onSubmit', 'update:modelValue', 'onChangeOption']);

const isMobile = mobileDetector(MOBILE_WIDTH);
const isVisible = computed({
  get: () => props.modelValue,
  set: (value: any) => {
    emit('update:modelValue', value);
  },
});

const formValues = ref<IQuickSearchFormValue>({
  searchKey: '',
  searchType: '',
});

onMounted(() => {
  formValues.value = { searchKey: '', searchType: props.searchOptions[0].value };
});

function resetSearchValues() {
  formValues.value = {
    searchKey: '',
    searchType: props.searchOptions[0].value,
  };
}

function onSubmit() {
  emit('onSubmit', formValues.value);
  resetSearchValues();
}

function onChange(value: string) {
  emit('onChangeOption', value);
}
</script>

<template>
  <Modal v-model="isVisible" class="modal-container" :title="title" :caption="caption">
    <form @submit.prevent="onSubmit">
      <Stack class="form" style="gap: 8px">
        <FormLayoutItem>
          <FormSelect v-model="formValues.searchType" :options="searchOptions" name="searchType" @update="onChange" />
        </FormLayoutItem>
        <FormTextfield v-model="formValues.searchKey" name="searchKey" :placeholder="placeholder" autofocus />
        <Button leading-icon="search" type="submit" :block="isMobile" variant="highlight">{{ buttonLabel }}</Button>
      </Stack>
      <slot />
    </form>
  </Modal>
</template>

<style lang="scss">
@import './QuickSearch.scss';
</style>
