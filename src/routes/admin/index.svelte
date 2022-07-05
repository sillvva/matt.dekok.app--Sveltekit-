<script lang="ts">
	import { onMount } from 'svelte';
	import { mdiUpload, mdiTrashCan } from '@mdi/js';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/connection';
	import { admin } from '$lib/store';
	import Icon from '$lib/components/common/icon.svelte';

	let search: string = '';

	let numLoaders = $admin.numposts || 6;
	let loaders = numLoaders;

	const checkError = async (error: any) => {
		if (error === 'Unauthorized') {
			alert('Unauthorized user');
			await supabase.auth.signOut();
			session.set({ ...$session, auth: null });
			await goto('/', { replaceState: true });
			return true;
		} else if (error) {
			alert(error);
			return true;
		}
		return false;
	};

	onMount(async () => {
		const response = await fetch('/admin/data?select=posts', {
			headers: {
				authorization: `Bearer ${$session.auth.access_token}`
			}
		});
		const data = await response.json();
		if (await checkError(data.error)) return;

		loaders = 0;
		admin.set({ ...admin, ...data });
	});

	const upload = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '*/*';
		input.onchange = async () => {
			if (!input.files) return;
			const file = input.files[0];
			if (!file.name.endsWith('.md')) return alert('Only markdown files are supported');
			const formData = new FormData();
			formData.append('file', file);
			formData.append('filename', file.name);
			loaders = numLoaders + 1;
			const response = await fetch('/admin/data?select=posts', {
				method: 'POST',
				headers: {
					authorization: `Bearer ${$session.auth.access_token}`
				},
				body: formData
			});
			const data = await response.json();
			if (await checkError(data.error)) return;

			loaders = 0;
			admin.set({ ...admin, ...data });
		};
		input.click();
	};

	const remove = async (slug: string) => {
		if (!confirm('Are you sure you want to delete this post?')) return;
		loaders = Math.max(1, numLoaders - 1);
		const response = await fetch(`/admin/data?select=posts&slug=${slug}`, {
			method: 'DELETE',
			headers: {
				authorization: `Bearer ${$session.auth.access_token}`
			}
		});
		const data = await response.json();
		if (await checkError(data.error)) return;

		loaders = 0;
		admin.set({ ...admin, ...data });
	};

	$: filteredPosts = ($admin.posts || [])
		.filter((post) => {
			return (
				post.title.toLowerCase().includes(search.toLowerCase()) ||
				(post.description || '').toLowerCase().includes(search.toLowerCase()) ||
				(post.tags || []).find((tag) => tag.toLowerCase() == search.toLowerCase())
			);
		})
		.sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1));
</script>

<div class="flex gap-4 mb-4">
	<div class="flex-1">
		<input type="text" bind:value={search} placeholder="Search" class="p-2 rounded-md w-full" />
	</div>
	<div class="md:flex-1 flex justify-end gap-4">
		<button on:click={upload}>
			<Icon path={mdiUpload} />
		</button>
	</div>
</div>
<div class="flex flex-col gap-2">
	{#if loaders == 0}
		{#each filteredPosts as post}
			<div
				class="flex items-center md:items-start bg-[color:var(--article)] p-2 md:p-4 gap-4 rounded-md shadow-md"
				style:--tw-shadow-color="#0006"
				style:--tw-shadow="var(--tw-shadow-colored)"
			>
				<div class="flex flex-1 flex-col">
					<div class="flex-1 font-medium pr-4">
						<a href={`/blog/${post.slug}`} target="_blank">{post.title}</a>
					</div>
					<div class="hidden sm:block">
						{post.description}
					</div>
				</div>
				<button on:click={() => remove(post.slug)}>
					<Icon path={mdiTrashCan} />
				</button>
			</div>
		{/each}
	{:else}
		{#each new Array(loaders).fill(1) as i}
			<div class="flex flex-col gap-2 bg-[color:var(--article)] p-2 md:p-4 rounded-md">
				<div class="loading-line title max-w-xs">
					<span />
				</div>
				<div class="loading-line text">
					<span />
				</div>
			</div>
		{/each}
	{/if}
</div>
