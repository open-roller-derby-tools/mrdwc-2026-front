<template>
    <div class="relative flex flex-col h-full bg-yellow text-black rounded-md">
        <div class="grid grid-cols-2 text-sm grow">
            <div :style="homeSpanStyle" class="h-full flex items-center justify-center text-sm rounded-tl-md"><span>{{
                homeTeamName
                    }}</span></div>
            <div :style="awaySpanStyle" class="h-full flex items-center justify-center text-sm rounded-tr-md"><span>{{
                awayTeamName
                    }}</span></div>
        </div>
        <div class="flex items-center justify-between text-sm font-medium px-1.5 py-0.5">
            <span class="">{{ formatTime(event.start) }}</span>
            <span class="text-xs">{{ gameDuration }}</span>
        </div>
        <div v-if="event.extendedProps.game.description"
            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-text text-white font-shoulders font-bold px-2 py-1 rounded-full">
            {{ event.extendedProps.game.description }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import type { IGame } from '~~/types/games';
import { useTeamsStore } from '~/stores/teams';

const { locale } = useI18n();
const teamsStore = useTeamsStore();

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

const homeTeamName = computed(() => teamsStore.getTeamById(props.event.extendedProps.game.home_team)?.name_letters ?? props.event.extendedProps.game.home_source);
const awayTeamName = computed(() => teamsStore.getTeamById(props.event.extendedProps.game.away_team)?.name_letters ?? props.event.extendedProps.game.away_source);

const homeTextColor = useContrastingColor(computed(() => props.event.extendedProps.game.home_color));
const awayTextColor = useContrastingColor(computed(() => props.event.extendedProps.game.away_color));

const homeSpanStyle = computed(() => ({
    backgroundColor: props.event.extendedProps.game.home_color,
    color: homeTextColor.value,
}));
const awaySpanStyle = computed(() => ({
    backgroundColor: props.event.extendedProps.game.away_color,
    color: awayTextColor.value,
}));

const gameDuration = computed(() => {
    return props.event.extendedProps.game.duration;
});

const formatTime = (time: Date): string => {
    return format(time, "p", { locale: locale.value === 'fr-FR' ? fr : enUS });
};
</script>