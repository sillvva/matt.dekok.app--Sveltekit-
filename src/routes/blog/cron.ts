/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from './__types/cron';
import { fetchPosts, testLog } from '$lib/supabase/blog';
import { blogPostsPerPage } from '$lib/constants';

export const post: RequestHandler = async ({ url }) => {
	try {
		const getPosts = !!url.searchParams.get('posts');
		const page = parseInt(url.searchParams.get('page') || "1");
		const perpage = parseInt(url.searchParams.get('limit') || blogPostsPerPage.toString());
		const query = url.searchParams.get('s') || "";

		if (url.searchParams.get('test')) await testLog();

		const result = await fetchPosts(getPosts, page, perpage, query);
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
