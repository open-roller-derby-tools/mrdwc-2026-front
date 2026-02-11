<template>
  <UApp>
    <div class="min-h-screen flex flex-col">
      <HeaderNav />
      <slot />
      <Footer />
    </div>
  </UApp>
</template>

<script lang="ts" setup>
import HeaderNav from "~/components/navigation/HeaderNav.vue"
import { useMenusStore } from "~/stores/menus"
import { usePagesStore } from "~/stores/pages"
import { useSponsorsStore } from "~/stores/sponsors"
import { useVenuesStore } from "~/stores/venues"
import { useApplicationsStore } from "~/stores/applications"
import { useOptionsStore } from "~/stores/options"

const menusStore = useMenusStore()
const pagesStore = usePagesStore()
const sponsorsStore = useSponsorsStore()
const venuesStore = useVenuesStore()
const applicationsStore = useApplicationsStore()
const optionsStore = useOptionsStore()

// Only fetch from API on the server (SSR or when running `nuxt generate`).
// On the client, data comes from the static payload (when serving the static output).
if (!import.meta.client) {
  await callOnce(menusStore.fetch)
  await callOnce(pagesStore.fetch)
  await callOnce(sponsorsStore.fetch)
  await callOnce(venuesStore.fetch)
  await callOnce(applicationsStore.fetch)
  await callOnce(optionsStore.fetch)

  // Prerender every [slug] page (default locale + en-US).
  // Without this, only crawler-discovered routes are generated.
  if (import.meta.prerender && pagesStore.pages?.length) {
    const slugs = pagesStore.pages.filter((p) => p.slug).map((p) => p.slug)
    const locales = ["en-US"] // default locale (fr-FR) has no prefix
    const routes = slugs.flatMap((slug) => [`/${slug}`, ...locales.map((locale) => `/${locale}/${slug}`)])
    prerenderRoutes(routes)
  }
}
</script>

<style></style>
