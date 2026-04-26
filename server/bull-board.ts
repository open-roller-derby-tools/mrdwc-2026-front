import express from "express";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { notificationQueue } from "./utils/queue";

export function startBullBoard() {
	const app = express();
	const serverAdapter = new ExpressAdapter();

	serverAdapter.setBasePath("/admin/queues");

	// --- BASIC AUTH ---
	app.use("/admin/queues", (req, res, next) => {
		const auth = req.headers.authorization;

		if (!auth || !auth.startsWith("Basic ")) {
			res.setHeader("WWW-Authenticate", 'Basic realm="Bull Board"');
			return res.status(401).send("Authentication required");
		}

		const [user, pass] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");

		if (user !== "bullAdmin" || pass !== process.env.BULLBOARD_PASSWORD) {
			return res.status(403).send("Forbidden");
		}

		next();
	});

	createBullBoard({
		queues: [new BullMQAdapter(notificationQueue)],
		serverAdapter,
	});

	app.use("/admin/queues", serverAdapter.getRouter());

	const port = process.env.BULLBOARD_PORT ?? 3030;
	app.listen(port, () => {
		console.log(`Bull Board running on http://localhost:${port}/admin/queues`);
	});
}
