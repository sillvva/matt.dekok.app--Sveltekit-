<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/stores';

	export let key: string;

	let delay = 0;
	onMount(() => {
		delay = 250;
	});

	let className = '';
	export { className as class };
</script>

{#key key}
	<main class={className} in:fade={{ delay, duration: 250 }} out:fade={{ duration: 250 }}>
		<slot />
	</main>
{/key}

<style lang="scss">
	main {
		@apply flex flex-col justify-center items-center;
		@apply px-2 md:px-4 pb-4;
		@apply relative z-[2];
		&.page-body {
			@apply mt-36;
		}
	}
</style>
