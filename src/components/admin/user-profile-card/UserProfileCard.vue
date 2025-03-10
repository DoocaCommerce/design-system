<script setup lang="ts">
import { computed } from 'vue';
import { DropdownItem, DropdownItemButton, DropdownDivider, Dropdown } from '../../ui/dropdown';
import Icon from '../../ui/icon/Icon.vue';
import UserButton from './UserButton.vue';
import type { UserProfileCardProps } from './types';

const props = defineProps<UserProfileCardProps>();

const dropdownItems = computed(() => {
  return props.dropdown?.map((item) => {
    if (!item.text) item.component = DropdownDivider;
    else if (item.to) item.component = DropdownItem;
    else if (item.href) {
      item.component = DropdownItem;
      item.target = '_blank';
    } else item.component = DropdownItemButton;
    return item;
  });
});
</script>

<template>
  <div class="user-card">
    <small v-if="label" class="user-card-label">{{ label }}</small>
    <div class="user-card-btn">
      <Dropdown no-close-on-click-tag="SMALL" close-on right :drop-up="dropUp">
        <template #button-content>
          <UserButton :user-name="user.name" :image="user.image?.src" :caption="caption" />
        </template>
        <slot name="user-links" />
        <div v-for="item in dropdownItems" class="dropdown-item">
          <small v-if="item.caption" class="dropdown-item-caption">{{ item.caption }}</small>
          <component :is="item.component" :key="item" :target="item.target" @click="item.onAction" v-bind="item">
            <Icon :name="item.icon" v-if="item.icon" />
            <span>{{ item.text }}</span>
          </component>
        </div>
      </Dropdown>
    </div>
  </div>
</template>

<style lang="scss">
@import './UserProfileCard.scss';
@import '../../../scss/mixins.scss';

.dropdown-item {
  display: flex;
  flex-direction: column;

  &-caption {
    padding: unset;
    text-transform: uppercase;
    font: var(--s-typography-caption-large);
    color: var(--s-color-content-default);
  }

  > .ui-dropdown-item-wrapper {
    &:first-child {
      margin-top: unset;
    }
    &:last-child {
      margin-bottom: unset;
    }

    .ui-dropdown-item {
      padding: var(--s-spacing-quark);
      font: var(--s-typography-label-medium);
      color: var(--s-color-content-default);
      transition: background-color var(--s-motion-duration-default);
      &:hover,
      &:focus {
        color: var(--s-color-content-default);
      }
    }
  }
}
</style>
