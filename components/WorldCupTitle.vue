<template>
  <div class="@container font-shoulders font-bold w-full max-w-[595px] flex flex-col items-end self-end">
    <div class="flex rounded-2xl border-2 border-white gap-[5dvw] px-[6dvw] py-[3dvw] -mb-[10dvw] @min-[595px]:gap-[31px] @min-[595px]:px-9 @min-[595px]:py-4 @min-[595px]:-mb-[63px]">
      <DatesDate
        class="text-[6.66dvw] @min-[595px]:text-[42px]"
        :date="startDate"
      ></DatesDate>
      <IconArrow class="w-[10dvw] @min-[595px]:w-16"></IconArrow>
      <DatesDate
        class="text-[6.66dvw] @min-[595px]:text-[42px]"
        :date="endDate"
      ></DatesDate>
    </div>
    <NuxtImg src="/mrdwc_title@2x.png"></NuxtImg>
    <p class="font-medium text-end text-[20dvw] -mt-[13dvw] @min-[595px]:text-[125px] @min-[595px]:-mt-[81px]">2026</p>
  </div>
</template>

<script lang="ts" setup>
import IconArrow from './icons/IconArrow.vue';

const startDate = new Date(2026, 3, 30, 0, 0, 0);
const endDate = new Date(2026, 4, 3, 0, 0, 0);
</script>

<style></style>
