<template>
	<div v-if="isDev" class="mt-32 bg-blue-text">
		<SimulateGamesToggle />
		<div class="padded">
			<div
				class="overflow-auto w-full sm:max-w-[73rem] max-h-[70dvh] sm:max-h-none mx-auto my-6 p-4 bg-blue rounded-2xl"
			>
				<div class="relative w-[71rem] h-[81rem] *:absolute">
					<!-- Quarterfinals -->
					<BracketGame
						v-if="gameQ4"
						:game="gameQ4"
						background-color="white"
						:style="getGameStyle(0, 0)"
						:link-out-win="'down'"
						:link-out-lose="'down'"
						:link-out-win-ratio="0.75"
						:link-out-lose-ratio="0.5"
						:link-out-lose-height="GAME_HEIGHT * 1.5"
					/>
					<BracketGame
						v-if="gameQ1"
						:game="gameQ1"
						background-color="white"
						:style="getGameStyle(0, 1, 0, 1)"
						:link-out-win="'up'"
						:link-out-lose="'down'"
						:link-out-win-ratio="0.75"
						:link-out-lose-ratio="0.5"
						:link-out-lose-height="GAME_HEIGHT * 5.9"
					/>
					<BracketGame
						v-if="gameQ2"
						:game="gameQ2"
						background-color="white"
						:style="getGameStyle(0, 2, 0, 4)"
						:link-out-win="'down'"
						:link-out-lose="'down'"
						:link-out-win-ratio="0.75"
						:link-out-lose-ratio="0.25"
						:link-out-lose-height="GAME_HEIGHT * 1.5"
					/>
					<BracketGame
						v-if="gameQ3"
						:game="gameQ3"
						background-color="white"
						:style="getGameStyle(0, 3, 0, 5)"
						:link-out-win="'up'"
						:link-out-lose="'down'"
						:link-out-win-ratio="0.75"
						:link-out-lose-ratio="0.25"
						:link-out-lose-height="GAME_HEIGHT * 4.2"
					/>
					<!-- Semifinals -->
					<BracketGame
						v-if="gameS1"
						:game="gameS1"
						:link-in-win="'both'"
						:link-out-win="'down'"
						:link-out-lose="'down'"
						:link-in-ratio="0.25"
						:link-out-win-ratio="0.666"
						:link-out-lose-ratio="0.333"
						:link-out-win-height="GAME_HEIGHT * 1.5"
						:link-out-lose-height="GAME_HEIGHT * 3.1"
						background-color="white"
						:style="getGameStyle(1, 0.5, 1, 0.5)"
					/>
					<BracketGame
						v-if="gameS2"
						:game="gameS2"
						:link-in-win="'both'"
						:link-out-win="'up'"
						:link-out-lose="'down'"
						:link-in-ratio="0.25"
						:link-out-win-ratio="0.666"
						:link-out-lose-ratio="0.333"
						:link-out-win-height="GAME_HEIGHT * 1.5"
						:link-out-lose-height="GAME_HEIGHT * 1.35"
						background-color="white"
						:style="getGameStyle(1, 2.5, 1, 4.5)"
					/>
					<!-- Top Eight -->
					<BracketGame
						v-if="gameTE1"
						:game="gameTE1"
						background-color="white"
						:link-in-lose="'up'"
						:link-out-win="'down'"
						:link-out-lose="'down'"
						:link-in-ratio="0.5"
						:link-out-win-ratio="0.666"
						:link-out-lose-ratio="0.333"
						:link-out-lose-height="GAME_HEIGHT * 1.5"
						:style="getGameStyle(1, 5, 1, 10)"
					/>
					<BracketGame
						v-if="gameTE2"
						:game="gameTE2"
						background-color="white"
						:link-in-lose="'up'"
						:link-out-win="'up'"
						:link-out-lose="'down'"
						:link-in-ratio="0.75"
						:link-out-win-ratio="0.666"
						:link-out-lose-ratio="0.333"
						:link-out-lose-height="GAME_HEIGHT * 2.2"
						:style="getGameStyle(1, 6, 1, 11)"
					/>
					<!-- Grand Final -->
					<BracketGame
						v-if="gameGF"
						:game="gameGF"
						:winner-on-top="true"
						:link-in-win="'both'"
						:link-in-ratio="0.333"
						background-color="white"
						:style="getGameStyle(2, 1.5, 2, 2.5)"
					/>
					<!-- Lower Final -->
					<BracketGame
						v-if="gameLF"
						:game="gameLF"
						:winner-on-top="true"
						background-color="white"
						:link-in-lose="'up'"
						:link-in-ratio="0.666"
						:style="getGameStyle(2, 3.5, 2, 6.5)"
					/>
					<!-- Upper Top Eight -->
					<BracketGame
						v-if="gameUTE"
						:game="gameUTE"
						:winner-on-top="true"
						:link-in-win="'both'"
						:link-in-ratio="0.333"
						background-color="white"
						:style="getGameStyle(2, 5.5, 2, 10.5)"
					/>
					<!-- Lower Top Eight -->
					<BracketGame
						v-if="gameLTE"
						:game="gameLTE"
						:winner-on-top="true"
						background-color="white"
						:link-in-lose="'up'"
						:link-in-ratio="0.666"
						:style="getGameStyle(2, 7.5, 2, 14.5)"
						class=""
					/>
				</div>
			</div>
		</div>
	</div>
	<div v-else>
		<p>Nothing to see here...</p>
	</div>
</template>

<script lang="ts" setup>
import BracketGame from "~/components/partials/games/BracketGame.vue";
import SimulateGamesToggle from "~/components/navigation/SimulateGamesToggle.vue";

import { useGamesStore } from "~/stores/games";
import { useTeamsStore } from "~/stores/teams";
import { GAME_WIDTH, GAME_HEIGHT, GAME_SPACING_X, GAME_SPACING_Y } from "~/utils/game";

// const { t } = useI18n();
const gamesStore = useGamesStore();
const teamsStore = useTeamsStore();

const isDev = import.meta.dev;

const getGameStyle = (
	column: number = 0,
	row: number = 0,
	spacing_x: number = 0,
	spacing_y: number = 0
) => {
	const style = [];
	style.push(`width: ${GAME_WIDTH}rem;`);
	style.push(`top: ${GAME_HEIGHT * row + GAME_SPACING_Y * spacing_y}rem;`);
	style.push(`left: ${GAME_WIDTH * column + GAME_SPACING_X * spacing_x}rem;`);
	return style.join(" ");
};

/* const gameRP1 = computed(() => gamesStore.getGameByNumber(50));
const gameRP2 = computed(() => gamesStore.getGameByNumber(49));
const gameRP3 = computed(() => gamesStore.getGameByNumber(43));
const gameRP4 = computed(() => gamesStore.getGameByNumber(46));
const gameRP5 = computed(() => gamesStore.getGameByNumber(41));
const gameRP6 = computed(() => gamesStore.getGameByNumber(42)); */

const gameQ1 = computed(() => gamesStore.getGameByNumber(40));
const gameQ2 = computed(() => gamesStore.getGameByNumber(38));
const gameQ3 = computed(() => gamesStore.getGameByNumber(39));
const gameQ4 = computed(() => gamesStore.getGameByNumber(37));

const gameS1 = computed(() => gamesStore.getGameByNumber(47));
const gameS2 = computed(() => gamesStore.getGameByNumber(48));

const gameGF = computed(() => gamesStore.getGameByNumber(54));
const gameLF = computed(() => gamesStore.getGameByNumber(53));

const gameTE1 = computed(() => gamesStore.getGameByNumber(44));
const gameTE2 = computed(() => gamesStore.getGameByNumber(45));
const gameUTE = computed(() => gamesStore.getGameByNumber(52));
const gameLTE = computed(() => gamesStore.getGameByNumber(51));

useGamesAutoRefresh({ intervalMs: 30000 });

onMounted(async () => {
	teamsStore.fetch();
});
</script>
