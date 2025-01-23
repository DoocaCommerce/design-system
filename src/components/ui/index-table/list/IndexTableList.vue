<script setup lang="ts" generic="T extends object">
import { watch } from 'vue';
import Table from '#ds/components/admin/table/Table.vue';
import TableBody from '#ds/components/admin/table/TableBody.vue';
import TableCell from '#ds/components/admin/table/TableCell.vue';
import TableHeadCell from '#ds/components/admin/table/TableHeadCell.vue';
import TableRow from '#ds/components/admin/table/TableRow.vue';
import FormCheckbox from '#ds/components/ui/form-checkbox/FormCheckbox.vue';
import IndexTableEmptyMessage from './IndexTableEmptyMessage.vue';
import { useIndexTableList } from '../composables/useIndexTableList';
import type { IndexTableListEmits, IndexTableListProps, IndexTableListSlots } from '../types';
import { defaultPropEmptyResultDisplay } from './defaultPropEmptyResultDisplay';

const props = withDefaults(defineProps<IndexTableListProps<T>>(), {
  show: () => ({
    select: true,
  }),
  emptyResultDisplay: () => defaultPropEmptyResultDisplay,
  checkboxSelectAllValue: false,
  headClass: null,
  cellClass: null,
});
const emit = defineEmits<IndexTableListEmits<T>>();
const slots = defineSlots<IndexTableListSlots<T>>();

const onOpenItem = (item: T) => {
  emit('open-item', item);
};

const {
  selectedItems,
  prepareKeysToCell,
  selectAllItems,
  updateItemSelectedWithKeyboard,
  selectItem,
  formatKeyToClass,
} = useIndexTableList<T>(props, emit);

watch(
  () => props.checkboxSelectAllValue,
  (value: boolean | null) => {
    selectAllItems(value);
  }
);
</script>

<template>
  <IndexTableEmptyMessage
    v-if="!items.length && emptyResultDisplay.show"
    :title="emptyResultDisplay.title"
    :subtitle="emptyResultDisplay.subtitle"
    :button="emptyResultDisplay.button"
    :icon="emptyResultDisplay.icon"
    :show-icon="emptyResultDisplay.showIcon ?? true"
    :show-button="emptyResultDisplay.showButton ?? true"
    class="ui-index-table-empty-message"
    @reset-filters="emit('reset-filters')" />
  <Table v-else class="ui-index-table-list">
    <template #header>
      <TableHeadCell v-if="show.select"></TableHeadCell>

      <TableHeadCell
        v-for="(fieldHead, index) in fields"
        :key="index"
        :data-test-index-table="`head-${formatKeyToClass(fieldHead.key)}`"
        :class="{
          'ui-index-table-list-head-cell': true,
          [`ui-index-table-list-head-${formatKeyToClass(fieldHead.key)}`]: true,
          ...(headClass ?? {}),
        }">
        <slot
          v-if="slots[`head(${fieldHead.key})`]"
          :name="`head(${fieldHead.key})`"
          :field="fieldHead"
          :label="fieldHead.label"></slot>

        <div v-else>{{ fieldHead.label }}</div>
      </TableHeadCell>
    </template>

    <TableBody class="ui-index-table-body">
      <TableRow
        v-for="(item, indexRow) in items"
        :key="indexRow"
        class="ui-index-table-row"
        :data-test-index-table="`row-${indexRow}`"
        @click="onOpenItem(item)"
        @keyup.enter="onOpenItem(item)">
        <TableCell v-if="show.select" class="ui-index-table-list-all-items-checkbox" @click.stop>
          <FormCheckbox
            :id="`item-${indexRow}`"
            v-model="selectedItems"
            :value="`item-${indexRow}`"
            data-test-index-table="cell-checkbox"
            class="ui-index-table-list-checkbox"
            @update="selectItem"
            @keyup.enter="updateItemSelectedWithKeyboard(`item-${indexRow}`)"
            @click.stop />
        </TableCell>

        <TableCell
          v-for="(cell, indexCell) in prepareKeysToCell(item)"
          :key="indexCell"
          :data-test-index-table="`cell-${cell.key}`"
          :class="{
            'ui-index-table-list-cell': true,
            [`ui-index-table-list-cell-${formatKeyToClass(cell.key)}`]: true,
            ...(cellClass ?? {}),
          }">
          <slot v-if="slots[`cell(${cell.key})`]" :name="`cell(${cell.key})`" :item="item" :row="indexRow"></slot>

          <div v-else>{{ cell.value }}</div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style lang="scss" scoped>
@use 'IndexTableList';
</style>
