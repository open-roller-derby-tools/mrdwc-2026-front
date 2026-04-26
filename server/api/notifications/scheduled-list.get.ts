import { getDb } from "../../utils/dbClient";

// Get all Scheduled notifications
export default defineEventHandler(async () => {
	const db = getDb();
	await db.connect();

	const result = await db.query(`
    SELECT id, channel_id, title, body, scheduled_at, created_at
    FROM notifications WHERE scheduled_at IS NOT NULL
    ORDER BY created_at DESC
  `);

	return result.rows;
});
