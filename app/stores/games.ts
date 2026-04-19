/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import { GameState, GameType, type IGame } from "~~/types/games";
import { useGroupsStore } from "./groups";

type IGamesRequestData = {
  data: IGame[];
};

export const useGamesStore = defineStore("games", () => {
  const groupsStore = useGroupsStore();
  const teamsStore = useTeamsStore();
  const isReady = ref<boolean>(false);
  const games = ref<IGame[] | null>(null);
  const inFlight = ref<Promise<IGame[]> | null>(null);
  const simulatedGames = ref<IGame[] | null>(null);
  const useSimulatedGames = ref(false);

  function getTournamentGroupIdForGame(game: IGame): number | null {
    const homeGroup = groupsStore.groups?.find((group) =>
      group.teams.includes(game.home_team ?? -1),
    );
    const awayGroup = groupsStore.groups?.find((group) =>
      group.teams.includes(game.away_team ?? -1),
    );

    if (homeGroup && awayGroup && homeGroup.id === awayGroup.id) {
      return homeGroup.id;
    }

    return null;
  }

  async function fetch(options: { force?: boolean } = {}) {
    const force = options.force === true;
    if (!force && isReady.value && games.value != null) return games.value;
    if (inFlight.value) return inFlight.value;

    const request = (async () => {
      try {
        if (!groupsStore.isReady || groupsStore.groups == null) {
          await groupsStore.fetch();
        }

        if (!teamsStore.isReady || teamsStore.teams == null) {
          await teamsStore.fetch();
        }

        const fields = {
          id: true,
          number: true,
          sort: true,
          start_time: true,
          duration: true,
          venue: true,
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

        // Regular fetch from the API
        const { data } = await $fetch<IGamesRequestData>(
          buildRESTURL("games", fields).href,
        );

        // Add the event timezone to the start_time
        data.forEach((game) => {
          game.start_time = game.start_time + "+02:00";
          game.tournament_group = getTournamentGroupIdForGame(game);
        });

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
    return gamesData.value?.find((game) => game.number === n);
  }

  // Games grouped by team

  function getGamesByTeam(teamId: number): IGame[] {
    return (
      gamesData.value?.filter(
        (game) => game.home_team === teamId || game.away_team === teamId,
      ) ?? []
    );
  }

  // Games grouped by date

  const gamesGroupedByDate = computed((): Record<string, IGame[]> => {
    return (
      gamesData.value?.reduce(
        (acc, game) => {
          const date = game.start_time.split("T")[0] ?? "unknown";
          acc[date] = [...(acc[date] || []), game];
          return acc;
        },
        {} as Record<string, IGame[]>,
      ) ?? {}
    );
  });

  const gamesGroupedByGroup = computed((): Record<string, IGame[]> => {
    return (
      gamesData.value?.reduce(
        (acc, game) => {
          const group = game.tournament_group?.toString() ?? "unknown";
          acc[group] = [...(acc[group] || []), game];
          return acc;
        },
        {} as Record<string, IGame[]>,
      ) ?? {}
    );
  });

  function getGamesByGroup(group: number): IGame[] {
    return (
      gamesData.value?.filter((game) => game.tournament_group === group) ?? []
    );
  }

  function toggleSimulatedGames(allFinished: boolean = false) {
    useSimulatedGames.value = !useSimulatedGames.value;

    if (useSimulatedGames.value) {
      const baseGames = games.value ?? [];
      simulatedGames.value = baseGames.map((game) => {
        if (
          game.type !== GameType.GroupsStage &&
          game.type !== GameType.RankingsPlay
        ) {
          return { ...game };
        }
        const modifiedGame = { ...game };
        // Assign random teams for rankings play games
        if (modifiedGame.type === GameType.RankingsPlay) {
          modifiedGame.home_team = teamsStore.getRandomTeam()?.id ?? null;
          modifiedGame.away_team = teamsStore.getRandomTeam()?.id ?? null;
        }
        if (allFinished) {
          modifiedGame.state = GameState.Finished;
          modifiedGame.home_score = Math.floor(Math.random() * 400);
          modifiedGame.away_score = Math.floor(Math.random() * 400);
          if (Math.random() < 0.666) {
            modifiedGame.video_url =
              "https://youtu.be/TwWmwPWxVYE?list=PLrMPTi78zARnVChE9djRevH59tVqbtdTe";
          }
        } else {
          let rand = Math.floor(Math.random() * 10);
          if (rand < 2) {
            modifiedGame.state = GameState.InProgressP1;
            modifiedGame.home_score = Math.floor(Math.random() * 100);
            modifiedGame.away_score = Math.floor(Math.random() * 100);
          } else if (rand < 4) {
            modifiedGame.state = GameState.HalfTime;
            modifiedGame.home_score = Math.floor(Math.random() * 200);
            modifiedGame.away_score = Math.floor(Math.random() * 200);
          } else if (rand < 6) {
            modifiedGame.state = GameState.InProgressP2;
            modifiedGame.home_score = Math.floor(Math.random() * 300);
            modifiedGame.away_score = Math.floor(Math.random() * 300);
          } else if (rand < 8) {
            modifiedGame.state = GameState.Finished;
            modifiedGame.home_score = Math.floor(Math.random() * 400);
            modifiedGame.away_score = Math.floor(Math.random() * 400);
            if (Math.random() < 0.5) {
              modifiedGame.video_url =
                "https://youtu.be/TwWmwPWxVYE?list=PLrMPTi78zARnVChE9djRevH59tVqbtdTe";
            }
          }
        }
        return modifiedGame;
      });
    } else {
      simulatedGames.value = null;
    }
  }

  const gamesData = computed(() => {
    return useSimulatedGames.value ? simulatedGames.value : games.value;
  });

  return {
    fetch,
    refresh,
    isReady,
    games,
    gamesData,
    useSimulatedGames,
    toggleSimulatedGames,
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
    getGamesByTeam,
    gamesGroupedByDate,
    gamesGroupedByGroup,
    getGamesByGroup,
  };
});
