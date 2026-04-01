<template>
    <div class="grid grid-cols-3 gap-4">
        <div>
            <p>{{ formatTime(props.event.extendedProps.game.start_time) }}</p>
            <p>{{ trackName }}</p>
            <CalendarGameState :game="event.extendedProps.game" />
        </div>
        <div :class="eventClass" class="relative flex flex-col select-none cursor-pointer col-span-2">
            <!-- Game teams/scores -->
            <CalendarGameVersus :game="event.extendedProps.game" />
            <!-- Game description (Q1, S2, etc.) -->
            <div v-if="event.extendedProps.game.description"
                class="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-red-text text-white font-shoulders font-bold px-2 py-1 rounded-full">
                {{ event.extendedProps.game.description }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GameState, Track, type IGame } from '~~/types/games';
import CalendarGameState from './CalendarGameState.vue';
import CalendarGameVersus from './CalendarGameVersus.vue';

const { formatTime } = useFormatTimeLocalized();

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

const trackName = computed(() => {
    return props.event.extendedProps.game.track == Track.PalaisDesSports ? 'Palais des Sports' : 'Gymnase Claude Robert';
});
</script>
