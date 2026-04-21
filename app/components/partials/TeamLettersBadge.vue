<template>
	<div
		class="inline-block font-mono font-bold px-1.5 rounded-md text-sm sm:text-base"
		:style="teamBadgeStyle"
	>
		{{ teamLetters }}
	</div>
</template>

<script lang="ts" setup>
import type { ILocalizedTeam } from "~~/types/teams";

const props = defineProps<{
	team: ILocalizedTeam | null;
	fallback?: string | null;
}>();

const teamLetters = computed(() => props.team?.name_letters ?? props.fallback ?? "---");

const teamBadgeStyle = computed(() => {
	const backgroundColor = props.team?.schedule_color ?? "var(--color-yellow)";
	const color = getContrastingTextColor(backgroundColor);
	return {
		backgroundColor: backgroundColor,
		color: color,
		// borderColor: color,
	};
});
</script>
