<template>
  <div>
    <div v-if="pagesStore.isReady && page">
      <PageHeader :image="page.header_image">
        <h1
          v-if="page.show_title"
          class="flex gap-2 items-center mb-2 absolute bottom-2 sm:bottom-0"
        >
          <UIcon
            name="i-lucide-arrow-down-right"
            class="text-yellow size-12 sm:size-16"
          />{{ page.title }}
        </h1>
        <!-- Logo 
        <NuxtImg
          src="/mrdwc_logo@2x.png"
          :alt="t('image_alts.image_logo')"
          class="absolute r-0 w-64 self-center sm:self-auto hidden md:block"
        />-->
      </PageHeader>
      <component
        v-for="(block, i) in page.blocks"
        :key="`block_${i}`"
        :is="getBlockComponent(block.collection)"
        :data="block"
      ></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PageHeader from "~/components/partials/PageHeader.vue"
import type { ILocalizedPage } from "~~/types/custom"

const { t } = useI18n()
const route = useRoute()
const pagesStore = usePagesStore()
const { hasPageWithSlug, getPageWithSlug } = storeToRefs(pagesStore)

// Throw 404 error if page slug was not found
if (!hasPageWithSlug.value(route.params.slug as string)) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
  })
}

// Fetch page data from store
const page = computed((): ILocalizedPage | null =>
  getPageWithSlug.value(route.params.slug as string)
)

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
