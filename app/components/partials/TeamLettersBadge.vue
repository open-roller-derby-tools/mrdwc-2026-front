<template>
  <div
    class="inline-block font-mono font-bold px-1.5 rounded-md"
    :style="teamColors"
  >
    {{ teamLetters }}
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedTeam } from "~~/types/custom";

const props = defineProps<{
  team: ILocalizedTeam | null;
  fallback: string | null;
}>();

const teamLetters = computed(
  () => props.team?.name_letters ?? props.fallback ?? "---",
);

const teamColors = computed(() => {
  const backgroundColor = props.team?.schedule_color ?? "var(--color-yellow)";
  return {
    backgroundColor: backgroundColor,
    color: getContrastingTextColor(backgroundColor),
  };
});
</script>
