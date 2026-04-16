<template>
    <div class="relative flex text-sm grow">
        <div :style="homeDivStyle" :class="`${homeDivClasses} ${COMMON_DIV_CLASSES}`" class="rounded-tl-md">
            <span>{{ homeTeamName }}</span>
            <span v-if="gameHasStarted && !isNoSpoilerModeActive">{{ game.home_score }}</span>
        </div>
        <div :style="awayDivStyle" :class="`${awayDivClasses} ${COMMON_DIV_CLASSES}`" class="rounded-tr-md">
            <span>{{ awayTeamName }}</span>
            <span v-if="gameHasStarted && !isNoSpoilerModeActive">{{ game.away_score }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GameState, type IGame } from '~~/types/games';

const { isNoSpoilerModeActive } = useNoSpoilerMode();
const { getTeamNameShort, getTeamColors, isGameSpoiler } = useGameFormatting();

const props = defineProps<{
    game: IGame;
}>();

const COMMON_DIV_CLASSES = 'h-full py-3 flex flex-col items-center justify-center leading-none transition-width duration-150 ease-out';

const homeTeamName = computed(() => getTeamNameShort(props.game.home_team, props.game.home_source, isGameSpoiler(props.game)));
const awayTeamName = computed(() => getTeamNameShort(props.game.away_team, props.game.away_source, isGameSpoiler(props.game)));

const homeDivStyle = computed(() => getTeamColors(props.game, "home"));
const awayDivStyle = computed(() => getTeamColors(props.game, "away"));

const homeDivClasses = computed(() => {
    if (gameIsOver.value && !isNoSpoilerModeActive.value) {
        if (homeWon.value)
            return 'font-bold text-base w-2/3';
        else if (awayWon.value)
            return 'w-1/3';
    }
    return 'w-1/2';
});
const awayDivClasses = computed(() => {
    if (gameIsOver.value && !isNoSpoilerModeActive.value) {
        if (awayWon.value)
            return 'font-bold text-base w-2/3';
        else if (homeWon.value)
            return 'w-1/3';
    }
    return 'w-1/2';
});

const gameHasStarted = computed(() => props.game.state !== GameState.Scheduled && props.game.state !== GameState.PreGame && props.game.state !== GameState.Unknown);
const gameIsOver = computed(() => props.game.state === GameState.Finished);
const homeWon = computed(() => props.game.home_score > props.game.away_score);
const awayWon = computed(() => props.game.away_score > props.game.home_score);
</script>
