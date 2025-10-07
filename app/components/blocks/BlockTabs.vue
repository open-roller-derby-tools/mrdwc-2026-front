<template>
  <div
    :id="data.anchor_id"
    :class="data.classes"
  >
    <ul class="maxed padded mt-6 flex flex-col sm:flex-row gap-0.5 items-center">
      <li
        v-for="slug, i in data.tabs"
        @click="activateTab(slug)"
        class="transition-colors duration-100 font-shoulders font-semibold text-xl px-3 py-2 w-full sm:w-auto flex gap-4 items-center select-none cursor-pointer first:rounded-t-xl last:rounded-b-xl sm:first:rounded-tr-none sm:first:rounded-bl-xl sm:last:rounded-bl-none sm:last:rounded-tr-xl"
        :class="activeSlug == slug ? 'bg-yellow text-blue-text' : 'bg-blue-light text-white'"
        :data-slug="slug"
      >{{ getPageWithSlug(slug)?.menu_title || slug }}
        <UIcon
          name="i-lucide-arrow-right"
          class="size-7 transition-transform duration-200 ease-out"
          :class="activeSlug == slug ? 'rotate-90' : ''"
        />
      </li>
    </ul>
    <Tab
      v-if="activePage"
      :page="activePage"
    ></Tab>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockTabs, ILocalizedPage } from '~~/types/custom';
import Tab from '../partials/Tab.vue';

const props = defineProps<{
  data: ILocalizedBlockTabs
}>()

const localePath = useLocalePath()
const route = useRoute()
const activeSlug = ref<string | undefined>(undefined)

onMounted(() => {
  activeSlug.value = props.data.tabs.find((slug) => slug === route.hash.slice(1))
  if (!activeSlug.value && props.data.tabs.length > 0) {
    activeSlug.value = props.data.tabs[0]
  }
})

const pagesStore = usePagesStore()
const { getPageWithSlug } = storeToRefs(pagesStore)
const activePage = computed((): ILocalizedPage | null => {
  if (activeSlug.value)
    return getPageWithSlug.value(activeSlug.value)
  return null
})

const activateTab = (slug: string) => {
  activeSlug.value = slug
  navigateTo(localePath(`${route.path}#${slug}`))
}
</script>

<style></style>