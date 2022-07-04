<script lang="ts">
	import { page as p } from '$app/stores';

	export let page: number;
	export let pages: number;

	const pagination: (number | null)[] = pages > 1 ? [1, pages] : [];
	if (pagination.length > 0) {
		const inMin = Math.max(2, page - 2);
		const inMax = Math.min(pages - 1, page + 2);
		const inserts =
			pages <= 2
				? []
				: inMax - Math.min(page, inMin) + 1 >= 2
				? Array(inMax - inMin + 1)
						.fill(null)
						.map((x, i) => i + inMin)
				: [2];
		pagination.splice(1, 0, ...inserts);
		if (inMin > 2) pagination.splice(1, 0, null);
		if (pages - inMax >= 2) pagination.splice(-1, 0, null);
	}

	const pageHandler = (newPage: number) => {
		const query = new URLSearchParams($p.url.search);
		if (newPage === 1) query.delete('page');
		else query.set('page', newPage.toString());
		const q = query.toString();
		return `/blog${q ? `?${q}` : ''}`;
	};
</script>

<div class="pagination">
	{#each pagination as p}
		{#if p == page}
			<span class="page active">
				{p}
			</span>
		{:else if p}
			<a href={pageHandler(p)} class="page">
				{p}
			</a>
		{:else}
			<span class="separator"> | </span>
		{/if}
	{/each}
</div>

<style lang="scss">
	.pagination {
		@apply flex justify-center gap-2 my-4;
		.page {
			@apply inline-flex w-8 h-8 justify-center items-center rounded-sm font-bold drop-shadow-sm;
			background-color: var(--article);
			&:hover,
			&.active {
				@apply text-white;
				background-color: var(--link);
				text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
			}
		}
		.separator {
			@apply inline-flex w-8 h-8 justify-center items-center;
		}
	}
</style>
