<script lang="ts">
	import Image from '$lib/components/common/image.svelte';

	export let href = '';
	export let title: string | undefined = undefined;
	export let text = '';
</script>

<figure>
	<a {href} target="_blank" rel="noreferrer noopener">
		<Image src={href} {title} alt={text} class="object-cover md:object-contain" objectFit="contain" />
	</a>
	<figcaption>Click to open full screen</figcaption>
</figure>

<style lang="scss">
	figure {
		@apply flex flex-col mb-6 mt-6;
		a {
			@apply relative flex justify-center w-full max-w-[800px] mb-2 mx-auto aspect-video;
		}
		figcaption {
			@apply block text-white/70 text-sm text-center;
		}
	}
</style>
