<script lang="ts">
	import { onMount } from 'svelte';

	let codespan: HTMLElement;

	onMount(() => {
		codespan.innerHTML = codespan.innerHTML.replace(/^`*([^`]+)`*$/, '$1');
	});
</script>

<code bind:this={codespan}><slot /></code>

<style lang="scss">
	code {
		@apply px-1 mx-1 outline outline-1 rounded-sm bg-white/10;
	}
</style>
