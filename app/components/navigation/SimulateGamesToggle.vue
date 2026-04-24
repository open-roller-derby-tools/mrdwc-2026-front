<template>
	<div class="text-base">
		<p>
			Use simulated games: <span class="font-bold">{{ useSimulatedGames }}</span>
		</p>
		<div v-if="!useSimulatedGames" class="text-red-text font-bold">
			<p class="cursor-pointer underline underline-offset-2" @click="toggleSimulatedGames()">
				Simulate games (random states)
			</p>
			<p class="cursor-pointer underline underline-offset-2" @click="toggleSimulatedGames(true)">
				Simulate games (all finished)
			</p>
		</div>
		<div v-else class="text-red-text font-bold">
			<p class="cursor-pointer underline underline-offset-2" @click="toggleSimulatedGames()">
				Back to real games
			</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
const gamesStore = useGamesStore();
const { useSimulatedGames } = storeToRefs(gamesStore);
const { toggleSimulatedGames } = gamesStore;
</script>
