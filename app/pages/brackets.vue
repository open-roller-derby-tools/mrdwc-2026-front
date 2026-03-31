<template>
    <div class="maxed padded my-32 w-full">
        <div class="flex flex-row gap-2 my-8">
            <button @click="currentDisplay = 'planning'" :class="buttonClasses">Planning</button>
            <button @click="currentDisplay = 'calendar'" :class="buttonClasses">Calendar</button>
            <button @click="currentDisplay = 'groups_stage'" :class="buttonClasses">Groups Stage</button>
            <button @click="currentDisplay = 'rankings_play'" :class="buttonClasses">Rankings Play</button>
            <button @click="currentDisplay = 'bracket_play'" :class="buttonClasses">Bracket Play</button>
        </div>
        <div v-if="gamesStore.isReady && teamsStore.isReady">
            <div v-if="currentDisplay === 'planning'">
                <div v-for="([date, games]) in Object.entries(gamesStore.gamesGroupedByDate)" :key="date">
                    <h2 class="text-xl font-bold">{{ date }}</h2>
                    <DebugGame v-for="game of games" :key="game.id" :game="game" />
                </div>
            </div>
            <div v-if="currentDisplay === 'calendar'">
                <Calendar />
            </div>
            <div v-if="currentDisplay === 'groups_stage'">
                <DebugGame v-for="game in gamesStore.typeGroupsStageGames" :key="game.id" :game="game" />
            </div>
            <div v-if="currentDisplay === 'rankings_play'">
                <div class="grid grid-cols-7 select-none cursor-default">
                    <div class="flex flex-col">
                        <BracketGame v-if="gameRP1" :game="gameRP1" :level="1" />
                        <BracketGame v-if="gameRP2" :game="gameRP2" :level="1" />
                        <BracketGame v-if="gameRP3" :game="gameRP3" :level="1" />
                        <BracketGame v-if="gameRP4" :game="gameRP4" :level="1" />
                        <BracketGame v-if="gameRP5" :game="gameRP5" :level="1" />
                        <BracketGame v-if="gameRP6" :game="gameRP6" :level="1" />
                    </div>
                </div>
            </div>
            <div v-if="currentDisplay === 'bracket_play'">
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
</template>

<script lang="ts" setup>
import BracketGame from '~/components/partials/games/BracketGame.vue';
import DebugGame from '~/components/partials/games/DebugGame.vue';
import Calendar from '~/components/partials/games/Calendar.vue';
import { useGamesStore } from '~/stores/games';
import { useTeamsStore } from '~/stores/teams';
const gamesStore = useGamesStore();
const teamsStore = useTeamsStore();
const { locale } = useI18n();
const currentDisplay = ref<string>("calendar");
const buttonClasses = 'bg-yellow text-black font-shoulders font-bold text-sm px-4 py-2 rounded-md cursor-pointer';

/* declare module 'nuxt/app' {
    interface NuxtLayouts {
        'debug': unknown
    }
}

definePageMeta({
    layout: 'debug',
}) */

const gameRP1 = computed(() => gamesStore.getGameByNumber(50));
const gameRP2 = computed(() => gamesStore.getGameByNumber(49));
const gameRP3 = computed(() => gamesStore.getGameByNumber(43));
const gameRP4 = computed(() => gamesStore.getGameByNumber(46));
const gameRP5 = computed(() => gamesStore.getGameByNumber(41));
const gameRP6 = computed(() => gamesStore.getGameByNumber(42));

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