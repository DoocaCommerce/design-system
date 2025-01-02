<script lang="ts">
/**
 * @deprecated Este componente está depreciado e será removido em versões futuras.
 */
export default {};
</script>

<script setup lang="ts">
import ListGroupItem from './ListGroupItem.vue';
</script>

<template>
  <ListGroupItem class="-button">
    <slot />
  </ListGroupItem>
</template>

<style lang="scss">
@import './ListGroupItemButton.scss';
</style>
