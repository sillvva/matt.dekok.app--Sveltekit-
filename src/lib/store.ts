import { writable } from 'svelte/store';

export type PageProps = {
	title?: string;
	description?: string;
	bodyClass?: string;
	backTo?: boolean | string;
	menu?: boolean;
	articleMeta?: object;
	image?: string;
};
export const pathname = writable('');
export const pageProps = writable<PageProps>({});

export const drawer = writable(false);
