/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 4s linear infinite",
        "spin-medium": "spin 2s linear infinite"
      }
    },
    screens: {
      "3xs": "360px",
      "2xs": "430px",
      xs: "576px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    }
  },
  plugins: []
};