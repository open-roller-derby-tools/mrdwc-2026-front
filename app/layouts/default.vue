<template>
  <div class="min-h-screen flex flex-col">
    <MenuHeader />
    <slot />
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import MenuHeader from "~/components/navigation/MenuHeader.vue"

import { useMenusStore } from "~/stores/menus"
import { usePagesStore } from "~/stores/pages"
import { useSponsorsStore } from "~/stores/sponsors"
import { useVenuesStore } from "~/stores/venues"

const menusStore = useMenusStore()
const pagesStore = usePagesStore()
const sponsorsStore = useSponsorsStore()
const venues = useVenuesStore()

await callOnce(menusStore.fetch)
await callOnce(pagesStore.fetch)
await callOnce(sponsorsStore.fetch)
await callOnce(venues.fetch)
</script>

<style></style>
