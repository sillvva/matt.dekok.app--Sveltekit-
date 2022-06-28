<script lang="ts">
	import { pageProps } from '$lib/store';
	import Article from '$lib/components/page/article.svelte';
	import Section from '$lib/components/page/section.svelte';
	import Header from '$lib/components/page/section-header.svelte';
	import SectionItems from '$lib/components/page/section-items.svelte';
	import type { ExperienceArrSection } from './experience';

	$pageProps = {
		title: 'Experience',
		bodyClass: 'page-body',
		menu: true
	};

	export let experience: ExperienceArrSection[];
</script>

<Article class="w-full md:w-9/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12">
	{#each experience as section}
		<Section>
			<Header>{section.name}</Header>
			<SectionItems items={section.experience} />
		</Section>
	{/each}
</Article>
