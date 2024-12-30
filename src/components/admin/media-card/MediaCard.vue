<script setup lang="ts">
import { ref, computed } from 'vue';
import Card from '../../ui/card/Card.vue';
import Button from '../../ui/button/Button.vue';
import Icon from '../../ui/icon/Icon.vue';
import Modal from '../../ui/modal/Modal.vue';
import type { MediaCardProps } from './types';

const props = withDefaults(defineProps<MediaCardProps>(), {
  imageTarget: '_self',
  inverse: false,
  vertical: false,
});

const openModal = ref<boolean>(false);
const customMediaStyle = computed<{ maxHeight?: string }>(() => {
  return props.maxMediaHeight ? { maxHeight: `${props.maxMediaHeight}px` } : {};
});
const mediaCardClasses = computed(() => {
  return ['ui-media-card', props.inverse && '-inverted', props.video && '-video', props.vertical && '-vertical'].filter(
    (styleClass) => styleClass
  );
});
</script>

<template>
  <div :class="mediaCardClasses">
    <div v-if="video" class="ui-media-card-video" :style="customMediaStyle">
      <img :src="`https://img.youtube.com/vi/${video}/mqdefault.jpg`" @click="openModal = !openModal" />

      <Icon name="play_arrow" @click="openModal = !openModal" />
    </div>
    <div v-else class="ui-media-card-image" :style="customMediaStyle">
      <a :href="imageHref" :target="imageTarget">
        <img :src="image" />
      </a>
    </div>
    <Card :title="title" :style="customMediaStyle">
      <div class="ui-media-card-info">
        <p v-html="text" class="ui-media-card-info-text" />
        <div class="ui-media-card-info-buttons">
          <Button
            v-for="button in buttons"
            :key="button.label"
            :href="button.to"
            :target="button.target"
            :size="button.size || 'sm'"
            :label="button.label"
            :variant="button.variant"
            @click="button.onAction" />
        </div>
      </div>
    </Card>

    <Modal v-model="openModal">
      <iframe
        :src="'https://www.youtube.com/embed/' + video + '?autoplay=1'"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="height: 70vh" />
    </Modal>
  </div>
</template>

<style lang="scss">
@import './MediaCard.scss';
</style>
