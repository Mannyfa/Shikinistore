/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Adjusted for JavaScript
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#111111',
          gold: '#C7A14A',
          goldLight: '#E5C475',
          white: '#F8F6F2',
          charcoal: '#222222',
          beige: '#EFECE6',
        }
      },
      fontFamily: {
        editorial: ['"Cormorant Garamond"', 'Didot', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.15em',
        widest: '0.25em',
      }
    },
  },
  plugins: [],
}