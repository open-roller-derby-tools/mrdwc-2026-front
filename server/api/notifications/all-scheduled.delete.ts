import { getDb } from "../../utils/dbClient";

// Delete scheduled notifications
export default defineEventHandler(async (event) => {
	const db = getDb();
	await db.connect();

	// Delete channels
	const result = await db.query(`DELETE FROM notifications WHERE scheduled_at IS NOT NULL`);

	if (result.rowCount === 0) {
		throw createError({ statusCode: 404, statusMessage: "No scheduled notification found" });
	}

	return {
		ok: true,
		deleted: result.rowCount,
	};
});
