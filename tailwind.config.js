/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B2A4A",
        accent: "#C9A84C",
        success: "#1A6B4A",
        surface: "#F5F0E8",
        white: "#FFFFFF",
        "text-dark": "#333333"
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif']
      }
    },
  },
  plugins: [],
}
