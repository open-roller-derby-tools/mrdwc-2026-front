<template>
  <div class="maxed padded my-6 sm:my-10">
    <h2>{{ t("applications.title") }}</h2>

    <UCarousel
      v-slot="{ item }"
      :items="activeApplications"
      :arrows="shouldShowNav"
      :dots="shouldShowNav"
      :prev="{ variant: 'ghost', color: 'primary', size: 'xl' }"
      :next="{ variant: 'ghost', color: 'primary', size: 'xl' }"
      prev-icon="i-lucide-chevron-left"
      next-icon="i-lucide-chevron-right"
      :ui="{
        item: 'basis-full md:basis-1/2 lg:basis-1/3 self-stretch',
        dots: 'relative bottom-0 mt-4',
        dot: 'bg-white/70 border-1 border-white data-[state=active]:bg-red-light shadow',
      }"
    >
      <Application :application="item" />
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import { useApplicationsStore } from "~/stores/applications"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import { computed, ref, onMounted, onBeforeUnmount } from "vue"
import Application from "../partials/Application.vue"

import { useWindowSize } from "@vueuse/core"

const { t } = useI18n()
const applicationsStore = useApplicationsStore()
const { getApplicationsWithStatus } = storeToRefs(applicationsStore)

const activeApplications = computed(() =>
  getApplicationsWithStatus.value(["open", "upcoming"])
)

// --- Responsive (vueuse)
const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.sm,
})
const smOrSmaller = breakpoints.smallerOrEqual("sm")

// --- Largeur de fenêtre (pour évaluer le nombre d’items visibles)

const { width: windowWidth } = useWindowSize()
const handleResize = () => (windowWidth.value = window.innerWidth)
onMounted(() => window.addEventListener("resize", handleResize))
onBeforeUnmount(() => window.removeEventListener("resize", handleResize))

// --- Déterminer combien d’items visibles selon la largeur
const visibleItems = computed(() => {
  if (windowWidth.value < 768) return 1 // mobile
  if (windowWidth.value < 1024) return 2 // tablette
  return 3 // desktop
})

// --- Masquer navigation si tout tient à l’écran
const shouldShowNav = computed(
  () => activeApplications.value.length > visibleItems.value
)
</script>
