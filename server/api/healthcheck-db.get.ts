import { Client } from "pg";
import Redis from "ioredis";

function redactUrl(url: string): string {
	return url.replace(/:[^:@/]+@/, ":****@");
}

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const results: Record<
		string,
		{ status: string; error?: string; details?: string; url?: string; responseTimeMs?: number }
	> = {};
	let allHealthy = true;

	// Check PostgreSQL
	const pgStart = Date.now();
	try {
		const client = new Client({ connectionString: config.databaseUrl });
		await client.connect();
		const res = await client.query("SELECT NOW() AS current_time");
		await client.end();
		results.postgres = {
			status: "ok",
			details: `Connected at ${res.rows[0].current_time}`,
			url: redactUrl(config.databaseUrl),
			responseTimeMs: Date.now() - pgStart,
		};
	} catch (err: unknown) {
		allHealthy = false;
		const message = err instanceof Error ? err.message : String(err);
		results.postgres = {
			status: "error",
			error: message || `Unknown error (${typeof err}: ${JSON.stringify(err)})`,
			url: redactUrl(config.databaseUrl),
			responseTimeMs: Date.now() - pgStart,
		};
	}

	// Check Redis
	let redis: Redis | null = null;
	const redisStart = Date.now();
	try {
		redis = new Redis(config.redisUrl, {
			lazyConnect: true,
			connectTimeout: 5000,
			retryStrategy: () => null,
		});
		await redis.connect();
		const pong = await redis.ping();
		await redis.quit();
		results.redis = {
			status: "ok",
			details: `PING → ${pong}`,
			url: redactUrl(config.redisUrl),
			responseTimeMs: Date.now() - redisStart,
		};
	} catch (err: unknown) {
		allHealthy = false;
		redis?.disconnect();
		const message = err instanceof Error ? err.message : String(err);
		results.redis = {
			status: "error",
			error: message || `Unknown error (${typeof err}: ${JSON.stringify(err)})`,
			url: redactUrl(config.redisUrl),
			responseTimeMs: Date.now() - redisStart,
		};
	}

	setResponseStatus(event, allHealthy ? 200 : 503);

	return {
		status: allHealthy ? "ready" : "degraded",
		services: results,
	};
});
