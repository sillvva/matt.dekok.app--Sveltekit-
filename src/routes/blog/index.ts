/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync, readFileSync } from 'fs';
import type { RequestHandler } from './__types/index';
import type { PostData } from '$lib/types/blog';
import { fetchPosts } from '$lib/supabase/blog';
import { blogPostsPerPage } from '$lib/constants';
import { getContentDir } from '$lib/supabase/func';

type PostFetchOptions = {
	page?: number;
	query?: string;
	limit?: number;
};

export const getPosts = async (options?: PostFetchOptions) => {
	const { page = 1, query = '', limit = blogPostsPerPage } = options || {};
	// const jsonFile = `${getContentDir()}/blog.json`;

	// let posts: PostData[] = [];
	// let num = 0;
	let {posts, num} = await fetchPosts(true, page, limit, query);
	// if (existsSync(jsonFile)) {
	// 	const metaJson = readFileSync(jsonFile, { encoding: 'utf-8' });
	// 	posts = JSON.parse(metaJson);
	// 	num = posts.length;
	// }

	if (query) {
		posts = posts
			.map((post) => {
				if (post.title.toLowerCase() === query.toLowerCase()) return { ...post, match: 1000 };
				const words = query.toLowerCase().split(' ');
				let match = 0;
				let found: string[] = [];
				if (post.title.toLowerCase().includes(query.toLowerCase())) match += 100;
				if (post.description?.toLowerCase().includes(query.toLowerCase())) match += 50;

				const tagMatches = words.filter((c) => post.tags.map((t) => t.toLowerCase()).includes(c));
				found = found.concat(tagMatches);
				match += tagMatches.length * 20;

				const titleMatches = words.filter((c) => post.title.toLowerCase().includes(c));
				found = found.concat(titleMatches);
				match += titleMatches.length * 5;

				const descriptionMatches = words.filter((c) => post.description?.toLowerCase().includes(c));
				found = found.concat(descriptionMatches);
				match += descriptionMatches.length * 1;

				const matches = found.filter((f, i) => i === found.indexOf(f));
				if (matches.length !== words.length) match = 0;

				return { ...post, match };
			})
			.filter((post) => post.match)
			.sort((a, b) => (a.match > b.match ? -1 : 1));
		num = posts.length;
	} else posts = posts.sort((a, b) => (a.date > b.date ? -1 : 1));

	return {
		pages: Math.ceil(num / limit),
		posts: posts.slice((page - 1) * limit, page * limit),
		num
	};
};

export const get: RequestHandler = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || blogPostsPerPage.toString());
	const query = url.searchParams.get('s') || '';

	try {
		const result = await getPosts({ page, query, limit });
		if (result.pages < page) throw new Error('Invalid page count');
		return {
			status: 200,
			body: {
				...result
			},
			headers: {
				'Cache-Control': 'public, max-age=21600'
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
