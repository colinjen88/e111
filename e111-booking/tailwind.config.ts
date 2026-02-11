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
            }
        }
    }
}
