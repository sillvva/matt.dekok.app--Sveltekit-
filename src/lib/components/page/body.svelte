<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { transitionDuration } from '$lib/constants';

	export let key: string;
	export let loaded: boolean;

	let delay = 0;
	onMount(() => {
		delay = transitionDuration / 2;
	});

	let className = '';
	export { className as class };
	$: key = key + (loaded ? 1 : 0);
</script>

{#key key}
	<main
		class={className}
		class:loaded
		in:fade={{ delay, duration: transitionDuration / 2 }}
		out:fade={{ duration: transitionDuration / 2 }}
	>
		<slot />
	</main>
{/key}

<style lang="scss">
	main {
		@apply hidden flex-col justify-center items-center;
		@apply px-2 md:px-4 pb-4;
		@apply relative z-[2];
		&.page-body {
			@apply mt-24 lg:mt-36;
		}
		&.loaded {
			@apply flex;
		}
	}
</style>
