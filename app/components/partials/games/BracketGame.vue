<template>
	<div :key="game.id" class="relative outline outline-blue-text/20 rounded-lg">
		<div
			class="flex items-center justify-between px-3 py-1.5 border-b rounded-t-lg"
			:class="teamClasses"
		>
			<div class="flex items-center gap-2">
				<TeamLettersBadge v-if="homeTeam" :team="homeTeam" :fallback="game.home_source" />
				<span class="font-medium text-sm">
					{{ homeTeam?.country ?? homeTeam?.name ?? game.home_source ?? "---" }}
				</span>
			</div>
			<span v-if="!isNoSpoilerModeActive" class="font-bold text-lg">
				{{ game.home_score }}
			</span>
		</div>
		<div class="flex items-center justify-between px-3 py-1.5" :class="teamClasses">
			<div class="flex items-center gap-2">
				<TeamLettersBadge v-if="awayTeam" :team="awayTeam" :fallback="game.away_source" />
				<span class="font-medium text-sm">
					{{ awayTeam?.country ?? awayTeam?.name ?? game.away_source ?? "---" }}
				</span>
			</div>
			<span v-if="!isNoSpoilerModeActive" class="font-bold text-lg">
				{{ game.away_score }}
			</span>
		</div>
		<div
			class="flex items-center justify-between px-3 py-1.5 bg-yellow text-blue-text rounded-b-lg"
		>
			<GameStateLabel :game="game" :with-background="false" :show-day="true" />
			<NuxtLinkLocale :to="`/games/${game.number}`" class="flex items-center gap-1 text-black">
				<span class="text-sm">{{ t("game_page") }}</span>
				<UIcon name="lucide:arrow-right" class="size-4" />
			</NuxtLinkLocale>
		</div>
		<div
			v-if="showLink"
			class="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-[10rem] flex"
			:class="linkClasses"
		>
			<div class="border-2 border-l-0 border-yellow w-1/2 h-full rounded-r-xl"></div>
			<div class="border-b-2 border-yellow w-1/2 h-1/2"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";

import TeamLettersBadge from "../TeamLettersBadge.vue";
import GameStateLabel from "./GameStateLabel.vue";
import { useTeamsStore } from "~/stores/teams";

const { t } = useI18n();
const teamsStore = useTeamsStore();
const { isNoSpoilerModeActive } = useNoSpoilerMode();
const { getTeamById } = teamsStore;

useGamesAutoRefresh({ intervalMs: 30000 });

const props = withDefaults(
	defineProps<{
		game: IGame;
		showLink?: boolean;
		backgroundColor?: "blue" | "yellow" | "white";
		level?: number;
	}>(),
	{
		showLink: false,
		backgroundColor: "blue",
		level: 1,
	}
);

const homeTeam = computed(() => getTeamById(props.game.home_team ?? -1));
const awayTeam = computed(() => getTeamById(props.game.away_team ?? -1));

const teamClasses = computed(() => ({
	"bg-blue-text text-white border-white/20": props.backgroundColor === "blue",
	"bg-yellow text-black border-white/30": props.backgroundColor === "yellow",
	"bg-white text-blue-text border-blue-text/20": props.backgroundColor === "white",
}));

const linkClasses = computed(() => ({
	"h-[130%]": props.level === 1,
	"h-[290%]": props.level === 2,
}));

onMounted(async () => {
	teamsStore.fetch();
});
</script>
