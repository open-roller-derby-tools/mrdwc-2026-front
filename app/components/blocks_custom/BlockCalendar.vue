<template>
    <div class="bg-blue-text pt-6">
        <div class="maxed padded">
            <div class="p-4 bg-white text-black rounded-2xl sm:w-fit sm:mx-auto">
                <p class="font-shoulders font-bold sm:text-lg text-balance flex items-center gap-2 leading-tight">
                    <span>{{ t('calendar.current_timezone', { timezone: active_timezone }) }}</span>
                </p>
                <p v-if="user_timezone !== tournament_timezone"
                    class="mt-2 flex flex-col gap-0 sm:gap-1 sm:flex-row sm:items-center cursor-pointer font-bold text-lg sm:text-base"
                    @click="toggleTimezone">
                    <UIcon name="i-ic-round-swap-horiz" class="size-6 hidden sm:block text-red-text" />
                    <span class="underline underline-offset-2 text-red-text">{{ active_timezone === tournament_timezone
                        ?
                        t('calendar.use_user_timezone', {
                            timezone: user_timezone
                        }) : t('calendar.use_tournament_timezone')
                    }}</span>
                    <span class="font-normal italic">({{ active_timezone === tournament_timezone ? user_timezone :
                        tournament_timezone }})</span>
                </p>
            </div>
        </div>
        <div :class="wrapperClass" class="padded sm:mx-auto pb-8">
            <FullCalendar ref="calendarRef" :options="calendarOptions">
                <template v-slot:eventContent="arg">
                    <CalendarGame :event="arg.event" />
                </template>
                <template v-slot:dayHeaderContent="arg" class="bg-red-text">
                    <p class="mb-4">{{ arg.text }}</p>
                </template>
            </FullCalendar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { CalendarOptions } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { addDays, addHours, differenceInCalendarDays, format, isAfter, isBefore } from 'date-fns';
import { TZDate, tz } from '@date-fns/tz';

import { useGamesStore } from '~/stores/games';
import { useVenuesStore } from '~/stores/venues';
import { getGameEndTime } from '~/utils/game'

import CalendarGame from '~/components/partials/games/CalendarGame.vue';

const { locale, t } = useI18n();
const gamesStore = useGamesStore();
const venuesStore = useVenuesStore();
const { smOrSmaller } = useResponsive();
const { active_timezone, tournament_timezone, user_timezone, toggleTimezone } = useTimezone();

useGamesAutoRefresh({ intervalMs: 60000 });

const WC_DATES = ["2026-04-30", "2026-05-01", "2026-05-02", "2026-05-03"] as const;
const END_DATE = "2026-05-04";

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

const firstGameDate = computed<TZDate>(() => {
    const date = gamesStore.games?.[0]?.start_time ?? null;
    if (!date)
        return new TZDate(`${WC_DATES[0]}T09:00:00+02:00`, active_timezone.value);
    return new TZDate(date, active_timezone.value);
});
const firstGameDateYMD = computed(() => {
    return format(firstGameDate.value, 'yyyy-MM-dd', { in: tz(active_timezone.value) });
});
const lastGameDate = computed<TZDate>(() => {
    const date = gamesStore.games?.[gamesStore.games.length - 1]?.start_time ?? null;
    if (!date)
        return new TZDate(`${WC_DATES[WC_DATES.length - 1]}T22:00:00+02:00`, active_timezone.value);
    return new TZDate(date, active_timezone.value);
});
const lastGameDateYMD = computed(() => {
    return format(lastGameDate.value, 'yyyy-MM-dd', { in: tz(active_timezone.value) });
});
const dateAfterLastGame = computed<TZDate>(() => {
    if (!lastGameDate.value)
        return new TZDate(`${END_DATE}T12:00:00+02:00`, active_timezone.value);
    return addDays(lastGameDate.value, 1) as TZDate;
});
const dateAfterLastGameYMD = computed(() => {
    return format(dateAfterLastGame.value, 'yyyy-MM-dd', { in: tz(active_timezone.value) });
});
const calendarFirstDay = computed<number>(() => {
    const isoWeekDay = Number(format(firstGameDate.value, 'i', { in: tz(active_timezone.value) }));
    return isoWeekDay === 7 ? 0 : isoWeekDay;
});
const calendarWeekDuration = computed<number>(() => {
    return Math.max(1, differenceInCalendarDays(dateAfterLastGame.value, firstGameDate.value));
});
const calendarValidRange = computed(() => {
    return {
        start: firstGameDateYMD.value,
        end: dateAfterLastGameYMD.value,
    };
});

const earliestGameTime = computed(() => {
    const activeTz = tz(active_timezone.value);
    const allGames = gamesStore.games ?? [];
    const relevantGames = currentViewType.value === 'timeGridDay'
        ? allGames.filter((game) => {
            const gameDay = format(new TZDate(game.start_time, active_timezone.value), 'yyyy-MM-dd', { in: activeTz });
            return gameDay === currentViewDateYMD.value;
        })
        : allGames;

    let earliestGameTimeOfDay: TZDate | null = null;

    relevantGames.forEach((game) => {
        const gameDate = new TZDate(game.start_time, active_timezone.value);
        const hour = Number(format(gameDate, 'HH', { in: activeTz }));
        const minute = Number(format(gameDate, 'mm', { in: activeTz }));
        const normalizedGameTime = new TZDate(2000, 0, 1, hour, minute, 0, active_timezone.value);

        if (!earliestGameTimeOfDay || isBefore(normalizedGameTime, earliestGameTimeOfDay))
            earliestGameTimeOfDay = normalizedGameTime;
    });

    if (!earliestGameTimeOfDay)
        return '00:00';
    return format(earliestGameTimeOfDay, 'HH:mm', { in: activeTz });
});

const latestGameTime = computed(() => {
    const activeTz = tz(active_timezone.value);
    const allGames = gamesStore.games ?? [];
    const relevantGames = currentViewType.value === 'timeGridDay'
        ? allGames.filter((game) => {
            const gameDay = format(new TZDate(game.start_time, active_timezone.value), 'yyyy-MM-dd', { in: activeTz });
            return gameDay === currentViewDateYMD.value;
        })
        : allGames;

    let latestGameTimeOfDay: TZDate | null = null;

    relevantGames.forEach((game) => {
        const gameDate = new TZDate(game.start_time, active_timezone.value);
        const hour = Number(format(gameDate, 'HH', { in: activeTz }));
        const minute = Number(format(gameDate, 'mm', { in: activeTz }));
        const normalizedGameTime = new TZDate(2000, 0, 1, hour, minute, 0, active_timezone.value);

        if (!latestGameTimeOfDay || isAfter(normalizedGameTime, latestGameTimeOfDay))
            latestGameTimeOfDay = normalizedGameTime;
    });

    if (!latestGameTimeOfDay)
        return '24:00';
    const latestGameTimeOfDayPlus2Hours = addHours(latestGameTimeOfDay, 2);
    if (format(latestGameTimeOfDayPlus2Hours, 'yyyy-MM-dd', { in: activeTz }) !== '2000-01-01')
        return '24:00';
    return format(latestGameTimeOfDayPlus2Hours, 'HH:mm', { in: activeTz });
});

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
const currentViewDateYMD = ref(firstGameDateYMD.value);

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

const realignCalendarToFirstDay = () => {
    const api = calendarRef.value?.getApi();
    if (!api)
        return;
    if (api.view.type !== 'timeGridWeek')
        return;
    api.gotoDate(firstGameDateYMD.value);
    api.updateSize();
};

const commonTimeGridOptions = computed(() => ({
    allDaySlot: false,
    slotDuration: '00:30:00',
    slotEventOverlap: false,
    nowIndicator: true,
    dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true } as const,
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: true, meridiem: 'short' } as const,
    duration: { days: calendarWeekDuration.value },
}));

const commonDayOptions = computed(() => ({
    ...commonTimeGridOptions.value,
    type: 'timeGrid',
    duration: { days: 1 },
}));

const calendarOptions = computed<CalendarOptions>(() => {
    const viewButtons = smOrSmaller.value ? 'timeGridDay' : 'timeGridWeek,timeGridDay';

    return {
        locale: locale.value,
        timeZone: active_timezone.value,
        plugins: [dayGridPlugin, timeGridPlugin, momentTimezonePlugin],
        headerToolbar: { start: viewButtons, center: 'prev,next', end: trackToolbarButtons.value },
        buttonText: {
            timeGridWeek: t('calendar.week'),
            timeGridDay: t('calendar.day'),
        },
        initialView: smOrSmaller.value ? 'timeGridDay' : 'timeGridWeek',
        initialDate: firstGameDateYMD.value,
        validRange: calendarValidRange.value,
        firstDay: calendarFirstDay.value,
        slotMinTime: earliestGameTime.value,
        slotMaxTime: latestGameTime.value,
        height: 'auto',
        stickyHeaderDates: true,
        eventColor: 'transparent',
        eventBorderColor: 'transparent',
        customButtons: {
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
                dateAlignment: 'week'
            },
            timeGridDay: {
                ...commonDayOptions.value,
            },
        },
        datesSet: (info) => {
            currentViewType.value = info.view.type;
            currentViewDateYMD.value = format(info.start, 'yyyy-MM-dd', { in: tz(active_timezone.value) });
        },
        events: events.value,
    };
});

let stickyObserver: IntersectionObserver | null = null;

const observeStickyHeader = () => {
    const calendarRoot = calendarRef.value?.$el as HTMLElement | undefined;
    if (!calendarRoot) return;

    const stickyEl = calendarRoot.querySelector<HTMLElement>(
        '.fc-scrollgrid-section-header.fc-scrollgrid-section-sticky > *'
    );
    stickyObserver?.disconnect();
    stickyObserver = null;

    if (!stickyEl)
        return;

    if (smOrSmaller.value) {
        stickyEl.classList.remove('is-pinned');
        return;
    }

    stickyObserver = new IntersectionObserver(
        (entries) => {
            const entry = entries[0];
            if (!entry)
                return;
            const rootTop = entry.rootBounds?.top ?? 0;
            const isAtTop = entry.boundingClientRect.top <= rootTop + 1; // small tolerance
            const isPinnedToTop = isAtTop && entry.intersectionRatio < 1;
            entry.target.classList.toggle("is-pinned", isPinnedToTop);
        },
        { threshold: [1] }
    );
    stickyObserver.observe(stickyEl);
};

onMounted(() => {
    nextTick(() => {
        currentViewType.value = calendarRef.value?.getApi().view.type ?? currentViewType.value;
        syncTrackButtonClasses();
        observeStickyHeader();
    });
});

onBeforeUnmount(() => {
    stickyObserver?.disconnect();
    stickyObserver = null;
});

watch(smOrSmaller, (smOrSmallerNow) => {
    const api = calendarRef.value?.getApi();
    if (!api)
        return;

    if (smOrSmallerNow && api.view.type == 'timeGridWeek')
        api.changeView('timeGridDay', firstGameDateYMD.value);
    else if (!smOrSmallerNow && api.view.type != 'timeGridWeek')
        api.changeView('timeGridWeek', firstGameDateYMD.value);

    nextTick(() => {
        observeStickyHeader();
    });
});

watch([active_timezone, firstGameDateYMD, calendarWeekDuration], async () => {
    await nextTick();
    realignCalendarToFirstDay();
}, { flush: 'post' });

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
