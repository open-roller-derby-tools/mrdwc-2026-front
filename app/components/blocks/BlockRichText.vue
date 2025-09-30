<template>
  <div class="my-8">
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