<template>
  <UApp class="min-h-screen flex flex-col">
    <!-- <MenuHeader /> -->
    <Test></Test>
    <slot />
    <Footer />
  </UApp>
</template>

<script lang="ts" setup>
import MenuHeader from "~/components/navigation/MenuHeader.vue"

import { useMenusStore } from '~/stores/menus';
import { usePagesStore } from '~/stores/pages';
import { useSponsorsStore } from '~/stores/sponsors';
import { useVenuesStore } from '~/stores/venues';
import { useApplicationsStore } from '~/stores/applications';
import Test from "~/components/navigation/Test.vue";

const menusStore = useMenusStore()
const pagesStore = usePagesStore()
const sponsorsStore = useSponsorsStore()
const venuesStore = useVenuesStore()
const applicationsStore = useApplicationsStore()

await callOnce(menusStore.fetch)
await callOnce(pagesStore.fetch)
await callOnce(sponsorsStore.fetch)
await callOnce(venuesStore.fetch)
await callOnce(applicationsStore.fetch)
</script>

<style></style>
