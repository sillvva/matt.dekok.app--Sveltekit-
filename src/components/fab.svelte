<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function clickHandler(ev: any) {
		dispatch('click', ev);
	}

	let className = '';
	export { className as class };
	export let href: string | undefined = '';
</script>

<a role="button" href={href || null} class={className} on:click={clickHandler}>
	<slot />
</a>

<style lang="scss">
	a {
		@apply flex justify-center items-center w-14 h-14 rounded-full text-2xl cursor-pointer;
		@apply transition-[background] duration-500 ease-linear bg-transparent text-[color:var(--text)];
		&.menu-fab {
			@apply lg:hidden;
		}
		&.nav-fab {
			@apply my-2;
		}
		&:hover {
			@apply bg-[color:var(--link)] text-[color:var(--menuText)];
		}
	}
</style>
