<template>
  <div class="maxed padded my-8">
    <h2 class="">{{ t("applications.title") }}</h2>
    <UCarousel
      v-slot="{ item }"
      :arrows="!smOrSmaller"
      :dots="smOrSmaller"
      :prev="{ variant: 'ghost', color: 'primary', size: 'xl' }"
      :next="{ variant: 'ghost', color: 'primary', size: 'xl' }"
      prev-icon="i-lucide-chevron-left"
      next-icon="i-lucide-chevron-right"
      :items="activeApplications"
      :ui="{
        item: 'basis-full md:basis-1/2 lg:basis-1/3 self-stretch',
        dots: 'relative bottom-0 mt-4',
        dot: 'bg-white/70 border-1 border-white data-[state=active]:bg-red-light',
      }"
    >
      <Application :application="item"></Application>
    </UCarousel>
  </div>
</template>

<script lang="ts" setup>
import { useApplicationsStore } from "~/stores/applications"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import Application from "../partials/Application.vue"

const { t } = useI18n()
const applicationsStore = useApplicationsStore()
const { getApplicationsWithStatus } = storeToRefs(applicationsStore)
const activeApplications = computed(() =>
  getApplicationsWithStatus.value(["open", "upcoming"])
)

// Responsive
const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.sm,
})
const smOrSmaller = breakpoints.smallerOrEqual("sm")
</script>

<style></style>
