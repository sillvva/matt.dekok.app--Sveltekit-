<script lang="ts">
	import { pageProps } from '$lib/store';
  import SvelteMarkdown from 'svelte-markdown'
	import Article from '$lib/components/page/article.svelte';
	import Section from '$lib/components/page/section.svelte';
	import Image from '$lib/components/common/image.svelte';
	import type { PostProps } from '$lib/types/blog';

	// Renderers
	import code from '$lib/components/blog/renderers/code.svelte';
	import heading from '$lib/components/blog/renderers/heading.svelte';
	import paragraph from '$lib/components/blog/renderers/paragraph.svelte';
	import codespan from '$lib/components/blog/renderers/codespan.svelte';
	import image from '$lib/components/blog/renderers/image.svelte';

	export let data: PostProps;
	export let content: string;

	$pageProps = {
		title: data.title,
		bodyClass: 'page-body',
		menu: true
	};

	const renderers = {
		code,
		heading,
		paragraph,
		codespan,
		image
	};
</script>

<Article class="w-full md:w-9/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12">
	{#if !data.full}
		<div class="aspect-video relative">
			<Image src={data.image} alt="Cover" objectFit="cover" />
		</div>
	{/if}
	<Section>
		<p class="mb-4 text-gray-400" aria-label="Date published">
			{data.date}
			{data.updated && `(Updated: ${data.updated})`}
		</p>
		<div class="blog-content">
			<SvelteMarkdown source={content} {renderers} />
		</div>
		{#if !!(data.tags || []).length}
			<p class="mt-4 mb-2">Tags:</p>
			<div class="flex flex-wrap gap-2">
				{#each data.tags as tag}
					<span class="rounded-full text-white py-1 px-3 bg-[color:var(--menuActive)]">
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</Section>
</Article>

<style lang="scss">
	.blog-content {
		@apply mb-4;
	}
</style>
