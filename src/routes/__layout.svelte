<script lang="ts" context="module">
	import type { Load } from './__types/__layout';
	export const load: Load = async ({ url }) => {
		return {
			props: {
				path: `${url.pathname}${url.search}`
			}
		};
	};
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { session } from '$app/stores';
	import { browser } from '$app/env';
	import { mdiBrightness6, mdiMenu, mdiChevronLeft } from '@mdi/js';
	import type { Item } from '$lib/types/hex-menu';
	import { pageProps, drawer } from '$lib/store';
	import { themes } from '$lib/utils';
	import { transitionDuration } from '$lib/constants';
	import PageBody from '$lib/components/page/body.svelte';
	import Menu from '$lib/components/page/menu.svelte';
	import Title from '$lib/components/page/title.svelte';
	import Drawer from '$lib/components/page/drawer.svelte';
	import Fab from '$lib/components/common/fab.svelte';
	import Icon from '$lib/components/common/icon.svelte';
	import '../app.scss';
	import '../misc.scss';
	import '../anim.scss';

	let theme = $session.theme;
	const toggleTheme = (newtheme?: typeof theme) => {
		const nextTheme = themes[(themes.indexOf(newtheme || theme) + 1) % themes.length];
		theme = newtheme || nextTheme;
		document.cookie = `theme=${theme}`;
	};

	let mm: MediaQueryList;
	if (browser) mm = matchMedia('(prefers-color-scheme: dark)');
	const listener = () => mm && toggleTheme(mm.matches ? 'dark' : 'light');

	let loaded = false;
	let delay = 0;
	onMount(() => {
		loaded = true;
		if (mm) mm.addEventListener('change', listener);

		setTimeout(() => {
			delay = transitionDuration / 2;
		}, transitionDuration / 2);
	});

	onDestroy(() => {
		if (mm) mm.removeEventListener('change', listener);
	});

	let scroll = 0;
	export let path: string;

	const menuItems: Item[] = [
		{ link: '/', label: 'Intro' },
		{ link: '/about', label: 'About Me' },
		{ link: '/experience', label: 'Experience' },
		{ link: '/skills', label: 'Skills' },
		{ link: '/projects', label: 'Projects' },
		{ link: '/blog', label: 'Blog' }
	];

	$: smallTitle = ($pageProps.title || '').length > 12 ? 'small-title' : '';
</script>

<svelte:window bind:scrollY={scroll} />

<svelte:head>
	<title>{$pageProps.title ? `${$pageProps.title} - ` : ''}Matt DeKok</title>
</svelte:head>

<div id="app" data-scroll={scroll} data-theme={theme} class="min-h-screen min-w-full">
	{#key theme}
		<div
			class="bg"
			data-theme={theme}
			in:fade={{ duration: transitionDuration }}
			out:fade={{ duration: transitionDuration }}
		/>
	{/key}
	<header>
		<div class="navbar">
			{#if $pageProps.backTo === true}
				<Fab href="/">
					<Icon path={mdiChevronLeft} />
				</Fab>
			{:else if $pageProps.backTo}
				<Fab ariaLabel="Back" href={$pageProps?.backTo}>
					<Icon path={mdiChevronLeft} />
				</Fab>
			{:else}
				<Fab ariaLabel="Open Drawer" class={`menu-fab`} on:click={() => ($drawer = !$drawer)}>
					<Icon path={mdiMenu} />
				</Fab>
			{/if}
			<div class="menu-container">
				{#if $pageProps.menu}
					<nav
						class="page-menu"
						in:fade={{ delay, duration: transitionDuration / 2 }}
						out:fade={{ duration: transitionDuration / 2 }}
					>
						<Menu items={menuItems} />
					</nav>
				{/if}
				<Title key={$pageProps.title} class={`nav-title ${smallTitle}`}>
					{$pageProps.title || ''}
				</Title>
			</div>
			<Fab ariaLabel="Toggle Theme" class="nav-fab" on:click={() => toggleTheme()}>
				<Icon path={mdiBrightness6} size={1.1} />
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
		<PageBody key={path} class={$pageProps.bodyClass}>
			<slot />
		</PageBody>
	{/if}
	{#if $drawer}
		<Drawer {menuItems} />
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
			@apply flex w-full py-4 px-2 2xs:px-3 items-center text-center max-h-[80px];
			.menu-container {
				@apply flex-1 block lg:pl-14 relative h-14;
				.page-menu {
					@apply hidden lg:flex justify-center gap-3 px-3;
				}
			}
		}
	}
</style>
