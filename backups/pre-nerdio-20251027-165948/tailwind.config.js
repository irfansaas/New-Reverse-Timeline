/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        nerdio: {
          // Primary - Eastern Blue
          primary: {
            50: '#E8F5F9',
            100: '#D1EBF3',
            200: '#A3D7E7',
            300: '#77CADC',
            400: '#4DB6D0',
            500: '#239CBB',  // Main Primary
            600: '#1B7A95',
            700: '#145770',
            800: '#0D394A',
            900: '#061C25',
          },
          // Secondary - Viking (for accents)
          secondary: {
            50: '#F0F9FB',
            100: '#E1F3F7',
            200: '#C3E7EF',
            300: '#A5DBE7',
            400: '#8ED2DF',
            500: '#77CADC',  // Main Secondary
            600: '#5BB8D1',
            700: '#4297B3',
            800: '#316F85',
            900: '#1F4756',
          },
          // Dark - Firefly
          dark: '#0F2A38',
          // Light background
          light: '#E8F5F9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
