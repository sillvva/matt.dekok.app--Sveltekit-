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
	import type { PageProps } from '$lib/store';
	import { pageProps } from '$lib/store';
	import PageBody from '$lib/components/page-body.svelte';
	import Fab from '$lib/components/fab.svelte';
	import Icon from '$lib/components/icon.svelte';
	import '../app.scss';

	export let path: string;
	export let scroll = 0;

	export let loaded = false;
	onMount(() => {
		loaded = true;
	});

	export let theme: typeof themes[0];
	export const toggleTheme = (newtheme?: typeof themes[0]) => {
		const nextTheme = themes[(themes.indexOf(newtheme || theme || '') + 1) % themes.length];
		theme = newtheme || nextTheme;
		document.cookie = `theme=${theme}`;
	};

	export let props: PageProps = {};
	pageProps.subscribe((p) => {
		props = p;
	});

	$: smallTitle = (props.title || "").length > 12 ? 'small-title' : '';
</script>

<svelte:window bind:scrollY={scroll} />

<svelte:head>
	<title>{props.title ? `${props.title} - ` : ''}Matt DeKok</title>
</svelte:head>

<div id="app" data-scroll={scroll} data-theme={theme} class="min-h-screen min-w-full">
	{#key theme}
		<div class="bg" data-theme={theme} in:fade out:fade />
	{/key}
	<header>
		<div class="navbar">
			{#if props.backTo === true}
				<Fab href="/">
					<Icon path={mdiChevronLeft} />
				</Fab>
			{:else if props.backTo}
				<Fab href={props?.backTo}>
					<Icon path={mdiChevronLeft} />
				</Fab>
			{:else}
				<Fab aria-label="Open Drawer" class={`menu-fab`}>
					<Icon path={mdiMenu} />
				</Fab>
			{/if}
			<div class="menu-container lg:pl-14">
				{#if props.menu}
					<nav in:fade={{ delay: 250, duration: 250 }} out:fade={{ duration: 250 }}>
						Menu Goes Here
					</nav>
				{/if}
			</div>
			<h1 class={`nav-title ${smallTitle}`}>{props.title || ''}</h1>
			<Fab class="nav-fab" on:click={() => toggleTheme()}>
				<Icon path={mdiBrightness6} size={1.2} />
			</Fab>
		</div>
		<div class="relative h-14 w-full hidden lg:block">
			{#if loaded}
				{#key props.title}
					<h1 in:fade={{ delay: 250, duration: 250 }} out:fade={{ duration: 250 }}>
						{props.title || ''}
					</h1>
				{/key}
			{/if}
		</div>
	</header>
	{#if loaded}
		<PageBody refresh={path} class={props.bodyClass}>
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
				@apply flex-1 hidden lg:block;
			}
		}
		h1 {
			font-family: 'Montserrat', sans-serif;
			@apply text-3xl text-center lg:mt-4 lg:mb-4 font-medium text-[color:var(--headers)];
			text-shadow: 1px 1px 0 rgba(var(--background), var(--headerOpacity)),
				-1px -1px 0 rgba(var(--background), var(--headerOpacity)),
				1px -1px 0 rgba(var(--background), var(--headerOpacity)),
				-1px 1px 0 rgba(var(--background), var(--headerOpacity));
			&.nav-title {
				@apply block lg:hidden flex-1 p-2;
			  &.small-title {
			    @apply text-sm sm:text-lg md:text-2xl;
			  }
			}
		}
	}
</style>
