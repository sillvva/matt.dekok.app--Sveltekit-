<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ session, url }: any) => {
		return {
			props: {
				theme: session.theme || 'dark',
        key: url
			}
		};
	};
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { themes } from '../utils';
  import type { PageProps } from '../store';
  import { pageProps } from '../store';
  import PageBody from '../components/page-body.svelte'
	import '../app.scss';

  export let key: string;

  export let props: PageProps = {};
  pageProps.subscribe(p => {
    props = p;
  });

	export let theme: typeof themes[0];
	export const toggleTheme = (newtheme: typeof themes[0]) => {
		theme = newtheme;
		document.cookie = `theme=${theme}`;
	};
</script>

<div id="app" data-theme={theme} class="min-h-screen min-w-screen">
	{#key theme}
		<div class="bg" data-theme={theme} in:fade out:fade />
	{/key}
	<header>
		<nav>
			<div>
				<button on:click={() => toggleTheme('dark')}>Dark</button>
				<button on:click={() => toggleTheme('light')}>Light</button>
				<button on:click={() => toggleTheme('blue')}>Blue</button>
			</div>
		</nav>
		<div>
			{#key props.title}
				<h1 in:fade={{ delay: 250, duration: 250 }} out:fade={{ duration: 250 }}>{props.title || ""}</h1>
			{/key}
		</div>
	</header>
  <PageBody refresh={key} class={props.bodyClass}>
    <slot />
  </PageBody>
</div>

<style lang="scss">
	.bg {
		@apply fixed inset-0 scale-x-[var(--bgScaleX)] z-0 transition-all duration-500;
		@apply bg-fixed bg-cover bg-no-repeat bg-[color:rgb(var(--background))] bg-[image:var(--bgImg)];
	}

	header {
		@apply flex flex-col items-center;
		@apply fixed top-0 left-0 right-0 z-[3];
		nav {
		}
		> div {
			@apply relative h-9 w-full;
			h1 {
				@apply absolute top-0 left-1/2 -translate-x-1/2 lg:mt-4 lg:mb-4;
				@apply text-3xl text-center font-medium text-[color:var(--headers)];
				@apply transition-all duration-500;
				text-shadow: 1px 1px 0 rgba(var(--background), var(--headerOpacity)),
					-1px -1px 0 rgba(var(--background), var(--headerOpacity)),
					1px -1px 0 rgba(var(--background), var(--headerOpacity)),
					-1px 1px 0 rgba(var(--background), var(--headerOpacity));
			}
		}
	}

	button {
		@apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
	}
</style>
