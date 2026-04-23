import { addMinutes, format, parseISO } from "date-fns";
import { GameDuration, GameState, type IGame } from "~~/types/games";
import { tz } from "@date-fns/tz";
import { useTimezone } from "~/composables/useTimezone";

const { active_timezone } = useTimezone();

export const GAME_WIDTH = 17; // rems
export const GAME_HEIGHT = 7; // rems
export const GAME_SPACING_X = 10; // rems
export const GAME_SPACING_Y = 1.5; // rems

export const getGameEndTime = (startTime: string, duration: GameDuration): string => {
	const parsedStart = parseISO(startTime, { in: tz(active_timezone.value) });
	const durationInMinutes = duration === GameDuration.TwoXFifteen ? 45 : 90;
	const endDate = addMinutes(parsedStart, durationInMinutes);
	return format(endDate, "yyyy-MM-dd'T'HH:mm:ss", {
		in: tz(active_timezone.value),
	});
};

export const isGameInProgress = (game: IGame): boolean => {
	return (
		game.state === GameState.InProgressP1 ||
		game.state === GameState.InProgressP2 ||
		game.state === GameState.HalfTime
	);
};

export const hasGameStarted = (game: IGame): boolean => {
	return (
		game.state === GameState.InProgressP1 ||
		game.state === GameState.InProgressP2 ||
		game.state === GameState.HalfTime ||
		game.state === GameState.Finished
	);
};

export const isGameFinished = (game: IGame): boolean => {
	return game.state === GameState.Finished;
};

export const hasHomeWon = (game: IGame): boolean => {
	return game.home_score > game.away_score;
};

export const hasAwayWon = (game: IGame): boolean => {
	return game.away_score > game.home_score;
};
