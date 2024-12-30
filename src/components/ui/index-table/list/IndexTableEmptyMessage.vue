<script setup lang="ts">
import FeedbackMessage from '#ds/components/ui/feedback-message/FeedbackMessage.vue';
import type { IndexTableEmptyMessageEmits, IndexTableEmptyMessageProps } from '../types';

withDefaults(defineProps<IndexTableEmptyMessageProps>(), {
  title: 'Nenhum resultado encontrado',
  subtitle:
    'Não encontramos nenhum item que corresponda à sua pesquisa.<br>Verifique o termo digitado ou tente um filtro diferente.',
  button: () => ({
    label: 'Limpar filtros',
    variant: 'highlight',
  }),
  showIcon: true,
  showButton: true,
});
const emit = defineEmits<IndexTableEmptyMessageEmits>();

const onResetFilters = () => {
  emit('reset-filters');
};
</script>

<template>
  <div class="index-table-empty-msg" data-test-index-table="empty-message">
    <div class="index-table-empty-msg-content">
      <FeedbackMessage
        class="index-table-empty-msg-feedback"
        :title
        :subtitle
        :button
        :show-icon
        :show-button
        data-test-index-table="action-reset-filters-empty-message"
        @action="onResetFilters" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './IndexTableEmptyMessage.scss';
</style>
