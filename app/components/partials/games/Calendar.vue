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
import { addMinutes, format, parseISO } from 'date-fns';
import { useGamesStore } from '~/stores/games';
import { GameDuration } from '~~/types/games';
import CalendarGame from './CalendarGame.vue';

const gamesStore = useGamesStore();

const games = computed(() => {
    return gamesStore.stateScheduledGames;
});

const getEndTime = (startTime: string, duration: GameDuration): string => {
    const parsedStart = parseISO(startTime);
    const durationInMinutes = duration === GameDuration.TwoXFifteen ? 45 : 90;
    const endDate = addMinutes(parsedStart, durationInMinutes);
    return format(endDate, "yyyy-MM-dd'T'HH:mm:ss");
};

const events = computed(() => {
    return games.value.map((game) => {
        return {
            title: `Game ${game.number}`,
            start: game.start_time,
            end: getEndTime(game.start_time, game.duration),
        };
    });
});

const calendarOptions = {
    plugins: [dayGridPlugin, listPlugin, timeGridPlugin],
    headerToolbar: { center: 'timeGridWeek, timeGridDay, listDay', end: 'prev,next,today' },
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
    initialEvents: events.value,
};

</script>
