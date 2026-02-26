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
const config = useRuntimeConfig()
const head = useLocaleHead()

// Fetch page data from store
const page = computed((): ILocalizedPage | null => getPageWithSlug.value(""))

// Define page head properties
useHead({
  title: `${page.value?.title} - ${t("site_title")}`,
  htmlAttrs: {...head.value.htmlAttrs},
  bodyAttrs: {
    class: `home ${page.value?.classes}`,
  },
});

// Define page SEO meta tags
useSeoMeta({
  title: `${page.value?.title} - ${t("site_title")}`,
  ogTitle: `${page.value?.title} - ${t("site_title")}`,
  description: t("site_description"),
  ogDescription: t("site_description"),
  ogImage: `${config.public.apiBase}/assets/044fe466-3c17-4022-8222-12e1a2fbe020`,
  twitterCard: "summary_large_image",
})
</script>
