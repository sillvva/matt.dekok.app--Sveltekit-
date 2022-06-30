import type { PageProps } from './store';
import { vercelUrl, env } from '$lib/constants';

export type Theme = 'dark' | 'light' | 'blue';
export const themes: Theme[] = ['dark', 'light', 'blue'];

// The debounce function receives our function as a parameter
export const debounce = (fn: (...args: any[]) => void) => {
	// This holds the requestAnimationFrame reference, so we can cancel it if we wish
	let frame: number;
	// The debounce function returns a new function that can receive a variable number of arguments
	return (...params: any[]) => {
		// If the frame variable has been defined, clear it now, and queue for next frame
		if (frame) {
			cancelAnimationFrame(frame);
		}
		// Queue our function call for the next frame
		frame = requestAnimationFrame(() => {
			// Call our function and pass any params we received
			fn(...params);
		});
	};
};

export const conClasses = (str: boolean | string | (string | boolean | undefined)[]) => {
	return (Array.isArray(str) ? str : typeof str == 'string' ? str.split(' ') : [])
		.filter((s) => !!s && typeof s == 'string')
		.join(' ');
};

export const slug = (str: string) => {
	return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
};

const timeouts = new Map<string | number, number>();
export const wait = (callback: TimerHandler, id: string | number, ms?: number, ...args: any[]) => {
	if (!callback) throw new Error("'callback' not defined");
	if (!id) throw new Error("'id' not defined");
	if (!ms) ms = 100;
	if (timeouts.get(id)) clearTimeout(timeouts.get(id));
	timeouts.set(id, setTimeout(callback, ms, ...args));
};

export const checkOrigin = (origin: string) => {
	return origin.match(/prerender/)
		? vercelUrl
			? `https://${vercelUrl}`
			: process.env.NODE_ENV === 'development'
			? 'http://localhost:3000'
			: env.PROD_URL
		: origin;
};

export const metaTags = (pageProps: PageProps, origin: string, path: string, theme?: string) => {
	const originCheck = checkOrigin(origin);
	const themeColors: { [key: string]: string } = {
		dark: '#00aa99',
		blue: '#32b2e8',
		light: '#0070e7'
	};

	const description =
		pageProps.description ||
		'Experienced full stack web developer with a demonstrated history of working in the wireless industry.';
	const ogProperties = {
		type: pageProps.articleMeta ? 'article' : 'website',
		title: pageProps.title || 'Matt DeKok',
		description: description,
		image: pageProps.image?.startsWith('http')
			? pageProps.image
			: `${originCheck}${pageProps.image || '/images/preview-me3.jpeg'}`,
		url: originCheck + path
	};

	return {
		title: pageProps.title ? `${pageProps.title} - Matt DeKok` : 'Matt DeKok',
		description: description,
		origin: originCheck,
		color: themeColors[theme || 'dark'] ?? '#111',
		ogProperties: ogProperties,
		twProperties: {
			site: '@sillvvasensei',
			card: 'summary_large_image',
			...ogProperties
		},
		articleMeta: pageProps.articleMeta
	};
};

export const getCursorPosition = (canvas: HTMLElement, event: MouseEvent | PointerEvent) => {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	return { x, y, rect };
};

export const isJSON = (text: string) => {
	try {
		JSON.parse(text);
		return true;
	}
	catch(e) {
		return false;
	}
}