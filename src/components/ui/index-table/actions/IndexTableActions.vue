<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Button from '#ds/components/ui/button/Button.vue';
import Dropdown from '#ds/components/ui/dropdown/Dropdown.vue';
import DropdownItemButton from '#ds/components/ui/dropdown/DropdownItemButton.vue';
import FormCheckbox from '#ds/components/ui/form-checkbox/FormCheckbox.vue';
import FormTextfield from '#ds/components/ui/form-textfield/FormTextfield.vue';
import IconButton from '#ds/components/ui/icon-button/IconButton.vue';
import Tag from '#ds/components/ui/tag/Tag.vue';
import TagList from '#ds/components/ui/tag/TagList.vue';
import IndexTableOrderButton from './IndexTableOrderButton.vue';
import IndexTablePaginationItem from './IndexTablePaginationItem.vue';
import { useActionSelectAllItems } from '../composables/useActionSelectAllItems';
import IndexTableInternalLoader from './IndexTableInternalLoader.vue';
import type { IndexTableActionsEmits, IndexTableActionsProps, IndexTableActionsSlots } from '../types';
import { defaultPropEmptyResultDisplay } from '../list/defaultPropEmptyResultDisplay';

const props = withDefaults(defineProps<IndexTableActionsProps>(), {
  show: () => ({
    select: true,
    reload: true,
    search: true,
    filters: true,
    bulkActionDelete: true,
  }),
  ordination: null,
  pagination: () => ({
    page: 1,
    size: 25,
    total: 100,
    from: 1,
    to: 25,
  }),
  activeFilterTags: () => [],
  bulkActions: () => [],
  isInternalLoading: false,
  checkboxSelectAllValue: false,
  emptyResultDisplay: () => defaultPropEmptyResultDisplay,
  loadingText: 'Carregando dados da tabela',
  searchValue: '',
});
const emit = defineEmits<IndexTableActionsEmits>();
defineSlots<IndexTableActionsSlots>();

const { showBulkActions, checkboxAllSelected, checkboxAllSelectedIndeterminate, updateCheckboxAllSelected } =
  useActionSelectAllItems(emit, props);

const search = ref('');

const orderBy = (key: string) => emit('order-by', key);

const currentActiveFilterTags = computed(() => props.activeFilterTags);

onMounted(() => {
  search.value = props.searchValue;
});

watch(
  () => props.searchValue,
  (value) => {
    search.value = value;
    emit('search', search.value);
  }
);
</script>

<template>
  <div class="ui-index-table-actions-main">
    <div class="ui-index-table-actions-item">
      <div class="ui-index-table-actions-wrapper">
        <FormCheckbox
          v-if="show.select"
          id="index-table-select-all"
          v-model="checkboxAllSelected"
          class="ui-index-table-actions-checkbox"
          data-test-index-table="action-checkbox-all"
          :value="checkboxAllSelected"
          :indeterminate="checkboxAllSelectedIndeterminate"
          :disabled="isInternalLoading || emptyResultDisplay.show"
          tabindex="0"
          @update="updateCheckboxAllSelected"
          @keyup.enter="updateCheckboxAllSelected(checkboxAllSelected === null ? false : !checkboxAllSelected)" />

        <template v-if="!showBulkActions">
          <IconButton
            v-if="show.reload"
            class="ui-index-table-actions-refresh"
            size="md"
            icon="refresh"
            data-test-index-table="action-refresh"
            :disabled="isInternalLoading"
            @click="emit('reload')" />

          <FormTextfield
            v-if="show.search"
            id="search-action"
            v-model="search"
            class="ui-index-table-actions-search"
            data-test-index-table="action-search"
            leading-icon="search"
            placeholder="Procurar registros"
            size="sm"
            clearable
            last
            @clear="emit('clear-search')"
            @keydown-enter="emit('search', search)" />

          <IndexTableOrderButton
            v-if="ordination"
            :ordination
            data-test-index-table="action-ordination"
            @order-by="orderBy" />

          <template v-if="show.filters">
            <Button
              class="ui-index-table-actions -mobile"
              size="md"
              label=""
              leading-icon="filter_list"
              :disabled="isInternalLoading"
              data-test-index-table="action-filters"
              @click="emit('filters')" />
            <Button
              class="ui-index-table-actions -desktop"
              size="sm"
              label="Filtros"
              leading-icon="filter_list"
              :disabled="isInternalLoading"
              data-test-index-table="action-filters"
              @click="emit('filters')" />
          </template>

          <slot name="actions" />
        </template>
        <template v-else-if="showBulkActions">
          <template v-if="show.bulkActionDelete">
            <Button
              class="ui-index-table-actions -desktop"
              size="sm"
              leading-icon="delete"
              label="Deletar"
              :disabled="isInternalLoading"
              data-test-index-table="bulk-action-delete"
              @click="emit('delete-selected-items')" />
            <Button
              class="ui-index-table-actions -mobile"
              size="md"
              leading-icon="delete"
              label=""
              :disabled="isInternalLoading"
              data-test-index-table="bulk-action-delete"
              @click="emit('delete-selected-items')" />
          </template>

          <Dropdown v-if="bulkActions.length > 0" right data-test-index-table="bulk-actions-list">
            <template #button-content>
              <Button size="sm" leading-icon="unfold_more" label="Ação em massa" :disabled="isInternalLoading" />
            </template>
            <DropdownItemButton
              v-for="action in bulkActions"
              :key="action.label"
              :label="action.label"
              :data-test-index-table="`bulk-action-item-${action.key}`"
              @click.stop="emit('bulk-action', action.key)" />
          </Dropdown>
          <slot name="bulk-actions" />
        </template>
      </div>
      <template v-if="!showBulkActions">
        <IndexTablePaginationItem
          v-if="pagination"
          :is-internal-loading
          :empty-result-display
          :page="pagination.page"
          :size="pagination.size"
          :total="pagination.total"
          :from="pagination.from"
          :to="pagination.to"
          data-test-index-table="action-pagination"
          @next-page="emit('next-page')"
          @previous-page="emit('previous-page')" />
        <slot v-else name="action-pagination" />
      </template>
    </div>
    <div
      class="ui-index-table-actions-tag-loader"
      :class="{ '-zero-items': currentActiveFilterTags.length === 0 && !isInternalLoading }">
      <div v-if="currentActiveFilterTags.length > 0" class="ui-index-table-actions-tags">
        <TagList>
          <Tag
            v-for="(tag, index) in currentActiveFilterTags"
            :key="index"
            variant="primary"
            :label="tag.label"
            :data-test-index-table="`tag-${tag.key}`"
            @remove="emit('remove-filter', tag)"></Tag>
        </TagList>
      </div>
      <IndexTableInternalLoader :is-internal-loading :loading-text />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'IndexTableActions';
</style>
