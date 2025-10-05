<template>
  <div class="relative">
    <USlideover
      v-if="smOrSmaller"
      v-model:open="open"
      :close="{
        color: 'primary',
        variant: 'ghost',
      }"
    >
      <UButton
        color="info"
        variant="solid"
        icon="i-lucide-menu"
        class="px-3 py-2 fixed top-4 right-4 z-100"
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
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import LangSwitcher from './LangSwitcher.vue';
import HeaderMenu from './HeaderMenu.vue';

const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.xl,
})
const smOrSmaller = breakpoints.smallerOrEqual('sm')

const open = ref(false)
const closeSlideover = () => {
  open.value = false
}
</script>

<style></style>