// https://nuxt.com/docs/api/configuration/nuxt-config
// Force rebuild comment for hydration fix
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      bodyAttrs: {
        class: 'antialiased text-gray-800 selection:bg-brand-red/20 selection:text-brand-red'
      }
    }
  },
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
  },
  runtimeConfig: {
    // Private (server-only)
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
    adminSecretToken: process.env.ADMIN_SECRET_TOKEN,

    lineChannelSecret: '',
    lineChannelAccessToken: ''
  }
})
