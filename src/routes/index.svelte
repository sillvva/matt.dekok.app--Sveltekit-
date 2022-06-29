<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { pageProps } from '$lib/store';
	import type { Item } from '$lib/types/hex-menu';
	import Image from '$lib/components/common/image.svelte';
	import HexMenu from '$lib/components/hex-menu/svg.svelte';
	// @ts-ignore
	import MeSS from '$lib/assets/images/me3x.webp?width=500;1000;1500;2000';
	import { metaTags } from '$lib/utils';

	const items: (Item | null)[] = [
		{ link: '/about', label: 'About Me' },
		{ link: '/experience', label: 'Experience' },
		{ link: '/skills', label: 'Skills' },
		{ link: '/projects', label: 'Projects' },
		null,
		{ link: '/blog', label: 'Blog' }
	];

	$pageProps = {
		bodyClass: 'mt-20'
	};

	$: metaProps = metaTags($pageProps, $page.url.origin, $page.url.pathname);
</script>

<svelte:head>
	<title>{metaProps.title}</title>
	<meta name="description" content={metaProps.description} />

	{#each Object.entries(metaProps.ogProperties) as t}
		<meta name={`og:${t[0]}`} property={`og:${t[0]}`} content={t[1]} />
	{/each}
	{#each Object.entries(metaProps.twProperties) as t}
		<meta name={`twitter:${t[0]}`} content={t[1]} />
	{/each}
</svelte:head>

<div class="me">
	<Image
		src={MeSS[0]}
		set={MeSS}
		sizes={[500, 1000, 1500, 2000]}
		alt="Me"
		id="me"
		container="cover-img"
		lazy={false}
	/>
	<div class="intro">
		<div class="intro-subject">
			<h2 class="intro-name">Matt DeKok</h2>
			<h4 class="intro-title">Full&nbsp;Stack Web&nbsp;Developer</h4>
		</div>
		<div class="menu-container hidden flex-col items-end lg:flex mt-8">
			<HexMenu
				{items}
				maxLength={3}
				classes={['hidden lg:block', '[--scale:1]', 'xl:[--scale:1.2]']}
				itemClasses={['bounce']}
				rotated={true}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.me {
		@apply fixed inset-0 grid grid-cols-12 grid-rows-6;
		@apply bg-left-bottom bg-no-repeat bg-cover;
	}

	.intro {
		@apply col-start-6 col-span-6 row-start-2 row-span-3 2xl:col-start-5;
		@apply relative z-[2];
	}

	.intro-subject {
		@apply mt-0 fixed bottom-12 left-0 right-0 z-10 text-center lg:relative lg:text-right lg:bottom-0;
		font-family: 'Montserrat', sans-serif;
		text-shadow: 2px 2px rgb(var(--background)), 1px 1px 5px rgb(var(--background));
	}

	.intro-name {
		@apply text-3xl sm:text-5xl lg:text-5xl font-semibold tracking-widest;
		font-family: 'Montserrat', sans-serif;
	}

	.intro-title {
		@apply text-xl sm:text-3xl xl:text-4xl font-medium tracking-normal;
	}
</style>
