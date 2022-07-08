<script lang="ts">
	import Image from '$lib/components/common/image.svelte';

	export let href = '';
	export let title: string | undefined = undefined;
	export let text = '';
</script>

<figure class="flex flex-col mb-6 mt-6">
	<a {href} target="_blank" rel="noreferrer noopener" class="relative flex justify-center w-full max-w-[800px] mb-2 mx-auto aspect-video">
		<Image src={href} {title} alt={text} class="object-cover md:object-contain" objectFit="contain" />
	</a>
	<figcaption class="block text-white/70 text-sm text-center">Click to open full screen</figcaption>
</figure>