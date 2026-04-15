<template>
    <div class="maxed padded flex justify-center">
        <ul class="my-4 flex flex-col sm:flex-row gap-0.5 items-center list-none font-shoulders font-semibold text-lg">
            <li v-for="track in trackList" :key="`track_${track.id}`"
                class="transition-colors duration-100 px-3 py-2 w-full sm:w-auto flex gap-4 items-center select-none cursor-pointer first:rounded-t-xl last:rounded-b-xl sm:first:rounded-tr-none sm:first:rounded-bl-xl sm:last:rounded-bl-none sm:last:rounded-tr-xl"
                :class="selectedTrackId === track.id ? 'bg-yellow text-blue-text' : 'bg-blue-inactive text-blue-text hover:bg-yellow'"
                @click="selectedTrackId = track.id">
                <span>{{ track.label }}</span>
            </li>
        </ul>
    </div>
    <FullCalendar ref="calendarRef" :options="calendarOptions">
        <template v-slot:eventContent="arg">
            <CalendarGame :event="arg.event" />
        </template>
    </FullCalendar>
</template>

<script lang="ts" setup>
import type { EventClickArg } from '@fullcalendar/core';
import type { CalendarOptions } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { useGamesStore } from '~/stores/games';
import { useVenuesStore } from '~/stores/venues';
import { getGameEndTime } from '~/utils/game'
import { useGamesAutoRefresh } from '~/composables/useGamesAutoRefresh';

import CalendarGame from '~/components/partials/games/CalendarGame.vue';

const { locale, t } = useI18n();
const gamesStore = useGamesStore();
const venuesStore = useVenuesStore();
const { formatDayShort } = useFormatTimeLocalized();
const { smOrSmaller } = useResponsive()

useGamesAutoRefresh({ intervalMs: 60000 });

const WC_DATES = ['2026-04-30', '2026-05-01', '2026-05-02', '2026-05-03'] as const;
const END_DATE = '2026-05-04';

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

const events = computed(() => {
    const filteredGames = gamesStore.games?.filter((game) => {
        if (selectedTrackId.value === 0)
            return true;
        return game.venue === selectedTrackId.value;
    }) ?? [];
    return filteredGames.map((game) => {
        return {
            title: `Game ${game.number}`,
            start: game.start_time,
            end: getGameEndTime(game.start_time, game.duration),
            game: game,
        };
    }) ?? [];
});

const trackList = computed(() => {
    const venueTracks = venuesStore.localizedVenues.map((venue, index) => ({
        id: venue.id,
        label: t('calendar_track', { index: index + 1, name: venue.name }),
    }));
    return [
        {
            id: 0,
            label: t('calendar_track_all'),
        },
        ...venueTracks,
    ];
});

const selectedTrackId = ref(0);

const commonTimeGridOptions = {
    allDaySlot: false,
    slotDuration: '00:30:00',
    slotMinTime: '09:00:00',
    slotMaxTime: '23:00:00',
    slotEventOverlap: false,
    nowIndicator: true,
    dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true } as const,
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: true, meridiem: 'short' } as const
};

const commonDayOptions = {
    ...commonTimeGridOptions,
    type: 'timeGrid',
    duration: { days: 1 },
};

const calendarOptions = computed<CalendarOptions>(() => {
    const viewButtons = smOrSmaller.value ? 'dayOne,dayTwo,dayThree,dayFour' : 'timeGridWeek,dayOne,dayTwo,dayThree,dayFour';

    return {
        locale: locale.value,
        plugins: [dayGridPlugin, listPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: { start: viewButtons, end: '' },
        buttonText: {
            week: t('calendar.week'),
        },
        initialView: smOrSmaller.value ? 'dayOne' : 'timeGridWeek',
        initialDate: WC_DATES[0],
        validRange: {
            start: WC_DATES[0],
            end: END_DATE
        },
        firstDay: 1,
        hiddenDays: [1, 2, 3],
        height: 'auto',
        eventColor: 'transparent',
        eventBorderColor: 'transparent',
        customButtons: {
            dayOne: {
                text: formatDayShort(WC_DATES[0]),
                click: () => {
                    calendarRef.value?.getApi().changeView('dayOne', WC_DATES[0]);
                }
            },
            dayTwo: {
                text: formatDayShort(WC_DATES[1]),
                click: () => {
                    calendarRef.value?.getApi().changeView('dayTwo', WC_DATES[1]);
                }
            },
            dayThree: {
                text: formatDayShort(WC_DATES[2]),
                click: () => {
                    calendarRef.value?.getApi().changeView('dayThree', WC_DATES[2]);
                }
            },
            dayFour: {
                text: formatDayShort(WC_DATES[3]),
                click: () => {
                    calendarRef.value?.getApi().changeView('dayFour', WC_DATES[3]);
                }
            },
        },
        views: {
            timeGridWeek: {
                ...commonTimeGridOptions,
            },
            dayOne: {
                ...commonDayOptions,
                buttonText: formatDayShort(WC_DATES[0])
            },
            dayTwo: {
                ...commonDayOptions,
                buttonText: formatDayShort(WC_DATES[1])
            },
            dayThree: {
                ...commonDayOptions,
                buttonText: formatDayShort(WC_DATES[2])
            },
            dayFour: {
                ...commonDayOptions,
                buttonText: formatDayShort(WC_DATES[3])
            },
        },
        eventClick: (info: EventClickArg) => {
            // TODO: Open game details modal
            console.log(info);
        },
        events: events.value,
    };
});

watch(smOrSmaller, (smOrSmallerNow) => {
    const api = calendarRef.value?.getApi();
    if (!api)
        return;

    if (smOrSmallerNow && api.view.type == 'timeGridWeek')
        api.changeView('dayOne', WC_DATES[0]);
    else if (!smOrSmallerNow && api.view.type != 'timeGridWeek')
        api.changeView('timeGridWeek');
});
</script>
