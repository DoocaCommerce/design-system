<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Skeleton from '../../ui/skeleton/Skeleton.vue';
import SidebarHeader from '../sidebar-header/SidebarHeader.vue';
import type { PanelSkeletonProps } from './types';

const props = withDefaults(defineProps<PanelSkeletonProps>(), {
  delayMiliseconds: 1,
});

const delayInSeconds = computed(() => `${props.delayMiliseconds / 1000}s`);

const isVisible = ref<boolean>(false);

watch(
  () => props.isLoading,
  () => {
    if (!props.isLoading) {
      setTimeout(() => {
        isVisible.value = false;
      }, props.delayMiliseconds);
    } else {
      isVisible.value = true;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="isVisible" class="panel-skeleton-container" :class="{ '-show': isLoading }">
    <div class="sidebar">
      <SidebarHeader
        :logoImage="logoImage"
        :actionsConfig="{
          notification: {
            show: false,
            nameClass: '',
          },
          quickSearch: { show: false },
        }" />
      <div class="tabs">
        <Skeleton v-for="s in new Array(2)" />
      </div>
      <Skeleton v-for="s in new Array(4)" />
      <div class="sidebar-footer">
        <Skeleton />
      </div>
    </div>
    <div class="panel-content">
      <Skeleton height="48px" />
      <Skeleton height="24px" />
      <div class="horizontal">
        <Skeleton v-for="s in new Array(3)" />
      </div>
      <Skeleton height="24px" />
      <div class="horizontal">
        <Skeleton v-for="s in new Array(6)" />
      </div>
      <div class="horizontal">
        <Skeleton />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './PanelSkeleton.scss';
.panel-skeleton-container {
  transition: all v-bind(delayInSeconds);
}
</style>
