import { GameType, type IGame } from "~~/types/games";
import { useTeamsStore } from "~/stores/teams";

export function useGameFormatting() {
  const teamsStore = useTeamsStore();
  const { isNoSpoilerModeActive } = useNoSpoilerMode();

  function getTeamName(
    game: IGame,
    team: "home" | "away",
    short: boolean = true,
    fallback: string | null,
  ) {
    // Spoiler status
    const isSpoiler = isGameSpoiler(game);

    // If the game is a spoiler and the no spoiler mode is active, return the fallback
    if (isSpoiler && isNoSpoilerModeActive.value) return fallback ?? "---";

    // If home team is defined, return the team name
    if (team === "home" && game.home_team !== null) {
      if (short)
        return (
          teamsStore.getTeamById(game.home_team)?.name_letters ??
          fallback ??
          "---"
        );
      else
        return (
          teamsStore.getTeamById(game.home_team)?.name ?? fallback ?? "---"
        );
    }
    // If away team is defined, return the team name
    else if (team === "away" && game.away_team !== null) {
      if (short)
        return (
          teamsStore.getTeamById(game.away_team)?.name_letters ??
          fallback ??
          "---"
        );
      else
        return (
          teamsStore.getTeamById(game.away_team)?.name ?? fallback ?? "---"
        );
    }
    return fallback ?? "---";
  }

  function getTeamColors(
    game: IGame,
    team: "home" | "away",
  ): { backgroundColor: string; color: string } {
    // Spoiler status
    const isSpoiler = isGameSpoiler(game);
    // Default colors
    const colors = {
      backgroundColor:
        team === "home" ? "var(--color-home)" : "var(--color-away)",
      color: "#000000",
    };

    // If the game is a spoiler and the no spoiler mode is active, return the default colors
    if (isSpoiler && isNoSpoilerModeActive.value) {
      colors.color = getContrastingTextColor(colors.backgroundColor);
      return colors;
    }

    // If the game is not a spoiler and the team is defined, use the team colors from Directus
    if (team === "home" && game.home_team !== null) {
      colors.backgroundColor = game.home_color;
    } else if (team === "away" && game.away_team !== null) {
      colors.backgroundColor = game.away_color;
    }
    colors.color = getContrastingTextColor(colors.backgroundColor);
    return colors;
  }

  function isGameSpoiler(game: IGame): boolean {
    return game.type !== GameType.GroupsStage;
  }

  return {
    getTeamName,
    getTeamColors,
    isGameSpoiler,
  };
}
