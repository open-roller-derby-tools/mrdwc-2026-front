<template>
  <div class="relative">
    <OnClickOutside @trigger="isOpen = false">
      <div class="select" :class="getDynamicClasses" @click="isOpen = !isOpen">
        <span>{{ getShortCode(locale) }}</span>
        <IconSelectArrow :open="isOpen" class="w-3"></IconSelectArrow>
      </div>
    </OnClickOutside>
    <div class="dropdown" :class="getDropdownDynamicClasses">
      <div
        v-for="l in locales"
        :key="l.code"
        class="w-full text-start py-1 px-3 hover:bg-[#d1982f] cursor-pointer"
        :class="getDynamicItemClasses(l.code == locale)"
        @click.prevent.stop="setLocale(l.code)"
      >
        {{ getShortCode(l.code) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconSelectArrow from "../icons/IconSelectArrow.vue"
import { OnClickOutside } from "@vueuse/components"

const { locales, locale, setLocale } = useI18n()

const isOpen = ref<boolean>(false)

const getDynamicClasses = computed(() => {
  return isOpen.value ? "rounded-b-none" : "rounded-b-2xl"
})

const getDropdownDynamicClasses = computed(() => {
  return isOpen.value ? "flex" : "hidden"
})

const getDynamicItemClasses = (isCurrent: boolean) => {
  return { hidden: isCurrent, "cursor-pointer": !isCurrent }
}

const getShortCode = (code: string) => code.slice(0, 2)
</script>

<style scoped>
@reference "~/assets/css/main.css";

.select {
  @apply relative bg-yellow text-blue-dark w-[62px] h-[32px] rounded-t-2xl px-3 py-1 select-none flex items-center justify-between gap-2;
  @apply font-shoulders font-bold uppercase;
}

.dropdown {
  @apply absolute left-0 bottom-0 z-110 translate-y-full w-full rounded-b-2xl overflow-hidden bg-yellow text-blue-dark select-none flex-col;
  @apply font-shoulders font-bold uppercase;
}
</style>
