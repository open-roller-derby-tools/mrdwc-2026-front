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
    <!-- <main class="bg-blue-dark py-16">
      <div class="maxed flex flex-col sm:flex-row gap-16">
        <div class="w-full sm:w-2/5">
          <Venues></Venues>
          <OfficialLogos></OfficialLogos>
        </div>
        <div class="w-full sm:w-3/5 text-lg">
          <TeamsParagraph></TeamsParagraph>
          <OfficialsParagraph></OfficialsParagraph>
        </div>
      </div>
    </main>
    <Footer></Footer> -->
  </div>
</template>

<script setup lang="ts">
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
