<script lang="ts">
	import { pageProps } from '$lib/store';
	import Article from '$lib/components/page/article.svelte';
	import Section from '$lib/components/page/section.svelte';
	import Header from '$lib/components/page/section-header.svelte';

	$pageProps = {
		title: 'Skills',
		bodyClass: 'page-body',
		menu: true
	};
</script>

<Article class="w-full sm:w-8/12 md:w-10/12 lg:w-9/12">
	<Section>
		<Header>Welcome to SvelteKit</Header>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	</Section>
</Article>
