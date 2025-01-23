<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Button from '#ds/components/ui/button/Button.vue';
import Dropdown from '#ds/components/ui/dropdown/Dropdown.vue';
import DropdownItemButton from '#ds/components/ui/dropdown/DropdownItemButton.vue';
import FormRadio from '#ds/components/ui/form-radio/FormRadio.vue';
import type { ActionOrdination, IndexTableOrderButtonEmits, IndexTableOrderButtonProps } from '../types';

const props = defineProps<IndexTableOrderButtonProps>();
const emit = defineEmits<IndexTableOrderButtonEmits>();

const activeItem = computed<undefined | ActionOrdination>(() => props.ordination?.find((item) => item.active));
const orderValue = ref();

onMounted(() => {
  if (!activeItem.value && props.ordination) {
    orderValue.value = props.ordination[0].key;
    return;
  }

  orderValue.value = activeItem.value?.key;
});

const onOrderBy = (key: string) => {
  orderValue.value = key;
  emit('order-by', key);
};
</script>

<template>
  <Dropdown ref="dropdownRef" class="ui-index-table-order-button">
    <template #button-content>
      <Button class="ui-index-table-order-button-action -mobile" label="" size="md" leading-icon="swap_vert" />
      <Button class="ui-index-table-order-button-action -desktop" label="Ordenar" size="sm" leading-icon="swap_vert" />
    </template>

    <DropdownItemButton
      v-for="item in ordination"
      :key="item.key"
      :active="item.key === orderValue"
      @click.stop.prevent="onOrderBy(item.key)">
      <FormRadio v-model="orderValue" :value="item.key" :label="item.label" />
    </DropdownItemButton>
  </Dropdown>
</template>

<style lang="scss" scoped>
@use 'IndexTableOrderButton';
</style>
