<script lang="ts">
	import { onMount } from 'svelte';

	export let component: string;
	export let description: string;
	export let props: any;

	let LoadedComponent: any;

	onMount(async () => {
		if (component == 'post') {
			LoadedComponent = await import('$lib/components/blog/post.svelte').then((c) => c.default);
		}
	});
</script>

<div class="component-container">
	{#if description}
		<p>{description}</p>
	{/if}
	{#if LoadedComponent}
		<div class="demo">
			<svelte:component this={LoadedComponent} {...props} on:click={(e) => e.preventDefault()} />
		</div>
	{/if}
</div>

<style lang="scss">
	.component-container {
		@apply flex flex-col text-sm mb-4 pt-2 md:p-2 pb-0 bg-gray-800 rounded-lg;
		p {
			@apply m-3 md:mb-0 text-white;
		}
		.demo {
			@apply grid w-full;
		}
	}
</style>
