<script setup lang="ts">
import { ref } from 'vue';
import { each } from 'lodash-es';
import TableListNavFilterSidebar from './TableListNavFilterSidebar.vue';
import Button from '../../../ui/button/Button.vue';
import isMobile from '../../../../services/MobileDetector';
import type { TableListNavFilterProps } from '../types';

const props = defineProps<TableListNavFilterProps>();

const filterSidebarRef = ref();

const closeFilter = (resFilters: Record<string, any>) => {
  const current: Record<string, any> = {};
  each(resFilters, (val, key) => {
    if (val == null || (Array.isArray(val) && val.length == 0)) {
      return;
    }

    if (Array.isArray(val)) {
      current[key] = val.join(',');
    } else {
      current[key] = val;
    }
  });

  props.state.resetQueryParams(current);
  filterSidebarRef.value.open();
};

defineExpose({
  openFilterSidebar: () => filterSidebarRef.value.open(),
});
</script>

<template>
  <span v-if="props.state.config.filters" class="table-list-nav-item">
    <Button
      :size="isMobile() ? 'md' : 'sm'"
      :label="isMobile() ? '' : 'Filtros'"
      leading-icon="filter_list"
      class="table-list-nav-btn"
      @click="filterSidebarRef.open()" />
    <TableListNavFilterSidebar
      ref="filterSidebarRef"
      :filters="props.state.config.filters"
      :current-filters="state.omitFilters"
      @close="closeFilter" />
  </span>
</template>
