<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { cloneDeep, keys, pick, find, omit, isNumber, isObject } from 'lodash-es';
import Dropdown from '../../../ui/dropdown/Dropdown.vue';
import Button from '../../../ui/button/Button.vue';
import FormTextfield from '../../../ui/form-textfield/FormTextfield.vue';
import DropdownSection from '../../../ui/dropdown/DropdownSection.vue';
import { $toast } from '../../../ui/toast';
import { slugify } from '../../../../filters';
import isMobile from '../../../../services/MobileDetector';
import type { TableListNavCustomFilterProps } from '../types';

const props = defineProps<TableListNavCustomFilterProps>();

const tabs: any = [];
const tab = ref();
const dropdownRef = ref();
const reg = ref<{
  id?: number | null;
  name?: string | null;
  filter?: any;
  resource?: string;
}>({
  name: null,
});

const addTab = (tab: any) => {
  tab.view = tab.id || slugify(tab.name);
  tabs.push(tab);
};

onMounted(async () => {
  const res = await props.service.get({ resource: props.state.config.customFilterResource });

  props.state.config.customFilterPresets.forEach((item: any) => {
    if (isObject(item)) {
      addTab(item);
    }

    if (item == 'active') {
      addTab({ name: 'Ativo', filter: { active: 1 } });
      addTab({ name: 'Inativo', filter: { active: 0 } });
    }
  });

  (res as any).data.forEach((item: any) => {
    addTab(item);
  });

  props.state.tabs = tabs;
});

const disableDropdown = computed(() => {
  if (isNumber(props.state.queryParams.selectedView)) {
    return false;
  }

  if (keys(props.state.omitFilters).length && props.state.queryParams.selectedView == 'all') {
    return false;
  }

  return true;
});

const onRemoveTab = async () => {
  if (props.state.currentTab) {
    await props.service.delete(props.state.currentTab);
    dropdownRef.value.hide();
    props.state.tabs = props.state.tabs.filter((item) => {
      return item.id != props.state.currentTab;
    });

    props.state.resetQueryParams({
      selectedView: 'all',
    });

    $toast.open('Filtro deletado com sucesso');
  }
};

const onSave = async () => {
  let res: any;
  if (reg.value.id) {
    res = await props.service.update(reg.value.id, pick(reg.value, ['name', 'filter']));
    tab.value.name = reg.value.name;
  } else {
    res = await props.service.create({
      name: reg.value.name,
      filter: omit(props.state.queryParams, props.state.omitFiltersValues),
      resource: props.state.config.customFilterResource,
    });
    res.view = res.id || slugify(res.name);
    props.state.tabs.push(res);
    props.state.setQueryParams({
      selectedView: res.id,
    });
  }

  dropdownRef.value.hide();
};

const onShowDropdown = () => {
  tab.value = find(props.state.tabs, { view: Number(props.state.currentTab) });

  if (tab.value) {
    reg.value = cloneDeep(tab.value);
  } else {
    reg.value = {
      name: null,
    };
  }
};
</script>

<template>
  <span v-if="!isMobile()" class="table-list-nav-item -custom-filter">
    <Dropdown ref="dropdownRef" :disabled="disableDropdown" right @show="onShowDropdown">
      <template #button-content>
        <Button
          v-if="Number(state.currentTab) >= 1"
          label="Editar filtro"
          leading-icon="star"
          size="sm"
          variant="highlight"
          :disabled="disableDropdown" />
        <Button v-else label="Salvar filtro" size="sm" leading-icon="star" :disabled="disableDropdown" />
      </template>
      <div class="dropdown-section">
        <DropdownSection>
          <form id="form-custom-filter" autocomplete="off" @submit.prevent="onSave">
            <h6>Salvar filtro</h6>
            <FormTextfield
              v-model="reg.name"
              size="sm"
              placeholder="Nome do filtro"
              data-close="none"
              required
              tabindex="1" />
            <div class="mt-2">Os filtros são salvos como uma nova aba no topo desta lista.</div>
          </form>
        </DropdownSection>
        <div class="dropdown-section-buttons">
          <Button
            v-if="reg.id"
            size="sm"
            tabindex="-1"
            label="Remover"
            variant="critical"
            outline
            @click="onRemoveTab" />
          <Button size="sm" label="Salvar" tabindex="2" type="submit" form="form-custom-filter" />
        </div>
      </div>
    </Dropdown>
  </span>
</template>
