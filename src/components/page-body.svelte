<script lang="ts">
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';
	export let refresh = ``;

	let delay = 0;
	onMount(() => {
		delay = 250;
	});

	let className = '';
	export { className as class };
</script>

{#key refresh}
	<main class={className} in:fade={{ delay, duration: 250 }} out:fade={{ duration: 250 }}>
		<slot />
	</main>
{/key}

<style lang="scss">
	main {
		@apply flex flex-col;
		@apply relative z-[2];
		&.page-body {
			@apply mt-32;
		}
	}
</style>
