<script setup lang="ts">
import type { HomeBarProps } from './types';

defineProps<HomeBarProps>();
</script>

<template>
  <div class="home-bar">
    <h5 class="home-bar-title" v-if="userName">Olá, {{ userName }}!</h5>
    <h5 class="home-bar-title" v-if="message">{{ message }}!</h5>
    <slot name="content" />
  </div>
</template>

<style lang="scss">
@import './HomeBar.scss';
</style>
