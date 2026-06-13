export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: { preference: 'light', fallback: 'light' },
  devtools: { enabled: false },
  compatibilityDate: '2026-06-11',
  vite: {
    server: {
      hmr: { port: 24678 }
    }
  }
})
