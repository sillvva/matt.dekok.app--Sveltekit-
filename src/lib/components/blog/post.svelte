<script lang="ts">
	import { ripple } from '$lib/directives';
	import Image from '$lib/components/common/image.svelte';
	import type { PostData } from '$lib/types/blog';

	export let post: PostData;
	let active = false;
</script>

<a
	href={post.link ? post.link : `/blog/${post.slug}`}
	target={post.link ? '_blank' : ''}
	rel={post.link ? 'noreferrer noopener' : ''}
	onClick={() => (active = true)}
>
	<div class="post-container" class:focused={active && !post.link} use:ripple>
		<div class="post-image" class:animate-pulse={!post.slug && !post.link}>
			{#if post.image}
				<Image src={post.image} alt={post.title} />
			{/if}
		</div>
		{#if post.slug || post.link}
			<div class="p-3">
				<h1 class="text-lg font-semibold">{post.title}</h1>
				<p class="text-gray-400">
					{new Date(post.date).toLocaleDateString('en-us', {
						weekday: 'long',
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</p>
				<p style:color="var(--text)">{post.description}</p>
			</div>
		{:else}
			<div class="p-3 w-full">
				<div class="loading-line title max-w-[200px]">
					<span />
				</div>
				<div class="loading-line text max-w-[150px]">
					<span />
				</div>
				<div class="loading-line text">
					<span />
				</div>
				<div class="loading-line text">
					<span />
				</div>
			</div>
		{/if}
	</div>
</a>

<style lang="scss">
	a {
		@apply basis-full md:basis-6/12 xl:basis-4/12 p-1 md:p-3;
		.post-container {
			@apply flex relative h-full shadow-lg ring-1 rounded-lg ring-gray-900/5 overflow-hidden;
			@apply bg-[color:var(--article)] transition-all duration-500 ease-linear isolate;
			@apply [--tw-shadow-color:var(--shadowColor)] [--tw-shadow:var(--tw-shadow-colored)];
			&:hover {
				@apply shadow-xl [--tw-shadow-color:var(--shadowHover)];
			}
			.post-image {
				@apply relative bg-clip-content bg-cover bg-center h-full min-w-[128px] max-w-[30%] text-white bg-gray-500/60;
			}
			@media (max-width: 430px) {
				@apply flex-col;
				.post-image {
					@apply min-w-full max-w-full h-[40vw];
				}
			}
			&.focused {
				@apply relative z-0;
				&::before {
					content: '';
					@apply absolute -left-1/2 -top-1/2 -z-20 w-[200%] h-[200%] animate-spin-medium;
					@apply left-[calc(50%-max(60vw,50vh))] top-[calc(50%-max(60vw,50vh))] w-[max(120vw,100vh)] h-[max(120vw,100vh)];
					@apply bg-[color:rgb(var(--background))] bg-no-repeat;
					background-image: conic-gradient(
						var(--article) 0deg,
						var(--link) 90deg,
						var(--article) 90deg,
						var(--article) 180deg,
						var(--article) 180deg,
						var(--link) 270deg,
						var(--article) 270deg,
						var(--article) 360deg
					);
				}
				&::after {
					content: '';
					@apply absolute -z-10 inset-1 rounded-[5px] bg-[color:var(--article)];
				}
			}
		}
	}
</style>
