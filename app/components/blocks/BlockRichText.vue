<template>
  <div
    class="relative maxed my-8"
    :class="data.classes"
  >
    <h1>{{ data.title }}</h1>
    <div v-html="data.content"></div>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedBlockRichText } from '~~/types/custom';

defineProps<{
  data: ILocalizedBlockRichText
}>()
</script>

<style></style>