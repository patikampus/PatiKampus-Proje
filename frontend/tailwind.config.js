/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#302369', // rgb(48, 35, 105)
          800: '#37216a',
          700: '#2d2a5a',
        },
        secondary: {
          900: '#232169', // rgb(35, 33, 105)
          800: '#232d69',
        },
        card: {
          DEFAULT: '#3d326e', // kart arka planı için uygun
          light: '#4e4180',
        },
        text: {
          DEFAULT: '#f3f3fa',
          muted: '#b3b3c6',
        },
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(135deg, #302369 0%, #232169 100%)',
      },
    },
  },
  plugins: [],
}
