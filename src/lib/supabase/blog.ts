/* eslint-disable @typescript-eslint/ban-ts-comment */
import matter from 'gray-matter';
import { writeFileSync } from 'fs';
import { supabase, getContentDir } from './connection';
import type { PostData } from '../types/blog';

export async function testLog() {
  const result = await supabase.from('test_log').upsert({});
  return result.data;
}

export async function fetchPosts(
	getPosts?: boolean,
	page?: number,
	perpage?: number,
	query?: string,
	refresh?: number
): Promise<any> {
	const { data: stgData } = await supabase.storage.from('blog').list();
	const contentList = (stgData || []).filter((post) => post.name.endsWith('.md'));
	let num = contentList.length;

	let result: { data: PostData[] | null; count: number | null };
	if (query && !refresh) {
    result = await supabase.rpc('search_posts', { keyword: query });
    num = (result.data || []).length;
  }
	else if (page && perpage && !refresh)
		result = await supabase
			.from('blog')
			.select('*')
			.range((page - 1) * perpage, page * perpage - 1);
	else result = await supabase.from('blog').select('*');

	const posts = result.data || [];

	if (getPosts && page && perpage && !refresh) return { posts, num };

	let changes = 0;
	let added = 0;
	const upserted: string[] = [];
	const removed: string[] = [];

	for (const file of contentList) {
		const slug = file.name.slice(0, file.name.length - 3);

		const fsIndex = posts.findIndex((p) => p.slug == slug);
		const fsItem = posts[fsIndex];
		if (!fsItem) added++;
		if (!fsItem || !fsItem.created_at || file.created_at > fsItem.created_at) {
			console.log(`Upserting: ${slug}`);
			upserted.push(slug);
			changes++;
		} else continue;

		const { publicURL: url } = await supabase.storage.from('blog').getPublicUrl(file.name);
		const response = await fetch(url || '');
		const result = await response.text();

		const parsedData = matter(result);
		const postData = {
			name: file.name,
			slug: slug,
			created_at: file.created_at,
			updated_at: file.updated_at,
			...{
				...parsedData.data,
				...(parsedData.data.date && { date: parsedData.data.date.toISOString() }),
				...(parsedData.data.updated && { updated: parsedData.data.updated.toISOString() })
			}
		};
		if (fsItem) posts.splice(fsIndex, 1, postData);
		else posts.push(postData);
	}

	posts.forEach((post, pi) => {
		const storageFile = contentList.find((item) => item.name === `${post.slug}.md`);
		if (!storageFile) {
			console.log(`Removing: ${post.slug}`);
			posts.splice(pi, 1);
			removed.push(post.slug);
			changes++;
		}
	});

	writeFileSync(`${getContentDir()}/blog.json`, JSON.stringify(posts));

	const errors: { slug: string; error: any }[] = [];

	if (changes) {
		console.log('Storing metadata to Firestore');
		for (const post of posts.filter((p) => !!upserted.find((a) => a === p.slug))) {
			const { error } = await supabase.from('blog').upsert(post);
			if (error) errors.push({ slug: post.slug, error });
		}
		for (const slug of removed) {
			const { error } = await supabase.from('blog').delete().match({ slug });
			if (error) errors.push({ slug, error });
		}
	} else console.log('No changes found');

	return {
		changes,
		upserted,
		removed,
		errors,
		posts: getPosts ? posts : [],
		num: (num || 0) + added - removed.length
	};
}
