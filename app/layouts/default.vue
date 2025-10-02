<template>
  <div class="">
    <MenuHeader />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import MenuHeader from '~/components/navigation/MenuHeader.vue';

import { useMenusStore } from '~/stores/menus';
import { usePagesStore } from '~/stores/pages';
import { useSponsorsStore } from '~/stores/sponsors';

const menusStore = useMenusStore()
const pagesStore = usePagesStore()
const sponsorsStore = useSponsorsStore()

await callOnce(menusStore.fetch)
await callOnce(pagesStore.fetch)
await callOnce(sponsorsStore.fetch)
</script>

<style></style>
