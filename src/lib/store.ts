import { writable } from 'svelte/store';
import type { PostData } from './types/blog';
import type { Rating } from './types/rating';

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

export type Admin = {
	success: boolean;
	error?: string;
	numposts?: number;
	posts?: PostData[];
	numexperience?: number;
	experience?: any[];
	numskills?: number;
	skills?: Rating[];
	numprojects?: number;
	projects?: any[];
}
export const admin = writable<Admin>({
	success: false,
	posts: [],
	experience: [],
	skills: [],
	projects: []
});