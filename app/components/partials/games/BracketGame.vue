<template>
	<div :key="game.id" class="relative outline outline-blue-text/20 rounded-lg">
		<div
			class="relative flex items-center justify-between px-3 py-1.5 border-b rounded-t-lg"
			:class="teamClasses"
		>
			<div class="flex items-center gap-2">
				<TeamLettersBadge :team="homeTeam" :fallback="game.home_source" />
				<span class="font-medium text-sm">
					{{ homeTeam?.country ?? homeTeam?.name ?? game.home_source ?? "---" }}
				</span>
			</div>
			<span v-if="gameHasStarted && !isNoSpoilerModeActive" class="font-bold text-base">
				{{ game.home_score }}
			</span>
			<div
				v-if="linkInWin !== 'none'"
				class="absolute bottom-0 left-0 -translate-x-full translate-y-px border-b-2 border-yellow"
				:style="linkInStyle"
			></div>
			<div
				v-if="linkInLose !== 'none'"
				class="absolute bottom-0 left-0 -translate-x-full translate-y-px border-b-2 border-blue-light"
				:style="linkInStyle"
			></div>
			<div
				v-if="linkInWin !== 'none' || linkInLose !== 'none'"
				class="absolute bottom-0 -translate-x-1/2 translate-y-1/2 bg-red-text text-white font-shoulders font-bold text-sm px-2 py-1 min-w-7 rounded-full"
				:style="linkInLabelStyle"
			>
				<span>{{ game.description }}</span>
				<div
					v-if="linkInWin !== 'none' || linkInLose !== 'none'"
					:class="linkInArrowClasses"
					class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-x-6 border-t-12 border-b-0 border-x-transparent border-b-transparent"
				></div>
				<div
					v-if="linkInWin === 'both' || linkInLose === 'both'"
					:class="linkInArrowClasses"
					class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-6 border-b-12 border-t-0 border-x-transparent border-t-transparent"
				></div>
			</div>
			<div
				v-if="linkOutWin === 'down'"
				:style="getLinkOutStyle('win')"
				class="absolute right-0 translate-x-full translate-y-full rounded-tr-2xl border-t-2 border-r-2 border-yellow"
			></div>
			<div
				v-if="linkOutWin === 'up'"
				:style="getLinkOutStyle('win')"
				class="absolute right-0 translate-x-full rounded-br-2xl border-b-2 border-r-2 border-yellow"
			></div>
			<div
				v-if="linkOutLose === 'down'"
				:style="getLinkOutStyle('lose')"
				class="absolute right-0 translate-x-full translate-y-full rounded-tr-2xl border-t-2 border-r-2 border-blue-light"
			></div>
			<div
				v-if="linkOutLose === 'up'"
				:style="getLinkOutStyle('lose')"
				class="absolute right-0 translate-x-full rounded-br-2xl border-b-2 border-r-2 border-blue-light"
			></div>
		</div>
		<div class="relative flex items-center justify-between px-3 py-1.5" :class="teamClasses">
			<div class="flex items-center gap-2">
				<TeamLettersBadge :team="awayTeam" :fallback="game.away_source" />
				<span class="font-medium text-sm">
					{{ awayTeam?.country ?? awayTeam?.name ?? game.away_source ?? "---" }}
				</span>
			</div>
			<span v-if="gameHasStarted && !isNoSpoilerModeActive" class="font-bold text-base">
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
import { hasGameStarted, isGameFinished, GAME_SPACING_X, GAME_HEIGHT } from "~/utils/game";

const { t } = useI18n();
const teamsStore = useTeamsStore();
const { isNoSpoilerModeActive } = useNoSpoilerMode();
const { getTeam } = useGameFormatting();

useGamesAutoRefresh({ intervalMs: 30000 });

const props = withDefaults(
	defineProps<{
		game: IGame;
		backgroundColor?: "blue" | "yellow" | "white";
		linkInWin?: "none" | "both" | "up";
		linkInLose?: "none" | "both" | "up";
		linkOutWin?: "none" | "down" | "up";
		linkOutLose?: "none" | "down" | "up";
		linkInRatio?: number;
		linkOutWinRatio?: number;
		linkOutLoseRatio?: number;
		linkOutWinHeight?: number;
		linkOutLoseHeight?: number;
	}>(),
	{
		backgroundColor: "blue",
		linkInWin: "none",
		linkInLose: "none",
		linkOutWin: "none",
		linkOutLose: "none",
		linkInRatio: 0.5,
		linkOutWinRatio: 0.5,
		linkOutLoseRatio: 0.5,
		linkOutWinHeight: GAME_HEIGHT * 0.65,
		linkOutLoseHeight: GAME_HEIGHT * 0.65,
	}
);

const homeTeam = computed(() => getTeam(props.game, "home"));
const awayTeam = computed(() => getTeam(props.game, "away"));
const gameHasStarted = computed(() => hasGameStarted(props.game));
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

const linkInLabelStyle = computed(() => {
	const style = [];
	style.push(`left: calc(-${GAME_SPACING_X * props.linkInRatio}rem - 1px);`);
	return style.join(" ");
});

const linkInArrowClasses = computed(() => {
	return {
		"border-blue-light": props.linkInLose !== "none",
		"border-yellow": props.linkInWin !== "none",
	};
});

const getLinkOutStyle = (type: "win" | "lose") => {
	const style = [];

	if (!isGameFinished(props.game) || (!isHomeTeamWinning.value && !isAwayTeamWinning.value)) {
		style.push(`bottom: 0;`);
		if (type === "win") {
			style.push(`height: ${props.linkOutWinHeight}rem;`);
		} else {
			style.push(`height: ${props.linkOutLoseHeight}rem;`);
		}
	}

	if (type === "win") {
		style.push(`width: ${GAME_SPACING_X * props.linkOutWinRatio}rem;`);

		if (props.linkOutWin === "down") {
			style.push(`transform: translateY(-2px);`);
		}

		if (isGameFinished(props.game) && isHomeTeamWinning.value) {
			style.push("bottom: 50%;");

			if (props.linkOutWin === "down") {
				style.push(`height: ${props.linkOutWinHeight + GAME_HEIGHT * 0.3}rem;`);
			} else {
				style.push(`height: ${props.linkOutWinHeight - GAME_HEIGHT * 0.1}rem;`);
			}
		} else if (isGameFinished(props.game) && isAwayTeamWinning.value) {
			style.push("bottom: -50%;");

			if (props.linkOutWin === "up") {
				style.push(`height: ${props.linkOutWinHeight + GAME_HEIGHT * 0.3}rem;`);
			} else {
				style.push(`height: ${props.linkOutWinHeight - GAME_HEIGHT * 0.1}rem;`);
			}
		}
	} else {
		style.push(`width: ${GAME_SPACING_X * props.linkOutLoseRatio}rem;`);

		if (isGameFinished(props.game) && isHomeTeamWinning.value) {
			style.push("bottom: -50%;");

			if (props.linkOutLose === "down") {
				style.push(`height: ${props.linkOutLoseHeight - GAME_HEIGHT * 0.1}rem;`);
			} else {
				style.push(`height: ${props.linkOutLoseHeight + GAME_HEIGHT * 0.3}rem;`);
			}
		} else if (isGameFinished(props.game) && isAwayTeamWinning.value) {
			style.push("bottom: 50%;");

			if (props.linkOutLose === "down") {
				style.push(`height: ${props.linkOutLoseHeight + GAME_HEIGHT * 0.3}rem;`);
			} else {
				style.push(`height: ${props.linkOutLoseHeight - GAME_HEIGHT * 0.1}rem;`);
			}
		}
	}
	return style.join(" ");
};

onMounted(async () => {
	teamsStore.fetch();
});
</script>
