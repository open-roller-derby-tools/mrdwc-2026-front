<template>
	<div class="my-6">
		<h2 class="text-2xl font-shoulders text-white">Games in this tournament:</h2>
		<NoSpoilerModeToggle layout="row" />
		<ul class="flex flex-col gap-3 list-none">
			<li
				v-for="game in getGamesByTeam(team.id)"
				:key="game.id"
				class="bg-blue-text rounded-lg px-4 py-3 flex justify-between items-center"
			>
				<div class="space-y-1">
					<div class="space-x-1">
						<TeamLettersBadge
							:team="getTeam(game, 'home')"
							:fallback="game.home_source"
							:style="getTeamColors(game, 'home', false)"
						/>
						<TeamLettersBadge
							:team="getTeam(game, 'away')"
							:fallback="game.away_source"
							:style="getTeamColors(game, 'away', false)"
						/>
					</div>
					<p class="text-sm text-white/70 capitalize text-balance leading-none">
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
	</div>
</template>

<script lang="ts" setup>
import TeamLettersBadge from "./TeamLettersBadge.vue";
import GameStateLabel from "./games/GameStateLabel.vue";
import NoSpoilerModeToggle from "../navigation/NoSpoilerModeToggle.vue";

import type { ILocalizedTeam } from "~~/types/custom";
import { useGamesStore } from "~/stores/games";
import { useGameFormatting } from "~/composables/useGameFormatting";

const gamesStore = useGamesStore();
const { getGamesByTeam } = gamesStore;
const { getTeam, getTeamColors } = useGameFormatting();
const { formatDay, formatTime } = useFormatTimeLocalized();

defineProps<{
	team: ILocalizedTeam;
}>();

useGamesAutoRefresh({ intervalMs: 60000 });
</script>
