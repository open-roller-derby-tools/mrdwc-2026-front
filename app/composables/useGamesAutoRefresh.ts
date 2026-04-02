import { useGamesStore } from "~/stores/games";
import { useDocumentVisibility, useIntervalFn } from "@vueuse/core";

type UseGamesAutoRefreshOptions = {
	intervalMs?: number;
	immediate?: boolean;
	pauseWhenHidden?: boolean;
};

export function useGamesAutoRefresh(options: UseGamesAutoRefreshOptions = {}) {
	const { intervalMs = 60000, immediate = true, pauseWhenHidden = true } = options;
	const gamesStore = useGamesStore();

	const visibility = useDocumentVisibility();

	const interval = useIntervalFn(
		() => {
			void gamesStore.refresh();
		},
		intervalMs,
		{ immediate: false }
	);

	const stop = () => interval.pause();
	const start = () => interval.resume();

	const visibilityWatch = watch(
		visibility,
		(visibleNow, visibleBefore) => {
			if (!pauseWhenHidden)
				return;
			if (visibleNow !== "visible")
				stop();
			else {
				start();
				if (visibleBefore != null && visibleBefore !== "visible")
					void gamesStore.refresh();
			}
		},
		{ immediate: true }
	);

	onMounted(() => {
		if (immediate) void gamesStore.refresh();
		start();
	});

	onBeforeUnmount(() => {
		stop();
		visibilityWatch();
	});

	return { start, stop };
}

