import { writable } from 'svelte/store';

export type PageProps = {
	title?: string;
	bodyClass?: string;
	backTo?: boolean | string;
};
export const pageProps = writable<PageProps>({});
