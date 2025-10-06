<template>
  <div class="maxed padded my-8">
    <h2 class="">{{ t("applications.title") }}</h2>
    <UCarousel
      v-slot="{ item }"
      arrows
      :prev="{ variant: 'ghost', color: 'primary', size: 'xxl' }"
      :next="{ variant: 'ghost', color: 'primary', size: 'xxl' }"
      prev-icon="i-lucide-chevron-left"
      next-icon="i-lucide-chevron-right"
      :items="applicationsStore.localizedApplications"
      :ui="{ item: 'basis-1/3 self-stretch' }"
    >
      <Application :application="item"></Application>
    </UCarousel>
  </div>
</template>

<script lang="ts" setup>
import { useApplicationsStore } from "~/stores/applications"
import Application from "../partials/Application.vue"
import type { colorPicker } from "#build/ui"

const { t } = useI18n()
const applicationsStore = useApplicationsStore()
</script>

<style></style>
