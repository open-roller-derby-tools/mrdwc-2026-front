import { getDb } from "../../utils/dbClient";
import type { IGamesRequestData } from "~~/types/games";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { user_id, team_id } = body;

	if (!user_id || !team_id) {
		throw createError({ statusCode: 400, statusMessage: "Missing user_id or team_id" });
	}

	const db = getDb();
	await db.connect();

	// Delete the team subscription
	await db.query(
		`
    DELETE FROM team_subscriptions
    WHERE user_id = $1 AND team_id = $2
    `,
		[user_id, team_id]
	);

	// Also unsubscribe the user from all channels related to the team
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
		// Delete subscription for this channel
		if (channelRes.rows.length > 0) {
			await db.query(
				`DELETE FROM subscriptions
				 WHERE user_id = $1 AND channel_id = $2`,
				[user_id, channelRes.rows[0].id]
			);
		}
	}

	return { success: true };
});
