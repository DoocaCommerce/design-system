<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Dropdown from '../../../ui/dropdown/Dropdown.vue';
import DropdownItemButton from '../../../ui/dropdown/DropdownItemButton.vue';
import FormRadio from '../../../ui/form-radio/FormRadio.vue';
import Button from '../../../ui/button/Button.vue';
import isMobile from '../../../../services/MobileDetector';
import type { TableListNavSortableProps } from '../types';

const props = withDefaults(defineProps<TableListNavSortableProps>(), {
  sortable: () => [],
});

const dropdownRef = ref();

const sortableFinal = ref<
  {
    name: string;
    sort: string;
  }[]
>([]);

const onSortBy = (item: any) => {
  dropdownRef.value.hide();
  props.setQueryParams({
    sort: item.sort,
    page: 1,
  });
};

onMounted(() => {
  props.sortable.map((item: any) => {
    if (typeof item === 'object') {
      sortableFinal.value.push(item);
    }
    switch (item) {
      case 'created_at':
        sortableFinal.value.push({ name: 'Criado em (antigos primeiro)', sort: 'id' });
        sortableFinal.value.push({ name: 'Criado em (novos primeiro)', sort: '-id' });
        break;
      case 'updated_at':
        sortableFinal.value.push({ name: 'Atualizado (antigos primeiro)', sort: 'updated_at' });
        sortableFinal.value.push({ name: 'Atualizado (novos primeiro)', sort: '-updated_at' });
        break;
      case 'name':
        sortableFinal.value.push({ name: 'Nome (A-Z)', sort: 'name' });
        sortableFinal.value.push({ name: 'Nome (Z-A)', sort: '-name' });
        break;
      case 'balance':
        sortableFinal.value.push({ name: 'Quantidade em estoque (menores primeiro)', sort: 'balance' });
        sortableFinal.value.push({ name: 'Quantidade em estoque (maiores primeiro)', sort: '-balance' });
        break;
    }
  });
});
</script>

<template>
  <span v-show="sortableFinal.length" class="table-list-nav-item">
    <Dropdown ref="dropdownRef">
      <template #button-content>
        <span class="table-list-nav-btn">
          <Button :label="isMobile() ? '' : 'Ordenar'" :size="isMobile() ? 'md' : 'sm'" leading-icon="swap_vert" />
        </span>
      </template>
      <DropdownItemButton
        v-for="item in sortableFinal"
        :key="item.sort"
        data-close="true"
        :active="queryParams.sort == item.sort"
        @click="onSortBy(item)">
        <FormRadio v-model="queryParams.sort" :value="item.sort" :label="item.name" no-events />
      </DropdownItemButton>
    </Dropdown>
  </span>
</template>
