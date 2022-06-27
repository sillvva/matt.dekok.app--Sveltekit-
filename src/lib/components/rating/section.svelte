<script lang="ts">
	import Section from '$lib/components/page/section.svelte';
	import Header from '$lib/components/page/section-header.svelte';

	type RatingColumnBreakpoints = {
		sm?: number;
		md?: number;
		lg?: number;
		xl?: number;
		'2xl'?: number;
	};

	export let name: string;
	export let columns: RatingColumnBreakpoints; 

	$: colClasses = [
		...(columns.sm ? ['sm:block'] : []),
		...(columns.md ? ['md:block'] : []),
		...(columns.xl ? ['xl:block'] : []),
		...(columns.lg ? ['lg:block'] : []),
		...(columns['2xl'] ? ['2xl:block'] : [])
	];
</script>

<Section class="sm:block md:block lg:block xl:block 2xl:block">
	<Header>{name}</Header>
	<div class="columns">
		{#each colClasses as col, c}
			<div class={['column', c > 0 && `hidden ${col}`].join(' ')}>
				<strong>Skills</strong>
			</div>
			<div class={['column', c > 0 && `hidden ${col}`].join(' ')}>
				<strong>Rating</strong>
			</div>
		{/each}
	</div>
	<div class="body">
		<slot />
	</div>
</Section>

<style lang="scss">
	.body {
		@apply flex flex-wrap -m-3;
	}
	.columns {
		@apply flex flex-wrap -m-3 mt-4 mb-2;
	}
	.column {
		@apply p-3 pt-0.5 basis-0 grow;
		&:nth-child(even) {
			@apply text-right max-w-max;
		}
	}

	.zoom {
		svg {
			@apply w-4 scale-0 inline-block;
			animation: zoom 300ms ease-in-out forwards;
		}
		svg:nth-child(1) {
			animation-delay: 0.4s;
		}
		svg:nth-child(2) {
			animation-delay: 0.525s;
		}
		svg:nth-child(3) {
			animation-delay: 0.65s;
		}
		svg:nth-child(4) {
			animation-delay: 0.775s;
		}
		svg:nth-child(5) {
			animation-delay: 0.9s;
		}
	}
	@keyframes zoom {
		0% {
			transform: scale(0);
		}
		60% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
