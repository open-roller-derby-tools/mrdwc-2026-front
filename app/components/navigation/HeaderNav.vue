<template>
  <div class="relative">
    <USlideover
      v-if="smOrSmaller"
      v-model:open="open"
      :close="{
        variant: 'ghost',
        icon: 'i-lucide-x',
        size: 'xxl',
        class:
          'absolute text-3xl top-4 right-4 items-center justify-center text-white hover:bg-white/30 rounded-full p-1',
      }"
      side="right"
    >
      <UButton
        color="info"
        variant="solid"
        icon="i-lucide-menu"
        size="xxl"
        class="fixed top-4 right-4 p-3 items-center justify-center z-100 text-white bg-red-light/70 border-1 border-white/20 hover:bg-red-light active:bg-red-light rounded-full backdrop-blur-sm shadow-lg"
      />
      <template #title>
        <LangSwitcher class="" />
      </template>
      <template #body>
        <HeaderMenu @link-selected="closeSlideover"></HeaderMenu>
      </template>
    </USlideover>
    <HeaderMenu v-else></HeaderMenu>
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import LangSwitcher from "./LangSwitcher.vue"
import HeaderMenu from "./HeaderMenu.vue"
import type { IconsIconExternalLink } from "#components"

const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.xl,
})
const smOrSmaller = breakpoints.smallerOrEqual("sm")

const open = ref(false)
const closeSlideover = () => {
  open.value = false
}
</script>

<style></style>
