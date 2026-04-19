<template>
  <div
    class="w-xl max-w-full mx-auto rounded-2xl bg-white p-4 sm:p-6 text-black shadow-2xl"
  >
    <GameCardVersus :game="game" />
    <div v-if="mode === 'card'" class="mt-6 flex gap-2 flex-col sm:flex-row">
      <!-- Watch live button -->
      <NuxtLink
        v-if="isGameInProgress(game)"
        :href="`/live#track-${game.venue}`"
        class="button--red flex-1"
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
        class="button--red flex-1"
        ><span>Watch replay</span
        ><UIcon name="ic:round-smart-display" class="size-6"
      /></NuxtLink>
      <!-- Go to game page button -->
      <NuxtLink :href="`/games/${game.number}`" class="button--yellow flex-1"
        ><span>Go to game page</span>
        <UIcon name="lucide:arrow-right" class="size-6"
      /></NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GameState, type IGame } from "~~/types/games";
import { isGameInProgress } from "~/utils/game";

import GameCardVersus from "./GameCardVersus.vue";

const props = defineProps<{
  game: IGame;
  mode: "card" | "page";
}>();
</script>
