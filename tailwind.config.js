/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        lunchyellow: '#FFE600',
      },
      fontFamily: {
        'sans': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}

