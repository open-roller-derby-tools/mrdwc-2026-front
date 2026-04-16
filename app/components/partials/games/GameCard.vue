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

const { getTeamName } = useGameFormatting();

const homeTeamName = computed(() => getTeamName(props.game, "home", true, props.game.home_source));
const awayTeamName = computed(() => getTeamName(props.game, "away", true, props.game.away_source));
</script>