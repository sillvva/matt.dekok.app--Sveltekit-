<script lang="ts">
	let className = '';
	export { className as class };
</script>

<article class={className}>
	<slot />
</article>

<style lang="scss">
	article {
		@apply shadow-xl ring-1 rounded-lg ring-gray-900/5 overflow-hidden;
		@apply bg-[color:var(--article)];
	}
</style>
