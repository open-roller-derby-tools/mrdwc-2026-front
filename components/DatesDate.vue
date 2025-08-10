<template>
  <div class="flex flex-col">
    <p class="text-[1.2em]">{{ $d(date, "d") }}</p>
    <p
      class="text-[1em] uppercase"
      :class="{ 'order-first': month_first, '-mb-[0.5em]': month_first, '-mt-[0.5em]': !month_first }"
    >{{ $d(date, "m") }}</p>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const props = defineProps<{
  date: Date
}>()

const month_first = computed(() => {
  return t("date_month_first", "true") == "true";
})
</script>

<style></style>