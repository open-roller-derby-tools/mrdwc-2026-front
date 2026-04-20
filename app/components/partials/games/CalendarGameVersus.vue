<template>
  <div class="relative flex text-sm grow">
    <div
      :style="homeDivStyle"
      :class="`${homeDivClasses} ${COMMON_DIV_CLASSES}`"
      class="rounded-tl-md"
    >
      <span class="font-mono font-bold">{{ homeTeamName }}</span>
      <span v-if="gameHasStarted && !isNoSpoilerModeActive">{{
        game.home_score
      }}</span>
    </div>
    <div
      :style="awayDivStyle"
      :class="`${awayDivClasses} ${COMMON_DIV_CLASSES}`"
      class="rounded-tr-md"
    >
      <span class="font-mono font-bold">{{ awayTeamName }}</span>
      <span v-if="gameHasStarted && !isNoSpoilerModeActive">{{
        game.away_score
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";
import {
  isGameFinished,
  hasGameStarted,
  hasHomeWon,
  hasAwayWon,
} from "~/utils/game";

const { isNoSpoilerModeActive } = useNoSpoilerMode();
const { getTeamName, getTeamColors } = useGameFormatting();

const props = defineProps<{
  game: IGame;
}>();

const COMMON_DIV_CLASSES =
  "h-full py-3 flex flex-col items-center justify-center leading-none transition-width duration-150 ease-out";

const homeTeamName = computed(() =>
  getTeamName(props.game, "home", true, props.game.home_source),
);
const awayTeamName = computed(() =>
  getTeamName(props.game, "away", true, props.game.away_source),
);

const homeDivStyle = computed(() => getTeamColors(props.game, "home", true));
const awayDivStyle = computed(() => getTeamColors(props.game, "away", true));

const homeDivClasses = computed(() => {
  if (gameIsFinished.value && !isNoSpoilerModeActive.value) {
    if (homeWon.value) return "font-bold text-base w-2/3";
    else if (awayWon.value) return "w-1/3";
  }
  return "w-1/2";
});
const awayDivClasses = computed(() => {
  if (gameIsFinished.value && !isNoSpoilerModeActive.value) {
    if (awayWon.value) return "font-bold text-base w-2/3";
    else if (homeWon.value) return "w-1/3";
  }
  return "w-1/2";
});

const gameHasStarted = computed(() => hasGameStarted(props.game));
const gameIsFinished = computed(() => isGameFinished(props.game));
const homeWon = computed(() => hasHomeWon(props.game));
const awayWon = computed(() => hasAwayWon(props.game));
</script>
