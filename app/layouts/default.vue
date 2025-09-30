<template>
  <div class="">
    <MenuHeader />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useMenusStore } from '~/stores/menus';
import { usePagesStore } from '~/stores/pages';

const menusStore = useMenusStore()
const pagesStore = usePagesStore()

await callOnce(menusStore.fetchMenuHeader)
await callOnce(pagesStore.fetch)
</script>

<style></style>
