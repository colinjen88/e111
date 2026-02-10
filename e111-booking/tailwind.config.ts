import type { Config } from 'tailwindcss'

export default <Config>{
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#d73324', // Red from contact.html css
          secondary: '#660033',  // Dark purple/red from contact.html css
          light: '#fdf2f2',
          dark: '#8f1e17',
        }
      }
    }
  },
  plugins: [],
}
