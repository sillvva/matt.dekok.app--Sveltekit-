<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { transitionDuration } from '$lib/constants';
	import { conClasses } from '$lib/utils';

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
		class={conClasses([
			'text-3xl text-center text-theme-heading font-medium font-montserrat',
			'drop-shadow-theme-text-outline lg:mt-4 lg:mb-4',
			className,
			className.includes('nav-title') && 'block lg:hidden flex-1 p-2 absolute inset-0',
			className.includes('small-title') &&
				'text-sm sm:text-lg md:text-2xl flex lg:hidden justify-center items-center'
		])}
		in:fade={{ delay, duration: transitionDuration / 2 }}
		out:fade={{ duration: transitionDuration / 2 }}
	>
		<slot />
	</h1>
{/key}
