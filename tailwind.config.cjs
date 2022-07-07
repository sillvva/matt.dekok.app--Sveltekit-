/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				'spin-slow': 'spin 4s linear infinite',
				'spin-medium': 'spin 2s linear infinite'
			},
			textColor: {
				theme: {
					base: 'var(--color-text-base)',
					inverted: 'var(--color-text-inverted)',
					link: 'var(--color-text-link)',
					'link-hover': 'var(--color-text-link-hover)',
					button: 'var(--color-text-button)',
					heading: 'var(--color-text-heading)',
				}
			},
			backgroundColor: {
				theme: {
					body: ({ opacityValue }) => {
						if (opacityValue === undefined) opacityValue = 1;
						return `rgba(var(--color-bg-body), ${opacityValue})`;
					},
					article: 'var(--color-bg-article)',
					hover: ({ opacityValue }) => {
						if (opacityValue === undefined) opacityValue = 1;
						return `rgba(var(--color-bg-hover), ${opacityValue})`;
					},
					link: 'var(--color-bg-link)',
					'link-hover': 'var(--color-bg-link-hover)',
					pre: 'var(--color-bg-pre)',
					file: 'var(--color-bg-file)',
					code: 'var(--color-bg-code)'
				}
			},
			dropShadow: {
				'theme-text': '1px 1px 2px var(--color-bg-shadow)',
				'theme-text-outline':
					'1px 1px 0 var(--text-shadow-color), -1px -1px 0 var(--text-shadow-color), 1px -1px 0 var(--text-shadow-color), -1px 1px 0 var(--text-shadow-color)'
			},
			opacity: {
				15: '0.15',
				33: '0.33',
			}
		},
		screens: {
			'3xs': '360px',
			'2xs': '430px',
			xs: '576px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		}
	},
	plugins: []
};
