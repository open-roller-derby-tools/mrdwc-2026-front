<template>
  <div>
    <div v-if="pagesStore.isReady && page">
      <PageHeader :image="page.header_image">
        <h1
          v-if="page.show_title"
          class="flex gap-2 items-center mb-2 absolute bottom-2 left-4 sm:left-8 md:left-8 sm:bottom-0 ]"
        >
          <UIcon
            name="i-lucide-arrow-down-right"
            class="text-yellow size-12 sm:size-16"
          />{{ page.title }}
        </h1>
        <!-- Logo -->
        <NuxtImg
          src="/mrdwc_logo@2x.png"
          :alt="t('image_alts.image_logo')"
          class="absolute -bottom-17 z-10 right-8 md:right-6 lg:right-2 w-52 self-center sm:self-auto hidden md:block"
        />
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
  description: t("site_description"),
  ogDescription: t("site_description"),
  ogImage: "https://backend.mrdwc.org/assets/044fe466-3c17-4022-8222-12e1a2fbe020",
  twitterCard: "summary_large_image",
})
</script>

<style></style>
