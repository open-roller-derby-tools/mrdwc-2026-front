<template>
	<div :key="game.id" class="relative outline outline-blue-text/20 rounded-lg">
		<div
			class="relative flex items-center justify-between px-3 py-1.5 border-b rounded-t-lg"
			:class="teamClasses"
		>
			<!-- Home/Top team -->
			<div class="flex items-center gap-2">
				<TeamLettersBadge :team="topTeam" :fallback="topTeamSource" />
				<span class="font-medium text-sm">
					{{ topTeam?.country ?? topTeam?.name ?? topTeamSource ?? "---" }}
				</span>
			</div>
			<span v-if="gameHasStarted && !isNoSpoilerModeActive" class="font-bold text-base">
				{{ topTeamScore }}
			</span>
			<!-- Link in elements -->
			<div
				v-if="linkInWin !== 'none'"
				class="absolute bottom-0 left-0 -translate-x-full translate-y-px border-b-2 border-white"
				:style="linkInStyle"
			></div>
			<div
				v-if="linkInLose !== 'none'"
				class="absolute bottom-0 left-0 -translate-x-full translate-y-px border-b-2 border-white"
				:style="linkInStyle"
			></div>
			<!-- Link in label -->
			<div
				v-if="linkInWin !== 'none' || linkInLose !== 'none'"
				class="absolute bottom-0 -translate-x-1/2 translate-y-1/2 bg-red-text text-white font-shoulders font-bold text-sm p-1.5 pb-2 min-w-7 rounded-lg"
				:style="linkInLabelStyle"
			>
				<span class="block max-w-10 text-center leading-none">{{ gameDescription }}</span>
				<!-- Link in arrows -->
				<div
					v-if="linkInArrows && (linkInWin !== 'none' || linkInLose !== 'none')"
					:class="linkInArrowClasses"
					class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-x-6 border-t-12 border-b-0 border-x-transparent border-b-transparent"
				></div>
				<div
					v-if="linkInArrows && (linkInWin === 'both' || linkInLose === 'both')"
					:class="linkInArrowClasses"
					class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-6 border-b-12 border-t-0 border-x-transparent border-t-transparent"
				></div>
			</div>
			<!-- Link out elements -->
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
			<!-- Link out win label -->
			<div
				v-if="linkOutWinLabel"
				class="absolute bottom-1/2 right-0 translate-x-full border-b-2 border-white w-8"
			>
				<div
					class="absolute bottom-0 right-1 translate-x-full translate-y-1/2 bg-red-text text-white font-shoulders font-bold text-sm p-1.5 pb-2 min-w-7 rounded-lg"
				>
					<i18n-t
						:keypath="linkOutWinLabel"
						tag="span"
						class="block text-center leading-none whitespace-nowrap"
					>
						<template #ordinal>
							<!-- Ordinal layout also comes from locale JSON -->
							<i18n-t keypath="format.ordinal" tag="span">
								<template #n>{{ linkOutWinRanking }}</template>
								<template #suffix
									><sup>{{ getOrdinalSuffix(linkOutWinRanking) }}</sup></template
								>
							</i18n-t>
						</template>
					</i18n-t>
				</div>
			</div>
			<!-- Link out lose label -->
			<div
				v-if="linkOutLoseLabel"
				class="absolute -bottom-1/2 right-0 translate-x-full border-b-2 border-white w-8"
			>
				<div
					class="absolute bottom-0 right-1 translate-x-full translate-y-1/2 bg-red-text text-white font-shoulders font-bold text-sm p-1.5 pb-2 min-w-7 rounded-lg"
				>
					<i18n-t
						:keypath="linkOutLoseLabel"
						tag="span"
						class="block text-center leading-none whitespace-nowrap"
					>
						<template #ordinal>
							<!-- Ordinal layout also comes from locale JSON -->
							<i18n-t keypath="format.ordinal" tag="span">
								<template #n>{{ linkOutLoseRanking }}</template>
								<template #suffix
									><sup>{{ getOrdinalSuffix(linkOutLoseRanking) }}</sup></template
								>
							</i18n-t>
						</template>
					</i18n-t>
				</div>
			</div>
		</div>
		<!-- Away/Bottom team -->
		<div class="relative flex items-center justify-between px-3 py-1.5" :class="teamClasses">
			<div class="flex items-center gap-2">
				<TeamLettersBadge :team="bottomTeam" :fallback="bottomTeamSource" />
				<span class="font-medium text-sm">
					{{ bottomTeam?.country ?? bottomTeam?.name ?? bottomTeamSource ?? "---" }}
				</span>
			</div>
			<span v-if="gameHasStarted && !isNoSpoilerModeActive" class="font-bold text-base">
				{{ bottomTeamScore }}
			</span>
		</div>
		<!-- Game state & game page link -->
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
import { GameType, type IGame } from "~~/types/games";

import TeamLettersBadge from "../TeamLettersBadge.vue";
import GameStateLabel from "./GameStateLabel.vue";
import { useTeamsStore } from "~/stores/teams";
import { hasGameStarted, isGameFinished, GAME_SPACING_X, GAME_HEIGHT } from "~/utils/game";

const { t, locale } = useI18n();
const teamsStore = useTeamsStore();
const { isNoSpoilerModeActive } = useNoSpoilerMode();
const { getTeam } = useGameFormatting();

useGamesAutoRefresh({ intervalMs: 30000 });

const props = withDefaults(
	defineProps<{
		game: IGame;
		winnerOnTop?: boolean; // Will show the winning team on the top row at the end of the game
		backgroundColor?: "blue" | "yellow" | "white";
		linkInWin?: "none" | "both" | "up"; // Is there a win (yellow) link coming in (shown on the left) and is it coming from the top only, or top + bottom?
		linkInLose?: "none" | "both" | "up"; // Is there a lose (blue) link coming in (shown on the left) and is it coming from the top only, or top + bottom?
		linkInArrows?: boolean; // Do we show arrows on the in-link?
		linkOutWin?: "none" | "down" | "up"; // Is there a win (yellow) link coming out (shown on the right) and is it going down or up?
		linkOutLose?: "none" | "down" | "up"; // Is there a lose (blue) link coming out (shown on the right) and is it going down or up?
		linkInRatio?: number; // Length of the in-link in proportion to the space between columns (GAME_SPACING_X)
		linkOutWinRatio?: number; // Length of the win out-link in proportion to the space between columns (GAME_SPACING_X)
		linkOutLoseRatio?: number; // Length of the lose out-link in proportion to the space between columns (GAME_SPACING_X)
		linkOutWinHeight?: number; // Height of the win out-link in rems
		linkOutLoseHeight?: number; // Height of the lose out-link in rems
	}>(),
	{
		winnerOnTop: false,
		backgroundColor: "blue",
		linkInWin: "none",
		linkInLose: "none",
		linkInArrows: true,
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
const isSomeoneWinning = computed(() => props.game.home_score !== props.game.away_score);
const isHomeTeamWinning = computed(() => props.game.home_score > props.game.away_score);
const isAwayTeamWinning = computed(() => props.game.away_score > props.game.home_score);

const topTeam = computed(() => {
	if (
		!isNoSpoilerModeActive.value &&
		props.winnerOnTop &&
		isGameFinished(props.game) &&
		isSomeoneWinning.value
	) {
		return isHomeTeamWinning.value ? homeTeam.value : awayTeam.value;
	} else {
		return homeTeam.value;
	}
});
const topTeamSource = computed(() => {
	if (topTeam.value == null) return props.game.home_source;
	return topTeam.value === homeTeam.value ? props.game.home_source : props.game.away_source;
});
const topTeamScore = computed(() => {
	if (topTeam.value == null) return 0;
	return topTeam.value === homeTeam.value ? props.game.home_score : props.game.away_score;
});

const bottomTeam = computed(() => {
	if (
		!isNoSpoilerModeActive.value &&
		props.winnerOnTop &&
		isGameFinished(props.game) &&
		isSomeoneWinning.value
	) {
		return isHomeTeamWinning.value ? awayTeam.value : homeTeam.value;
	} else {
		return awayTeam.value;
	}
});
const bottomTeamSource = computed(() => {
	if (bottomTeam.value == null) return props.game.away_source;
	return bottomTeam.value === homeTeam.value ? props.game.home_source : props.game.away_source;
});
const bottomTeamScore = computed(() => {
	if (bottomTeam.value == null) return 0;
	return bottomTeam.value === homeTeam.value ? props.game.home_score : props.game.away_score;
});

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

const gameDescription = computed(() => {
	if (
		props.game.type == GameType.LowerTopEight ||
		props.game.type == GameType.UpperTopEight ||
		props.game.type == GameType.LowerFinal ||
		props.game.type == GameType.GrandFinal
	)
		return t(`game_type.${props.game.type}`);
	return props.game.description;
});

const linkOutWinLabel = computed(() => {
	if (!isGameFinished(props.game)) return null;
	if (props.game.type == GameType.GrandFinal) return "rankings.1st";
	if (
		props.game.type == GameType.LowerFinal ||
		props.game.type == GameType.UpperTopEight ||
		props.game.type == GameType.LowerTopEight
	)
		return "rankings.others";
	return null;
});

const linkOutWinRanking = computed(() => {
	if (!isGameFinished(props.game)) return null;
	if (props.game.type == GameType.GrandFinal) return 1;
	if (props.game.type == GameType.LowerFinal) return 3;
	if (props.game.type == GameType.UpperTopEight) return 5;
	if (props.game.type == GameType.LowerTopEight) return 7;
	return null;
});

const linkOutLoseLabel = computed(() => {
	if (!isGameFinished(props.game)) return null;
	if (props.game.type == GameType.GrandFinal) return "rankings.place";
	if (
		props.game.type == GameType.LowerFinal ||
		props.game.type == GameType.UpperTopEight ||
		props.game.type == GameType.LowerTopEight
	)
		return "rankings.others";
	return null;
});

const linkOutLoseRanking = computed(() => {
	if (!isGameFinished(props.game)) return null;
	if (props.game.type == GameType.GrandFinal) return 2;
	if (props.game.type == GameType.LowerFinal) return 4;
	if (props.game.type == GameType.UpperTopEight) return 6;
	if (props.game.type == GameType.LowerTopEight) return 8;
	return null;
});

const ordinalRules = computed(() => new Intl.PluralRules(locale.value, { type: "ordinal" }));

const getOrdinalSuffix = (value: number | null) => {
	if (value == null) return "";
	const category = ordinalRules.value.select(value);
	const key = `ordinals.${category}`;
	const resolved = t(key);
	return resolved === key ? t("ordinals.other") : resolved;
};

onMounted(async () => {
	teamsStore.fetch();
});
</script>
