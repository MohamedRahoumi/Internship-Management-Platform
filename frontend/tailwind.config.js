const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        cooper: ['Cooper BT W01 Light', 'Georgia', 'serif'],
        'cooper-medium': ['Cooper BT W01 Medium', 'Cooper BT W01 Light', 'Georgia', 'serif'],
      },
      colors: {
        ocp: {
          50: '#F4F9F5',
          100: '#EAF3EE',
          150: '#F1F8F4',
          200: '#C5E0D1',
          300: '#8FC4A3',
          400: '#4FA871',
          500: '#00843D',
          600: '#015F2A',
          700: '#02421D',
          800: '#013115',
          900: '#01220e',
          950: '#001408',
        },
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
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
};
