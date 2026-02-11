
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@vueuse/motion/nuxt'],
  googleFonts: {
    families: {
      'Noto+Sans+TC': [300, 400, 500, 700],
      'Noto+Serif+TC': [400, 700],
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 2390
  }
})
