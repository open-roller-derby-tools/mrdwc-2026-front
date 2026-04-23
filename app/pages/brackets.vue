<template>
	<div v-if="isDev" class="mt-32 bg-blue-text">
		<SimulateGamesToggle />
		<div class="padded">
			<div class="overflow-x-auto max-w-[73rem] mx-auto my-6 p-4 bg-blue rounded-2xl">
				<!-- Quarterfinals + Semifinals + Grand Final -->
				<div class="inline-grid grid-flow-col auto-cols-[17rem_10rem] select-none cursor-default">
					<!-- Quarterfinals -->
					<div class="flex flex-col">
						<BracketGame
							v-if="gameQ4"
							:game="gameQ4"
							background-color="white"
							class="mb-6"
							:link-out-down="true"
						/>
						<BracketGame
							v-if="gameQ1"
							:game="gameQ1"
							background-color="white"
							class="mb-12"
							:link-out-up="true"
						/>
						<BracketGame
							v-if="gameQ2"
							:game="gameQ2"
							background-color="white"
							class="mb-6"
							:link-out-down="true"
						/>
						<BracketGame
							v-if="gameQ3"
							:game="gameQ3"
							background-color="white"
							class=""
							:link-out-up="true"
						/>
					</div>
					<div></div>
					<!-- Semifinals -->
					<div class="flex flex-col justify-center gap-18">
						<BracketGame
							v-if="gameS1"
							:game="gameS1"
							:level="1"
							:link-in="true"
							:link-out-down="true"
							background-color="white"
							class="-translate-y-1/2"
						/>
						<BracketGame
							v-if="gameS2"
							:game="gameS2"
							:level="1"
							:link-in="true"
							:link-out-up="true"
							background-color="white"
							class="translate-y-1/2"
						/>
					</div>
					<div></div>
					<!-- Grand Final -->
					<div class="flex flex-col justify-center">
						<BracketGame
							v-if="gameGF"
							:game="gameGF"
							:level="2"
							:link-in="true"
							background-color="white"
							class=""
						/>
					</div>
				</div>
				<!-- Lower Final -->
				<div
					class="inline-grid grid-flow-col auto-cols-[17rem_10rem] select-none cursor-default -mt-32 mb-12"
				>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame v-if="gameLF" :game="gameLF" background-color="white" />
					</div>
				</div>
				<!-- Lower Quarterfinals + Top Eight -->
				<div
					class="inline-grid grid-flow-col auto-cols-[17rem_10rem] select-none cursor-default mb-12"
				>
					<div></div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame
							v-if="gameTE1"
							:game="gameTE1"
							background-color="white"
							:link-out-down="true"
							:level="0"
							class="mb-6"
						/>
						<BracketGame
							v-if="gameTE2"
							:game="gameTE2"
							background-color="white"
							:link-out-up="true"
							:level="0"
							class=""
						/>
					</div>
					<div></div>
					<div class="flex flex-col justify-center">
						<BracketGame
							v-if="gameUTE"
							:game="gameUTE"
							:link-in="true"
							:level="1"
							background-color="white"
						/>
					</div>
				</div>
				<!-- Lower Top Eight -->
				<div class="inline-grid grid-flow-col auto-cols-[17rem_10rem] select-none cursor-default">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div class="flex flex-col">
						<BracketGame v-if="gameLTE" :game="gameLTE" background-color="white" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-else>
		<p>Nothing to see here...</p>
	</div>
</template>

<script lang="ts" setup>
import BracketGame from "~/components/partials/games/BracketGame.vue";
import SimulateGamesToggle from "~/components/navigation/SimulateGamesToggle.vue";

import { useGamesStore } from "~/stores/games";
import { useTeamsStore } from "~/stores/teams";

// const { t } = useI18n();
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

useGamesAutoRefresh({ intervalMs: 30000 });

onMounted(async () => {
	teamsStore.fetch();
});
</script>
