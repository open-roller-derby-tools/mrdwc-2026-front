<template>
  <div class="maxed padded my-4">
    <p class="font-bold">TABS BLOCK:</p>
    <ul>
      <li v-for="slug in data.tabs">{{ slug }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockTabs } from '~~/types/custom';

const props = defineProps<{
  data: ILocalizedBlockTabs
}>()
</script>

<style></style>