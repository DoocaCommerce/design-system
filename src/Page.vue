<script setup lang="ts">
import Page from './components/admin/page/Page.vue';
import type { ActionButton } from './types/Action';

const action: ActionButton = {
  label: 'Bagy',
};
</script>

<template>
  <Page title="Bagy Design System" size="full" :primary-action="action">
    <TextStyle variant="muted">Inicie seus testes por aqui...</TextStyle>
  </Page>
</template>
