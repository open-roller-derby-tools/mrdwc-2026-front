import { getDb } from "../../utils/dbClient";
import type { IGame, IGamesRequestData } from "~~/types/games";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { user_id, team_id } = body;

	if (!user_id || !team_id) {
		throw createError({ statusCode: 400, statusMessage: "Missing user_id or team_id" });
	}

	const db = getDb();
	await db.connect();

	// Add the team subscription
	await db.query(
		`
    INSERT INTO team_subscriptions (user_id, team_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
		[user_id, team_id]
	);

	// Also subscribe the user to all channels related to the team
	// Fetch all games where this team plays
	const games: IGamesRequestData = await $fetch(`${process.env.NUXT_PUBLIC_API_BASE}/items/games`, {
		query: {
			filter: JSON.stringify({
				_or: [{ home_team: { _eq: team_id } }, { away_team: { _eq: team_id } }],
			}),
			fields: "id",
		},
	});
	for (const game of games.data) {
		const slug = `game_${game.id}`;
		// Get the channel id of the game
		const channelRes = await db.query(`SELECT id FROM channels WHERE slug = $1`, [slug]);
		// Add subscription for this channel
		if (channelRes.rows.length > 0) {
			await db.query(
				`INSERT INTO subscriptions (user_id, channel_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
				[user_id, channelRes.rows[0].id]
			);
		}
	}
	return { success: true };
});
