<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function clickHandler(ev: any) {
		dispatch('click', ev);
	}

	let className = '';
	export { className as class };
</script>

<button class={className} on:click={clickHandler}>
	<slot />
</button>

<style lang="scss">
	button {
		@apply flex justify-center items-center w-14 h-14 rounded-full text-2xl cursor-pointer;
		@apply transition-[background] duration-500 ease-linear bg-transparent;
		&.menu-fab {
			@apply lg:hidden;
		}
		&.nav-fab {
			@apply my-2;
		}
		svg {
			@apply w-7 text-[color:var(--text)] transition-all duration-500;
		}
		&:hover {
			@apply bg-[color:var(--link)] text-[color:var(--menuText)];
			svg {
				@apply text-[color:var(--menuText)];
				text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
			}
		}
	}
</style>
