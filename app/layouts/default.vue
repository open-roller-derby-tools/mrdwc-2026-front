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
import HeaderNav from "~/components/navigation/HeaderNav.vue";
import { useMenusStore } from '~/stores/menus';
import { usePagesStore } from '~/stores/pages';
import { useSponsorsStore } from '~/stores/sponsors';
import { useVenuesStore } from '~/stores/venues';
import { useApplicationsStore } from '~/stores/applications';

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
