<script lang="ts">
	import { pageProps } from '$lib/store';
	import Article from '$lib/components/page/article.svelte';
	import Section from '$lib/components/rating/section.svelte';
	import Item from '$lib/components/rating/item.svelte';
	import type { SkillPropsSection } from './skills';

	$pageProps = {
		title: 'Skills',
		bodyClass: 'page-body',
		menu: true
	};

	export let skills: SkillPropsSection[] = [];
	const cols = {
		sm: 12,
		md: 6,
		xl: 4
	};
</script>

<Article class="w-full sm:w-8/12 md:w-10/12 lg:w-9/12">
	{#each skills as section}
		<Section name={section.name} columns={cols}>
			{#each section.skills as skill}
				<Item rating={skill} />
			{/each}
		</Section>
	{/each}
</Article>
