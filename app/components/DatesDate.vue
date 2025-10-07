<template>
  <div class="flex flex-col">
    <p class="text-[1.2em] flex flex-row align-start">
      {{ d(date, "d") }}
      <span v-if="locale === 'en-US'" class="text-[0.6em] ml-[2px]">
        {{ getOrdinalSuffix(date.getDate()) }}
      </span>
    </p>

    <p
      class="text-[1em] uppercase"
      :class="{
        'order-first': month_first,
        '-mb-[0.5em]': month_first,
        '-mt-[0.5em]': !month_first,
      }"
    >
      {{ d(date, "m") }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const { t, d, locale } = useI18n()

defineProps<{
  date: Date
}>()

const month_first = ref<boolean>(true)

onMounted(() => {
  month_first.value = t("date_month_first", "true") == "true"
})

// Helper pour les suffixes anglais
function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th" // exceptions pour 11th, 12th, 13th
  switch (day % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}
</script>

<style></style>
