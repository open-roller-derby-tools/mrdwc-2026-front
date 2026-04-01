<template>
    <div class="relative grid grid-cols-6 text-sm grow">
        <div :style="homeDivStyle" :class="`${homeDivClasses} ${COMMON_DIV_CLASSES}`" class="rounded-tl-md">
            <span>{{ homeTeamName }}</span>
            <span v-if="game.home_score > 0">{{ game.home_score }}</span>
        </div>
        <div :style="awayDivStyle" :class="`${awayDivClasses} ${COMMON_DIV_CLASSES}`" class="rounded-tr-md">
            <span>{{ awayTeamName }}</span>
            <span v-if="game.away_score > 0">{{ game.away_score }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GameState, type IGame } from '~~/types/games';
import { useTeamsStore } from '~/stores/teams';

const teamsStore = useTeamsStore();

const props = defineProps<{
    game: IGame;
}>();

const COMMON_DIV_CLASSES = 'h-full flex flex-col items-center justify-center leading-none';

const homeTeamName = computed(() => teamsStore.getTeamById(props.game.home_team)?.name_letters ?? props.game.home_source);
const awayTeamName = computed(() => teamsStore.getTeamById(props.game.away_team)?.name_letters ?? props.game.away_source);

const homeTextColor = useContrastingColor(computed(() => props.game.home_color));
const awayTextColor = useContrastingColor(computed(() => props.game.away_color));

const homeDivStyle = computed(() => ({
    backgroundColor: props.game.home_color,
    color: homeTextColor.value,
}));
const awayDivStyle = computed(() => ({
    backgroundColor: props.game.away_color,
    color: awayTextColor.value,
}));

const homeDivClasses = computed(() => {
    if (gameIsOver.value && homeWon.value) {
        return 'font-bold text-base col-span-4';
    }
    else if (gameIsOver.value && awayWon.value) {
        return 'col-span-2';
    }
    return 'col-span-3';
});
const awayDivClasses = computed(() => {
    if (gameIsOver.value && awayWon.value) {
        return 'font-bold text-base col-span-4';
    }
    else if (gameIsOver.value && homeWon.value) {
        return 'col-span-2';
    }
    return 'col-span-3';
});

const gameIsOver = computed(() => props.game.state === GameState.Finished);
const homeWon = computed(() => props.game.home_score > props.game.away_score);
const awayWon = computed(() => props.game.away_score > props.game.home_score);
</script>
