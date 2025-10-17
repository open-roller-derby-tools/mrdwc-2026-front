import tailwindcss from "@tailwindcss/vite";

const datetimeFormats = {
	d: {
		day: "numeric",
	},
	m: {
		month: "long",
	},
	dm: {
		month: "long",
		day: "numeric",
	},
	dmy: {
		year: "numeric",
		month: "long",
		day: "numeric",
	},
	ddmy: {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "long",
	},
	dmyhm: {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "long",
		hour: "2-digit",
		minute: "2-digit",
	},
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	modules: [
		"@nuxt/image",
		"@nuxt/fonts",
		"@nuxtjs/i18n",
		"@pinia/nuxt",
		"@nuxt/ui",
	],
	css: ["~~/app/assets/css/main.css"],
	devtools: { enabled: false },

	runtimeConfig: {
		public: {
			apiBase: "",
		},
	},
	app: {
		head: {
			viewport:
				"width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=3, user-scalable=yes",
			title: "Men's Roller Derby World Cup 2026",
			link: [
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/favicon-32x32.png",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					href: "/favicon-16x16.png",
				},
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{ rel: "manifest", href: "/site.webmanifest" },
			],
		},
	},
	fonts: {
		defaults: {
			weights: ["400 700"], // Regular, Bold
		},
		families: [
			{
				name: "Big Shoulders",
				provider: "fontsource",
				weights: ["400 500 600 700 900"],
			},
			{
				name: "Cabin",
				provider: "fontsource",
				weights: ["400 500 600 700"],
			},
		],
	},
	vite: {
		css: {
			preprocessorOptions: {},
		},
	},
	image: {
		format: ["webp"],
	},
	i18n: {
		locales: [
			{ code: "en-US", name: "English", file: "en.json" },
			{ code: "fr-FR", name: "Français", file: "fr.json" },
		],
		defaultLocale: "fr-FR",
	},
});
