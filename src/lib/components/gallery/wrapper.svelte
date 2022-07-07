<script lang="ts">
	export let link = '';
</script>

{#if link}
	<a href={link} target="_blank" rel="noopener noreferrer">
		<slot />
	</a>
{:else}
	<div>
		<slot />
	</div>
{/if}

<style lang="scss">
	a,
	div {
		@apply w-full h-full aspect-video relative block bg-theme-article shadow-lg rounded-md overflow-hidden transition-all duration-500 p-2;
		--tw-shadow-color: var(--shadowColor);
		--tw-shadow: var(--tw-shadow-colored);
	}
	a:hover {
		@apply shadow-xl;
		--tw-shadow-color: var(--shadowHover);
		--tw-shadow: var(--tw-shadow-colored);
	}
</style>
