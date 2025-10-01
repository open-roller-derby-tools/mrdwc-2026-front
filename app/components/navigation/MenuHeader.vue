<template>
  <div class="flex gap-4 items-center justify-between p-4 fixed top-0 left-0 w-full">
    <ul
      v-if="menusStore.isMenuHeaderReady"
      class="flex gap-4 items-center"
    >
      <li
        v-for="item, i in menusStore.localizedMenuHeader"
        :key="`header_menu_item_${i}`"
        :class="item.classes"
      >
        <NuxtLinkLocale
          v-if="item.collection === 'pages'"
          :to="`/${(item as ILocalizedPageMenuItem).slug}`"
        >{{ (item as ILocalizedPageMenuItem).menu_title }}</NuxtLinkLocale>
        <a
          v-else
          :href="(item as ILocalizedCustomLinkMenuItem).url"
          :target="(item as ILocalizedCustomLinkMenuItem).target"
        >{{ (item as ILocalizedCustomLinkMenuItem).label }}</a>
      </li>
    </ul>
    <LangSwitcher></LangSwitcher>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedCustomLinkMenuItem, ILocalizedPageMenuItem } from '~~/types/custom';

const menusStore = useMenusStore()
</script>

<style></style>