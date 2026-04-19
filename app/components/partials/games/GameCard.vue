<template>
  <div
    class="w-xl max-w-full mx-auto rounded-2xl bg-white p-8 text-black shadow-2xl"
  >
    <div class="grid grid-cols-2 gap-4">
      <GameCardVersusTeam :game="game" team="home" />
      <GameCardVersusTeam :game="game" team="away" />
    </div>
    <!-- Watch live button -->
    <NuxtLink
      v-if="isGameInProgress(game)"
      :href="`/live#track-${game.venue}`"
      class="button--red"
      ><span>Watch live</span>
      <div class="relative inline-flex">
        <UIcon
          name="ic:round-fiber-manual-record"
          class="absolute size-5 opacity-75 animate-ping"
        />
        <UIcon name="ic:round-fiber-manual-record" class="size-5" />
      </div>
    </NuxtLink>
    <!-- Watch replay button -->
    <NuxtLink
      v-if="game.state === GameState.Finished && game.video_url"
      :href="`/games/${game.number}`"
      class="button--red"
      ><span>Watch replay</span
      ><UIcon name="ic:round-smart-display" class="size-6"
    /></NuxtLink>
    <!-- Go to game page button -->
    <NuxtLink :href="`/games/${game.number}`" class="button--yellow"
      >Go to game page</NuxtLink
    >
  </div>
</template>

<script lang="ts" setup>
import { GameState, type IGame } from "~~/types/games";
import { isGameInProgress } from "~/utils/game";

import GameCardVersusTeam from "./GameCardVersusTeam.vue";

const props = defineProps<{
  game: IGame;
}>();
</script>
