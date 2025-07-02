// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  srcDir: 'src/',
  runtimeConfig: {
    public: {
      apiBase: process.env.URL_API,
    },
  },
  css: ['~/assets/css/main.css'],
  plugins: [
    { src: '~/plugins/fetch-interceptor.js', mode: 'client' },
    { src: '~/plugins/swal.js', mode: 'client' },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
});
