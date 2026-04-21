<template>
	<div class="grid grid-cols-2 gap-x-6 gap-y-2 items-center">
		<p
			v-for="team in ['home', 'away'] as Side[]"
			:key="`${team}-name`"
			class="leading-none text-balance font-shoulders text-xl sm:text-2xl font-bold relative"
			:class="getTeamNameClass(team)"
		>
			{{ getTeamName(props.game, team, false, game[`${team}_source`]) }}
		</p>
		<div
			v-for="team in ['home', 'away'] as Side[]"
			:key="`${team}-score`"
			class="flex items-center justify-end gap-4"
			:class="team === 'home' ? 'flex-row' : ' flex-row-reverse'"
		>
			<TeamLettersBadge
				v-if="getTeam(game, team) !== null"
				:team="getTeam(game, team)"
				:fallback="getTeamName(props.game, team, true, props.game[`${team}_source`])"
				:style="getTeamColors(game, team, false)"
			/>
			<span
				v-if="hasGameStarted(props.game) && !isNoSpoilerModeActive"
				class="font-shoulders font-bold text-4xl sm:text-5xl"
				:class="getScoreClass(team)"
				>{{ props.game[`${team}_score`] }}</span
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";
import TeamLettersBadge from "../TeamLettersBadge.vue";
import { hasGameStarted } from "~/utils/game";

type Side = "home" | "away";

const { isNoSpoilerModeActive } = useNoSpoilerMode();
const { getTeam, getTeamName, getTeamColors } = useGameFormatting();

const props = defineProps<{
	game: IGame;
}>();

const getScoreClass = (team: Side) => {
	if (isNoSpoilerModeActive.value) {
		return "scale-100 mx-0";
	}
	if (
		(team === "home" && props.game.home_score > props.game.away_score) ||
		(team === "away" && props.game.away_score > props.game.home_score)
	) {
		return "scale-120 mx-1 sm:mx-1.5";
	}
	return "scale-100 mx-0";
};
const getTeamNameClass = (team: Side) => {
	return team === "home" ? "text-right" : "text-left";
};
</script>
