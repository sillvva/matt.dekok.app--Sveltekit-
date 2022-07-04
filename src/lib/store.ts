import { writable } from 'svelte/store';
import type { PostData } from './types/blog';

export type PageProps = {
	title?: string;
	description?: string;
	bodyClass?: string;
	backTo?: boolean | string;
	menu?: boolean;
	articleMeta?: object;
	image?: string;
};
export const pageProps = writable<PageProps>({});
export const drawer = writable(false);
type Admin = {
	numposts?: number;
	posts?: PostData[];
	numexperience?: number;
	experience?: any[];
	numskills?: number;
	skills?: any[];
	numprojects?: number;
	projects?: any[];
}
export const admin = writable<Admin>({
	posts: [],
	experience: [],
	skills: [],
	projects: []
});