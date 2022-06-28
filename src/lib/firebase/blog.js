/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from "path";
import matter from 'gray-matter';
import { writeFileSync } from 'fs';
import { firestore, storage, firebaseConfig, getContentDir } from './connection.js';

/**
 *
 * @param {boolean=} getPosts
 * @param {number=} page
 * @param {number=} perpage
 * @param {string=} query
 * @returns
 */
export async function fetchPosts(getPosts, page, perpage, query) {
	let [contentList] = await storage.getFiles({ prefix: firebaseConfig.blogStorage });

	contentList = contentList.filter((file) => {
		return file.name.endsWith('.md');
	});

	const collection = firestore.collection(firebaseConfig.blogCollection);
	const list = await collection.listDocuments();
	if (getPosts && page && perpage && !query) collection.limit(perpage).offset((page - 1) * perpage);
	const docs = await collection.get();

	/**
	 * @type {Array<import('../types/blog').PostData>}
	 */
	let posts = [];
	docs.forEach((doc) => {
		const post = doc.data();
		posts.push({
			...post,
			slug: doc.id,
			...(post.date?._seconds && { date: new Date(post.date._seconds * 1000).toISOString() }),
			...(post.updated?._seconds && {
				updated: new Date(post.updated._seconds * 1000).toISOString()
			})
		});
	});

	if (getPosts && page && perpage) return { posts, num: list.length };

	let changes = 0;
	/**
	 * @type {Array<string>}
	 */
	let added = [];
	/**
	 * @type {Array<string>}
	 */
	let updated = [];
	/**
	 * @type {Array<string>}
	 */
	let removed = [];

	for (const file of contentList) {
		const timeCreated = new Date(file.metadata.timeCreated).toISOString();
		const ext = path.extname(file.metadata.name);
		if (ext != '.md') continue;
		const fileName = path.basename(file.metadata.name);
		const slug = fileName.slice(0, fileName.length - 3);

		const fsIndex = posts.findIndex((p) => p.slug == slug);
		const fsItem = posts[fsIndex];
		if (fsItem && (!fsItem.timeCreated || timeCreated > fsItem.timeCreated)) {
			console.log(`Updating: ${slug}`);
			updated.push(slug);
			changes++;
		} else if (!fsItem) {
			console.log(`Adding: ${slug}`);
			added.push(slug);
			changes++;
		} else continue;

		const result = await new Promise((resolve) => {
			let content = '';
			file
				.createReadStream({
					// @ts-ignore
					encoding: 'UTF-8'
				})
				.on('data', (chunk) => {
					content += Buffer.from(chunk);
				})
				.on('end', () => {
					resolve(content);
				});
		});

		const parsedData = matter(result);
		const postData = {
			slug: slug,
			path: file.metadata.name,
			timeCreated: timeCreated,
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
		const storageFile = contentList.find((item) => item.name.endsWith(`/${post.slug}.md`));
		if (!storageFile) {
			console.log(`Removing: ${post.slug}`);
			posts.splice(pi, 1);
			removed.push(post.slug);
			changes++;
		}
	});

	writeFileSync(`${getContentDir()}/${firebaseConfig.blogCollection}.json`, JSON.stringify(posts));

	if (changes) {
		console.log('Storing metadata to Firestore');
		for (const doc of added) {
			const post = posts.find((p) => p.slug === doc);
			if (post) await collection.doc(doc).set(post);
		}
		for (const doc of updated) {
			const post = posts.find((p) => p.slug === doc);
			if (post) await collection.doc(doc).set(post);
		}
		for (const doc of removed) {
			await collection.doc(doc).delete();
		}
	} else console.log('No changes found');

	return {
		changes,
		added,
		updated,
		removed,
		posts: getPosts ? posts : [],
		num: list.length
	};
}
