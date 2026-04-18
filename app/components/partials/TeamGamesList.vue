<template>
  <div class="my-6">
    <p class="font-shoulders text-2xl font-bold mb-2">
      Games in this tournament:
    </p>
    <ul class="max-w-xs">
      <li
        v-for="game in getGamesByTeam(team.id)"
        :key="game.id"
        class="flex my-2 items-center justify-between"
      >
        <div class="space-x-1">
          <span class="capitalize">{{ formatDay(game.start_time) }}</span>
          <span class="mr-2">{{ formatTime(game.start_time) }}</span>
        </div>
        <div class="space-x-1">
          <span
            class="font-mono font-bold px-1.5 bg-yellow text-black rounded-md"
          >
            {{ getTeamName(game, "home", true, game.home_source) }}</span
          >
          <span
            class="font-mono font-bold px-1.5 bg-yellow text-black rounded-md"
          >
            {{ getTeamName(game, "away", true, game.away_source) }}</span
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedTeam } from "~~/types/custom";
import { useGamesStore } from "~/stores/games";
import { useGameFormatting } from "~/composables/useGameFormatting";

const gamesStore = useGamesStore();
const { getGamesByTeam } = gamesStore;
const { getTeamName } = useGameFormatting();
const { formatTime, formatDateYMD, formatDay } = useFormatTimeLocalized();

const props = defineProps<{
  team: ILocalizedTeam;
}>();

useGamesAutoRefresh({ intervalMs: 60000 });
</script>
