<template>
  <div class="w-fit">
    <p>Use simulated games: {{ useSimulatedGames }}</p>
    <div v-if="!useSimulatedGames">
      <p
        class="cursor-pointer underline underline-offset-2 text-yellow"
        @click="toggleSimulatedGames()"
      >
        Simulate games (random states)
      </p>
      <p
        class="cursor-pointer underline underline-offset-2 text-yellow"
        @click="toggleSimulatedGames(true)"
      >
        Simulate games (all finished)
      </p>
    </div>
    <div v-else>
      <p
        class="cursor-pointer underline underline-offset-2 text-yellow"
        @click="toggleSimulatedGames()"
      >
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
