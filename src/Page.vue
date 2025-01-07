<script setup lang="ts">
import { Page } from '#ds/index';
import type { ActionButton } from '#ds/index';

const action: ActionButton = {
  label: 'Bagy',
};
</script>

<template>
  <Page title="Bagy Design System" size="full" :primary-action="action">
    <TextStyle variant="muted">Inicie seus testes por aqui...</TextStyle>
  </Page>
</template>
