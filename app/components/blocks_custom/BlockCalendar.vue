<template>
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
import { getGameEndTime } from '~/utils/game'
import { useGamesAutoRefresh } from '~/composables/useGamesAutoRefresh';

import CalendarGame from '~/components/partials/games/CalendarGame.vue';
import CalendarListGame from '~/components/partials/games/CalendarListGame.vue';

const { locale, t } = useI18n();
const gamesStore = useGamesStore();
const { formatDayShort } = useFormatTimeLocalized();
const { smOrSmaller } = useResponsive()

useGamesAutoRefresh({ intervalMs: 60000 });

const WC_DATES = ['2026-04-30', '2026-05-01', '2026-05-02', '2026-05-03'] as const;
const END_DATE = '2026-05-04';

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

const events = computed(() => {
    return gamesStore.games?.map((game) => {
        return {
            title: `Game ${game.number}`,
            start: game.start_time,
            end: getGameEndTime(game.start_time, game.duration),
            game: game,
        };
    }) ?? [];
});

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
