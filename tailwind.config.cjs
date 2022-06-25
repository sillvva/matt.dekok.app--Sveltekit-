/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      keyframes: {
        ripple: {
          "0%": {
            width: "5%",
            opacity: 0
          },
          "80%": {
            width: "100%",
            opacity: 0.25
          },
          "100%": {
            opacity: 0
          }
        }
      },
      animation: {
        ripple: "ripple .5s linear",
        "spin-slow": "spin 4s linear infinite",
        "spin-medium": "spin 2s linear infinite"
      }
    },
    screens: {
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