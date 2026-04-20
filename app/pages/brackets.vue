<template>
	<div v-if="isDev" class="mt-32">
		<SimulateGamesToggle />
		<NoSpoilerModeToggle />
		<BlockGroups />
		<BlockGroupsRankings />
		<div v-show="false" v-if="gamesStore.isReady && teamsStore.isReady">
			<div>
				<div class="grid grid-cols-7 select-none cursor-default">
					<div class="flex flex-col">
						<BracketGame v-if="gameQ1" :game="gameQ1" :level="1" />
						<BracketGame v-if="gameQ4" :game="gameQ4" :level="1" />
						<BracketGame v-if="gameQ3" :game="gameQ3" :level="1" />
						<BracketGame v-if="gameQ2" :game="gameQ2" :level="1" />
					</div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame v-if="gameS1" :game="gameS1" :level="2" :show-link="true" />
						<BracketGame v-if="gameS2" :game="gameS2" :level="2" :show-link="true" />
					</div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame v-if="gameGF" :game="gameGF" :level="3" :show-link="true" />
					</div>
				</div>
				<div class="grid grid-cols-7 select-none cursor-default">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame v-if="gameLF" :game="gameLF" :level="1" />
					</div>
				</div>
				<div class="grid grid-cols-7 select-none cursor-default">
					<div></div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame v-if="gameTE1" :game="gameTE1" :level="1" />
						<BracketGame v-if="gameTE2" :game="gameTE2" :level="1" />
					</div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame v-if="gameUTE" :game="gameUTE" :level="2" :show-link="true" />
					</div>
				</div>
				<div class="grid grid-cols-7 select-none cursor-default">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame v-if="gameLTE" :game="gameLTE" :level="1" />
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<p>Loading...</p>
		</div>
	</div>
	<div v-else>
		<p>Nothing to see here...</p>
	</div>
</template>

<script lang="ts" setup>
import BracketGame from "~/components/partials/games/BracketGame.vue";
import BlockGroups from "~/components/blocks_custom/BlockGroups.vue";
import NoSpoilerModeToggle from "~/components/navigation/NoSpoilerModeToggle.vue";
import SimulateGamesToggle from "~/components/navigation/SimulateGamesToggle.vue";
import BlockGroupsRankings from "~/components/blocks_custom/BlockGroupsRankings.vue";

import { useGamesStore } from "~/stores/games";
import { useTeamsStore } from "~/stores/teams";
const gamesStore = useGamesStore();
const teamsStore = useTeamsStore();

const isDev = import.meta.dev;

/* const gameRP1 = computed(() => gamesStore.getGameByNumber(50));
const gameRP2 = computed(() => gamesStore.getGameByNumber(49));
const gameRP3 = computed(() => gamesStore.getGameByNumber(43));
const gameRP4 = computed(() => gamesStore.getGameByNumber(46));
const gameRP5 = computed(() => gamesStore.getGameByNumber(41));
const gameRP6 = computed(() => gamesStore.getGameByNumber(42)); */

const gameQ1 = computed(() => gamesStore.getGameByNumber(40));
const gameQ2 = computed(() => gamesStore.getGameByNumber(38));
const gameQ3 = computed(() => gamesStore.getGameByNumber(39));
const gameQ4 = computed(() => gamesStore.getGameByNumber(37));

const gameS1 = computed(() => gamesStore.getGameByNumber(47));
const gameS2 = computed(() => gamesStore.getGameByNumber(48));

const gameGF = computed(() => gamesStore.getGameByNumber(54));
const gameLF = computed(() => gamesStore.getGameByNumber(53));

const gameTE1 = computed(() => gamesStore.getGameByNumber(44));
const gameTE2 = computed(() => gamesStore.getGameByNumber(45));
const gameUTE = computed(() => gamesStore.getGameByNumber(52));
const gameLTE = computed(() => gamesStore.getGameByNumber(51));

onMounted(async () => {
	const fetches: Promise<unknown>[] = [];
	if (!gamesStore.isReady) fetches.push(gamesStore.fetch());
	if (!teamsStore.isReady) fetches.push(teamsStore.fetch());
	await Promise.all(fetches);
});
</script>
