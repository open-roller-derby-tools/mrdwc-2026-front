import staging from "staging-nuxt";
import { defineEventHandler } from "h3";

console.log("[staging] STAGING_PASSWORD:", process.env.STAGING_PASSWORD ? "[SET]" : "[NOT SET]");

const stagingHandler = staging({
	password: process.env.STAGING_PASSWORD,
	siteName: "Announcers",
	protectedRoutes: ["/announcers/teams", "/announcers/teams/**"],
});

export default defineEventHandler(async (event) => {
	const result = await stagingHandler(event);
	return result;
});
