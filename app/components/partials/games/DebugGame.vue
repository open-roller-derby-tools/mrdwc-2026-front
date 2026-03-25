<template>
    <div class="grid grid-cols-3 items-center max-w-96">
        <span class="text-center">Game {{ game.number }}</span>
        <span :style="homeSpanStyle" class="text-center">{{ teamsStore.getTeamById(game.home_team)?.name_letters
        }}</span>
        <span :style="awaySpanStyle" class="text-center">{{ teamsStore.getTeamById(game.away_team)?.name_letters
        }}</span>
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