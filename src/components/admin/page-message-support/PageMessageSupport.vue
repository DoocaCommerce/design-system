<script setup lang="ts">
import Icon from '../../ui/icon/Icon.vue';
import Link from '../../ui/link/Link.vue';
import type { PageMessageSupportProps } from './types';

defineProps<PageMessageSupportProps>();
</script>

<template>
  <div class="page-message-support">
    <Icon class="icon" name="info" />
    <span class="page-message-support-text">
      Saiba mais sobre
      <span class="page-message-support-link">
        <Link :href="link" external :label="name" />
      </span>
      na base de conhecimento.
    </span>
  </div>
</template>

<style lang="scss">
@import './PageMessageSupport.scss';
</style>
