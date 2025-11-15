/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // green color for FAB
        'background-light': '#ffffff',
        'background-dark': '#111827',
      },
      fontFamily: {
        display: ['Public Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

