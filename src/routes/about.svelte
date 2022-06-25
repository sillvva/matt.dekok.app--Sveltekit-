<script lang="ts">
	import { pageProps } from '../store';

	pageProps.set({
		title: 'About Me',
    bodyClass: "page-body",
    menu: true
	});
</script>

<h1 class="text-3xl font-bold">Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<a href="/">Home Page</a>
