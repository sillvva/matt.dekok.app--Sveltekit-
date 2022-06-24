// src/hooks.js
import type { Handle, GetSession } from '@sveltejs/kit';
import { parse } from 'cookie';

export const handle: Handle = ({ event, resolve }) => {
	const cookies = parse(event.request.headers?.get('cookie') || '');

	(<any>event.locals).theme = cookies.theme || 'dark';

	return resolve(event);
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession = (request) => {
	return {
		theme: (<any>request.locals).theme
	};
};
