import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	resolve: {
		alias: {
			"~": resolve(__dirname, "app"),
			"~~": resolve(__dirname),
		},
	},
	plugins: [vue()],
	test: {
		include: ["tests/**/*.test.ts"],
	},
});
