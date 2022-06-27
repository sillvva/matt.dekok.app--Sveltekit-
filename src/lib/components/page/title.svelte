<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { transitionDuration } from '$lib/constants';

	export let key = '';

	let delay = 0;
	onMount(() => {
		const d = transitionDuration / 2;
		if (key) {
			setTimeout(() => {
				delay = d;
			}, d);
		} else delay = d;
	});

	let className = '';
	export { className as class };
</script>

{#key key}
	<h1
		class={className}
		in:fade={{ delay, duration: transitionDuration / 2 }}
		out:fade={{ duration: transitionDuration / 2 }}
	>
		<slot />
	</h1>
{/key}

<style lang="scss">
	h1 {
		font-family: 'Montserrat', sans-serif;
		@apply text-3xl text-center lg:mt-4 lg:mb-4 font-medium text-[color:var(--headers)];
		text-shadow: 1px 1px 0 rgba(var(--background), var(--headerOpacity)),
			-1px -1px 0 rgba(var(--background), var(--headerOpacity)),
			1px -1px 0 rgba(var(--background), var(--headerOpacity)),
			-1px 1px 0 rgba(var(--background), var(--headerOpacity));
		&.nav-title {
			@apply block lg:hidden flex-1 p-2;
			@apply absolute inset-0;
			&.small-title {
				@apply text-sm sm:text-lg md:text-2xl;
			}
		}
	}
</style>
