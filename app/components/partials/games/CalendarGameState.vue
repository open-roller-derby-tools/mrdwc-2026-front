<template>
    <div class="flex items-center gap-1 text-sm font-medium px-1 py-0.5 rounded-b-md" :class="gameTimeOrStateClass">
        <div v-if="gameIsLive && gameTimeOrStateIcon" class="relative inline-flex">
            <UIcon :name="gameTimeOrStateIcon" class="absolute size-4 opacity-75 animate-ping" />
            <UIcon :name="gameTimeOrStateIcon" class="size-4" />
        </div>
        <template v-else-if="gameTimeOrStateIcon">
            <UIcon :name="gameTimeOrStateIcon" class="size-4" />
        </template>
        <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ gameTimeOrStateLabel }}</span>
    </div>
</template>

<script lang="ts" setup>
import { GameState, type IGame } from '~~/types/games';

const { formatTime } = useFormatTimeLocalized();
const { t } = useI18n();

const props = defineProps<{
    game: IGame;
}>();

const gameIsLive = computed(() => {
    return props.game.state === GameState.InProgressP1 || props.game.state === GameState.HalfTime || props.game.state === GameState.InProgressP2;
});

const gameTimeOrStateLabel = computed(() => {
    switch (props.game.state) {
        case GameState.Scheduled:
        case GameState.PreGame:
            return formatTime(props.game.start_time);
        case GameState.InProgressP1:
            return t('game_state.in_progress_p1');
        case GameState.HalfTime:
            return t('game_state.half_time');
        case GameState.InProgressP2:
            return t('game_state.in_progress_p2');
        case GameState.Finished:
            return t('game_state.finished');
        default:
            return '';
    }
});

const gameTimeOrStateIcon = computed<string | false>(() => {
    switch (props.game.state) {
        case GameState.Scheduled:
        case GameState.PreGame:
            return 'ic:round-schedule';
        case GameState.InProgressP1:
        case GameState.InProgressP2:
            return 'ic:round-fiber-manual-record';
        case GameState.HalfTime:
            return 'ic:round-pause';
        case GameState.Finished:
            return 'ic:round-done';
        default:
            return false;
    }
});

const gameTimeOrStateClass = computed<string>(() => {
    switch (props.game.state) {
        case GameState.InProgressP1:
        case GameState.InProgressP2:
        case GameState.HalfTime:
            return 'text-red-base bg-white';
        default:
            return 'text-black bg-yellow';
    }
});
</script>