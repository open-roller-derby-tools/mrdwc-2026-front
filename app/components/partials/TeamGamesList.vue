<template>
	<div class="">
		<h2 class="text-2xl font-shoulders text-white">{{ t("team_games") }}</h2>
		<div class="grid grid-cols-2 gap-4">
			<BracketGame
				v-for="game in getGamesByTeam(team.id)"
				:key="game.id"
				:game="game"
				background-color="blue"
				class="cursor-pointer"
				@click="
					selectedGame = game;
					showGameCard = true;
				"
			/>
		</div>
		<ModalContainer :show="selectedGame !== null && showGameCard" @close="showGameCard = false">
			<GameCard v-if="selectedGame" :game="selectedGame" mode="card" />
		</ModalContainer>
	</div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";

import ModalContainer from "../partials/ModalContainer.vue";
import GameCard from "./games/GameCard.vue";
import BracketGame from "./games/BracketGame.vue";

import type { ILocalizedTeam } from "~~/types/teams";
import { useGamesStore } from "~/stores/games";

const { t } = useI18n();
const gamesStore = useGamesStore();
const { getGamesByTeam } = gamesStore;

defineProps<{
	team: ILocalizedTeam;
}>();

useGamesAutoRefresh({ intervalMs: 60000 });

const showGameCard = ref(false);
const selectedGame = ref<IGame | null>(null);
</script>
