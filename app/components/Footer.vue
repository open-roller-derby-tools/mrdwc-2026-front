<template>
  <footer class="flex flex-col bg-blue-text mt-auto justify-self-end">
    <BlockSponsors></BlockSponsors>
    <div class="maxed padded flex flex-col sm:flex-row w-full p-4 gap-8 items-center justify-end">
      <!-- Logo -->
      <NuxtImg
        src="/mrdwc_logo@2x.png"
        :alt="t('image_alts.image_logo')"
        class="w-64 self-center sm:self-auto hidden md:block"
      />

      <!-- Liens en colonnes -->
      <nav class="flex flex-col sm:flex-row gap-4 sm:gap-8 w-auto sm:w-full">
        <!-- Colonne 1 -->
        <ul class="flex flex-col gap-4 list-none pl-0">
          <li
            v-for="(item, i) in menuItemsFirstHalf"
            :key="`footer_item_1_${i}`"
          >
            <FooterLink
              v-if="item.collection === 'pages'"
              :label="(item as ILocalizedPageMenuItem).menu_title"
              :to="`/${(item as ILocalizedPageMenuItem).slug}`"
            />
            <FooterLink
              v-else
              :label="(item as ILocalizedCustomLinkMenuItem).label"
              :to="(item as ILocalizedCustomLinkMenuItem).url"
              :target="(item as ILocalizedCustomLinkMenuItem).target"
            />
          </li>
        </ul>

        <!-- Colonne 2 -->
        <ul class="flex flex-col gap-4 flex-1 list-none pl-0">
          <li
            v-for="(item, i) in menuItemsSecondHalf"
            :key="`footer_item_2_${i}`"
          >
            <FooterLink
              v-if="item.collection === 'pages'"
              :label="(item as ILocalizedPageMenuItem).menu_title"
              :to="`/${(item as ILocalizedPageMenuItem).slug}`"
            />
            <FooterLink
              v-else
              :label="(item as ILocalizedCustomLinkMenuItem).label"
              :to="(item as ILocalizedCustomLinkMenuItem).url"
              :target="(item as ILocalizedCustomLinkMenuItem).target"
            />
          </li>
        </ul>
      </nav>

      <Socials />
    </div>
  </footer>
</template>

<script lang="ts" setup>
import type {
  ILocalizedCustomLinkMenuItem,
  ILocalizedMenu,
  ILocalizedPageMenuItem,
} from "~~/types/custom"

import Socials from "@/components/Socials.vue"
import BlockSponsors from "./blocks_custom/BlockSponsors.vue"

const { t } = useI18n()
const MENU_NAME = "footer"

const menusStore = useMenusStore()
const { getMenuWithName } = storeToRefs(menusStore)
const menu = computed((): ILocalizedMenu | null =>
  getMenuWithName.value(MENU_NAME)
)

const menuItemsFirstHalf = computed(() => {
  if (menu.value?.items?.length) {
    const half = Math.ceil(menu.value?.items?.length / 2)
    return menu.value?.items.slice(0, half)
  }
  return []
})

const menuItemsSecondHalf = computed(() => {
  if (menu.value?.items?.length) {
    const half = Math.ceil(menu.value?.items?.length / 2)
    return menu.value?.items.slice(half)
  }
  return []
})
</script>

<style></style>
