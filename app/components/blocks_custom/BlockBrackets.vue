<template>
	<div class="w-full bg-blue-text py-6">
		<div class="w-full padded">
			<div
				class="overflow-auto w-full max-h-[70dvh] sm:max-h-none mx-auto my-6 p-4 bg-blue rounded-2xl"
				:class="isOneOfTheLastFourGamesFinished ? 'sm:max-w-[87.5rem]' : 'sm:max-w-[76.5rem]'"
			>
				<div
					class="relative h-[81rem] *:absolute"
					:class="isOneOfTheLastFourGamesFinished ? 'w-[85.5rem]' : 'w-[74.5rem]'"
				>
					<!-- Quarterfinals -->
					<BracketGame
						v-if="gameQ4"
						:game="gameQ4"
						background-color="white"
						:style="getGameStyle(0.2, 0)"
						:link-in-win="'up'"
						:link-in-arrows="false"
						:link-in-ratio="0.25"
						:link-out-win="'down'"
						:link-out-lose="'down'"
						:link-out-win-ratio="0.75"
						:link-out-lose-ratio="0.5"
						:link-out-lose-height="GAME_HEIGHT * 1.5"
						class="cursor-pointer"
						@click="
							selectedGame = gameQ4;
							showGameCard = true;
						"
					/>
					<BracketGame
						v-if="gameQ1"
						:game="gameQ1"
						background-color="white"
						:style="getGameStyle(0.2, 1, 0, 1)"
						:link-in-win="'up'"
						:link-in-arrows="false"
						:link-in-ratio="0.25"
						:link-out-win="'up'"
						:link-out-lose="'down'"
						:link-out-win-ratio="0.75"
						:link-out-lose-ratio="0.5"
						:link-out-lose-height="GAME_HEIGHT * 5.9"
						class="cursor-pointer"
						@click="
							selectedGame = gameQ1;
							showGameCard = true;
						"
					/>
					<BracketGame
						v-if="gameQ2"
						:game="gameQ2"
						background-color="white"
						:style="getGameStyle(0.2, 2, 0, 4)"
						:link-in-win="'up'"
						:link-in-arrows="false"
						:link-in-ratio="0.25"
						:link-out-win="'down'"
						:link-out-lose="'down'"
						:link-out-win-ratio="0.75"
						:link-out-lose-ratio="0.25"
						:link-out-lose-height="GAME_HEIGHT * 1.5"
						class="cursor-pointer"
						@click="
							selectedGame = gameQ2;
							showGameCard = true;
						"
					/>
					<BracketGame
						v-if="gameQ3"
						:game="gameQ3"
						background-color="white"
						:style="getGameStyle(0.2, 3, 0, 5)"
						:link-in-win="'up'"
						:link-in-arrows="false"
						:link-in-ratio="0.25"
						:link-out-win="'up'"
						:link-out-lose="'down'"
						:link-out-win-ratio="0.75"
						:link-out-lose-ratio="0.25"
						:link-out-lose-height="GAME_HEIGHT * 4.2"
						class="cursor-pointer"
						@click="
							selectedGame = gameQ3;
							showGameCard = true;
						"
					/>
					<!-- Semifinals -->
					<BracketGame
						v-if="gameS1"
						:game="gameS1"
						:link-in-win="'both'"
						:link-out-win="'down'"
						:link-out-lose="'down'"
						:link-in-arrows="true"
						:link-in-ratio="0.25"
						:link-out-win-ratio="0.666"
						:link-out-lose-ratio="0.333"
						:link-out-win-height="GAME_HEIGHT * 1.5"
						:link-out-lose-height="GAME_HEIGHT * 3.1"
						background-color="white"
						:style="getGameStyle(1.2, 0.5, 1, 0.5)"
						class="cursor-pointer"
						@click="
							selectedGame = gameS1;
							showGameCard = true;
						"
					/>
					<BracketGame
						v-if="gameS2"
						:game="gameS2"
						:link-in-win="'both'"
						:link-out-win="'up'"
						:link-out-lose="'down'"
						:link-in-arrows="true"
						:link-in-ratio="0.25"
						:link-out-win-ratio="0.666"
						:link-out-lose-ratio="0.333"
						:link-out-win-height="GAME_HEIGHT * 1.5"
						:link-out-lose-height="GAME_HEIGHT * 1.35"
						background-color="white"
						:style="getGameStyle(1.2, 2.5, 1, 4.5)"
						class="cursor-pointer"
						@click="
							selectedGame = gameS2;
							showGameCard = true;
						"
					/>
					<!-- Top Eight -->
					<BracketGame
						v-if="gameTE1"
						:game="gameTE1"
						background-color="white"
						:link-in-lose="'up'"
						:link-out-win="'down'"
						:link-out-lose="'down'"
						:link-in-arrows="true"
						:link-in-ratio="0.5"
						:link-out-win-ratio="0.666"
						:link-out-lose-ratio="0.333"
						:link-out-lose-height="GAME_HEIGHT * 1.5"
						:style="getGameStyle(1.2, 5, 1, 10)"
						class="cursor-pointer"
						@click="
							selectedGame = gameTE1;
							showGameCard = true;
						"
					/>
					<BracketGame
						v-if="gameTE2"
						:game="gameTE2"
						background-color="white"
						:link-in-lose="'up'"
						:link-out-win="'up'"
						:link-out-lose="'down'"
						:link-in-arrows="true"
						:link-in-ratio="0.75"
						:link-out-win-ratio="0.666"
						:link-out-lose-ratio="0.333"
						:link-out-lose-height="GAME_HEIGHT * 2.2"
						:style="getGameStyle(1.2, 6, 1, 11)"
						class="cursor-pointer"
						@click="
							selectedGame = gameTE2;
							showGameCard = true;
						"
					/>
					<!-- Grand Final -->
					<BracketGame
						v-if="gameGF"
						:game="gameGF"
						:winner-on-top="true"
						:link-in-win="'both'"
						:link-in-arrows="true"
						:link-in-ratio="0.333"
						:link-out-win-ratio="0.25"
						background-color="white"
						:style="getGameStyle(2.2, 1.5, 2, 2.5)"
						class="cursor-pointer"
						@click="
							selectedGame = gameGF;
							showGameCard = true;
						"
					/>
					<!-- Lower Final -->
					<BracketGame
						v-if="gameLF"
						:game="gameLF"
						:winner-on-top="true"
						:link-in-arrows="true"
						background-color="white"
						:link-in-lose="'up'"
						:link-in-ratio="0.666"
						:style="getGameStyle(2.2, 3.5, 2, 6.5)"
						class="cursor-pointer"
						@click="
							selectedGame = gameLF;
							showGameCard = true;
						"
					/>
					<!-- Upper Top Eight -->
					<BracketGame
						v-if="gameUTE"
						:game="gameUTE"
						:winner-on-top="true"
						:link-in-win="'both'"
						:link-in-arrows="true"
						:link-in-ratio="0.333"
						background-color="white"
						:style="getGameStyle(2.2, 5.5, 2, 10.5)"
						class="cursor-pointer"
						@click="
							selectedGame = gameUTE;
							showGameCard = true;
						"
					/>
					<!-- Lower Top Eight -->
					<BracketGame
						v-if="gameLTE"
						:game="gameLTE"
						:winner-on-top="true"
						:link-in-arrows="true"
						background-color="white"
						:link-in-lose="'up'"
						:link-in-ratio="0.666"
						:style="getGameStyle(2.2, 7.5, 2, 14.5)"
						class="cursor-pointer"
						@click="
							selectedGame = gameLTE;
							showGameCard = true;
						"
					/>
				</div>
			</div>
		</div>
		<ModalContainer :show="selectedGame !== null && showGameCard" @close="showGameCard = false">
			<GameCard v-if="selectedGame" :game="selectedGame" mode="card" />
		</ModalContainer>
	</div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";

import BracketGame from "~/components/partials/games/BracketGame.vue";
import ModalContainer from "~/components/partials/ModalContainer.vue";
import GameCard from "~/components/partials/games/GameCard.vue";

import { useGamesStore } from "~/stores/games";
import { useTeamsStore } from "~/stores/teams";
import { GAME_WIDTH, GAME_HEIGHT, GAME_SPACING_X, GAME_SPACING_Y } from "~/utils/game";

const showGameCard = ref(false);
const selectedGame = ref<IGame | null>(null);

const gamesStore = useGamesStore();
const teamsStore = useTeamsStore();

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

const isOneOfTheLastFourGamesFinished = computed(() => {
	return (
		(gameGF.value && isGameFinished(gameGF.value)) ||
		(gameLF.value && isGameFinished(gameLF.value)) ||
		(gameUTE.value && isGameFinished(gameUTE.value)) ||
		(gameLTE.value && isGameFinished(gameLTE.value))
	);
});

useGamesAutoRefresh({ intervalMs: 30000 });

onMounted(async () => {
	teamsStore.fetch();
});
</script>
