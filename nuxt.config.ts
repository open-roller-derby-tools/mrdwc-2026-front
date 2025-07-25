// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxtjs/tailwindcss"],
  devtools: { enabled: true },
  tailwindcss: {
    config: {
      theme: {
        extend: {},
      },
    },
  },
});
