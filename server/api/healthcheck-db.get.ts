import { Client } from "pg";
import Redis from "ioredis";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const results: Record<string, { status: string; error?: string; details?: string }> = {};
	let allHealthy = true;

	// Check PostgreSQL
	try {
		const client = new Client({ connectionString: config.databaseUrl });
		await client.connect();
		const res = await client.query("SELECT NOW() AS current_time");
		await client.end();
		results.postgres = {
			status: "ok",
			details: `Connected at ${res.rows[0].current_time}`,
		};
	} catch (err: unknown) {
		allHealthy = false;
		results.postgres = {
			status: "error",
			error: err instanceof Error ? err.message : String(err),
		};
	}

	// Check Redis
	try {
		const redis = new Redis(config.redisUrl, { lazyConnect: true, connectTimeout: 5000 });
		await redis.connect();
		const pong = await redis.ping();
		await redis.quit();
		results.redis = {
			status: "ok",
			details: `PING → ${pong}`,
		};
	} catch (err: unknown) {
		allHealthy = false;
		results.redis = {
			status: "error",
			error: err instanceof Error ? err.message : String(err),
		};
	}

	setResponseStatus(event, allHealthy ? 200 : 503);

	return {
		status: allHealthy ? "ready" : "degraded",
		services: results,
	};
});
