<template>
    <FullCalendar :options="calendarOptions">
        <template v-slot:eventContent="{ event }">
            <CalendarGame :event="event" />
        </template>
    </FullCalendar>
</template>

<script lang="ts" setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';

import { addMinutes, format, parseISO } from 'date-fns';
import { useGamesStore } from '~/stores/games';
import { GameDuration } from '~~/types/games';
import CalendarGame from './CalendarGame.vue';

const { locale, t } = useI18n();
const gamesStore = useGamesStore();

const games = computed(() => {
    return gamesStore.games;
});

const getEndTime = (startTime: string, duration: GameDuration): string => {
    const parsedStart = parseISO(startTime);
    const durationInMinutes = duration === GameDuration.TwoXFifteen ? 45 : 90;
    const endDate = addMinutes(parsedStart, durationInMinutes);
    return format(endDate, "yyyy-MM-dd'T'HH:mm:ss");
};

const events = computed(() => {
    return games.value?.map((game) => {
        return {
            title: `Game ${game.number}`,
            start: game.start_time,
            end: getEndTime(game.start_time, game.duration),
            game: game,
        };
    }) ?? [];
});

const calendarOptions = {
    locale: locale.value,
    plugins: [dayGridPlugin, listPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: { center: 'timeGridWeek,timeGridDay,listDay', end: 'prev,next,today' },
    buttonText: {
        today: t('calendar.today'),
        week: t('calendar.week'),
        day: t('calendar.day'),
        list: t('calendar.list'),
    },
    initialView: 'timeGridWeek',
    initialDate: '2026-04-30',
    validRange: {
        start: '2026-04-30',
        end: '2026-05-04'
    },
    firstDay: 1,
    hiddenDays: [1, 2, 3],
    height: 'auto',
    eventColor: 'transparent',
    eventBorderColor: 'transparent',
    views: {
        timeGridWeek: {
            allDaySlot: false,
            slotDuration: '00:30:00',
            slotMinTime: '09:00:00',
            slotMaxTime: '23:00:00',
            slotEventOverlap: false,
            nowIndicator: true,
        },
        timeGridDay: {
            allDaySlot: false,
            slotDuration: '00:30:00',
            slotMinTime: '09:00:00',
            slotMaxTime: '23:00:00',
            slotEventOverlap: false,
            nowIndicator: true,
        },
    },
    eventClick: (info: EventClickArg) => {
        console.log(info);
    },
    initialEvents: events.value,
};

</script>
