<template>
  <div
    class="px-4 py-24"
    :class="page?.classes"
  >
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
import type { ILocalizedPage } from '~~/types/custom'

const { t } = useI18n();
const route = useRoute()
const pagesStore = usePagesStore()
const { hasPageWithSlug, getPageBySlug } = storeToRefs(pagesStore)

// Throw 404 error if page slug was not found
if (!hasPageWithSlug.value(route.params.slug as string)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

// Fetch page data from store
const page = computed((): ILocalizedPage | null => getPageBySlug.value(route.params.slug as string))

// Define page head properties
useHead({
  title: `${page.value?.title} - ${t("site_title")}`,
  bodyAttrs: {
    class: page.value?.classes,
  },
})

// Define page SEO meta tags
useSeoMeta({
  title: `${page.value?.title} - ${t("site_title")}`,
  ogTitle: `${page.value?.title} - ${t("site_title")}`,
  // description: 'This is my amazing site, let me tell you all about it.',
  // ogDescription: 'This is my amazing site, let me tell you all about it.',
  // ogImage: 'https://example.com/image.png',
})
</script>

<style></style>