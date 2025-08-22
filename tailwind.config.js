/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          neon: '#00FF88',
          dark: '#00CC6A',
        },
        secondary: {
          red: '#FF4D6D',
          dark: '#E63946',
        },
        neutral: {
          black: '#0D0D0D',
          gray: '#2A2A2A',
          light: '#E5E5E5',
        },
        accent: {
          cyan: '#1E90FF',
          dark: '#0F6FDB',
        }
      },
      backgroundColor: {
        'primary-gradient': 'linear-gradient(135deg, #00FF88 0%, #00CC6A 100%)',
      },
    }
  },
  plugins: [],
};
