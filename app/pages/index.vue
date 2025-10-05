<template>
  <div>
    <div v-if="pagesStore.isReady && page">
      <component
        v-for="block, i in page.blocks"
        :key="`block_${i}`"
        :is="getBlockComponent(block.collection)"
        :data="block"
      ></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedPage } from '~~/types/custom';

const { t } = useI18n();
const pagesStore = usePagesStore()
const { getPageWithSlug } = storeToRefs(pagesStore)

// Fetch page data from store
const page = computed((): ILocalizedPage | null => getPageWithSlug.value(""))

// Define page head properties
useHead({
  title: `${page.value?.title} - ${t("site_title")}`,
  bodyAttrs: {
    class: `home ${page.value?.classes}`,
  },
});
</script>
