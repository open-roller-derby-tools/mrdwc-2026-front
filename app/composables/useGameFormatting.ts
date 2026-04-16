import { GameType, type IGame } from "~~/types/games";
import { useTeamsStore } from "~/stores/teams";

export function useGameFormatting() {
	const teamsStore = useTeamsStore();
	const { isNoSpoilerModeActive } = useNoSpoilerMode();

	/**
	 * Get the 3-letters team name, with a fallback and a spoiler protection.
	 * If the team name is a spoiler and the no spoiler mode is active, return the fallback.
	 * @param teamId - The team ID.
	 * @param fallback - The fallback team name.
	 * @param isSpoiler - Whether the team name is a spoiler.
	 * @returns The 3-letters team name.
	 */
	function getTeamNameShort(teamId: number, fallback: string | null, isSpoiler: boolean = false) {
		if (isSpoiler && isNoSpoilerModeActive.value)
			return fallback ?? "---";

		return teamsStore.getTeamById(teamId)?.name_letters ?? fallback ?? "---";
	}

	/**
	 * Get the full team name, with a fallback and a spoiler protection.
	 * If the team name is a spoiler and the no spoiler mode is active, return the fallback.
	 * @param teamId - The team ID.
	 * @param fallback - The fallback team name.
	 * @param isSpoiler - Whether the team name is a spoiler.
	 * @returns The full team name.
	 */
	function getTeamName(teamId: number, fallback: string | null, isSpoiler: boolean = false) {
		if (isSpoiler && isNoSpoilerModeActive.value)
			return fallback ?? "---";

		return teamsStore.getTeamById(teamId)?.name ?? fallback ?? "---";
	}

	function getTeamColors(color: string, fallback: string | null, isSpoiler: boolean = false): { backgroundColor: string, color: string } {
		const colors = {
			backgroundColor: "#FFFFFF",
			color: "#000000",
		};
		if (isSpoiler && isNoSpoilerModeActive.value)
			colors.backgroundColor = fallback ?? "#FFFFFF";
		else
			colors.backgroundColor = color;

		colors.color = getContrastingTextColor(colors.backgroundColor);
		return colors;
	}

	function isGameSpoiler(game: IGame): boolean {
		return game.type !== GameType.GroupsStage;
	}

	return {
		getTeamNameShort,
		getTeamName,
		getTeamColors,
		isGameSpoiler,
	};
}
