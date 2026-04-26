import { Worker, Queue } from "bullmq";
import { getDb } from "../utils/dbClient";
import { notificationQueue } from "../utils/queue";
import { ILocalizedTeam } from "~~/types/teams";
import { $fetch } from "ofetch";
import { IGame } from "~~/types/games";
import { IVenue } from "~~/types/custom";
import { defaultScheduledNotifications } from "~~/server/utils/notifications-helpers";

const scheduledTemplates = Object.fromEntries(
	defaultScheduledNotifications.map((n) => [n.title, n.body])
);

function renderGameTemplate(template: string, team1: string, team2: string, track: string) {
	return template
		.replace("{{team1}}", team1)
		.replace("{{team2}}", team2)
		.replace("{{track}}", track);
}

function extractGameId(slug: string): number | null {
	if (!slug.startsWith("game_")) return null;

	const id = Number(slug.slice(5));
	return Number.isFinite(id) ? id : null;
}

async function fetchGame(id: number) {
	return await $fetch<IGame>(`${process.env.NUXT_PUBLIC_API_BASE}/items/games/${id}`, {
		query: {
			fields: ["id", "number", "venue", "home_team", "away_team"].join(","),
		},
	});
}

async function fetchTeam(id: number) {
	return await $fetch<ILocalizedTeam>(`${process.env.NUXT_PUBLIC_API_BASE}/items/teams/${id}`, {
		query: {
			fields: ["id", "name", "country"].join(","),
		},
	});
}

async function fetchVenue(id: number) {
	return await $fetch<IVenue>(`${process.env.NUXT_PUBLIC_API_BASE}/items/venues/${id}`, {
		query: {
			fields: ["id", "name"].join(","),
		},
	});
}

export default defineNitroPlugin(() => {
	// Scheduler queue
	const schedulerQueue = new Queue("scheduler", {
		connection: {
			host: process.env.REDIS_HOST ?? "localhost",
			port: Number(process.env.REDIS_PORT ?? 6379),
		},
	});

	// Add Scanning job to the queue
	schedulerQueue.add(
		"scan",
		{},
		{
			repeat: { every: 60_000 }, // Every minute
		}
	);

	// Worker for executing "scan" job
	const schedulerWorker = new Worker(
		"scheduler",
		async (job) => {
			console.log("[Scheduler] Scan running");
			const db = getDb();
			await db.connect();

			const res = await db.query(`
        SELECT *
        FROM notifications
        WHERE scheduled_at IS NOT NULL
        AND scheduled_at <= NOW()
        AND sent_at IS NULL
      `);

			if (res.rows.length === 0) {
				return { sent: 0 };
			}

			for (const row of res.rows) {
				// Find channel (for log info)
				const channelRes = await db.query(
					`SELECT id, slug, name, type FROM channels WHERE id = $1`,
					[row.channel_id]
				);
				const notification = row;
				let body: string | null = notification.body;
				const channel = channelRes.rows[0];

				// Generate notification body if null
				if ((!notification.body || notification.body.trim() === "") && channel.type === "game") {
					const gameId = extractGameId(channel.slug);
					if (gameId != null) {
						try {
							const game = await fetchGame(gameId);
							if (game.home_team != null && game.away_team != null && game.venue != null) {
								const [homeTeam, awayTeam, venue] = await Promise.all([
									fetchTeam(game.home_team),
									fetchTeam(game.away_team),
									fetchVenue(game.venue),
								]);
								// Extract data from directus
								const vars = {
									team1: homeTeam.country ?? homeTeam.name,
									team2: awayTeam.country ?? awayTeam.name,
									track: venue.name,
								};
								// Format notification body
								const template = scheduledTemplates[notification.title];
								const renderedBody = renderGameTemplate(
									template,
									vars.team1,
									vars.team2,
									vars.track
								);

								if (renderedBody && renderedBody.trim() !== "") {
									body = renderedBody;
									// Insert notification body
									await db.query(`UPDATE notifications SET body = $1 WHERE id = $2`, [
										renderedBody,
										notification.id,
									]);
									// Skipping sent because body is empty (will be reevaluated on next scan)
									if (!body || body.trim() === "") {
										console.warn(
											`[Scheduler] Skipping notification ${notification.id} because body is empty`
										);
										continue;
									}
									// Add channel to teams subscribers
									await db.query(
										`
								INSERT INTO user_subscriptions (user_id, channel_id)
								SELECT DISTINCT ts.user_id, $1
								FROM team_subscriptions ts
								WHERE ts.team_id = $2 OR ts.team_id = $3
								ON CONFLICT DO NOTHING
								`,
										[channel.id, game.home_team, game.away_team]
									);
								}
							}
						} catch (err) {
							console.error("[Scheduler] Failed to complete body from Directus:", err);
							// Keep body empty if fetch fails
						}
					}
				}

				await notificationQueue.add("send-notification", {
					notification_id: row.id,
					title: row.title,
					body: body,
					channel_id: channel.id,
					channel_name: channel.name,
					channel_slug: channel.slug,
					scheduled_at: row.scheduled_at,
					created_at: row.created_at,
				});
			}

			await job.log(`Scheduler sent ${res.rows.length} notifications`);
			// Populate scheduler data in bull dashboard
			return { sent: res.rows.length };
		},
		{
			connection: {
				host: process.env.REDIS_HOST ?? "localhost",
				port: Number(process.env.REDIS_PORT ?? 6379),
			},
		}
	);
	console.log("[Scheduler] Worker instantiated");
});
