<template>
  <div
    :id="data.anchor_id"
    :class="[data.classes, 'relative']"
  >
    <!-- Fond bleu desktop -->
    <div class="absolute hidden sm:block inset-x-0 top-[22px] h-[22px] bg-blue-text"></div>

    <!-- VERSION MOBILE -->
    <div class="sm:hidden relative z-10 maxed mb-6">
      <div
        v-for="(slug, i) in data.tabs"
        :key="slug"
        class="mt-0.5 first:mt-0"
      >
        <button
          @click="toggleTab(slug)"
          :data-slug="slug"
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
          <div
            v-if="openSlug === slug"
            class="overflow-hidden"
          >
            <Tab :page="getPageWithSlug(slug)" />
          </div>
        </transition>
      </div>
    </div>

    <!-- VERSION DESKTOP -->
    <nav class="hidden sm:block relative z-10">
      <ul class="maxed padded py-0 mt-6 flex flex-col sm:flex-row gap-0.5 items-center">
        <li
          v-for="(slug, i) in data.tabs"
          :key="slug"
          @click="activateTab(slug)"
          :data-slug="slug"
          class="transition-colors duration-100 font-shoulders font-semibold text-xl px-3 py-2 w-full sm:w-auto flex gap-4 items-center select-none cursor-pointer first:rounded-t-xl last:rounded-b-xl sm:first:rounded-tr-none sm:first:rounded-bl-xl sm:last:rounded-bl-none sm:last:rounded-tr-xl"
          :class="[
            activeSlug === slug
              ? 'bg-yellow text-blue-text'
              : 'bg-blue-inactive text-blue-text hover:bg-yellow transition-all duration-200',
          ]"
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
      <Tab
        v-if="activePage"
        :page="activePage"
        class="relative z-10"
      />
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { nextTick } from "vue"
import type { ILocalizedBlockTabs, ILocalizedPage } from "~~/types/custom"
import Tab from "../partials/Tab.vue"

const props = defineProps<{
  data: ILocalizedBlockTabs
}>()

const route = useRoute()
const router = useRouter()

const activeSlug = ref<string | null>(null)
const openSlug = ref<string | null>(null)

const pagesStore = usePagesStore()
const { getPageWithSlug } = pagesStore

const setActiveFromHash = () => {
  const slugFromHash = route.hash.slice(1)
  const validSlug = props.data.tabs.find((slug) => slug === slugFromHash)
  const newSlug = validSlug ?? props.data.tabs[0] ?? null

  activeSlug.value = newSlug
  openSlug.value = newSlug
}

onMounted(() => {
  setActiveFromHash()
})

watch(
  () => route.hash,
  () => {
    setActiveFromHash()
  }
)

const activePage = computed((): ILocalizedPage | null => {
  return activeSlug.value ? getPageWithSlug(activeSlug.value) : null
})

const activateTab = (slug: string) => {
  activeSlug.value = slug
  openSlug.value = slug
  router.replace({ hash: `#${slug}` })
}

/**
 * toggleTab : ouvre/ferme le toggle mobile.
 * Si on ouvre, on attend le rendu + transition puis on scroll vers le bouton.
 */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const toggleTab = async (slug: string) => {
  const wasOpen = openSlug.value === slug
  openSlug.value = wasOpen ? null : slug

  if (!wasOpen && openSlug.value) {
    // synchro URL / active
    activeSlug.value = openSlug.value
    router.replace({ hash: `#${openSlug.value}` })

    await nextTick()
    await sleep(360)

    const buttonEl = document.querySelector(
      `button[data-slug="${slug}"]`
    ) as HTMLElement | null
    if (!buttonEl) {
      return
    }

    // calculer la position (gérer header fixe)
    const headerOffset = 80
    const top =
      buttonEl.getBoundingClientRect().top + window.scrollY - headerOffset

    window.scrollTo({ top, behavior: "smooth" })
  }
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
