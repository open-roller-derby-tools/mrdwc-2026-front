<template>
    <div :class="eventClass" class="relative flex flex-col h-full select-none cursor-pointer">
        <!-- Game teams/scores -->
        <CalendarGameVersus :game="event.extendedProps.game" />
        <!-- Game state/time -->
        <CalendarGameState :game="event.extendedProps.game" />
        <!-- Game description (Q1, S2, etc.) -->
        <div v-if="event.extendedProps.game.description"
            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-text text-white font-shoulders font-bold px-2 py-1 rounded-full">
            {{ event.extendedProps.game.description }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GameState, type IGame } from '~~/types/games';
import CalendarGameState from './CalendarGameState.vue';
import CalendarGameVersus from './CalendarGameVersus.vue';

const props = defineProps<{
    event: {
        title: string;
        start: Date;
        end: Date;
        extendedProps: {
            game: IGame;
        };
    };
}>();

const eventClass = computed(() => ({
    'opacity-100': props.event.extendedProps.game.state !== GameState.Finished,
    'opacity-75 transition-opacity duration-200 hover:opacity-100': props.event.extendedProps.game.state === GameState.Finished,
}));

</script>