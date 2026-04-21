import { GameType, type IGame } from "~~/types/games";
import type { ILocalizedTeam } from "~~/types/teams";
import { useTeamsStore } from "~/stores/teams";

export function useGameFormatting() {
	const teamsStore = useTeamsStore();
	const { isNoSpoilerModeActive } = useNoSpoilerMode();

	function getTeam(game: IGame, team: "home" | "away"): ILocalizedTeam | null {
		const isSpoiler = isGameSpoiler(game);
		if (isSpoiler && isNoSpoilerModeActive.value) return null;

		const teamId = team === "home" ? game.home_team : game.away_team;
		if (teamId === null) return null;

		return teamsStore.getTeamById(teamId);
	}

	function getTeamName(
		game: IGame,
		team: "home" | "away",
		short: boolean = true,
		fallback: string | null
	) {
		// Spoiler status
		const isSpoiler = isGameSpoiler(game);

		// If the game is a spoiler and the no spoiler mode is active, return the fallback
		if (isSpoiler && isNoSpoilerModeActive.value) return fallback ?? "---";

		// If home team is defined, return the team name
		if (team === "home" && game.home_team !== null) {
			if (short) return teamsStore.getTeamById(game.home_team)?.name_letters ?? fallback ?? "---";
			else return teamsStore.getTeamById(game.home_team)?.name ?? fallback ?? "---";
		}
		// If away team is defined, return the team name
		else if (team === "away" && game.away_team !== null) {
			if (short) return teamsStore.getTeamById(game.away_team)?.name_letters ?? fallback ?? "---";
			else return teamsStore.getTeamById(game.away_team)?.name ?? fallback ?? "---";
		}
		return fallback ?? "---";
	}

	function getTeamColors(
		game: IGame,
		team: "home" | "away",
		schedule: boolean = false
	): { backgroundColor: string; color: string; borderColor: string } {
		// Spoiler status
		const isSpoiler = isGameSpoiler(game);
		// Default colors
		const colors = {
			backgroundColor: team === "home" ? "var(--color-home)" : "var(--color-away)",
			color: "#000000",
			borderColor: "#000000",
		};

		// If the game is a spoiler and the no spoiler mode is active, return the default colors
		if (isSpoiler && isNoSpoilerModeActive.value) {
			colors.color = getContrastingTextColor(colors.backgroundColor);
			colors.borderColor = colors.color;
			return colors;
		}

		// If the game is not a spoiler and the team is defined, use the team colors from Directus
		if (team === "home" && game.home_team !== null) {
			if (schedule) {
				colors.backgroundColor =
					teamsStore.getTeamById(game.home_team)?.schedule_color ?? game.home_color;
			} else {
				colors.backgroundColor = game.home_color;
			}
		} else if (team === "away" && game.away_team !== null) {
			if (schedule) {
				colors.backgroundColor =
					teamsStore.getTeamById(game.away_team)?.schedule_color ?? game.away_color;
			} else {
				colors.backgroundColor = game.away_color;
			}
		}
		colors.color = getContrastingTextColor(colors.backgroundColor);
		colors.borderColor = colors.color;
		return colors;
	}

	function isGameSpoiler(game: IGame): boolean {
		return game.type !== GameType.GroupsStage;
	}

	return {
		getTeam,
		getTeamName,
		getTeamColors,
		isGameSpoiler,
	};
}
