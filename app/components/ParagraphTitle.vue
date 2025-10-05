<template>
  <h2 class="font-shoulders font-medium uppercase text-3xl sm:text-4xl flex items-center justify-start gap-3 mb-3">
    <div class="w-fit">
      <IconArrow class="text-blue-light w-8 sm:w-10 rotate-45"></IconArrow>
    </div>
    <span class="text-balance shrink">{{ title }}</span>
  </h2>
</template>

<script lang="ts" setup>
import IconArrow from "./icons/IconArrow.vue";

const props = defineProps<{
  title: string;
}>();
</script>

<style></style>
