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

const menusStore = useMenusStore()
const pagesStore = usePagesStore()

await callOnce(menusStore.fetch)
await callOnce(pagesStore.fetch)
</script>

<style></style>
