/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#ffa500',
          dark: '#e6940a',
        },
        secondary: {
          gray: '#333232',
          light: '#4a4949',
        },
        background: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        text: {
          light: '#333232',
          dark: '#ffffff',
        },
        card: {
          light: '#f8f9fa',
          dark: '#2a2a2a',
        },
        border: {
          light: '#e9ecef',
          dark: '#404040',
        }
      },
      backgroundColor: {
        'primary-gradient': 'linear-gradient(135deg, #ffa500 0%, #e6940a 100%)',
        'card-gradient-light': 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        'card-gradient-dark': 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      },
    }
  },
  plugins: [],
};
