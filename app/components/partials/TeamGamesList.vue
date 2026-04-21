<template>
	<div class="">
		<h2 class="text-2xl font-shoulders text-white">Games in this tournament:</h2>
		<NoSpoilerModeToggle class="mb-6" />
		<ul class="flex flex-col gap-3 list-none">
			<li
				v-for="game in getGamesByTeam(team.id)"
				:key="game.id"
				class="bg-blue-text rounded-lg px-4 py-3 flex justify-between items-center"
				@click="
					selectedGame = game;
					showGameCard = true;
				"
			>
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<TeamLettersBadge
							:team="getTeam(game, 'home')"
							:fallback="game.home_source"
							:style="getTeamColors(game, 'home', false)"
						/>
						<div
							v-if="hasGameStarted(game) && !isNoSpoilerModeActive"
							class="flex items-center gap-1"
						>
							<span class="font-shoulders font-bold">
								{{ game.home_score }}
							</span>
							<span>-</span>
							<span class="font-shoulders font-bold">
								{{ game.away_score }}
							</span>
						</div>
						<TeamLettersBadge
							:team="getTeam(game, 'away')"
							:fallback="game.away_source"
							:style="getTeamColors(game, 'away', false)"
						/>
					</div>
					<p class="text-sm sm:text-base text-white/70 capitalize text-balance leading-none">
						{{ formatDay(game.start_time) }}, {{ formatTime(game.start_time) }}
					</p>
				</div>
				<div class="">
					<GameStateLabel
						:game="game"
						:with-background="true"
						:show-time="false"
						class="!rounded-lg !p-2 !w-full"
					/>
				</div>
			</li>
		</ul>
		<ModalContainer :show="selectedGame !== null && showGameCard" @close="showGameCard = false">
			<GameCard v-if="selectedGame" :game="selectedGame" mode="card" />
		</ModalContainer>
	</div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";

import TeamLettersBadge from "./TeamLettersBadge.vue";
import GameStateLabel from "./games/GameStateLabel.vue";
import NoSpoilerModeToggle from "../navigation/NoSpoilerModeToggle.vue";
import ModalContainer from "../partials/ModalContainer.vue";
import GameCard from "./games/GameCard.vue";

import type { ILocalizedTeam } from "~~/types/custom";
import { useGamesStore } from "~/stores/games";
import { useGameFormatting } from "~/composables/useGameFormatting";
import { hasGameStarted } from "~/utils/game";

const gamesStore = useGamesStore();
const { getGamesByTeam } = gamesStore;
const { getTeam, getTeamColors } = useGameFormatting();
const { formatDay, formatTime } = useFormatTimeLocalized();
const { isNoSpoilerModeActive } = useNoSpoilerMode();

defineProps<{
	team: ILocalizedTeam;
}>();

useGamesAutoRefresh({ intervalMs: 60000 });

const showGameCard = ref(false);
const selectedGame = ref<IGame | null>(null);
</script>
