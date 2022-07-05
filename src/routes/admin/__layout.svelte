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
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { User } from '@supabase/supabase-js';
	import { session } from '$app/stores';
	import { browser } from '$app/env';
	import { transitionDuration } from '$lib/constants';
	import { supabase } from '$lib/supabase/connection';
	import { pageProps, admin } from '$lib/store';
	import Article from '$lib/components/page/article.svelte';
	import Section from '$lib/components/page/section.svelte';
	import PageMessage from '$lib/components/page/message.svelte';

	$pageProps = {
		bodyClass: 'page-body admin-body'
	};

	export let path: string;
	let user: User | null;
	let width = 0;
	let expanded = false;

	if (browser) $session.auth = supabase.auth.session();

	onMount(async () => {
		if ($session.auth) user = $session.auth.user;

		if (!user)
			return await supabase.auth.signIn({
				provider: 'github'
			});
	});

	$: paths = [
		{ name: 'Blog', path: '/admin', value: $admin.numposts, label: 'posts' },
		{ name: 'Experience', path: '/admin/experience', value: $admin.numexperience, label: 'items' },
		{ name: 'Skills', path: '/admin/skills', value: $admin.numskills, label: 'skills' },
		{ name: 'Projects', path: '/admin/projects', value: $admin.numprojects, label: 'projects' }
	];
</script>

<svelte:window bind:innerWidth={width} />

{#if user}
	<div class="flex flex-col md:flex-row w-full gap-4">
		<div class="flex-1 md:max-w-[20rem]">
			<Article>
				{#each paths as p}
					{#if path == p.path || expanded || width >= 768}
						<a
							href={p.path}
							class="menu-item block"
							class:active={path == p.path && expanded && width < 768 && paths.length > 1}
						>
							<Section on:click={() => (expanded = !expanded)}>
								<div class="flex">
									<div class="flex-1">
										<span class="text-[color:var(--link)]">{p.name}</span>
									</div>
									<div class="flex-1 min-w-fit text-right">
										{#if typeof p.value !== 'undefined'}
											{p.value} {p.label}
										{:else}
											<div class="loading-line text">
												<span />
											</div>
										{/if}
									</div>
								</div>
							</Section>
						</a>
					{/if}
				{/each}
			</Article>
		</div>
		{#key path}
			<div
				class="flex-1 overflow-hidden"
				in:fade={{ delay: transitionDuration / 2, duration: transitionDuration / 2 }}
				out:fade={{ duration: transitionDuration / 2 }}
			>
				<slot />
			</div>
		{/key}
	</div>
{:else}
	<PageMessage>Authenticating...</PageMessage>
{/if}

<style lang="scss">
	.menu-item {
		@apply border-solid border-b-black/25 border-b-[1px] transition-[background] duration-500;
		&:last-child {
			@apply border-b-0;
		}
		&.active, &:hover {
			@apply bg-[color:rgba(255,255,255,0.1)];
		}
	}
</style>
