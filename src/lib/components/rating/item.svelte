<script lang="ts">
	import type { Rating } from '$lib/types/rating';
  import Stars from './stars.svelte';

	export let rating: Rating;
</script>

<div class="entry">
	<div class="entry-row">
		<div class="entry-col">{rating.name}</div>
		<div class="entry-col">
			<Stars rating={rating.rating} />
		</div>
	</div>
</div>

<style lang="scss">
	.entry {
		@apply basis-full md:basis-6/12 xl:basis-4/12 p-3 grow-0;
	}
	.entry-row {
		@apply flex -m-3;
	}
	.entry-col {
		@apply p-3 pt-0.5 basis-0 grow;
		@nth-child (even) {
			@apply text-right max-w-max;
		}
	}
</style>
