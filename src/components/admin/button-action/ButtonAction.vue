<script lang="ts">
/**
 * @deprecated Este componente está depreciado e será removido em versões futuras. Use o Button.
 */
export default {};
</script>

<script lang="ts" setup>
import { watchEffect, ref, useAttrs, onMounted } from 'vue';
import { $dialog } from '../../ui/dialog';
import IconButton from '../../ui/icon-button/IconButton.vue';
import TextStyle from '../../ui/text-style/TextStyle.vue';
import Button from '../../ui/button/Button.vue';
import type { ButtonActionProps } from './types';

const props = defineProps<ButtonActionProps>();

const emit = defineEmits(['delete', 'inactive', 'active', 'close', 'update:active', 'toggleActive']);
const attrs = useAttrs();
const currentIcon = ref<string | undefined>();
const hasClick = attrs.click;

const activeIcon = (active?: boolean) => {
  currentIcon.value = active ? 'toggle_on' : 'toggle_off';
};

const classType = ref(['-btn-' + props.type]);

if (props.size) {
  classType.value.push(`-${props.size}`);
}

onMounted(() => {
  switch (props.type) {
    case 'remove':
      currentIcon.value = 'close';
      break;
    case 'active':
      activeIcon(props.active);
      break;
    default:
      currentIcon.value = props.type;
      break;
  }
});

if (props.type == 'active') {
  watchEffect(() => {
    activeIcon(props.active);
  });
}

const onClick = (evt: MouseEvent) => {
  if (props.type == 'edit') {
    return;
  }

  // emit('click')

  if (!props.noEvents) {
    evt.stopPropagation();
  }

  if (props.type == 'delete' && !hasClick) {
    let msg = 'Você confirma a exclusão do registro';

    if (props.deleteName) {
      msg += ` ${props.deleteName}`;
    }

    msg += '?';

    $dialog.delete({
      title: 'Excluir registro',
      message: msg,
      onCallback: (val: boolean) => {
        emit('delete', val);
      },
    });
  }

  if (props.type == 'active') {
    emit('update:active', !props.active);
    emit('toggleActive');
    if (props.active) {
      emit('inactive');
    } else {
      emit('active');
    }
  }
};
</script>

<template>
  <div>
    <IconButton v-if="type == 'remove'" class="ui-button-action" icon="close" size="sm" />
    <!-- <Button v-if="type == 'remove'" variant="plain" size="sm" label="Remover" /> -->
    <Button v-if="type == 'active'" variant="plain" size="sm" @click="onClick">
      <TextStyle v-if="active" variant="success" label="Ativo" />
      <TextStyle v-else variant="danger" label="Inativo" />
    </Button>
    <!-- <div v-if="type == 'active'" class="text-right" @click="onClick">

			<TextStyle v-if="active" variant="success" label="Ativo" />
			<TextStyle v-else variant="danger" label="Inativo" />
		</div> -->
  </div>
</template>

<style lang="scss">
@import './ButtonAction.scss';
</style>
