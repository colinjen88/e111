export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      bodyAttrs: {
        class: 'antialiased text-gray-800 selection:bg-brand-red/20 selection:text-brand-red'
      }
    }
  },
  render: {
    csp: {
      hashAlgorithm: 'sha256',
      policies: {
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:", "http:"],
        'style-src': ["'self'", "'unsafe-inline'", "https:", "http:"],
      },
      addMeta: true
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
    port: 3003
  },
  runtimeConfig: {
    // Private (server-only) — loaded from environment variables
    adminPassword: process.env.ADMIN_PASSWORD || '',
    adminSecretToken: process.env.ADMIN_SECRET_TOKEN || '',

    lineChannelAccessToken: ''
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:;"
        }
      }
    }
  }
})
