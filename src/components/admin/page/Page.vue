<script setup lang="ts">
import { ref, computed } from 'vue';
import Titlebar from '../titlebar/Titlebar.vue';
import PageMessageSupport from '../page-message-support/PageMessageSupport.vue';
import PageHelperVideo from '../page-helper-video/PageHelperVideo.vue';

import type { PageProps } from './types';
import { PageHelperArticles } from '../page-helper-articles';
import type { IArticle, PageHelperArticlesProps } from '../page-helper-articles';

const props = defineProps<PageProps>();
const classList = ref<string[]>([]);

const articlesHelp = computed<PageHelperArticlesProps>(() => {
  const articlesHelp = {
    title: props?.title,
    articles: [] as IArticle[],
  };

  if (props?.articlesHelp?.length) {
    articlesHelp.articles = props.articlesHelp;
  }

  articlesHelp.articles = props.videoHelp?.articles || [];
  return articlesHelp as PageHelperArticlesProps;
});

if (props.size) {
  classList.value.push(`-${props.size}`);
}
</script>

<template>
  <div class="ui-page" :class="classList">
    <Titlebar
      v-if="!props.hideTitle"
      :title="title"
      :to="to"
      :backlink="backlink"
      :group-actions="groupActions"
      :primary-action="primaryAction"
      :secondary-actions="secondaryActions">
      <template #titlebar-subtitle>
        <slot name="titlebar-subtitle" />
      </template>
    </Titlebar>
    <div v-if="videoHelp?.video_id" class="ui-page-help">
      <PageHelperVideo :video="videoHelp" />
      <PageHelperArticles
        v-if="!videoHelp?.video_id && !!articlesHelp?.articles?.length"
        :articles="articlesHelp.articles"
        :title="articlesHelp.title" />
    </div>
    <slot name="default" />
    <PageMessageSupport v-if="footerHelp" :name="footerHelp.name" :link="footerHelp.link" />
  </div>
</template>

<style lang="scss">
@import './Page.scss';
</style>
