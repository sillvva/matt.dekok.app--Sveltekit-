<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { debounce, themes } from '../utils';
	import { parse } from 'cookie';

	export const load: Load = async ({ session, url }: any) => {
		const cookie = typeof document !== 'undefined' ? parse(document.cookie) : session;
		return {
			props: {
				theme: cookie.theme || themes[0],
				key: url.pathname
			}
		};
	};
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { mdiBrightness6, mdiMenu, mdiChevronLeft } from '@mdi/js';
	import type { PageProps } from '../store';
	import { pageProps } from '../store';
	import PageBody from '../components/page-body.svelte';
	import Fab from '../components/fab.svelte';
	import Icon from '../components/icon.svelte';
	import '../app.scss';

	export let key: string;

	export let scroll = 0;
	const scrollHandler = debounce(() => {
		scroll = window.scrollY;
	});

	export let loaded = false;
	onMount(() => {
		loaded = true;
		if (typeof window !== 'undefined')
			window.addEventListener('scroll', scrollHandler, { passive: true });
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') window.removeEventListener('scroll', scrollHandler);
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
</script>

<svelte:head>
	<title>{props.title ? `${props.title} - ` : ''}Matt DeKok</title>
</svelte:head>

<div id="app" data-scroll={scroll} data-theme={theme} class="min-h-screen min-w-full">
	{#key theme}
		<div class="bg" data-theme={theme} in:fade out:fade />
	{/key}
	<header>
		<nav class="lg:pl-3">
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
			<div class="menu-container lg:pl-14" />
			<Fab class="nav-fab" on:click={() => toggleTheme()}>
				<Icon path={mdiBrightness6} size={1.2} />
			</Fab>
		</nav>
		<div class="hidden lg:block">
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
		<PageBody refresh={key} class={props.bodyClass}>
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
		nav {
			@apply flex w-full px-3 items-center text-center max-h-[80px];
			// .PageTitle {
			//   @apply p-2;
			//   &.SmallTitle {
			//     @apply text-sm sm:text-lg md:text-2xl;
			//   }
			// }
			@media (max-width: 400px) {
				@apply px-0;
			}
			.menu-container {
				@apply flex-1;
			}
		}
		> div {
			@apply relative h-14 w-full;
			h1 {
				@apply absolute top-0 left-1/2 -translate-x-1/2 lg:mt-3 lg:mb-2;
				@apply text-3xl text-center font-medium text-[color:var(--headers)];
				@apply transition-all duration-500;
				text-shadow: 1px 1px 0 rgba(var(--background), var(--headerOpacity)),
					-1px -1px 0 rgba(var(--background), var(--headerOpacity)),
					1px -1px 0 rgba(var(--background), var(--headerOpacity)),
					-1px 1px 0 rgba(var(--background), var(--headerOpacity));
			}
		}
	}
</style>
