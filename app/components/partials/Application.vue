<template>
  <div class="h-full bg-white text-blue-text rounded-2xl p-6">
    <h3 class="text-red-text uppercase font-shoulders text-2xl">{{ application.name }}</h3>
    <p class="text-red-text font-bold">{{ application.status }}</p>
    <div v-html="application.description"></div>
    <ul>
      <li
        v-for="date, i in application.dates"
        :key="`date_${i}`"
      >
        <span class="font-bold">{{ date.label }}</span>
        <span>{{ date.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedApplication } from '~~/types/custom';

const props = defineProps<{
  application: ILocalizedApplication;
}>();
</script>

<style></style>