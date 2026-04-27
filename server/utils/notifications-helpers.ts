// Notification types
import type { IChannel, NotificationCategory } from "~~/types/custom";

export const defaultScheduledNotifications = [
	{
		title: "Game is starting soon",
		body: "The game {{team1}} vs. {{team2}} will start soon on venue {{track}}",
		offsetMinutes: -10,
	},
	/*	{
			title: "Game has started",
			body: "The game {{team1}} vs. {{team2}} has started on venue {{track}}",
			offsetMinutes: 0,
		},*/
];

export function extractGameId(slug: string): number | null {
	if (!slug.startsWith("game_")) return null;

	const id = Number(slug.slice(5));
	return Number.isFinite(id) ? id : null;
}

export const redirectedUrl = (channelType: NotificationCategory, slug: string): string => {
	switch (channelType) {
		case "game":
			const gameId = extractGameId(slug);
			if (!gameId) throw new Error(`Invalid game slug: ${slug}`);
			return `/games/${gameId}`;
		case "local":
			return `/local/`;
		case "global":
			return `/`;
		default:
			return "/";
	}
};
