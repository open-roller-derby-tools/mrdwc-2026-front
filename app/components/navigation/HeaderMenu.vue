<template>
  <!-- Placeholder pendant le chargement -->
  <div
    v-if="!menuReady"
    class="h-16 sm:h-20 bg-[#121356] animate-pulse transition-opacity duration-300"
  ></div>

  <!-- Menu -->
  <div
    v-else
    class="sm:fixed sm:top-0 sm:left-0 sm:z-100 sm:w-full sm:p-6 sm:bg-gradient-to-b from-[#121356] to-transparent transition-opacity duration-500 opacity-0"
    :class="{ 'opacity-100': menuReady }"
  >
    <div class="maxed px-0 sm:px-6">
      <UNavigationMenu
        :items="convertedMenuItems"
        :orientation="smOrSmaller ? 'vertical' : 'horizontal'"
        content-orientation="vertical"
        variant="header"
      >
        <template
          #list-trailing
          v-if="!smOrSmaller"
        >
          <LangSwitcher class="sm:mr-3" />
        </template>
      </UNavigationMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, onMounted } from "vue"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import type { NavigationMenuItem } from "@nuxt/ui"
import LangSwitcher from "./LangSwitcher.vue"
import type {
  ILocalizedCustomLinkMenuItem,
  ILocalizedMenu,
  ILocalizedMenuMenuItem,
  ILocalizedPageMenuItem,
} from "~~/types/custom"

const localePath = useLocalePath()
const emit = defineEmits(["linkSelected"])
const emitLinkSelected = (e: Event) => emit("linkSelected")

// Responsive
const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.sm,
})
const smOrSmaller = breakpoints.smallerOrEqual("sm")

// Menu data
const MENU_NAME = "header"
const menusStore = useMenusStore()
const { getMenuWithName } = storeToRefs(menusStore)

const menu = computed((): ILocalizedMenu | null =>
  getMenuWithName.value(MENU_NAME)
)

const convertedMenuItems = computed<NavigationMenuItem[]>(() => {
  if (!menu.value || !menu.value.items) return []
  return convertMenuItems(menu.value.items)
})

const convertMenuItems = (
  items: (
    | ILocalizedPageMenuItem
    | ILocalizedCustomLinkMenuItem
    | ILocalizedMenuMenuItem
  )[]
): NavigationMenuItem[] => {
  return items.map((item) => {
    switch (item.collection) {
      case "pages":
        return {
          label: (item as ILocalizedPageMenuItem).menu_title,
          to: localePath(`/${(item as ILocalizedPageMenuItem).slug}`),
          class: (item as ILocalizedPageMenuItem).classes,
          onSelect: emitLinkSelected,
        }
      case "custom_links":
        return {
          label: (item as ILocalizedCustomLinkMenuItem).label,
          to: (item as ILocalizedCustomLinkMenuItem).url,
          class: (item as ILocalizedPageMenuItem).classes,
          target: (item as ILocalizedCustomLinkMenuItem).target,
          onSelect: emitLinkSelected,
        }
      case "menus":
        let submenu = getMenuWithName.value(
          (item as ILocalizedMenuMenuItem).name
        )
        if (
          !submenu ||
          !submenu.items ||
          (item as ILocalizedMenuMenuItem).name == MENU_NAME
        )
          return {
            label: (item as ILocalizedMenuMenuItem).display_name,
          }
        return {
          label: (item as ILocalizedMenuMenuItem).display_name,
          children: convertMenuItems(submenu.items),
          onSelect: emitLinkSelected,
        }
    }
  })
}

// Contrôle d'affichage
const menuReady = ref(false)

watch(
  () => convertedMenuItems.value,
  async (items) => {
    if (items.length > 0 && process.client) {
      await nextTick()
      requestAnimationFrame(() => {
        menuReady.value = true
      })
    }
  },
  { immediate: true }
)

// Fallback si les données sont lentes
onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      if (!menuReady.value) menuReady.value = true
    }, 3000)
  }
})
</script>

<style scoped>
div[role="navigation"] {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}
</style>
