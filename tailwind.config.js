/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],

  theme: {
    colors:{
      primarybg:'#f3f4f6',
    },
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
  ],
}

