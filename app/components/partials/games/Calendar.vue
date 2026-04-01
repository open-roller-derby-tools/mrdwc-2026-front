<template>
    <FullCalendar ref="calendarRef" :options="calendarOptions">
        <template v-slot:eventContent="arg">
            <CalendarListGame v-if="arg.view.type.startsWith('list')" :event="arg.event" />
            <CalendarGame v-else :event="arg.event" />
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
import type { CalendarOptions } from '@fullcalendar/core';

import { addMinutes, format, parseISO } from 'date-fns';
import { useGamesStore } from '~/stores/games';
import { GameDuration } from '~~/types/games';
import CalendarGame from './CalendarGame.vue';
import CalendarListGame from './CalendarListGame.vue';

const { locale, t } = useI18n();
const gamesStore = useGamesStore();
const { getBreakpointPx } = useTailwindBreakpoint();
const { formatDayShort } = useFormatTimeLocalized();

const DEFAULT_MOBILE_BREAKPOINT = 640;
const WC_DATES = ['2026-04-30', '2026-05-01', '2026-05-02', '2026-05-03'] as const;
const END_DATE = '2026-05-04';

const mobileBreakpoint = ref(DEFAULT_MOBILE_BREAKPOINT);
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const isMobile = ref(false);

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

const updateViewportState = () => {
    isMobile.value = window.innerWidth < mobileBreakpoint.value;
};

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
    const viewButtons = isMobile.value ? 'dayOne,dayTwo,dayThree,dayFour' : 'timeGridWeek,dayOne,dayTwo,dayThree,dayFour';

    return {
        locale: locale.value,
        plugins: [dayGridPlugin, listPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: { start: viewButtons, end: '' },
        buttonText: {
            week: t('calendar.week'),
        },
        initialView: isMobile.value ? 'timeGridDay' : 'timeGridWeek',
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
            /* timeGridDay: {
                ...commonTimeGridOptions,
            }, */
            /* listDay: {
                listDayFormat: { weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true } as const,
            }, */
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

onMounted(() => {
    mobileBreakpoint.value = getBreakpointPx('sm', DEFAULT_MOBILE_BREAKPOINT);
    updateViewportState();
    window.addEventListener('resize', updateViewportState);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateViewportState);
});

watch(isMobile, (mobileNow) => {
    const api = calendarRef.value?.getApi();
    if (!api)
        return;

    if (mobileNow && api.view.type === 'timeGridWeek')
        api.changeView('dayOne', WC_DATES[0]);
});
</script>
