<script lang="ts">
	import Image from '$lib/components/common/image.svelte';
	import type { ExperienceItem } from 'src/routes/experience';

	export let items: ExperienceItem[];
</script>

<div class="section-items">
	{#each items as item}
		<div class="section-item">
			<div class="section-item__image">
				<Image
					src={item.image}
					alt={item.name || ''}
					objectFit="contain"
					class="max-w-[56px] max-h-[56px] rounded-sm"
				/>
			</div>
			<div class="section-item__content">
				<h3>
					{#if !item.nameLink}
						{item.name}
					{:else}
						<a href={item.nameLink} target="_blank" rel="noreferrer noopener">
							{item.name}
						</a>
					{/if}
				</h3>
				<h4>
					{#if !item.h4Link}
						{item.h4}
					{:else}
						<a href={item.h4Link} target="_blank" rel="noreferrer noopener">
							{item.h4}
						</a>
					{/if}
				</h4>
				<h5>
					{#if !item.h5Link}
						{item.h5}
					{:else}
						<a href={item.h5Link} target="_blank" rel="noreferrer noopener">
							{item.h5}
						</a>
					{/if}
				</h5>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.section-items {
		@apply grid grid-cols-2 gap-y-5 gap-x-2;
		@media (max-width: 991px) {
			@apply grid-cols-1;
		}
		.section-item {
			@apply text-[color:var(--text)] min-h-[60px] overflow-hidden;
			@media (max-width: 991px) {
				@apply pb-5;
				border-bottom: 1px solid rgba(0, 0, 0, 0.15);
				&:last-child {
					@apply pb-0 border-0;
				}
			}
			.section-item__image {
				@apply relative float-left w-14 h-14 grid justify-center items-center bg-white rounded-sm relative;
			}
			.section-item__content {
				@apply ml-20;
				h3 {
					@apply text-base font-medium m-0;
					font-family: 'Montserrat', sans-serif;
				}
				h4 {
					@apply text-sm font-light mb-1;
					a {
						@apply font-normal;
					}
				}
				h5 {
					@apply text-sm font-light m-0;
					a {
						@apply font-normal;
					}
				}
			}
		}
	}
</style>
