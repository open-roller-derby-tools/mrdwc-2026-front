import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/image", "@nuxt/fonts", "@nuxtjs/i18n", "@vueuse/nuxt"],
  devtools: { enabled: false },
  vite: { plugins: [tailwindcss()] },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=3, user-scalable=yes",
      title: "Men's Roller Derby World Cup 2026",
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
        weights: ["400 500 600 700 900"], // Regular, Medium, Semibold, Bold, Black
      },
    ],
  },
  image: {
    format: ["webp"],
  },
  i18n: {
    defaultLocale: "en",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "fr", name: "Français", file: "fr.json" },
    ],
  },
});