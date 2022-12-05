/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        primary: '#213263',
        primary_container: '#b4c5ff',
        on_primary: '#fff',
        background: '#fff',
        background_container: '#f5f5f5',
        on_background: '#111115',
        on_background_variant: '#757680',

        // Dark
        primary_dark: '#5d7dd9',
        on_primary_dark: '#1b1b1f',
        primary_container_dark: '#a5b2d2',
        background_dark: '#1b1b1f',
        on_background_dark: '#fff ',
      },
    },
  },
  plugins: [],
};
