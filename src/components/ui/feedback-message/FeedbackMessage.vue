<script setup lang="ts">
import type { FeedbackMessageEmits, FeedbackMessageProps } from './types';
import Button from '#ds/components/ui/button/Button.vue';
import Icon from '#ds/components/ui/icon/Icon.vue';

withDefaults(defineProps<FeedbackMessageProps>(), {
  icon: () => ({
    name: 'search_off',
    size: 48,
  }),
  button: () => ({
    variant: 'highlight',
  }),
});
const emit = defineEmits<FeedbackMessageEmits>();

const onAction = () => emit('action');
</script>

<template>
  <!-- eslint-disable vue/no-v-html
    Não é um problema de segurança, pois durante o seu uso o conteúdo é fixo e não é dinâmico ou inserido pelo usuário.
  -->
  <section class="ui-feedback-message">
    <Icon
      v-if="showIcon"
      class="ui-feedback-message-icon"
      :name="icon?.name"
      :size="icon?.size"
      :filled="icon?.filled" />

    <div class="ui-feedback-message-content">
      <h4 class="ui-feedback-message-title">{{ title }}</h4>

      <p class="ui-feedback-message-text" v-html="subtitle"></p>
    </div>

    <Button
      v-if="showButton"
      class="ui-feedback-message-action"
      :type="button?.type"
      :label="button?.label"
      :variant="button?.variant"
      :leading-icon="button?.leadingIcon"
      :trailing-icon="button?.trailingIcon"
      :loading="button?.loading"
      :disabled="button?.disabled"
      :size="button?.size"
      :href="button?.href"
      :target="button?.target"
      :block="button?.block"
      @click="onAction" />
  </section>
</template>

<style lang="scss">
@import './FeedbackMessage.scss';
</style>
