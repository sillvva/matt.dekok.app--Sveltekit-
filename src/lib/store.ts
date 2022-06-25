import { writable } from 'svelte/store';

export type PageProps = {
	title?: string;
	bodyClass?: string;
	backTo?: boolean | string;
	menu?: boolean;
};
export const pageProps = writable<PageProps>({});
