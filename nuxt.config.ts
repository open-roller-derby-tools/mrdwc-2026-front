import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/image", "@nuxt/fonts", "@nuxtjs/i18n"],
  devtools: { enabled: false },
  vite: { plugins: [tailwindcss()] },
  css: ["~/assets/css/main.css"],
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
