// Force rebuild comment for hydration and path fix: 2026-02-13 08:05
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
  devtools: { enabled: false },
  devServer: {
    host: '0.0.0.0',
    port: 3003
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@vueuse/motion/nuxt'],
  googleFonts: {
    families: {
      'Noto+Sans+TC': [300, 400, 500, 700],
      'Noto+Serif+TC': [400, 700],
    }
  },

  runtimeConfig: {
    // Private (server-only) — loaded from environment variables
    adminPassword: process.env.ADMIN_PASSWORD || '',
    adminSecretToken: process.env.ADMIN_SECRET_TOKEN || '',

    lineChannelSecret: process.env.NUXT_LINE_CHANNEL_SECRET || '',
    lineChannelAccessToken: process.env.NUXT_LINE_CHANNEL_ACCESS_TOKEN || '',
    lineNotifyToken: process.env.NUXT_LINE_NOTIFY_TOKEN || '',
    lineAdminUserId: process.env.NUXT_LINE_ADMIN_USER_ID || '',
    resendApiKey: process.env.NUXT_RESEND_API_KEY || '',
    emailFrom: process.env.NUXT_EMAIL_FROM || 'onboarding@resend.dev'
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:;"
        }
      }
    }
  },
  build: {
    transpile: ['@vueuse/motion']
  }
})
