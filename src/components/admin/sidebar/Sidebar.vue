<script setup lang="ts">
import { computed, inject, useSlots } from 'vue';
import SidebarMobile from './SidebarMobile.vue';
import Icon from '../../ui/icon/Icon.vue';
import NewsIndicator from '../../ui/news-indicator/NewsIndicator.vue';
import Badge from '../../ui/badge/Badge.vue';
import type { MenuProviderInterface, SideBarItem, SideBarItemType, SidebarMobileMenu } from './types';

export interface Props {
  isActive: (item: SideBarItem, isOnlyChildren?: boolean) => boolean;
  menuOpen?: boolean;
  menus: SideBarItem[];
  mobileNavigationBar: SidebarMobileMenu[];
}

const slots = useSlots();
const menu = inject('menu') as MenuProviderInterface;
defineProps<Props>();

const haveSlot = (name = 'default') => !!slots[name as keyof typeof slots];

const emit = defineEmits<{
  (evt: 'onClickItem', type: SideBarItemType, menuItem?: SideBarItem | SidebarMobileMenu): void;
}>();

const toggleMenu = (item: any) => {
  if (menu) {
    menu?.toggle();
    emit('onClickItem', 'sub', item);
  }
};

const handleMenuClick = (type: SideBarItemType, menuItem?: SideBarItem): void => {
  emit('onClickItem', type, menuItem);
  if (!menuItem?.nodes?.length) menu?.toggle();
};

const handleMobileBar = (item: SidebarMobileMenu) => {
  if (item.type === 'action') {
    menu?.toggle();
    return;
  }

  emit('onClickItem', 'node', item);
  menu.close();
};

const getTemplate = (item: SideBarItem) => (item.to ? 'router-link' : 'div');

const getTemplateTo = computed<any>(() => {
  return (item: SideBarItem) => {
    if (item.to && item.params) {
      return { to: item.to, params: item.params };
    }

    if (item.to && !item.params) {
      return { to: item.to };
    }

    return undefined;
  };
});
</script>

<template>
  <div class="ui-sidebar" id="ui-sidebar">
    <div class="ui-sidebar-wrapper">
      <div class="ui-sidebar-container">
        <div class="ui-sidebar-content">
          <div v-if="haveSlot('logo') || haveSlot('select-button')" class="ui-sidebar-nav">
            <div class="ui-sidebar-logo" @click="handleMenuClick('logo')">
              <slot name="logo" />
            </div>
            <slot name="select-button" />
          </div>
          <div v-if="haveSlot('top-content')" class="ui-sidebar-nav top-content">
            <slot name="top-content" />
          </div>
          <div class="ui-sidebar-list">
            <ul class="ui-sidebar-list -primary">
              <li
                v-for="(item, key) in menus"
                class="ui-sidebar-item"
                redirectLink
                :key="key"
                :class="[
                  {
                    '-disabled': item.disabled,
                    '-spacer': item.spacer,
                    '-spacer-last': item.last,
                  },
                  item.to,
                ]">
                <small v-if="item.caption" class="ui-sidebar-link-caption">{{ item.caption }}</small>
                <component
                  :is="getTemplate(item)"
                  class="ui-sidebar-link"
                  :to="getTemplateTo(item)"
                  :class="{
                    '-node-active': item.active,
                    '-active': item.active,
                  }"
                  activeClass="-active"
                  @click="handleMenuClick('node', item)">
                  <div class="d-flex">
                    <span class="ui-sidebar-link-icon">
                      <Icon size="16" :name="item.icon" filled />
                    </span>
                    <span class="ui-sidebar-link-text -title">
                      {{ item.name }}
                    </span>
                  </div>
                  <div class="ui-sidebar-link-right-icons">
                    <Badge
                      class="badge-soon-container"
                      v-if="item.isComingSoon"
                      no-wrap
                      size="sm"
                      variant="default"
                      label="Em breve" />
                    <div class="news-indicator" v-if="item.isNew">
                      <NewsIndicator />
                    </div>

                    <Icon v-if="item.nodes?.length" class="icon-arrow" name="expand_more" />
                  </div>
                </component>

                <ul v-if="item.nodes && item.dropdown !== false" class="ui-sidebar-sublist">
                  <li v-for="(node, index) in item.nodes" class="ui-sidebar-item" :key="index">
                    <component
                      :is="getTemplate(node)"
                      :to="getTemplateTo(node)"
                      class="ui-sidebar-link -sub"
                      @click="toggleMenu(node)"
                      :class="{
                        '-active': isActive(node),
                        '-disabled': node.disabled,
                      }">
                      <span class="ui-sidebar-link-icon">
                        <Icon size="16" name="subdirectory_arrow_right" />
                      </span>
                      <div class="ui-sidebar-link-content">
                        <span class="ui-sidebar-link-text"> {{ node.name }} </span>
                        <Badge
                          class="badge-soon-container"
                          v-if="node.isComingSoon"
                          size="sm"
                          variant="default"
                          no-wrap
                          label="Em breve" />
                        <NewsIndicator v-if="node.isNew" :label="node.highlightedLabel ?? 'Novo'" />
                      </div>
                    </component>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="ui-sidebar-footer">
            <slot name="footer" class="ui-sidebar-footer" @click="handleMenuClick('footer')" />
          </div>
        </div>
      </div>
    </div>
    <div class="ui-sidebar-overlay" @click="toggleMenu"></div>
  </div>

  <SidebarMobile :mobile-menus="mobileNavigationBar" @on-click-action="handleMobileBar" />
</template>

<style lang="scss">
@import './Sidebar.scss';
</style>
