<template>
  <div class="">
    <MenuHeader />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useMenusStore } from '~/stores/menus';
const menuStore = useMenusStore()
await callOnce(menuStore.fetchMenuHeader)
</script>

<style></style>
