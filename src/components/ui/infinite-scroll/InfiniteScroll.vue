<script lang="ts">
/**
 * @deprecated Este componente está depreciado e será removido em versões futuras.
 */
export default {};
</script>

<script setup lang="ts">
import { getCurrentInstance, ref, onMounted, nextTick } from 'vue';
import TextStyle from '../text-style/TextStyle.vue';
import Spinner from '../spinner/Spinner.vue';
import type { IContext, InfiniteScrollProps } from './types';

const props = defineProps<InfiniteScrollProps>();

const uid = `ui-infinite-loading-${getCurrentInstance()?.uid}`;
const parentEl = ref<HTMLElement>();
const listen = ref<boolean>(true);
const noMore = ref();
const context: IContext = {
  noMore: () => {
    noMore.value = true;
    removeListener();
  },
  loaded: () => {
    listen.value = true;
  },
};

onMounted(() => {
  const el = document.getElementById(uid);
  const scrollableElement: HTMLElement | null = document.getElementById(props.scrollableElementId!) as HTMLElement;
  if (!el) return;
  parentEl.value = scrollableElement ?? (el.parentElement as HTMLElement);
  addListener();
});

function handleScroll(): void {
  if (!parentEl.value) return;
  const rect = parentEl.value.getBoundingClientRect();
  const heightScroll = parentEl.value.scrollTop + rect.height;
  if (heightScroll > parentEl.value?.scrollHeight - 1 && listen.value) {
    listen.value = false;
    props.load(context);
  }
}
function removeListener(): void {
  if (!parentEl.value) return;
  parentEl.value.removeEventListener('scroll', handleScroll, false);
  listen.value = false;
}
function addListener(): void {
  if (!parentEl.value) return;
  parentEl.value.scrollTo({ top: 0 });
  noMore.value = false;
  parentEl.value.addEventListener('scroll', handleScroll, false);
  listen.value = true;
  props.load(context);
}
defineExpose({
  reset: () => {
    nextTick(() => addListener());
  },
});
</script>

<template>
  <div className="ui-infinite-loading" :id="uid">
    <div className="ui-infinite-loading-content">
      <div v-if="noMore" className="ui-infinite-loading-no-more">
        <TextStyle variant="muted" label="Sem mais resultados" />
      </div>
      <div v-if="listen" className="ui-infinite-loading-spinner">
        <Spinner border="2" :size="spinnerSize || 25" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './InfiniteScroll.scss';
</style>
