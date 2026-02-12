import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
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
            }
        }
    }
}
