<template>
  <div
    :id="data.anchor_id"
    :class="data.classes"
  >
    <ul class="maxed padded mt-6 flex flex-col sm:flex-row gap-0.5 items-center">
      <li
        v-for="slug, i in data.tabs"
        @click="activeTabIndex = i"
        class="transition-colors duration-100 font-shoulders font-semibold text-xl px-3 py-2 w-full sm:w-auto flex gap-4 items-center select-none cursor-pointer first:rounded-t-xl last:rounded-b-xl sm:first:rounded-tr-none sm:first:rounded-bl-xl sm:last:rounded-bl-none sm:last:rounded-tr-xl"
        :class="activeTabIndex == i ? 'bg-yellow text-blue-text' : 'bg-blue-light text-white'"
      >{{ getPageWithSlug(slug)?.menu_title || slug }}
        <UIcon
          name="i-lucide-arrow-right"
          class="size-7 transition-transform duration-200 ease-out"
          :class="activeTabIndex == i ? 'rotate-90' : ''"
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

const activeTabIndex = ref(0)
const activeTab = computed(() => {
  return props.data.tabs[activeTabIndex.value] || null
})

const pagesStore = usePagesStore()
const { getPageWithSlug } = storeToRefs(pagesStore)
const activePage = computed((): ILocalizedPage | null => {
  if (activeTab.value)
    return getPageWithSlug.value(activeTab.value)
  return null
})

</script>

<style></style>