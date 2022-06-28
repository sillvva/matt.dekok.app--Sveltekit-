<script lang="ts">
	import { slug } from '$lib/utils';
	export let depth: number;
	export let raw: any;
	export let text: string;
	$: id = slug(text);
</script>

{#if depth === 1}
	<h1 {id}><slot /></h1>
{:else if depth === 2}
	<h2 {id}><slot /></h2>
{:else if depth === 3}
	<h3 {id}><slot /></h3>
{:else if depth === 4}
	<h4 {id}><slot /></h4>
{:else if depth === 5}
	<h5 {id}><slot /></h5>
{:else if depth === 6}
	<h6 {id}><slot /></h6>
{:else}
	{raw}
{/if}

<style lang="scss">
	h1,
	h2,
	h3,
	h4 {
		@apply font-semibold mb-2 mt-4 relative scroll-m-40;
	}
	h1 {
		@apply text-4xl;
	}
	h2 {
		@apply text-2xl;
	}
	h3 {
		@apply text-lg;
	}
	h4 {
		@apply text-base;
	}
</style>
