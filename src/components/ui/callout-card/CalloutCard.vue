<script lang="ts">
/**
 * **Deprecated:** este componente está depreciado e será removido em breve.
 *
 * @deprecated Este componente está depreciado e será removido em versões futuras.
 */
export default {};
</script>

<script setup lang="ts">
import Card from '../card/Card.vue';
import Button from '../button/Button.vue';
import Icon from '../icon/Icon.vue';
import type { CalloutCardProps } from './types';

defineProps<CalloutCardProps>();
</script>

<template>
  <Card class="ui-callout-card">
    <div v-if="icon" class="ui-callout-card-icon" :class="{ '-bg-primary': bgColorIconPrimary }">
      <Icon :name="icon" size="30" />
    </div>
    <div class="ui-callout-card-content">
      <div class="ui-callout-card-header">
        <h5 v-if="title" class="ui-callout-card-title">
          {{ title }}
        </h5>
        <slot name="append-to-header" />
      </div>
      <div class="ui-callout-card-text">
        <slot />
      </div>
      <div
        v-if="primaryAction"
        class="ui-callout-card-actions"
        :style="{ 'justify-content': justifyCardActions || 'flex-end' }">
        <Button
          :to="primaryAction.to"
          :variant="primaryAction?.variant"
          :label="primaryAction?.label"
          :leading-icon="primaryAction.leadingIcon"
          @click="primaryAction?.onAction" />
      </div>
    </div>
  </Card>
</template>

<style lang="scss">
@import './CalloutCard.scss';
</style>
