<template>
	<div class="bg-blue-text pt-6">
		<div v-if="isDev" class="maxed padded mb-8">
			<SimulateGamesToggle />
		</div>
		<div :class="wrapperClass" class="padded sm:mx-auto pb-8">
			<FullCalendar ref="calendarRef" :options="calendarOptions">
				<template #eventContent="arg">
					<CalendarGame v-if="arg.event.extendedProps.game" :event="arg.event" />
					<CalendarEvent v-else :event="arg.event" />
				</template>
				<template #dayHeaderContent="arg">
					<p class="mb-4">{{ arg.text }}</p>
				</template>
			</FullCalendar>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { CalendarOptions } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import {
	addDays,
	addMinutes,
	differenceInCalendarDays,
	endOfHour,
	format,
	isAfter,
	isBefore,
} from "date-fns";
import { TZDate, tz } from "@date-fns/tz";

import { useGamesStore } from "~/stores/games";
import { useEventsStore } from "~/stores/events";
import { useVenuesStore } from "~/stores/venues";
import { getGameEndTime } from "~/utils/game";
import { GameDuration } from "~~/types/games";

import CalendarGame from "~/components/partials/games/CalendarGame.vue";
import CalendarEvent from "~/components/partials/games/CalendarEvent.vue";
import SimulateGamesToggle from "~/components/navigation/SimulateGamesToggle.vue";

const { locale, t } = useI18n();
const gamesStore = useGamesStore();
const venuesStore = useVenuesStore();
const eventsStore = useEventsStore();
const { smOrSmaller } = useResponsive();
const { active_timezone } = useTimezone();

const isDev = import.meta.dev;

useGamesAutoRefresh({ intervalMs: 60000 });

const WC_DATES = ["2026-04-30", "2026-05-01", "2026-05-02", "2026-05-03"] as const;
const END_DATE = "2026-05-04";

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

const firstEventDate = computed<TZDate>(() => {
	const date = gamesStore.gamesData?.[0]?.start_time ?? null;
	let result = !date
		? new TZDate(`${WC_DATES[0]}T09:00:00+02:00`, active_timezone.value)
		: new TZDate(date, active_timezone.value);

	for (const event of eventsStore.localizedEvents) {
		const eventDate = new TZDate(event.start_time, active_timezone.value);
		if (isBefore(eventDate, result)) {
			result = eventDate;
		}
	}

	return result;
});
const firstEventDateYMD = computed(() => {
	return format(firstEventDate.value, "yyyy-MM-dd", {
		in: tz(active_timezone.value),
	});
});

const lastEventDate = computed<TZDate>(() => {
	const date = gamesStore.gamesData?.[gamesStore.gamesData.length - 1]?.start_time ?? null;
	let result = !date
		? new TZDate(`${WC_DATES[WC_DATES.length - 1]}T22:00:00+02:00`, active_timezone.value)
		: new TZDate(date, active_timezone.value);

	for (const event of eventsStore.localizedEvents) {
		const eventDate = new TZDate(event.start_time, active_timezone.value);
		if (isAfter(eventDate, result)) {
			result = eventDate;
		}
	}

	return result;
});

const dateAfterLastEvent = computed<TZDate>(() => {
	if (!lastEventDate.value) return new TZDate(`${END_DATE}T12:00:00+02:00`, active_timezone.value);
	return addDays(lastEventDate.value, 1) as TZDate;
});
const dateAfterLastEventYMD = computed(() => {
	return format(dateAfterLastEvent.value, "yyyy-MM-dd", {
		in: tz(active_timezone.value),
	});
});

const calendarFirstDay = computed<number>(() => {
	const isoWeekDay = Number(format(firstEventDate.value, "i", { in: tz(active_timezone.value) }));
	return isoWeekDay === 7 ? 0 : isoWeekDay;
});
const calendarWeekDuration = computed<number>(() => {
	return Math.max(1, differenceInCalendarDays(dateAfterLastEvent.value, firstEventDate.value));
});
const calendarValidRange = computed(() => {
	return {
		start: firstEventDateYMD.value,
		end: dateAfterLastEventYMD.value,
	};
});

const earliestEventTime = computed(() => {
	const activeTz = tz(active_timezone.value);
	const allGames = gamesStore.gamesData ?? [];
	const relevantGames =
		currentViewType.value === "timeGridDay"
			? allGames.filter((game) => {
					const gameDay = format(new TZDate(game.start_time, active_timezone.value), "yyyy-MM-dd", {
						in: activeTz,
					});
					return gameDay === currentViewDateYMD.value;
				})
			: allGames;

	const allEvents = eventsStore.localizedEvents;
	const relevantEvents =
		currentViewType.value === "timeGridDay"
			? allEvents.filter((event) => {
					const eventDay = format(
						new TZDate(event.start_time, active_timezone.value),
						"yyyy-MM-dd",
						{ in: activeTz }
					);
					return eventDay === currentViewDateYMD.value;
				})
			: allEvents;

	let earliestEventTimeOfDay: TZDate | null = null;

	relevantGames.forEach((game) => {
		const gameDate = new TZDate(game.start_time, active_timezone.value);
		const hour = Number(format(gameDate, "HH", { in: activeTz }));
		const minute = Number(format(gameDate, "mm", { in: activeTz }));
		const normalizedGameTime = new TZDate(2000, 0, 1, hour, minute, 0, active_timezone.value);

		if (!earliestEventTimeOfDay || isBefore(normalizedGameTime, earliestEventTimeOfDay))
			earliestEventTimeOfDay = normalizedGameTime;
	});

	relevantEvents.forEach((event) => {
		const eventDate = new TZDate(event.start_time, active_timezone.value);
		const hour = Number(format(eventDate, "HH", { in: activeTz }));
		const minute = Number(format(eventDate, "mm", { in: activeTz }));
		const normalizedEventTime = new TZDate(2000, 0, 1, hour, minute, 0, active_timezone.value);

		if (!earliestEventTimeOfDay || isBefore(normalizedEventTime, earliestEventTimeOfDay))
			earliestEventTimeOfDay = normalizedEventTime;
	});

	if (!earliestEventTimeOfDay) return "00:00";
	return format(earliestEventTimeOfDay, "HH:mm", { in: activeTz });
});

const latestEventTime = computed(() => {
	const activeTz = tz(active_timezone.value);
	const allGames = gamesStore.gamesData ?? [];
	const relevantGames =
		currentViewType.value === "timeGridDay"
			? allGames.filter((game) => {
					const gameDay = format(new TZDate(game.start_time, active_timezone.value), "yyyy-MM-dd", {
						in: activeTz,
					});
					return gameDay === currentViewDateYMD.value;
				})
			: allGames;

	const allEvents = eventsStore.localizedEvents;
	const relevantEvents =
		currentViewType.value === "timeGridDay"
			? allEvents.filter((event) => {
					const eventDay = format(
						new TZDate(event.start_time, active_timezone.value),
						"yyyy-MM-dd",
						{ in: activeTz }
					);
					return eventDay === currentViewDateYMD.value;
				})
			: allEvents;

	let latestGameEndOfDay: TZDate | null = null;

	for (const game of relevantGames) {
		const gameDate = new TZDate(game.start_time, active_timezone.value);
		const hour = Number(format(gameDate, "HH", { in: activeTz }));
		const minute = Number(format(gameDate, "mm", { in: activeTz }));
		const normalizedStart = new TZDate(2000, 0, 1, hour, minute, 0, active_timezone.value);

		const durationMinutes = game.duration === GameDuration.TwoXFifteen ? 45 : 90;

		const normalizedEnd = addMinutes(normalizedStart, durationMinutes);

		if (format(normalizedEnd, "yyyy-MM-dd", { in: activeTz }) !== "2000-01-01") {
			return "24:00";
		}

		if (!latestGameEndOfDay || isAfter(normalizedEnd, latestGameEndOfDay)) {
			latestGameEndOfDay = normalizedEnd;
		}
	}

	let best: TZDate | null = null;

	if (latestGameEndOfDay) {
		best = latestGameEndOfDay;
	}

	relevantEvents.forEach((event) => {
		const endDate = new TZDate(event.end_time, active_timezone.value);
		const hour = Number(format(endDate, "HH", { in: activeTz }));
		const minute = Number(format(endDate, "mm", { in: activeTz }));
		const normalizedEndTime = new TZDate(2000, 0, 1, hour, minute, 0, active_timezone.value);

		if (!best || isAfter(normalizedEndTime, best)) {
			best = normalizedEndTime;
		}
	});

	if (!best) return "24:00";

	const atEndOfHour = endOfHour(best, { in: activeTz });
	if (format(atEndOfHour, "yyyy-MM-dd", { in: activeTz }) !== "2000-01-01") {
		return "24:00";
	}
	return format(atEndOfHour, "HH:mm", { in: activeTz });
});

const events = computed(() => {
	// Get games filtered by selected track
	const filteredGames =
		gamesStore.gamesData?.filter((game) => {
			if (selectedTrackId.value === 0) return true;
			return game.venue === selectedTrackId.value;
		}) ?? [];

	// Map games to calendar events
	const mappedGames =
		filteredGames.map((game) => {
			return {
				title: `Game ${game.number}`,
				start: game.start_time,
				end: getGameEndTime(game.start_time, game.duration),
				game: game,
			};
		}) ?? [];

	// Get and map other events
	const events = eventsStore.localizedEvents;

	const mappedEvents =
		events.map((event) => {
			return {
				title: event.name,
				start: event.start_time,
				end: event.end_time,
				event: event,
			};
		}) ?? [];

	return [...mappedGames, ...mappedEvents];
});

const trackButtons = computed(() => {
	return Object.fromEntries(
		venuesStore.localizedVenues.map((venue, index) => [
			`track_${venue.id}`,
			{
				text: t("calendar_track_short", { index: index + 1 }),
				click: () => {
					selectedTrackId.value = venue.id;
				},
			},
		])
	);
});

const trackButtonNames = computed(() => {
	return ["allGames", ...Object.keys(trackButtons.value)];
});

const trackToolbarButtons = computed(() => {
	return trackButtonNames.value.join(",");
});

const selectedTrackId = ref(0);
const currentViewType = ref(smOrSmaller.value ? "dayOne" : "timeGridWeek");
const currentViewDateYMD = ref(firstEventDateYMD.value);

const wrapperClass = computed(() => {
	if (currentViewType.value === "timeGridWeek") return "calendar-week-view sm:max-w-screen-2xl";
	else return "calendar-day-view sm:max-w-5xl";
});

const getTrackButtonName = (trackId: number) => {
	return trackId === 0 ? "allGames" : `track_${trackId}`;
};

const syncTrackButtonClasses = () => {
	const calendarRoot = calendarRef.value?.$el as HTMLElement | undefined;
	if (!calendarRoot) return;

	const activeButtonName = getTrackButtonName(selectedTrackId.value);

	trackButtonNames.value.forEach((buttonName) => {
		const buttonEl = calendarRoot.querySelector<HTMLElement>(`.fc-${buttonName}-button`);
		if (!buttonEl) return;

		const isActive = buttonName === activeButtonName;
		buttonEl.classList.add("fc-track-btn");
		buttonEl.classList.toggle("fc-track-btn-active", isActive);
		buttonEl.classList.toggle("fc-track-btn-inactive", !isActive);
	});
};

const realignCalendarToFirstDay = () => {
	const api = calendarRef.value?.getApi();
	if (!api) return;
	if (api.view.type !== "timeGridWeek") return;
	api.gotoDate(firstEventDateYMD.value);
	api.updateSize();
};

const commonTimeGridOptions = computed(() => ({
	allDaySlot: false,
	slotDuration: "00:30:00",
	slotEventOverlap: false,
	nowIndicator: true,
	dayHeaderFormat: {
		weekday: "long",
		month: "numeric",
		day: "numeric",
		omitCommas: true,
	} as const,
	slotLabelFormat: {
		hour: "numeric",
		minute: "2-digit",
		omitZeroMinute: true,
		meridiem: "short",
	} as const,
	duration: { days: calendarWeekDuration.value },
}));

const commonDayOptions = computed(() => ({
	...commonTimeGridOptions.value,
	type: "timeGrid",
	duration: { days: 1 },
}));

const calendarOptions = computed<CalendarOptions>(() => {
	const viewButtons = smOrSmaller.value ? "timeGridDay" : "timeGridWeek,timeGridDay";

	return {
		locale: locale.value,
		timeZone: active_timezone.value,
		plugins: [dayGridPlugin, timeGridPlugin, momentTimezonePlugin],
		headerToolbar: {
			start: viewButtons,
			center: "prev,next",
			end: trackToolbarButtons.value,
		},
		buttonText: {
			timeGridWeek: t("calendar.week"),
			timeGridDay: t("calendar.day"),
		},
		initialView: smOrSmaller.value ? "timeGridDay" : "timeGridWeek",
		initialDate: firstEventDateYMD.value,
		validRange: calendarValidRange.value,
		firstDay: calendarFirstDay.value,
		slotMinTime: earliestEventTime.value,
		slotMaxTime: latestEventTime.value,
		height: "auto",
		stickyHeaderDates: true,
		eventColor: "transparent",
		eventBorderColor: "transparent",
		customButtons: {
			allGames: {
				text: t("calendar_track_all"),
				click: () => {
					selectedTrackId.value = 0;
				},
			},
			...trackButtons.value,
		},
		views: {
			timeGridWeek: {
				...commonTimeGridOptions.value,
				dateAlignment: "week",
			},
			timeGridDay: {
				...commonDayOptions.value,
			},
		},
		datesSet: (info) => {
			currentViewType.value = info.view.type;
			currentViewDateYMD.value = format(info.start, "yyyy-MM-dd", {
				in: tz(active_timezone.value),
			});
		},
		events: events.value,
	};
});

let stickyObserver: IntersectionObserver | null = null;

const observeStickyHeader = () => {
	const calendarRoot = calendarRef.value?.$el as HTMLElement | undefined;
	if (!calendarRoot) return;

	const stickyEl = calendarRoot.querySelector<HTMLElement>(
		".fc-scrollgrid-section-header.fc-scrollgrid-section-sticky > *"
	);
	stickyObserver?.disconnect();
	stickyObserver = null;

	if (!stickyEl) return;

	if (smOrSmaller.value) {
		stickyEl.classList.remove("is-pinned");
		return;
	}

	stickyObserver = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];
			if (!entry) return;
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
	eventsStore.fetch();
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
	if (!api) return;

	if (smOrSmallerNow && api.view.type == "timeGridWeek")
		api.changeView("timeGridDay", firstEventDateYMD.value);
	else if (!smOrSmallerNow && api.view.type != "timeGridWeek")
		api.changeView("timeGridWeek", firstEventDateYMD.value);

	nextTick(() => {
		observeStickyHeader();
	});
});

watch(
	[active_timezone, firstEventDateYMD, calendarWeekDuration],
	async () => {
		await nextTick();
		realignCalendarToFirstDay();
	},
	{ flush: "post" }
);

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
