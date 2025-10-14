import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1e90ff',
          50: '#e7f3ff',
          100: '#cfe7ff',
          200: '#9fd0ff',
          300: '#6fb8ff',
          400: '#3fa1ff',
          500: '#1e90ff',
          600: '#0f6fd4',
          700: '#0b57a8',
          800: '#08417d',
          900: '#062c52'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
