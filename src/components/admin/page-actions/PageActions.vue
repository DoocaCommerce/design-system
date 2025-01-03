<script setup lang="ts">
import Button from '../../ui/button/Button.vue';
import type { PageActionsProps } from './types';

defineProps<PageActionsProps>();
</script>

<template>
  <div class="ui-page-actions">
    <div v-if="secondaryActions" class="ui-page-actions-secondary">
      <Button v-for="(item, index) in secondaryActions" :key="index" :variant="item.variant" @click="item.onAction">
        {{ item.label }}
      </Button>
    </div>
    <div v-if="primaryAction" class="ui-page-actions-primary">
      <Button
        v-if="primaryAction"
        variant="success"
        type="submit"
        :to="primaryAction.to"
        :leading-icon="primaryAction.leadingIcon"
        @click="primaryAction?.onAction">
        {{ primaryAction.label }}
      </Button>
    </div>
  </div>
</template>

<style lang="scss">
@import './PageActions.scss';
</style>
