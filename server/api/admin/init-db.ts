import { getDb } from "../../utils/dbClient";

// Notification types
const defaultScheduledNotifications = [
	{
		title: "Game is starting soon",
		body: "The game {{team1}} vs. {{team2}} will start soon on venue {{track}}",
		offsetMinutes: -10,
	},
	{
		title: "Game has started",
		body: "The game {{team1}} vs. {{team2}} has started on venue {{track}}",
		offsetMinutes: 0,
	},
];

// UTC time + offsetMinutes
function addOffsetUtc(dateString: string, offSetMinutes: number) {
	const ts = Date.parse(dateString); // parse ISO → UTC
	return new Date(ts + offSetMinutes * 60000); // Stay in UTC
}

export default defineEventHandler(async (event) => {
	const { games } = await readBody(event);

	if (!games?.length) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing games array",
		});
	}

	const db = getDb();
	await db.connect();

	try {
		await db.query("BEGIN");

		// Create "Global" channel
		/*		await db.query(
			`
        INSERT INTO channels (slug, name, type, team_id_1, team_id_2)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO NOTHING
        `,
			["Global", "Official news", game.venue, game.home_team, game.away_team]
		);
		// Create "Local" channel
		await db.query(
			`
        INSERT INTO channels (slug, name, track, team_id_1, team_id_2)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO NOTHING
        `,
			[slug, channelName, game.venue, game.home_team, game.away_team]
		);*/
		// Create channel game_*
		for (const game of games) {
			const slug = `game_${game.id}`; // TODO check if should be game.number
			const channelName = game.description ?? `Game #${game.number}`; // TODO check if should be 'game team 1 vs team 2'

			await db.query(
				`
        INSERT INTO channels (slug, name, track, team_id_1, team_id_2)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO NOTHING
        `,
				[slug, channelName, game.venue, game.home_team, game.away_team]
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

				// Insert notification
				await db.query(
					`
          INSERT INTO notifications (channel_id, title, body, data, scheduled_at)
          VALUES ($1, $2, $3, $4, $5)
          `,
					[channelId, nt.title, nt.body, {}, scheduledAt]
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
