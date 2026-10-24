import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#07101E',
          900: '#0A192F',
          800: '#112240',
          700: '#1B3056',
          600: '#233F6E',
        },
        champagne: {
          50: '#FAF8F2',
          100: '#F5F0E2',
          200: '#EBDDBF',
          300: '#DFC898',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#AA8542',
          700: '#8A6730',
        },
        sand: {
          50: '#FDFBF7',
          100: '#F7F4EC',
          200: '#EEE9DC',
        }
      },
    },
  },
  plugins: [],
};
export default config;
