<template>
    <div class="w-full max-w-md rounded-2xl bg-white p-8 text-black shadow-2xl">
        <h3>{{ homeTeamName }} - {{ awayTeamName }}</h3>
        <NuxtLink :href="`/games/${game.number}`">Go to game page</NuxtLink>
    </div>
</template>

<script lang="ts" setup>
import type { IGame } from '~~/types/games';

const props = defineProps<{
    game: IGame;
}>();

const { getTeamNameShort, isGameSpoiler } = useGameFormatting();

const homeTeamName = computed(() => getTeamNameShort(props.game.home_team, props.game.home_source, isGameSpoiler(props.game)));
const awayTeamName = computed(() => getTeamNameShort(props.game.away_team, props.game.away_source, isGameSpoiler(props.game)));
</script>