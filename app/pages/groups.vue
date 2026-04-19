<template>
  <div class="w-full maxed padded my-32">
    <h1>TOURNAMENT GROUPS</h1>
    <BlockGroups />
    <h2 class="mt-16">GAMES</h2>
    <span
      @click="toggleSimulatedGames()"
      class="cursor-pointer underline underline-offset-2 text-yellow"
      >Toggle simulated games</span
    >
    <div class="w-full grid grid-cols-3 gap-4">
      <div v-for="group in groups" :key="group.id">
        <p class="font-shoulders text-2xl font-bold">
          Group {{ group.number }}
        </p>

        <ul v-if="getGamesByGroup(group.number).length > 0">
          <li v-for="game in getGamesByGroup(group.number)" :key="game.id">
            <p class="flex gap-1">
              <span>Game {{ game.number }}:</span>
              <span>{{
                getTeamName(game, "home", true, game.home_source)
              }}</span>
              <span>{{ game.home_score }}</span>
              <span>-</span>
              <span>{{ game.away_score }}</span>
              <span>{{
                getTeamName(game, "away", true, game.away_source)
              }}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BlockGroups from "~/components/blocks_custom/BlockGroups.vue";

const groupsStore = useGroupsStore();
const teamsStore = useTeamsStore();
const gamesStore = useGamesStore();
const { getTeamName } = useGameFormatting();
const { getGamesByGroup, toggleSimulatedGames } = gamesStore;

onMounted(async () => {
  await groupsStore.fetch();
  await teamsStore.fetch();
  await gamesStore.fetch();
});

const groups = computed(() => groupsStore.groups ?? []);
</script>
