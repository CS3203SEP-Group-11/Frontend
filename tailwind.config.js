/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf7ff',
          100: '#f4edff',
          200: '#eaddff',
          300: '#d4bfff',
          400: '#b794ff',
          500: '#9965ff',
          600: '#6528f7',
          700: '#5a1fe6',
          800: '#4c1ac2',
          900: '#3f179f',
        },
        secondary: {
          50: '#fbf9ff',
          100: '#f7f2ff',
          200: '#f0e7ff',
          300: '#e4d4ff',
          400: '#d1b5ff',
          500: '#bc93ff',
          600: '#a076f9',
          700: '#8b5cf6',
          800: '#7c3aed',
          900: '#6d28d9',
        },
        accent: {
          50: '#faf8ff',
          100: '#f3efff',
          200: '#e9ddff',
          300: '#d7bbf5',
          400: '#c299f0',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c2d12',
          800: '#581c87',
          900: '#3b0764',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-green': 'pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-green': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '.7',
          },
        },
      },
    },
  },
  plugins: [],
}
