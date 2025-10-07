<template>
  <div class="maxed padded pt-48">
    <p>MENU TEST</p>
    <hr>
    <ul>
      <li v-for="item in menu?.items">
        <p v-if="item.collection === 'pages'">{{ (item as ILocalizedPageMenuItem).menu_title }}</p>
        <p v-else-if="item.collection === 'custom_links'">{{ (item as ILocalizedCustomLinkMenuItem).label }}</p>
        <template v-else-if="item.collection === 'menus' && (item as ILocalizedMenuMenuItem).name != MENU_NAME">
          <p>{{ (item as ILocalizedMenuMenuItem).display_name }}</p>
          <ul class="ml-6">
            <li v-for="subitem in getMenuWithName((item as ILocalizedMenuMenuItem).name)?.items">{{ subitem.collection }}</li>
          </ul>
        </template>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedCustomLinkMenuItem, ILocalizedMenu, ILocalizedMenuMenuItem, ILocalizedPageMenuItem } from '~~/types/custom'


// Menu data
const MENU_NAME = "test_menu"
const menusStore = useMenusStore()
const { getMenuWithName } = storeToRefs(menusStore)

const menu = computed((): ILocalizedMenu | null =>
  getMenuWithName.value(MENU_NAME)
)
console.log(menu.value);

</script>

<style></style>