<template>
  <div class="h-full bg-white text-blue-text rounded-2xl p-6">
    <h3 class="text-red-text uppercase font-shoulders text-2xl">{{ application.name }}</h3>
    <p class="text-red-text font-bold">{{ t(`applications.status_${application.status}`) }}</p>
    <div v-html="application.description"></div>
    <ul>
      <li
        v-for="date, i in application.dates"
        :key="`date_${i}`"
      >
        <i18n-t
          keypath="applications.date"
          tag="span"
        >
          <template v-slot:label><strong>{{ date.label }}</strong></template>
          <template v-slot:date>{{ date.date }}</template>
        </i18n-t>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedApplication } from '~~/types/custom';

const { t } = useI18n();

const props = defineProps<{
  application: ILocalizedApplication;
}>();
</script>

<style></style>