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
			<h3 class="intro-title">Full&nbsp;Stack Web&nbsp;Developer</h3>
		</div>
		<div class="menu-container">
			<HexMenu
				{items}
				maxLength={3}
				classes={[
					'hidden lg:block',
					'[--scale:0.7]',
					'3xs:[--scale:0.8]',
					'md:[--scale:0.9]',
					'xl:[--scale:1.2]'
				]}
				itemClasses={['bounce']}
				rotated={true}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.me {
		@apply fixed inset-0 md:grid grid-cols-12 grid-rows-6;
		@apply bg-left-bottom bg-no-repeat bg-cover;
	}

	.intro {
		@apply flex md:block flex-col h-full justify-end col-start-6 col-span-6 row-start-2 row-span-3 2xl:col-start-5;
		@apply relative z-[2];
	}

	.intro-subject {
		@apply flex flex-col mt-0 md:fixed bottom-12 left-0 right-0 z-10 text-center md:relative md:text-right md:bottom-0;
		font-family: 'Montserrat', sans-serif;
		text-shadow: 2px 2px rgb(var(--color-bg-body)), 1px 1px 5px rgb(var(--color-bg-body));
	}

	.intro-name {
		@apply text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold tracking-widest;
		font-family: 'Montserrat', sans-serif;
	}

	.intro-title {
		@apply text-xl sm:text-3xl xl:text-4xl font-medium tracking-normal;
	}

	.menu-container {
		@apply flex flex-row justify-center md:flex-col md:items-end my-4 md:mt-8;
	}
</style>
