<template>
  <div class="flex flex-col">
    <p class="text-xl">{{ $d(date, "d") }}</p>
    <p :class="{ 'order-first': month_first }">{{ $d(date, "m") }}</p>
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