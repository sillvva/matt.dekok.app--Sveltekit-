/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from './__types/cron';
import { fetchPosts } from '$lib/firebase/blog';
import { env } from '$lib/constants';

export const post: RequestHandler = async ({ request, url }) => {
	try {
		const authorization = request.headers.get('authorization');
		if (authorization !== `Bearer ${env.API_SECRET_KEY}`)
			throw new Error(`Unauthorized: ${authorization}`);

		const getPosts = !!url.searchParams.get('posts');

		const result = await fetchPosts(getPosts);
		const added = result.added || [];
		const updated = result.updated || [];
		const revalidations = [...added, ...updated];
		return {
			status: 200,
			body: { success: true, revalidated: !!revalidations.length, ...result },
			headers: {
				'Cache-Control': 'no-cache'
			}
		};
	} catch (err: any) {
		return {
			status: 200,
			body: {
				error: {
					message: err.message
				}
			},
			headers: {
				'Cache-Control': 'no-cache'
			}
		};
	}
};
