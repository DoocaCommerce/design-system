<script lang="ts">
/**
 * @deprecated Este componente está depreciado e será removido em versões futuras.
 * Por favor, use o componente `Button`.
 */
export default {};
</script>

<script setup lang="ts">
import ColorSchemeService, { ColorScheme } from '../../../services/ColorSchemeService';
import { onMounted, ref } from 'vue';
import IconButton from '../../ui/icon-button/IconButton.vue';

const emit = defineEmits(['changeSchemeColor']);
const iconMode = ref('dark_mode');
const colorSchemeStorageName = 'ds_color_scheme';

const setColorScheme = (val: any) => {
  document.documentElement.setAttribute('data-theme', val);

  if (val == ColorScheme.DARK) {
    iconMode.value = 'light_mode';
  } else {
    iconMode.value = 'dark_mode';
  }
};

const toggleDarkmode = () => {
  const color = ColorSchemeService.get() === ColorScheme.DARK ? ColorScheme.LIGHT : ColorScheme.DARK;
  emit('changeSchemeColor', color);
  localStorage.setItem(colorSchemeStorageName, color);
  setColorScheme(color);
};

onMounted(() => {
  setColorScheme(ColorSchemeService.get());
});
</script>

<template>
  <span @click="toggleDarkmode">
    <slot>
      <IconButton :icon="iconMode" variant="plain" />
    </slot>
  </span>
</template>
