import { getDb } from "../../utils/dbClient";
import { defaultScheduledNotifications } from "~~/server/utils/notifications-helpers";
import type { IGame } from "~~/types/games";
import type { ILocalizedTeam } from "~~/types/teams";
import type { ILocalizedVenue } from "~~/types/custom";

// UTC time + offsetMinutes
function addOffsetUtc(dateString: string, offSetMinutes: number) {
	const d = new Date(dateString); // ex: "2026-04-26T18:00:00+02:00"
	const utcTs = d.getTime();
	return new Date(utcTs + offSetMinutes * 60000); // Stay in UTC
}

// Render template or return null if missing data
function renderGameTemplate(
	template: string,
	game: IGame,
	teamsById: Record<string, ILocalizedTeam>,
	venuesById: Record<string, ILocalizedVenue>
) {
	const team1 = game.home_team ? teamsById[game.home_team]?.country : null;
	const team2 = game.away_team ? teamsById[game.away_team]?.country : null;
	const track = game.venue ? venuesById[game.venue]?.name : null;

	// return body = null if any field is missing
	if (!team1 || !team2 || !track) return null;

	return template
		.replace("{{team1}}", team1)
		.replace("{{team2}}", team2)
		.replace("{{track}}", track);
}

export default defineEventHandler(async (event) => {
	const { games, teams, venues } = await readBody(event);

	if (!games?.length) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing games array",
		});
	}

	// Build dictionaries for quick lookup
	const teamsById = Object.fromEntries(teams.map((t: any) => [t.id, t]));
	const venuesById = Object.fromEntries(venues.map((v: any) => [v.id, v]));

	const db = getDb();
	await db.connect();

	try {
		await db.query("BEGIN");

		// Create "Global" channel
		await db.query(
			`
        INSERT INTO channels (name, slug, type)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO NOTHING
        `,
			["Official news", "global", "global"]
		);
		// Create "Local" channel
		await db.query(
			`
				INSERT INTO channels (name, slug, type)
				VALUES ($1, $2, $3)
					ON CONFLICT (slug) DO NOTHING
			`,
			["At the venue", "local", "local"]
		);
		// Create channel game_*
		for (const game of games) {
			const slug = `game_${game.id}`;
			const channelName = `Game #${game.number}`;

			await db.query(
				`
        INSERT INTO channels (name, slug, type)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO NOTHING
        `,
				[channelName, slug, "game"]
			);
		}

		// Scheduled notifications
		for (const game of games) {
			const slug = `game_${game.id}`;

			const channel = await db.query(`SELECT id FROM channels WHERE slug = $1`, [slug]);

			if (channel.rowCount === 0) continue;

			const channelId = channel.rows[0].id;

			for (const nt of defaultScheduledNotifications) {
				const scheduledAt = addOffsetUtc(game.start_time, nt.offsetMinutes);
				// Check if notification already exists
				const exists = await db.query(
					`
          SELECT 1 FROM notifications
          WHERE channel_id = $1
          AND title = $2
          AND scheduled_at = $3
          `,
					[channelId, nt.title, scheduledAt]
				);

				if (exists.rows.length > 0) continue;
				// Render template (or null)
				const renderedBody = renderGameTemplate(nt.body, game, teamsById, venuesById);
				// Insert notification
				await db.query(
					`
          INSERT INTO notifications (channel_id, title, body, data, scheduled_at)
          VALUES ($1, $2, $3, $4, $5)
          `,
					[channelId, nt.title, renderedBody, {}, scheduledAt]
				);
			}
		}

		await db.query("COMMIT");

		return { ok: true };
	} catch (err) {
		await db.query("ROLLBACK");
		console.error("Init DB failed:", err);
		throw createError({
			statusCode: 500,
			statusMessage: "Database initialization failed",
		});
	}
});
