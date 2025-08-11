<template>
  <div class="wc-title font-shoulders font-bold w-full max-w-[10em] flex flex-col items-end self-end">
    <div class="flex rounded-2xl border-2 border-white gap-[0.5em] px-[0.5em] py-[0.25em] -mb-[1em]">
      <DatesDate
        class="text-[0.666em]"
        :date="startDate"
      ></DatesDate>
      <IconArrow class="w-[0.85em]"></IconArrow>
      <DatesDate
        class="text-[0.666em]"
        :date="endDate"
      ></DatesDate>
    </div>
    <NuxtImg src="/mrdwc_title@2x.png"></NuxtImg>
    <p class="font-medium text-end text-[2.1em] -mt-[0.7em]">2026</p>
  </div>
</template>

<script lang="ts" setup>
import IconArrow from "./icons/IconArrow.vue";

const startDate = new Date(2026, 3, 30, 0, 0, 0);
const endDate = new Date(2026, 4, 3, 0, 0, 0);
</script>

<style scoped>
div.wc-title {
  font-size: min(10dvw, 50px);
}
</style>
