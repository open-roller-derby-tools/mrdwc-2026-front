<template>
	<div class="w-full bg-blue-text py-6">
		<div class="maxed padded">
			<div class="flex flex-col gap-4 items-center">
				<BracketGame
					v-if="gameRP1"
					:game="gameRP1"
					:winner-on-top="true"
					background-color="white"
					class="cursor-pointer"
					:style="`width: ${GAME_WIDTH}rem;`"
					@click="
						selectedGame = gameRP1;
						showGameCard = true;
					"
				/>
				<BracketGame
					v-if="gameRP2"
					:game="gameRP2"
					:winner-on-top="true"
					background-color="white"
					class="cursor-pointer"
					:style="`width: ${GAME_WIDTH}rem;`"
					@click="
						selectedGame = gameRP2;
						showGameCard = true;
					"
				/>
				<BracketGame
					v-if="gameRP3"
					:game="gameRP3"
					:winner-on-top="true"
					background-color="white"
					class="cursor-pointer"
					:style="`width: ${GAME_WIDTH}rem;`"
					@click="
						selectedGame = gameRP3;
						showGameCard = true;
					"
				/>
				<BracketGame
					v-if="gameRP4"
					:game="gameRP4"
					:winner-on-top="true"
					background-color="white"
					class="cursor-pointer"
					:style="`width: ${GAME_WIDTH}rem;`"
					@click="
						selectedGame = gameRP4;
						showGameCard = true;
					"
				/>
				<BracketGame
					v-if="gameRP5"
					:game="gameRP5"
					:winner-on-top="true"
					background-color="white"
					class="cursor-pointer"
					:style="`width: ${GAME_WIDTH}rem;`"
					@click="
						selectedGame = gameRP5;
						showGameCard = true;
					"
				/>
				<BracketGame
					v-if="gameRP6"
					:game="gameRP6"
					:winner-on-top="true"
					background-color="white"
					class="cursor-pointer"
					:style="`width: ${GAME_WIDTH}rem;`"
					@click="
						selectedGame = gameRP6;
						showGameCard = true;
					"
				/>
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
import { GAME_WIDTH } from "~/utils/game";

const gamesStore = useGamesStore();
const teamsStore = useTeamsStore();

const showGameCard = ref(false);
const selectedGame = ref<IGame | null>(null);

const gameRP1 = computed(() => gamesStore.getGameByNumber(50));
const gameRP2 = computed(() => gamesStore.getGameByNumber(49));
const gameRP3 = computed(() => gamesStore.getGameByNumber(43));
const gameRP4 = computed(() => gamesStore.getGameByNumber(46));
const gameRP5 = computed(() => gamesStore.getGameByNumber(41));
const gameRP6 = computed(() => gamesStore.getGameByNumber(42));

useGamesAutoRefresh({ intervalMs: 30000 });

onMounted(async () => {
	teamsStore.fetch();
});
</script>
