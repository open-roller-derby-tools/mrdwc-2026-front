/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import { GameState, GameType, type IGame } from "~~/types/games";

type IGamesRequestData = {
	data: IGame[];
};

export const useGamesStore = defineStore("games", () => {
	const config = useRuntimeConfig()

	const isReady = ref<boolean>(false);
	const games = ref<IGame[] | null>(null);
	const inFlight = ref<Promise<IGame[]> | null>(null);

	async function fetch(options: { force?: boolean } = {}) {
		const force = options.force === true;
		if (!force && isReady.value && games.value != null) return games.value;
		if (inFlight.value) return inFlight.value;

		const request = (async () => {
			try {
				const fields = {
					id: true,
					number: true,
					sort: true,
					start_time: true,
					duration: true,
					track: true,
					home_team: true,
					away_team: true,
					home_score: true,
					away_score: true,
					home_color: true,
					away_color: true,
					home_source: true,
					away_source: true,
					state: true,
					video_url: true,
					type: true,
					description: true,
				};

				// TODO Replace webhook access with regular API fetch when games data is ready to be public
				// Regular fetch from the API
				/* const { data } = await $fetch<IGamesRequestData>(
					buildRESTURL("games", fields).href
				);*/
				// Temporary webhook access
				const { data } = await $fetch<IGamesRequestData>(
					`https://worldcup-dashboard.mrda.org/flows/trigger/${config.public.gamesFlowId}`
				);

				// Sort games by start time.
				const sortedData = [...data].sort((a, b) => {
					const ta = Date.parse(a.start_time);
					const tb = Date.parse(b.start_time);
					const aValid = !Number.isNaN(ta);
					const bValid = !Number.isNaN(tb);

					if (aValid && bValid) {
						if (ta !== tb) return ta - tb;
						// Sort by game number for identical start_time
						return a.number - b.number;
					}
					// Fallback for unexpected date formats.
					return a.number - b.number;
				});

				games.value = sortedData;
				isReady.value = true;
				return sortedData;
			} catch (error) {
				console.error("Error fetching games:", error);
				// If we already have data, keep it (avoid blanking UI on transient failures).
				if (games.value == null) {
					isReady.value = false;
					games.value = null;
				}
				throw error;
			} finally {
				inFlight.value = null;
			}
		})();

		inFlight.value = request;
		return request;
	}

	async function refresh() {
		return fetch({ force: true });
	}

	// Game state getters

	const stateScheduledGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.state === GameState.Scheduled) ?? [];
	});
	const statePreGameGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.state === GameState.PreGame) ?? [];
	});
	const stateInProgressP1Games = computed((): IGame[] => {
		return games.value?.filter((g) => g.state === GameState.InProgressP1) ?? [];
	});
	const stateHalfTimeGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.state === GameState.HalfTime) ?? [];
	});
	const stateInProgressP2Games = computed((): IGame[] => {
		return games.value?.filter((g) => g.state === GameState.InProgressP2) ?? [];
	});
	const stateFinishedGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.state === GameState.Finished) ?? [];
	});
	const stateUnknownGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.state === GameState.Unknown) ?? [];
	});

	// Game type getters

	const typeGroupsStageGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.GroupsStage) ?? [];
	});
	const typeRankingsPlayGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.RankingsPlay) ?? [];
	});
	const typeTopEightGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.TopEight) ?? [];
	});
	const typeQuarterfinalsGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.Quarterfinals) ?? [];
	});
	const typeLowerTopEightGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.LowerTopEight) ?? [];
	});
	const typeUpperTopEightGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.UpperTopEight) ?? [];
	});
	const typeSemifinalsGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.Semifinals) ?? [];
	});
	const typeLowerFinalGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.LowerFinal) ?? [];
	});
	const typeGrandFinalGames = computed((): IGame[] => {
		return games.value?.filter((g) => g.type === GameType.GrandFinal) ?? [];
	});

	// Game by number

	function getGameByNumber(n: number): IGame | undefined {
		return games.value?.find((game) => game.number === n);
	}

	// Games grouped by date

	const gamesGroupedByDate = computed((): Record<string, IGame[]> => {
		return games.value?.reduce((acc, game) => {
			const date = game.start_time.split('T')[0] ?? 'unknown';
			acc[date] = [...(acc[date] || []), game];
			return acc;
		}, {} as Record<string, IGame[]>) ?? {};
	});

	return {
		fetch,
		refresh,
		isReady,
		games,
		stateScheduledGames,
		statePreGameGames,
		stateInProgressP1Games,
		stateHalfTimeGames,
		stateInProgressP2Games,
		stateFinishedGames,
		stateUnknownGames,
		typeGroupsStageGames,
		typeRankingsPlayGames,
		typeTopEightGames,
		typeQuarterfinalsGames,
		typeLowerTopEightGames,
		typeUpperTopEightGames,
		typeSemifinalsGames,
		typeLowerFinalGames,
		typeGrandFinalGames,
		getGameByNumber,
		gamesGroupedByDate,
	};
});

