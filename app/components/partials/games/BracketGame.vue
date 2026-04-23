<template>
	<div :key="game.id" class="relative outline outline-blue-text/20 rounded-lg">
		<div
			class="relative flex items-center justify-between px-3 py-1.5 border-b rounded-t-lg"
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
			<div
				v-if="linkInWin !== 'none'"
				class="absolute bottom-0 left-0 -translate-x-full translate-y-px border-b-2 border-yellow"
				:style="linkInStyle"
			></div>
			<div
				v-if="linkInLose !== 'none'"
				class="absolute bottom-0 left-0 -translate-x-full translate-y-px border-b-2 border-red-text"
				:style="linkInStyle"
			></div>
			<div
				v-if="linkOutWin === 'down'"
				:class="linkOutClasses"
				:style="getLinkOutStyle('win')"
				class="absolute right-0 translate-x-full translate-y-full rounded-tr-xl border-t-2 border-r-2 border-yellow"
			></div>
			<div
				v-if="linkOutWin === 'up'"
				:class="linkOutClasses"
				:style="getLinkOutStyle('win')"
				class="absolute right-0 translate-x-full rounded-br-xl border-b-2 border-r-2 border-yellow"
			></div>
			<div
				v-if="linkOutLose === 'down'"
				:class="linkOutClasses"
				:style="getLinkOutStyle('lose')"
				class="absolute right-0 translate-x-full translate-y-full rounded-tr-xl border-t-2 border-r-2 border-red-text"
			></div>
			<div
				v-if="linkOutLose === 'up'"
				:class="linkOutClasses"
				:style="getLinkOutStyle('lose')"
				class="absolute right-0 translate-x-full rounded-br-xl border-b-2 border-r-2 border-red-text"
			></div>
		</div>
		<div class="relative flex items-center justify-between px-3 py-1.5" :class="teamClasses">
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
	</div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";

import TeamLettersBadge from "../TeamLettersBadge.vue";
import GameStateLabel from "./GameStateLabel.vue";
import { useTeamsStore } from "~/stores/teams";
import { isGameFinished, GAME_SPACING_X } from "~/utils/game";

const { t } = useI18n();
const teamsStore = useTeamsStore();
const { isNoSpoilerModeActive } = useNoSpoilerMode();
// const { isGameSpoiler } = useGameFormatting();
const { getTeamById } = teamsStore;

useGamesAutoRefresh({ intervalMs: 30000 });

const props = withDefaults(
	defineProps<{
		game: IGame;
		showLink?: boolean;
		backgroundColor?: "blue" | "yellow" | "white";
		level?: number;
		linkInWin?: "none" | "both" | "up";
		linkInLose?: "none" | "both" | "up";
		linkOutWin?: "none" | "down" | "up";
		linkOutLose?: "none" | "down" | "up";
		linkInRatio?: number;
		linkOutWinRatio?: number;
		linkOutLoseRatio?: number;
	}>(),
	{
		showLink: false,
		backgroundColor: "blue",
		level: 0,
		linkInWin: "none",
		linkInLose: "none",
		linkOutWin: "none",
		linkOutLose: "none",
		linkInRatio: 0.5,
		linkOutWinRatio: 0.5,
		linkOutLoseRatio: 0.5,
	}
);

const homeTeam = computed(() => getTeamById(props.game.home_team ?? -1));
const awayTeam = computed(() => getTeamById(props.game.away_team ?? -1));

const isHomeTeamWinning = computed(() => props.game.home_score > props.game.away_score);
const isAwayTeamWinning = computed(() => props.game.away_score > props.game.home_score);

const teamClasses = computed(() => ({
	"bg-blue-text text-white border-white/20": props.backgroundColor === "blue",
	"bg-yellow text-black border-white/30": props.backgroundColor === "yellow",
	"bg-white text-blue-text border-blue-text/20": props.backgroundColor === "white",
}));

const linkInStyle = computed(() => {
	const style = [];
	style.push(`width: ${GAME_SPACING_X * props.linkInRatio}rem;`);
	return style.join(" ");
});

const getLinkOutStyle = (type: "win" | "lose") => {
	const style = [];
	if (type === "win") style.push(`width: ${GAME_SPACING_X * props.linkOutWinRatio}rem;`);
	else style.push(`width: ${GAME_SPACING_X * props.linkOutLoseRatio}rem;`);
	return style.join(" ");
};

const linkOutClasses = computed(() => {
	const classes = [];

	if (props.level === 0) classes.push("h-[100%]");
	else if (props.level === 1) classes.push("h-[100%]");

	if (!isGameFinished(props.game) || (!isHomeTeamWinning.value && !isAwayTeamWinning.value))
		classes.push("bottom-0");
	else if (isHomeTeamWinning.value) classes.push("bottom-1/2");
	else if (isAwayTeamWinning.value) classes.push("-bottom-1/2");

	return classes.join(" ");
});

onMounted(async () => {
	teamsStore.fetch();
});
</script>
