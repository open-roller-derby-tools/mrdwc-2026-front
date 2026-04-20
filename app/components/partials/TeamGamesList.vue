<template>
	<div class="my-6">
		<p class="font-shoulders text-2xl font-bold mb-2">Games in this tournament:</p>
		<ul class="max-w-xs">
			<li
				v-for="game in getGamesByTeam(team.id)"
				:key="game.id"
				class="flex my-2 items-center justify-between"
			>
				<div class="space-x-1">
					<span class="capitalize">{{ formatDay(game.start_time) }}</span>
					<span class="mr-2">{{ formatTime(game.start_time) }}</span>
				</div>
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
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import TeamLettersBadge from "./TeamLettersBadge.vue";

import type { ILocalizedTeam } from "~~/types/custom";
import { useGamesStore } from "~/stores/games";
import { useGameFormatting } from "~/composables/useGameFormatting";

const gamesStore = useGamesStore();
const { getGamesByTeam } = gamesStore;
const { getTeam, getTeamColors } = useGameFormatting();
const { formatTime, formatDay } = useFormatTimeLocalized();

defineProps<{
	team: ILocalizedTeam;
}>();

useGamesAutoRefresh({ intervalMs: 60000 });
</script>
