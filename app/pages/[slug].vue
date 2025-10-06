<template>
  <div class="pt-24">
    <div v-if="pagesStore.isReady && page">
      <h1
        v-if="page.show_title"
        class="maxed padded my-4 flex gap-2 items-center"
      >
        <UIcon
          name="i-lucide-arrow-down-right"
          class="text-yellow size-16"
        />{{ page.title }}
      </h1>
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
const { hasPageWithSlug, getPageWithSlug } = storeToRefs(pagesStore)

// Throw 404 error if page slug was not found
if (!hasPageWithSlug.value(route.params.slug as string)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

// Fetch page data from store
const page = computed((): ILocalizedPage | null => getPageWithSlug.value(route.params.slug as string))

// Define page head properties
useHead({
  title: `${page.value?.title} - ${t("site_title")}`,
  bodyAttrs: {
    class: `${page.value?.slug} ${page.value?.classes}`,
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