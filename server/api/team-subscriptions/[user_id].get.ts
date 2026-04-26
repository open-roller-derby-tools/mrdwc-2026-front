import { getDb } from "../../utils/dbClient";

export default defineEventHandler(async (event) => {
	const user_id = event.context.params?.user_id;
	if (!user_id) {
		throw createError({ statusCode: 400, statusMessage: "Missing user_id" });
	}

	const db = getDb();
	await db.connect();

	const result = await db.query(
		`
    SELECT team_id
    FROM team_subscriptions
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
		[user_id]
	);

	return result.rows;
});
