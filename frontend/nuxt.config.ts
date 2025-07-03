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
  modules: ['shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  plugins: [
    { src: '~/plugins/fetch-interceptor.js', mode: 'client' },
    { src: '~/plugins/swal.js', mode: 'client' },
  ],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
});
