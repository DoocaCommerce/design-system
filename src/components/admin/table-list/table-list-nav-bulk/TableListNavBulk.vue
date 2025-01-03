<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { each } from 'lodash-es';
import { zerofill, pluralize } from '../../../../filters';
import { $dialog } from '../../../ui/dialog';
import FormCheckbox from '../../../ui/form-checkbox/FormCheckbox.vue';
import Dropdown from '../../../ui/dropdown/Dropdown.vue';
import Button from '../../../ui/button/Button.vue';
import DropdownItemButton from '../../../ui/dropdown/DropdownItemButton.vue';
import type { ITableListConfig, TBulkActions } from '../types';

type Props = {
  rows: unknown[];
  selected: number[];
  config: ITableListConfig;
  state: any;
};

const emit = defineEmits(['duplicate']);

const props = withDefaults(defineProps<Props>(), {
  selected: () => {
    return [];
  },
  rows: () => {
    return [];
  },
});

const bulkActions = ref<TBulkActions>([]);
const indeterminate = ref<boolean>(false);
const allSelected = ref<boolean>(false);
const checkbox = ref<boolean>(false);

const onCheckAll = () => props.state.checkAll(!checkbox.value);
const onRemoveDialog = () => {
  const count = zerofill(props.selected.length, 2);
  const defaultMessage = `Você confirma a exclusão de <b>${count}</b> ${pluralize(
    count,
    'registro selecionado',
    'registros selecionados',
    '',
    false
  )}?`;

  function buildMessage() {
    if (props.config.dialogDelete?.message) {
      if (props.config.dialogDelete.message.concatMessage) {
        return `${defaultMessage} ${props.config.dialogDelete.message.text}`;
      } else return props.config.dialogDelete.message.text;
    }
    return defaultMessage;
  }

  $dialog.open({
    title: props.config.dialogDelete?.title ?? 'Excluir registros',
    destructIcon: props.config.dialogDelete?.destructIcon ?? 'delete',
    destructLabel: props.config.dialogDelete?.destructLabel ?? 'Deletar registros',
    message: buildMessage(),
    onCallback: remove,
  });
};

const onDuplicate = () => {
  emit('duplicate');
};

const remove = () => props.state.removeSelected();
const active = () => props.state.toggleActiveSelected(true);
const inactive = () => props.state.toggleActiveSelected(false);

watchEffect(() => {
  if (props.rows.length && props.selected.length == props.rows.length) {
    allSelected.value = true;
    indeterminate.value = false;
  } else if (props.selected.length) {
    allSelected.value = false;
    indeterminate.value = true;
  } else {
    allSelected.value = false;
    indeterminate.value = false;
  }

  checkbox.value = allSelected.value;
});

onMounted(() => {
  each(props.config.actions, (item) => {
    if (item == 'active') {
      bulkActions.value.push({
        label: 'Ativar registros',
        onAction: active,
      });
      bulkActions.value.push({
        label: 'Inativar registros',
        onAction: inactive,
      });
    }

    if (item == 'remove') {
      bulkActions.value.push({
        label: 'Remover registros',
        variant: 'danger',
        onAction: onRemoveDialog,
      });
    }

    if (props.config.allowDuplication && item == 'duplicate') {
      bulkActions.value.push({
        label: 'Duplicar registros',
        variant: 'danger',
        onAction: onDuplicate,
      });
    }
  });

  if (props.config.bulk) {
    bulkActions.value.push(...props.config.bulk);
  }
});
</script>

<template>
  <div v-show="!config.hideCheckbox" class="table-list-nav-bulk" :class="{ '-active': selected.length }">
    <div class="-checkbox" @click="onCheckAll">
      <FormCheckbox v-model="checkbox" :indeterminate="indeterminate" :value="allSelected" no-events />
    </div>

    <span v-show="selected.length && config.actions?.includes('remove')" class="table-list-nav-item">
      <Button size="sm" leading-icon="delete" label="Deletar" @click="onRemoveDialog" />
    </span>

    <Dropdown v-show="selected.length && bulkActions && bulkActions.length > 0" right>
      <template #button-content>
        <Button size="sm" leading-icon="unfold_more" label="Ação em massa" />
      </template>

      <DropdownItemButton
        v-for="action in bulkActions"
        :key="action.label"
        :variant="action.variant"
        :label="action.label"
        @click.stop="action.onAction(selected)" />
    </Dropdown>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/mixins.scss';
.table-list-nav-bulk {
  display: flex;
  align-items: center;
  height: 100%;
  gap: var(--s-spacing-nano);
  padding-right: var(--s-spacing-small);

  &.-active {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: var(--s-index-medium-high);
    padding: var(--s-spacing-x-small);
    background: inherit;

    .-checkbox {
      padding-right: var(--s-spacing-small);
    }
  }

  .table-list-nav-select {
    display: flex;
    align-items: center;
  }
}
</style>
