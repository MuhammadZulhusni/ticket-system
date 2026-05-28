export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api',
    },
  },

  // Speed up dev server
  vite: {
    server: {
      warmup: {
        clientFiles: ['./app/**/*.vue'],
      }
    }
  },

  devtools: { enabled: false }, 

  compatibilityDate: '2024-11-01',
})