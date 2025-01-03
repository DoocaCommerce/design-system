<script setup lang="ts">
import { getCurrentInstance, ref, useSlots, watchEffect } from 'vue';
import Icon from '../icon/Icon.vue';
import Spinner from '../spinner/Spinner.vue';
import Button from '../button/Button.vue';
import Link from '../link/Link.vue';
import type { CardProps } from './types';

const emit = defineEmits(['toggleShowBody', 'open', 'close']);

const props = withDefaults(defineProps<CardProps>(), {
  dropdownClosed: false,
});

const isDropdown = ref(props.dropdown);
const showBody = ref(!props.dropdownClosed);
const uid = `ui-card-${getCurrentInstance()?.uid}`;
const slots = useSlots();

const haveSlot = (name = 'default') => {
  return !!slots[name];
};

const toggleShowBody = () => {
  emit('toggleShowBody');

  if (!showBody.value) {
    emit('open');
  }

  if (showBody.value) {
    emit('close');
  }

  showBody.value = !showBody.value;
};

watchEffect(() => (showBody.value = !props.dropdownClosed));
</script>

<template>
  <div
    :id="uid"
    class="ui-card"
    :class="{
      '-hide': !showBody,
      '-collapse': isDropdown,
      '-gray': gray,
      '-last': last,
      '-full-height': fullHeight,
      '-full-width': fullWidth,
      '-loading': loading,
      '-transparent': transparent,
      '-no-padding': noPadding,
      '-plain': plain,
    }">
    <div v-if="loading" class="ui-card-loading">
      <Spinner size="50" />
    </div>
    <div v-if="title || haveSlot('header-title')" class="ui-card-header" @click="isDropdown ? toggleShowBody() : null">
      <div class="ui-card-header-content">
        <div class="ui-header-content-title">
          <slot name="header-title">
            <h4 v-if="title" class="ui-card-title">
              <span>{{ title }}</span>
              <span v-if="titleMuted" class="muted" v-html="titleMuted"></span>
            </h4>
          </slot>
          <div v-if="caption" class="ui-card-caption" v-html="caption"></div>
          <span v-if="haveSlot('caption')" class="ui-card-caption">
            <slot name="caption" />
          </span>
        </div>
        <div class="ui-card-header-content-button">
          <Link v-if="actions" v-for="item in actions" :key="item.label" @click="item.onAction">
            {{ item.label }}
          </Link>
          <slot v-if="haveSlot('header-button')" name="header-button" />
          <Button v-if="isDropdown" type="button" class="btn-collapse">
            <div v-if="showBody">
              <Icon class="btn-collapse-icon" name="expand_less" :size="24" />
            </div>
            <div v-if="!showBody">
              <Link v-if="dropdownLabel">{{ dropdownLabel }}</Link>
              <Icon v-else class="btn-collapse-icon" name="expand_more" :size="24" />
            </div>
          </Button>
        </div>
      </div>

      <div v-if="closeCaption && !showBody" class="ui-card-caption">{{ closeCaption }}</div>
      <div v-if="haveSlot('close-caption') && !showBody" class="ui-card-caption">
        <slot name="close-caption" />
      </div>
      <div v-if="haveSlot('header-caption')" class="ui-card-caption">
        <slot name="header-caption" />
      </div>
    </div>

    <div v-show="showBody" class="ui-card-body">
      <slot />
    </div>

    <div v-if="haveSlot('footer')" v-show="showBody" class="ui-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss">
@import './Card.scss';
</style>
