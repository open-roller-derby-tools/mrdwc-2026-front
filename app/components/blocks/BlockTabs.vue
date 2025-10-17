<template>
  <div :id="data.anchor_id" :class="[data.classes, 'relative']">
    <!-- Fond bleu desktop -->
    <div
      class="absolute hidden sm:block inset-x-0 top-[22px] h-[22px] bg-blue-text"
    ></div>

    <!-- VERSION MOBILE -->
    <div class="sm:hidden relative z-10 maxed mb-6">
      <div v-for="(slug, i) in data.tabs" :key="slug" class="mt-0.5 first:mt-0">
        <button
          @click="toggleTab(slug)"
          :class="[
            'flex items-center justify-between w-full px-6 py-3 text-blue-text font-shoulders font-semibold text-xl transition-colors duration-200',
            openSlug === slug
              ? 'bg-yellow text-blue-text'
              : 'bg-blue-light text-white',
          ]"
        >
          <span>{{ getPageWithSlug(slug)?.menu_title || slug }}</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="size-6 transition-transform duration-200 ease-out"
            :class="{ 'rotate-90': openSlug === slug }"
          />
        </button>

        <!-- Contenu mobile -->
        <transition name="slide">
          <div v-if="openSlug === slug" class="overflow-hidden">
            <Tab :page="getPageWithSlug(slug)" class="" />
          </div>
        </transition>
      </div>
    </div>

    <!-- VERSION DESKTOP -->
    <div class="hidden sm:block relative z-10">
      <ul
        class="maxed padded py-0 mt-6 flex flex-col sm:flex-row gap-0.5 items-center"
      >
        <li
          v-for="(slug, i) in data.tabs"
          :key="slug"
          @click="activateTab(slug)"
          class="transition-colors duration-100 font-shoulders font-semibold text-xl px-3 py-2 w-full sm:w-auto flex gap-4 items-center select-none cursor-pointer first:rounded-t-xl last:rounded-b-xl sm:first:rounded-tr-none sm:first:rounded-bl-xl sm:last:rounded-bl-none sm:last:rounded-tr-xl"
          :class="[
            activeSlug === slug
              ? 'bg-yellow text-blue-text'
              : 'bg-blue-inactive text-blue-text hover:bg-yellow transition-all duration-200',
          ]"
          :data-slug="slug"
        >
          {{ getPageWithSlug(slug)?.menu_title || slug }}
          <UIcon
            name="i-lucide-arrow-right"
            class="size-7 transition-transform duration-200 ease-out"
            :class="{ 'rotate-90': activeSlug === slug }"
          />
        </li>
      </ul>

      <!-- Contenu desktop -->
      <Tab v-if="activePage" :page="activePage" class="relative z-10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockTabs, ILocalizedPage } from "~~/types/custom"
import Tab from "../partials/Tab.vue"

const props = defineProps<{
  data: ILocalizedBlockTabs
}>()

const localePath = useLocalePath()
const route = useRoute()
const activeSlug = ref<string | undefined>(undefined)
const openSlug = ref<string | null>(null)

onMounted(() => {
  activeSlug.value =
    props.data.tabs.find((slug) => slug === route.hash.slice(1)) ??
    props.data.tabs[0]
})

const pagesStore = usePagesStore()
const { getPageWithSlug } = pagesStore // pas .value !

const activePage = computed((): ILocalizedPage | null => {
  if (activeSlug.value) return getPageWithSlug(activeSlug.value)
  return null
})

const activateTab = (slug: string) => {
  activeSlug.value = slug
  navigateTo(localePath(`${route.path}#${slug}`))
}

const toggleTab = (slug: string) => {
  openSlug.value = openSlug.value === slug ? null : slug
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  opacity: 1;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
