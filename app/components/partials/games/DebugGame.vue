<template>
    <div class="flex h-8 my-1">
        <div class="flex items-center justify-center w-8 bg-blue-text text-white">{{ game.number }}</div>
        <div :style="homeSpanStyle" class="w-48 flex items-center justify-center">{{ homeTeamName }}</div>
        <div :style="awaySpanStyle" class="w-48 flex items-center justify-center">{{ awayTeamName }}</div>
    </div>
</template>

<script lang="ts" setup>
import type { IGame } from '~~/types/games';
import { useContrastingColor } from '~/composables/useContrastingColor';
import { useTeamsStore } from '~/stores/teams';

const teamsStore = useTeamsStore();

const props = defineProps<{
    game: IGame;
}>();

const homeTeamName = computed(() => teamsStore.getTeamById(props.game.home_team)?.name_letters ?? props.game.home_source);
const awayTeamName = computed(() => teamsStore.getTeamById(props.game.away_team)?.name_letters ?? props.game.away_source);

const homeTextColor = useContrastingColor(computed(() => props.game.home_color));
const awayTextColor = useContrastingColor(computed(() => props.game.away_color));

const homeSpanStyle = computed(() => ({
    backgroundColor: props.game.home_color,
    color: homeTextColor.value,
}));

const awaySpanStyle = computed(() => ({
    backgroundColor: props.game.away_color,
    color: awayTextColor.value,
}));
</script>