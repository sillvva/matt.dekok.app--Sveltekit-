<script lang="ts">
	import { page } from '$app/stores';
	import { pageProps } from '$lib/store';
	import GalleryItem from '$lib/components/gallery/item.svelte';
	import type { Project } from './projects';
	import { metaTags } from '$lib/utils';

	$pageProps = {
		title: 'Projects',
		bodyClass: 'page-body',
		menu: true
	};

	export let projects: Project[] = [];

	$: metaProps = metaTags($pageProps, $page.url.origin, $page.url.pathname);
</script>

<svelte:head>
	<title>{metaProps.title}</title>
	<meta name="description" content={metaProps.description} />

	{#each Object.entries(metaProps.ogProperties) as t}
		<meta name={`og:${t[0]}`} property={`og:${t[0]}`} content={t[1]} />
	{/each}
	{#each Object.entries(metaProps.twProperties) as t}
		<meta name={`twitter:${t[0]}`} content={t[1]} />
	{/each}
</svelte:head>

<div class="flex flex-wrap justify-center lg:mt-0 pb-4 w-full">
	<div class="p-0 md:p-2 basis-full 2xl:basis-11/12">
		<div class="flex flex-wrap -m-2 justify-center md:justify-start">
			{#each projects as project}
				<div class="p-1 px-0 sm:p-3 basis-full sm:basis-9/12 md:basis-6/12 xl:basis-4/12 aspect-video">
					<GalleryItem
						image={project.image}
						title={project.title}
						subtitle={project.subtitle}
						description={project.description}
						link={project.link}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
