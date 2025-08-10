<template>
  <div class="relative">
    <OnClickOutside @trigger="isOpen = false">
      <div
        class="select"
        :class="getDynamicClasses"
        @click="isOpen = !isOpen"
      >
        <span>{{ locale }}</span>
        <IconSelectArrow
          :open="isOpen"
          class="w-3"
        ></IconSelectArrow>
      </div>
    </OnClickOutside>
    <div
      class="dropdown"
      :class="getDropdownDynamicClasses"
    >
      <div
        v-for="l in locales"
        :key="l.code"
        class="w-full text-center py-1 first:pt-0 last:pb-2"
        :class="getDynamicItemClasses(l.code == locale)"
        @click.prevent.stop="setLocale(l.code)"
      >
        {{ l.code }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconSelectArrow from './icons/IconSelectArrow.vue';
import { OnClickOutside } from '@vueuse/components';

const { locales, locale, setLocale } = useI18n();

const isOpen = ref<boolean>(false);

const getDynamicClasses = computed(() => {
  return isOpen.value ? 'rounded-b-none' : 'rounded-b-2xl';
})
const getDropdownDynamicClasses = computed(() => {
  return isOpen.value ? 'flex' : 'hidden';
})
const getDynamicItemClasses = (isCurrent: boolean) => {
  return { 'opacity-50': isCurrent, 'cursor-pointer': !isCurrent }
}
</script>

<style scoped>
@reference "~/assets/css/main.css";

.select {
  @apply relative bg-yellow text-blue-dark rounded-t-2xl px-4 py-2 select-none flex items-center gap-2;
  @apply font-shoulders font-bold uppercase;
}

.dropdown {
  @apply absolute left-0 bottom-0 translate-y-full w-full rounded-b-2xl bg-yellow text-blue-dark select-none flex-col;
  @apply font-shoulders font-bold uppercase;
}
</style>
