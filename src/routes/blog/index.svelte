<script lang="ts">
	import { onMount } from 'svelte';
	import { page as p } from '$app/stores';
	import { blogPostsPerPage } from '$lib/constants';
	import { pageProps } from '$lib/store';
	import type { PostData } from '$lib/types/blog';
	import Message from '$lib/components/page/message.svelte';
	import Post from '$lib/components/blog/post.svelte';
	import Pagination from '$lib/components/common/pagination.svelte';

	const loaders: PostData[] = Array(blogPostsPerPage).fill({
		title: '',
		date: '',
		image: '',
		slug: '',
		tags: []
	});

	export let pages: number = 1;
	export let num: number = 0;
	export let posts: PostData[] = loaders;
	export let error: Error = { name: '', message: '' };

	onMount(async () => {
		let request: any = await fetch(`/blog/posts${$p.url.search}`);
		const data = await request?.json();
		if (data.error) error = data.error;
		else {
			num = data.num;
			pages = data.pages;
			posts = data.posts;
			if (num === 0) {
				error = { name: '', message: 'No posts found.' };
			}
		}
	});

	$pageProps = {
		title: 'Blog',
		bodyClass: 'page-body',
		menu: true
	};

	$: page = parseInt($p.url.searchParams.get('page') || '1');
</script>

{#if error.message}
	<Message>{error.message}</Message>
{:else}
	<div class="flex justify-center" style="max-width: 1800px;">
		<div class="flex flex-wrap w-full -m-3 md:m-0">
			{#each posts as post}
				<Post {post} />
			{/each}
		</div>
	</div>
{/if}

{#if pages > 1}
	<Pagination {page} {pages} />
{/if}