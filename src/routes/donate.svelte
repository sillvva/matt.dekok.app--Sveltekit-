<script lang="ts">
	import { pageProps } from '$lib/store';
	import Article from '$lib/components/page/article.svelte';
	import Section from '$lib/components/page/section.svelte';
	import Header from '$lib/components/page/section-header.svelte';

	$pageProps = {
		title: 'Donate',
		bodyClass: 'page-body',
		menu: true
	};
</script>

<Article class="w-full md:w-9/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12">
	<Section>
		<Header>Welcome to SvelteKit</Header>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	</Section>
</Article>
