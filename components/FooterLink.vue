<template>
  <NuxtLink class="flex gap-2 items-center">
    <div class="w-fit">
      <IconArrow class="text-blue-light w-6 rotate-45"></IconArrow>
    </div>
    <span class="font-shoulders font-medium text-2xl">{{ label }}</span>
  </NuxtLink>
</template>

<script lang="ts" setup>
import IconArrow from './icons/IconArrow.vue';

const props = defineProps<{
  label: string
}>()
</script>

<style></style>