const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        navy: {
          50: '#F0F4F9',
          100: '#D9E2EF',
          200: '#B3C7DD',
          300: '#8AA9C9',
          400: '#638DB5',
          500: '#3E71A0',
          600: '#2C5680',
          700: '#1C3D60',
          800: '#10253F',
          900: '#0B1420',
          950: '#060D17',
        },
      },
    },
  },
  plugins: [],
};


