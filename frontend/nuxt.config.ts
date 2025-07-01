// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  // plugins: ['~/plugins/fetch-interceptor.js'],
  runtimeConfig: {
    public: {
      apiBase: process.env.URL_API,
    },
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
});
