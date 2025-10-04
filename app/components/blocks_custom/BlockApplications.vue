<template>
  <div class="maxed my-8">
    <h1 class="">{{ t('applications') }}</h1>
    <UCarousel
      v-slot="{ item }"
      arrows
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
import { useApplicationsStore } from "~/stores/applications";
import Application from "../partials/Application.vue";

const { t } = useI18n();
const applicationsStore = useApplicationsStore();
</script>

<style></style>