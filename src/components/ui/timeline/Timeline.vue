<script setup lang="ts">
import { shallowRef } from 'vue';
import Link from '../link/Link.vue';
import FormTextfield from '../form-textfield/FormTextfield.vue';
import Button from '../button/Button.vue';
import Stack from '../stack/Stack.vue';
import IconButton from '../icon-button/IconButton.vue';
import type { TimelineProps } from './types';

defineProps<TimelineProps>();
const emit = defineEmits(['onAddMessage', 'onRemoveMessage']);
const note = shallowRef();

function myComponent(item: any): object {
  return { template: item.textRaw };
}
function onSavePost(): void {
  emit('onAddMessage', note.value);
  note.value = null;
}
</script>

<template>
  <div class="ui-timeline ui-timeline-avatar">
    <div class="ui-timeline-input" v-if="inputMessage">
      <form action="" @submit.prevent="onSavePost" autocomplete="off">
        <Stack spacing="sm">
          <FormTextfield required v-model="note" placeholder="Escreva um comentário..." />
          <Button variant="highlight" type="submit" label="Postar" />
        </Stack>
      </form>
    </div>
    <ul class="ui-timeline-list">
      <li class="ui-timeline-item" v-for="(item, key) in modelValue" :key="key">
        <div class="ui-timeline-item-wrapper">
          <div class="ui-timeline-item-content">
            <div class="ui-timeline-info">
              <div class="ui-timeline-item-title-wrapper">
                <component
                  v-if="item.title"
                  :is="item.titleTo ? Link : 'div'"
                  :to="item.titleTo"
                  class="ui-timeline-item-title">
                  {{ item.title }}
                </component>
              </div>

              <div class="ui-timeline-item-text">
                <component v-if="item.textRaw" :is="myComponent(item)" />
                {{ item.text }}
              </div>

              <small class="ui-timeline-item-date">{{ item.date }}</small>
            </div>
            <IconButton @click="$emit('onRemoveMessage', item)" icon="close" size="sm" variant="plain" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import './Timeline.scss';

.ui-timeline-list .ui-timeline-item {
  margin-bottom: 0;
}
</style>
