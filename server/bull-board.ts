import express from "express";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { notificationQueue } from "./utils/queue";
import { Queue } from "bullmq";

const connection = {
	host: process.env.REDIS_HOST ?? "localhost",
	port: Number(process.env.REDIS_PORT ?? 6379),
};

export function startBullBoard() {
	const app = express();

	// Dedicated router
	const router = express.Router();

	// --- BASIC AUTH on router ---
	router.use((req, res, next) => {
		const auth = req.headers.authorization;

		if (!auth || !auth.startsWith("Basic ")) {
			res.setHeader("WWW-Authenticate", 'Basic realm="Bull Board"');
			return res.status(401).end();
		}

		const [user, pass] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");

		if (user !== "bullAdmin" || pass !== process.env.BULLBOARD_PASSWORD) {
			res.setHeader("WWW-Authenticate", 'Basic realm="Bull Board"');
			return res.status(401).end();
		}

		next();
	});

	const serverAdapter = new ExpressAdapter();
	serverAdapter.setBasePath("/admin/queues");

	createBullBoard({
		queues: [
			new BullMQAdapter(notificationQueue),
			new BullMQAdapter(new Queue("scheduler", { connection })),
		],
		serverAdapter,
	});

	// Mount Bull dashboard on dedicated router
	router.use("/", serverAdapter.getRouter());
	// Mount router on /admin/queues
	app.use("/admin/queues", serverAdapter.getRouter());

	const port = process.env.BULLBOARD_PORT ?? 3030;
	app.listen(port, () => {
		console.log(`Bull Board running on http://localhost:${port}/admin/queues`);
	});
}
