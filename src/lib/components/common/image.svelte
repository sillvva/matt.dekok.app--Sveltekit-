<script lang="ts">
	export let src = ``;
	export let set: string[] = [];
	export let sizes: number[] = [];
	export let alt: string;
	export let title: string | undefined = undefined;
	export let lazy = true;
	export let id = ``;
	export let objectFit = `cover`;

	let containerClass = '';
	export { containerClass as container };
	let className = '';
	export { className as class };

	$: srcset = set
		.map((s, i) => {
			return `${s} ${sizes[i]}w`;
		})
		.join(', ');

	$: loading = lazy ? 'lazy' : 'eager';
</script>

<span class={containerClass} style:--fit={objectFit}>
	<img {id} {src} {srcset} {title} {alt} {loading} class={className} />
</span>

<style lang="scss">
	span {
		@apply transition-all duration-500 bg-none;
		@apply overflow-hidden w-[initial] h-[initial] p-0;
		@apply absolute inset-0;
		img {
			@apply absolute inset-0 border-none;
			@apply p-0 m-auto block [object-fit:var(--fit)] object-center;
			@apply w-0 h-0 min-w-full max-w-full min-h-full max-h-full;
		}
		&.cover-img {
			@apply -left-36 xs:-left-20 sm:-left-8 md:-left-28 lg:left-0;
			&::after {
				content: '';
				@apply fixed z-0 left-0 right-0 bottom-0 h-[80vh] lg:hidden;
				background-image: linear-gradient(transparent, rgba(var(--background), 1));
			}
			img {
				@apply object-left lg:object-center;
			}
		}
	}
</style>
