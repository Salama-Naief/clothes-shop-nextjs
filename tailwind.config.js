/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#167699",
        secondary:"#99750E",
        error:"#D92D18"
      }
    
    },
  },
  plugins: [],
}
