<template>
  <div
    class="sm:fixed sm:top-0 sm:left-0 sm:z-100 sm:w-full sm:p-6 sm:bg-gradient-to-b from-[#121356] to-transparent"
  >
    <div class="maxed px-0 sm:px-6">
      <UNavigationMenu
        :items="convertedMenuItems"
        :orientation="smOrSmaller ? 'vertical' : 'horizontal'"
        content-orientation="vertical"
        variant="header"
      >
        <template #list-trailing v-if="!smOrSmaller">
          <LangSwitcher class="mr-3" />
        </template>
      </UNavigationMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ILocalizedCustomLinkMenuItem,
  ILocalizedMenu,
  ILocalizedPageMenuItem,
} from "~~/types/custom"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import LangSwitcher from "./LangSwitcher.vue"
import type { NavigationMenuItem } from "@nuxt/ui"

const localePath = useLocalePath()

const emit = defineEmits(["linkSelected"])
const emitLinkSelected = (e: Event) => {
  emit("linkSelected")
}

const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.sm,
})

const smOrSmaller = breakpoints.smallerOrEqual("sm")

const MENU_NAME = "header"
const menusStore = useMenusStore()
const { getMenuWithName } = storeToRefs(menusStore)

// Fetch menu data from store
const menu = computed((): ILocalizedMenu | null =>
  getMenuWithName.value(MENU_NAME)
)

const convertedMenuItems = computed(() => {
  return (
    menu.value?.items?.map((item) => {
      switch (item.collection) {
        case "pages":
          return {
            label: (item as ILocalizedPageMenuItem).menu_title,
            to: localePath(`/${(item as ILocalizedPageMenuItem).slug}`),
            class: item.classes,
            onSelect: emitLinkSelected,
          } as NavigationMenuItem
        case "custom_links":
          return {
            label: (item as ILocalizedCustomLinkMenuItem).label,
            to: (item as ILocalizedCustomLinkMenuItem).url,
            class: item.classes,
            target: (item as ILocalizedCustomLinkMenuItem).target,
            onSelect: emitLinkSelected,
          } as NavigationMenuItem
      }
    }) || []
  )
})
</script>

<style></style>
