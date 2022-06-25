<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { parse } from 'cookie';
	import { themes } from '$lib/utils';

	export const load: Load = async ({ session, url }) => {
		const cookie = typeof document !== 'undefined' ? parse(document.cookie) : session;
		return {
			props: {
				theme: cookie.theme || themes[0],
				path: url.pathname
			}
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { mdiBrightness6, mdiMenu, mdiChevronLeft } from '@mdi/js';
	import { pageProps } from '$lib/store';
	import PageBody from '$lib/components/page/body.svelte';
	import Title from '$lib/components/page/title.svelte';
	import Fab from '$lib/components/fab.svelte';
	import Icon from '$lib/components/icon.svelte';
	import '../app.scss';

	let loaded = false;
	onMount(() => {
		loaded = true;
	});

	export let path: string;
	let scroll = 0;

	export let theme: typeof themes[0];
	const toggleTheme = (newtheme?: typeof themes[0]) => {
		const nextTheme = themes[(themes.indexOf(newtheme || theme || '') + 1) % themes.length];
		theme = newtheme || nextTheme;
		document.cookie = `theme=${theme}`;
	};

	$: smallTitle = ($pageProps.title || '').length > 12 ? 'small-title' : '';
</script>

<svelte:window bind:scrollY={scroll} />

<svelte:head>
	<title>{$pageProps.title ? `${$pageProps.title} - ` : ''}Matt DeKok</title>
</svelte:head>

<div id="app" data-scroll={scroll} data-theme={theme} class="min-h-screen min-w-full">
	{#key theme}
		<div class="bg" data-theme={theme} in:fade out:fade />
	{/key}
	<header>
		<div class="navbar">
			{#if $pageProps.backTo === true}
				<Fab href="/">
					<Icon path={mdiChevronLeft} />
				</Fab>
			{:else if $pageProps.backTo}
				<Fab href={$pageProps?.backTo}>
					<Icon path={mdiChevronLeft} />
				</Fab>
			{:else}
				<Fab aria-label="Open Drawer" class={`menu-fab`}>
					<Icon path={mdiMenu} />
				</Fab>
			{/if}
			<div class="menu-container">
				{#if $pageProps.menu}
					<nav in:fade={{ delay: loaded ? 250 : 0, duration: 250 }} out:fade={{ duration: 250 }}>
						Menu Goes Here
					</nav>
				{/if}
			</div>
			<Title key={$pageProps.title} class={`nav-title ${smallTitle}`}
				>{$pageProps.title || ''}</Title
			>
			<Fab class="nav-fab" on:click={() => toggleTheme()}>
				<Icon path={mdiBrightness6} size={1.2} />
			</Fab>
		</div>
		<div class="relative h-14 w-full hidden lg:block">
			{#if loaded}
				<Title key={$pageProps.title}>
					{$pageProps.title || ''}
				</Title>
			{/if}
		</div>
	</header>
	{#if loaded}
		<PageBody refresh={path} class={$pageProps.bodyClass}>
			<slot />
		</PageBody>
	{/if}
</div>

<style lang="scss">
	.bg {
		@apply fixed inset-0 scale-x-[var(--bgScaleX)] z-0;
		@apply bg-fixed bg-cover bg-no-repeat bg-[color:rgb(var(--background))] bg-[image:var(--bgImg)];
	}

	header {
		@apply flex flex-col items-center transition-[backdrop-filter] duration-500;
		@apply fixed top-0 left-0 right-0 z-[3];
		#app[data-scroll]:not([data-scroll='0']) & {
			@apply backdrop-blur-lg bg-[color:rgba(var(--background),var(--headerOpacity))];
		}
		.navbar {
			@apply flex w-full px-3 items-center text-center max-h-[80px];
			@media (max-width: 400px) {
				@apply px-0;
			}
			.menu-container {
				@apply flex-1 hidden lg:block lg:pl-14;
			}
		}
	}
</style>
