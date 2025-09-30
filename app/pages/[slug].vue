<template>
  <div class="px-4 py-24">
    <p>SLUG: {{ route.params.slug }}</p>
    <div v-if="pagesStore.isReady">
      <p>TITLE: {{ page?.title }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedPage } from '~~/types/custom'

const route = useRoute()
const pagesStore = usePagesStore()
const { hasPageWithSlug, getPageBySlug } = storeToRefs(pagesStore)

if (!hasPageWithSlug.value(route.params.slug as string)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const page = computed((): ILocalizedPage | null => getPageBySlug.value(route.params.slug as string))
</script>

<style></style>