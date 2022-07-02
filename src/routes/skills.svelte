<script lang="ts">
	import { page } from '$app/stores';
	import { pageProps } from '$lib/store';
	import Article from '$lib/components/page/article.svelte';
	import Section from '$lib/components/rating/section.svelte';
	import Item from '$lib/components/rating/item.svelte';
	import type { SkillSection } from './skills';
	import { metaTags } from '$lib/utils';

	$pageProps = {
		title: 'Skills',
		bodyClass: 'page-body',
		menu: true
	};

	export let skills: SkillSection[] = [];
	const cols = {
		sm: 12,
		md: 6,
		xl: 4
	};

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

<Article class="w-full sm:w-8/12 md:w-10/12 lg:w-9/12">
	{#each skills as section}
		<Section name={section.name} columns={cols}>
			{#each section.skills as skill}
				<Item rating={skill} />
			{/each}
		</Section>
	{/each}
</Article>
