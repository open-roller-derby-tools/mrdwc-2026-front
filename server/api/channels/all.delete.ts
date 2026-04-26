import { getDb } from "../../utils/dbClient";

// Delete channels
export default defineEventHandler(async (event) => {
	const db = getDb();
	await db.connect();

	// Delete channels
	const result = await db.query(`DELETE FROM channels`);

	if (result.rowCount === 0) {
		throw createError({ statusCode: 404, statusMessage: "No channel found" });
	}

	return {
		ok: true,
		deleted: result.rowCount,
	};
});
