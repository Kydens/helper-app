// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts}',
    './components/**/*.{vue,js}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#588157', // contoh warna utama
        secondary: '#a3b18a', // contoh warna sekunder
      },
    },
  },
  plugins: [],
};
