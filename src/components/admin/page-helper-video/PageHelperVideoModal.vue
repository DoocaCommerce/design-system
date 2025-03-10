<script setup lang="ts">
import { ref } from 'vue';
import Aside from '../../ui/aside/Aside.vue';
import Link from '../../ui/link/Link.vue';
import AsideSection from '../../ui/aside/AsideSection.vue';
import YoutubePlayer from '../../ui/youtube-player/YoutubePlayer.vue';
import type { IVideo, PageHelperVideoModalProps } from './types';

withDefaults(defineProps<PageHelperVideoModalProps>(), {
  title: 'Base de conhecimento',
  supportTitle: 'Para encontrar ainda mais informações, explore nossos artigos disponíveis na base de conhecimento.',
});

const video = ref<IVideo>({
  video_id: '_QzHQ3zxUS4',
  name: 'PageHelperVideo',
});

const aside = ref(false);

const open = (item: IVideo) => {
  video.value = item;
  aside.value = true;
};

defineExpose({
  open,
});
</script>

<template>
  <Aside v-model="aside" title="Ajuda" size="sm">
    <div class="page-helper-video-modal">
      <AsideSection>
        <div class="videoWrapper">
          <YoutubePlayer :video-id="video.video_id" :width="480" :height="320" style="width: 100%" />
        </div>
      </AsideSection>
      <AsideSection>
        <div class="page-helper-video-title">
          <div class="page-helper-video-default">
            <h3 class="page-helper-video-default-title">{{ title }}</h3>
            <p class="page-helper-video-default-support">
              {{ supportTitle }}
            </p>
          </div>
        </div>
        <ul class="page-helper-video-modal-list">
          <li v-for="item in video.articles" :key="item.url">
            <Link :href="item.url" target="_blank">
              {{ item.name }}
            </Link>
          </li>
        </ul>
      </AsideSection>
    </div>
  </Aside>
</template>

<style lang="scss">
.page-helper-video-modal {
  .videoWrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
  }

  .videoWrapper iframe {
    border-radius: var(--s-border-radius-small);
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .page-helper-video-default {
    padding: 0 0 var(--s-spacing-small);
    display: inline-block;

    &-support {
      margin: 0;
    }
  }

  .page-helper-video-modal-list {
    padding-left: 0;
    list-style: none;

    li {
      padding: var(--s-spacing-xx-small) 0;
      border-top: var(--s-border-light);
      margin: 0;

      &:first-child {
        padding-top: 0;
        border: 0;
      }
    }
  }
}
</style>
