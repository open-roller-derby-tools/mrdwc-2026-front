<template>
	<div class="relative flex flex-col justify-center" :style="bracketHeight">
		<div class="flex flex-row">
			<div class="flex items-center justify-center px-2 bg-blue-text text-white">
				{{ game.number }}
			</div>
			<div class="flex flex-col w-full">
				<BracketGameTeam
					:team-name="homeTeamName"
					:team-color="game.home_color"
					:style="`height: ${TEAM_HEIGHT}px`"
				/>
				<BracketGameTeam
					:team-name="awayTeamName"
					:team-color="game.away_color"
					:style="`height: ${TEAM_HEIGHT}px`"
				/>
			</div>
		</div>
		<p class="text-sm">{{ game.description }}</p>
		<svg
			v-if="showLink"
			class="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-full h-full text-yellow"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			stroke-width="2"
			stroke-linejoin="round"
			stroke="currentColor"
			fill="none"
		>
			<polyline points="0,25 50,25 50,75 0,75" vector-effect="non-scaling-stroke" />
			<line x1="50" y1="50" x2="100" y2="50" vector-effect="non-scaling-stroke" />
		</svg>
	</div>
</template>

<script lang="ts" setup>
import type { IGame } from "~~/types/games";
import BracketGameTeam from "./BracketGameTeam.vue";
import { useTeamsStore } from "~/stores/teams";

const TEAM_HEIGHT = 30;
const WRAPPER_HEIGHT = 100;

const teamsStore = useTeamsStore();

const props = withDefaults(
	defineProps<{
		level?: number;
		showLink?: boolean;
		game: IGame;
	}>(),
	{
		level: 1,
		showLink: false,
	}
);

const bracketHeight = computed(() => ({
	height: `${WRAPPER_HEIGHT * Math.pow(2, props.level - 1)}px`,
}));

const homeTeamName = computed(
	() => teamsStore.getTeamById(props.game.home_team ?? -1)?.name_letters ?? props.game.home_source
);
const awayTeamName = computed(
	() => teamsStore.getTeamById(props.game.away_team ?? -1)?.name_letters ?? props.game.away_source
);
</script>
