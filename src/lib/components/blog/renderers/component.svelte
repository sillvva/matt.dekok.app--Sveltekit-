<script lang="ts">
	import { onMount } from 'svelte';

	export let component: string;
	export let props: any;

	let LoadedComponent: any;

	onMount(async () => {
		if (component == "post") {
			LoadedComponent = await import("$lib/components/blog/post.svelte").then((c) => c.default);
		}
	});
</script>

{#if LoadedComponent}
	<div class="component-container">
    <svelte:component this={LoadedComponent} {...props} on:click={e => { e.preventDefault(); return false; }} />
  </div>
{/if}