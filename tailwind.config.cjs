/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 4s linear infinite",
        "spin-medium": "spin 2s linear infinite"
      },
      textColor: {
        theme: {
          base: 'var(--color-text-base)',
          inverted: 'var(--color-text-inverted)',
          link: 'var(--color-text-link)',
          'link-hover': 'var(--color-text-link-hover)',
          menu: 'var(--color-text-menu)',
        }
      },
      backgroundColor: {
        theme: {
          body: 'var(--color-bg-body)',
          article: 'var(--color-bg-article)',
          hover: ({ opacityValue }) => {
            if (opacityValue === undefined) opacityValue = 1;
            return `rgba(var(--color-bg-hover), ${opacityValue})`
          },
          link: 'var(--color-bg-link)',
          'link-hover': 'var(--color-bg-link-hover)',
          pre: 'var(--color-bg-pre)',
          file: 'var(--color-bg-file)',
          code: 'var(--color-bg-code)',
        }
      },
      opacity: {
        '15': '0.15',
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