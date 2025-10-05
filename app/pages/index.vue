<template>
  <div class="">
    <div v-if="pagesStore.isReady && page">
      <component
        v-for="block, i in page.blocks"
        :key="`block_${i}`"
        :is="getBlockComponent(block.collection)"
        :data="block"
      ></component>
    </div>
    <!-- <iframe
      id="haWidget"
      class="max-prose mx-auto my-6"
      allowtransparency="true"
      src="https://www.helloasso.com/associations/open-roller-derby-association/evenements/men-s-roller-derby-world-cup-2026-coupe-du-monde-masculine-roller-derby-2026/widget"
      style="width: 100%; border: none;"
      onload="window.addEventListener( 'message', function(e) { const dataHeight = e.data.height; const haWidgetElement = document.getElementById('haWidget'); haWidgetElement.height = dataHeight + 'px'; } )"
    ></iframe> -->
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
