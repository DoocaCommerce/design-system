<script setup lang="ts">
import Icon from '../../ui/icon/Icon.vue';
import type { SidebarMobileMenu } from './types';

export interface Props {
  mobileMenus: SidebarMobileMenu[];
}

defineProps<Props>();
const emit = defineEmits<{
  (evt: 'onClickAction', action: SidebarMobileMenu): void;
}>();
</script>

<template>
  <div class="ui-sidebar-mobile">
    <div
      v-for="menu in mobileMenus"
      :key="menu.title"
      class="ui-sidebar-mobile-action"
      @click="emit('onClickAction', menu)">
      <Icon :name="menu.icon" size="20" filled />
      <p class="action-title">{{ menu.title }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'SidebarMobile';
</style>
