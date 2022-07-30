import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), imagetools()],
  define: {
    // 'process.env': process.env
  },
  optimizeDeps: {
    include: ['highlight.js', 'highlight.js/lib/core']
  },
  server: {
    // port: 3000,
  }
};

export default config;
