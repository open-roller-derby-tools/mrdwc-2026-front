<template>
  <div>
    <p>Use simulated games: {{ useSimulatedGames }}</p>
    <div v-if="!useSimulatedGames">
      <p
        @click="toggleSimulatedGames()"
        class="cursor-pointer underline underline-offset-2 text-yellow"
      >
        Simulate games (random states)
      </p>
      <p
        @click="toggleSimulatedGames(true)"
        class="cursor-pointer underline underline-offset-2 text-yellow"
      >
        Simulate games (all finished)
      </p>
    </div>
    <div v-else>
      <p
        @click="toggleSimulatedGames()"
        class="cursor-pointer underline underline-offset-2 text-yellow"
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
