<template>
    <div class="maxed padded mt-32 w-full">
        <div v-if="gamesStore.isReady && teamsStore.isReady">
            <DebugGame v-for="game in gamesStore.typeGroupsStageGames" :key="game.id" :game="game" />
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
        <div class="my-8">
            <div class="grid grid-cols-7 select-none cursor-default">
                <div class="flex flex-col">
                    <BracketGame />
                    <BracketGame />
                    <BracketGame />
                    <BracketGame />
                    <BracketGame />
                    <BracketGame />
                    <BracketGame />
                    <BracketGame />
                </div>
                <div></div>
                <div class="flex flex-col">
                    <BracketGame :level="2" :show_link="true" />
                    <BracketGame :level="2" :show_link="true" />
                    <BracketGame :level="2" :show_link="true" />
                    <BracketGame :level="2" :show_link="true" />
                </div>
                <div></div>
                <div class="flex flex-col">
                    <BracketGame :level="3" :show_link="true" />
                    <BracketGame :level="3" :show_link="true" />
                </div>
                <div></div>
                <div class="flex flex-col">
                    <BracketGame :level="4" :show_link="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BracketGame from '~/components/partials/games/BracketGame.vue';
import DebugGame from '~/components/partials/games/DebugGame.vue';
import { useGamesStore } from '~/stores/games';
import { useTeamsStore } from '~/stores/teams';
const gamesStore = useGamesStore();
const teamsStore = useTeamsStore();

declare module 'nuxt/app' {
    interface NuxtLayouts {
        'debug': unknown
    }
}

definePageMeta({
    layout: 'debug',
})

// onMounted(async () => {
//     const fetches: Promise<unknown>[] = [];
//     if (!gamesStore.isReady) fetches.push(gamesStore.fetch());
//     if (!teamsStore.isReady) fetches.push(teamsStore.fetch());
//     await Promise.all(fetches);
// });
</script>