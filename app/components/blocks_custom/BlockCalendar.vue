<template>
    <div class="bg-blue-text">
        <div class="maxed padded" v-if="true || user_timezone !== tournament_timezone">
            <div class="bg-white text-black p-6 rounded-2xl w-fit">
                <p>The tournament timezone is {{ tournament_timezone }}</p>
                <p>Your timezone: {{ user_timezone }}</p>
                <p class="font-bold text-red-text">Active timezone: {{ active_timezone }}</p>
                <button @click="toggleTimezone" class="my-4 bg-yellow text-black p-2 rounded-lg cursor-pointer">Toggle
                    timezone</button>
                <p>Slot min time: {{ format(slotMinTime, 'HH:mm', { in: tz(active_timezone) }) }}</p>
                <p>Slot max time: {{ format(slotMaxTime, 'HH:mm', { in: tz(active_timezone) }) }}</p>
            </div>
        </div>
        <div :class="wrapperClass" class="padded sm:mx-auto pb-8">
            <FullCalendar ref="calendarRef" :options="calendarOptions">
                <template v-slot:eventContent="arg">
                    <CalendarGame :event="arg.event" />
                </template>
                <template v-slot:dayHeaderContent="arg" class="bg-red-text">
                    <p class="mb-4">{{ arg.text }}</p>
                    <div v-if="selectedTrackId == 0" class="track-header w-full flex flex-row gap-1 mb-1 pl-0.5">
                        <div>{{ t('calendar_track_short', { index: 1 }) }}</div>
                        <div v-if="FIRST_TWO_DAYS.includes(formatDateYMD(arg.date))">{{ t('calendar_track_short', {
                            index: 2
                        }) }}</div>
                    </div>
                </template>
            </FullCalendar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { CalendarOptions } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { format } from 'date-fns';
import { TZDate, tz } from '@date-fns/tz';

import { useGamesStore } from '~/stores/games';
import { useVenuesStore } from '~/stores/venues';
import { getGameEndTime } from '~/utils/game'

import CalendarGame from '~/components/partials/games/CalendarGame.vue';

const { locale, t } = useI18n();
const gamesStore = useGamesStore();
const venuesStore = useVenuesStore();
const { formatDayShort, formatDateYMD } = useFormatTimeLocalized();
const { smOrSmaller } = useResponsive();
const { active_timezone, tournament_timezone, user_timezone, toggleTimezone } = useTimezone();

useGamesAutoRefresh({ intervalMs: 60000 });

const WC_DATES = ["2026-04-30", "2026-05-01", "2026-05-02", "2026-05-03"] as const;
const END_DATE = "2026-05-04";
const FIRST_TWO_DAYS: string[] = [WC_DATES[0], WC_DATES[1]];

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

const trackButtons = computed(() => {
    return Object.fromEntries(
        venuesStore.localizedVenues.map((venue, index) => [
            `track_${venue.id}`,
            {
                text: t('calendar_track_short', { index: index + 1 }),
                click: () => {
                    selectedTrackId.value = venue.id;
                }
            }
        ])
    );
});

const trackButtonNames = computed(() => {
    return [
        'allGames',
        ...Object.keys(trackButtons.value),
    ];
});

const trackToolbarButtons = computed(() => {
    return trackButtonNames.value.join(',');
});

const selectedTrackId = ref(0);
const currentViewType = ref(smOrSmaller.value ? 'dayOne' : 'timeGridWeek');

const wrapperClass = computed(() => {
    if (currentViewType.value === 'timeGridWeek')
        return 'calendar-week-view sm:max-w-screen-2xl';
    else
        return 'calendar-day-view sm:max-w-5xl';
});

const getTrackButtonName = (trackId: number) => {
    return trackId === 0 ? 'allGames' : `track_${trackId}`;
};

const syncTrackButtonClasses = () => {
    const calendarRoot = calendarRef.value?.$el as HTMLElement | undefined;
    if (!calendarRoot)
        return;

    const activeButtonName = getTrackButtonName(selectedTrackId.value);

    trackButtonNames.value.forEach((buttonName) => {
        const buttonEl = calendarRoot.querySelector<HTMLElement>(`.fc-${buttonName}-button`);
        if (!buttonEl)
            return;

        const isActive = buttonName === activeButtonName;
        buttonEl.classList.add('fc-track-btn');
        buttonEl.classList.toggle('fc-track-btn-active', isActive);
        buttonEl.classList.toggle('fc-track-btn-inactive', !isActive);
    });
};

const slotMinTime = new TZDate(`${WC_DATES[0]}T09:00:00+02:00`, tournament_timezone);
const slotMaxTime = new TZDate(`${WC_DATES[0]}T23:00:00+02:00`, tournament_timezone);

const getClampedSlotTime = (date: TZDate, clamp: 'min' | 'max') => {
    const convertedDay = format(date, 'yyyy-MM-dd', { in: tz(active_timezone.value) });

    if (clamp === 'min' && convertedDay < WC_DATES[0])
        return '00:00';
    if (clamp === 'max' && convertedDay > WC_DATES[0])
        return '24:00';

    return format(date, 'HH:mm', { in: tz(active_timezone.value) });
};

const commonTimeGridOptions = computed(() => ({
    allDaySlot: false,
    slotDuration: '00:30:00',
    slotMinTime: getClampedSlotTime(slotMinTime, 'min'),
    slotMaxTime: getClampedSlotTime(slotMaxTime, 'max'),
    slotEventOverlap: false,
    nowIndicator: true,
    dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true } as const,
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: true, meridiem: 'short' } as const
}));

const commonDayOptions = computed(() => ({
    ...commonTimeGridOptions.value,
    type: 'timeGrid',
    duration: { days: 1 },
}));

const calendarOptions = computed<CalendarOptions>(() => {
    const viewButtons = smOrSmaller.value ? 'dayOne,dayTwo,dayThree,dayFour' : 'timeGridWeek,dayOne,dayTwo,dayThree,dayFour';

    return {
        locale: locale.value,
        timeZone: active_timezone.value,
        plugins: [dayGridPlugin, listPlugin, timeGridPlugin, interactionPlugin, momentTimezonePlugin],
        headerToolbar: { start: viewButtons, end: trackToolbarButtons.value },
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
            allGames: {
                text: t('calendar_track_all'),
                click: () => {
                    selectedTrackId.value = 0;
                }
            },
            ...trackButtons.value,
        },
        views: {
            timeGridWeek: {
                ...commonTimeGridOptions.value,
            },
            dayOne: {
                ...commonDayOptions.value,
                buttonText: formatDayShort(WC_DATES[0])
            },
            dayTwo: {
                ...commonDayOptions.value,
                buttonText: formatDayShort(WC_DATES[1])
            },
            dayThree: {
                ...commonDayOptions.value,
                buttonText: formatDayShort(WC_DATES[2])
            },
            dayFour: {
                ...commonDayOptions.value,
                buttonText: formatDayShort(WC_DATES[3])
            },
        },
        datesSet: (info) => {
            currentViewType.value = info.view.type;
        },
        events: events.value,
    };
});

onMounted(() => {
    nextTick(() => {
        currentViewType.value = calendarRef.value?.getApi().view.type ?? currentViewType.value;
        syncTrackButtonClasses();
    });
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

watch(selectedTrackId, () => {
    nextTick(() => {
        syncTrackButtonClasses();
    });
});

watch(trackToolbarButtons, () => {
    nextTick(() => {
        syncTrackButtonClasses();
    });
});
</script>
