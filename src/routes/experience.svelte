<script lang="ts">
	import { page } from '$app/stores';
	import { pageProps } from '$lib/store';
	import Article from '$lib/components/page/article.svelte';
	import Section from '$lib/components/page/section.svelte';
	import Header from '$lib/components/page/section-header.svelte';
	import SectionItems from '$lib/components/page/section-items.svelte';
	import type { ExperienceArrSection } from './experience';
	import { metaTags } from '$lib/utils';

	$pageProps = {
		title: 'Experience',
		bodyClass: 'page-body',
		menu: true
	};

	export let experience: ExperienceArrSection[];

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

<Article class="w-full md:w-9/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12">
	{#each experience as section}
		<Section>
			<Header>{section.name}</Header>
			<SectionItems items={section.experience} />
		</Section>
	{/each}
</Article>
