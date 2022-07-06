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
	import { session, page } from '$app/stores';
	import { browser } from '$app/env';
	import { transitionDuration } from '$lib/constants';
	import { supabase } from '$lib/supabase/connection';
	import { pageProps, admin } from '$lib/store';
	import { conClasses } from '$lib/utils';
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
		console.log($session.auth, user, $page.url.hash)

		if (!user && !$page.url.hash) {
			return await supabase.auth.signIn(
				{
					provider: 'github'
				},
				{
					redirectTo: $page.url.href
				}
			);
		}
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
					<a
						href={p.path}
						class={conClasses([
							'menu-item md:block md:bg-transparent',
							path == p.path || expanded ? 'block' : 'hidden',
							path == p.path && expanded && paths.length > 1 ? 'bg-active' : ''
						])}
						on:click={() => (expanded = !expanded)}
					>
						<Section>
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
				{/each}
			</Article>
			<Article class="hidden md:block">
				<a
					href="https://vercel.com/"
					target="_blank"
					rel="noreferrer noopener"
					class="menu-item block"
				>
					<Section>
						<div class="flex">
							<div class="flex-1">
								<span class="text-[color:var(--link)]">Vercel</span>
							</div>
						</div>
					</Section>
				</a>
				<a
					href="https://app.supabase.com/"
					target="_blank"
					rel="noreferrer noopener"
					class="menu-item block"
				>
					<Section>
						<div class="flex">
							<div class="flex-1">
								<span class="text-[color:var(--link)]">Supabase</span>
							</div>
						</div>
					</Section>
				</a>
			</Article>
		</div>
		<div
			class="flex-1"
			in:fade={{ delay: transitionDuration / 2, duration: transitionDuration / 2 }}
			out:fade={{ duration: transitionDuration / 2 }}
		>
			<slot />
		</div>
	</div>
{:else}
	<PageMessage>Authenticating...</PageMessage>
{/if}

<style lang="scss">
	@tailwind utilities;

	@layer utilities {
		.bg-active {
			@apply bg-[color:rgba(var(--bgInvert),0.1)];
		}
	}
	.menu-item {
		@apply border-solid border-b-black/25 border-b-[1px] transition-[background] duration-500;
		&:last-child {
			@apply border-b-0;
		}
		&.active,
		&:hover {
			@apply bg-active;
		}
	}
</style>
