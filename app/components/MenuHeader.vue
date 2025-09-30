<template>
  <div class="flex gap-4 items-center justify-between p-4 fixed top-0 left-0 w-full">
    <ul
      v-if="menusStore.isMenuHeaderReady"
      class="flex gap-4 items-center"
    >
      <li
        v-for="page in menusStore.localizedMenuHeader"
        :key="page.slug"
      >
        <NuxtLinkLocale :to="`/${page.slug}`">{{ page.menu_title }}</NuxtLinkLocale>
      </li>
    </ul>
    <LangSwitcher></LangSwitcher>
  </div>
</template>

<script lang="ts" setup>
const menusStore = useMenusStore()
</script>

<style></style>