/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#1476FF",
        'secondary': "#F3F5FF",
        'light': "#F9FAFF",
        'green':'#f50057'
      },
    },
  },
  plugins: [
    
  ],
}