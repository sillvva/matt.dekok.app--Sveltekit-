/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, rmSync, existsSync, statSync } from 'node:fs';
import matter from 'gray-matter';
import type { RequestHandler } from './__types/[slug]';
import type { PostData } from '$lib/types/blog';
import { getContentDir } from '$lib/firebase/connection';
import { storage, firebaseConfig } from '$lib/firebase/connection';

export const get: RequestHandler = async ({ params: { slug } }) => {
	const dirPath = getContentDir();
	const postsPath = `${dirPath}/posts.json`;
	const filePath = `${dirPath}/${slug}.md`;

	if (slug.match(/\.[a-z]*$/)) return {
		status: 200
	};

	let meta: any;
	let file: any;
	if (existsSync(postsPath)) {
		const data = readFileSync(postsPath, 'utf8');
		const posts: PostData[] = JSON.parse(data);
		meta = posts.find((p) => p.slug == slug);
	} else {
		file = storage.file(`${firebaseConfig.blogStorage}/${slug}.md`);
		[meta] = await file.getMetadata();
	}

	const result = { data: '' };
	let write = false;
	if (existsSync(filePath)) {
		const stat = statSync(filePath);
		const tdiff = (new Date(meta.timeCreated).getTime() - stat.ctime.getTime()) / 1000;
		if (tdiff > 0) {
			write = true;
			rmSync(filePath);
		} else {
			result.data = readFileSync(filePath, 'utf8');
		}
	} else write = true;

	if (write) {
		if (!file) file = storage.file(`${firebaseConfig.blogStorage}/${slug}.md`);
		await file.download({ destination: filePath });
		result.data = readFileSync(filePath, 'utf8');
	}

	const { content, data } = matter(result.data);
	console.log('Revalidating...', slug);
	if (data.date) data.dateISO = new Date(data.date).toISOString();
	if (data.updated) data.updatedISO = new Date(data.updated).toISOString();
	for (const key in data) {
		if (data[key] instanceof Date) {
			data[key] = data[key].toLocaleDateString('en-us', {
				weekday: 'long',
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		}
	}

	return {
		status: 200,
		body: {
			content,
			data
		},
		headers: {
			'Cache-Control': `public, max-age=86400`
		}
	};
};