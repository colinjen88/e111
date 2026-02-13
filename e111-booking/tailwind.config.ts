import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: [
        './app/components/**/*.{vue,js,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/composables/**/*.{js,ts}',
        './app/plugins/**/*.{js,ts}',
        './app/app.vue',
        './app/error.vue',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    red: '#8B0000',
                    gold: '#D4AF37',
                    dark: '#1a1a1a',
                    cream: '#fdfbf7'
                }
            },
            fontFamily: {
                sans: ['"Noto Sans TC"', 'sans-serif'],
                serif: ['"Noto Serif TC"', 'serif'],
            },
            borderWidth: {
                '3': '3px',
            },
            transitionDuration: {
                '400': '400ms',
            },
            boxShadow: {
                'glow-red': '0 0 30px rgba(139, 0, 0, 0.3)',
                'glow-gold': '0 0 30px rgba(212, 175, 55, 0.2)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        }
    }
}
