<script lang="ts">
	export let src = ``;
	export let alt = ``;
	export let id = ``;

	let containerClass = '';
	export { containerClass as container };
	let className = '';
	export { className as class };
</script>

<span class={containerClass}>
	<img {id} {src} {alt} class={className} />
</span>

<style lang="scss">
	span {
		@apply transition-all duration-500 bg-none;
		@apply overflow-hidden w-[initial] h-[initial] m-0 p-0;
		@apply absolute inset-0;
		img {
			@apply absolute inset-0 border-none;
			@apply p-0 m-auto block object-cover object-center;
			@apply w-0 h-0 min-w-full max-w-full min-h-full max-h-full;
		}
		&.cover-img {
			@apply -left-36 sm:-left-12 md:left-0;
			@media (max-width: 1023px) {
				&::after {
					content: '';
					@apply fixed z-0 left-0 right-0 bottom-0 h-[80vh];
					background-image: linear-gradient(transparent, rgba(var(--background), 0.8));
				}
			}
			img {
				@apply object-left lg:object-center;
			}
		}
	}
</style>
