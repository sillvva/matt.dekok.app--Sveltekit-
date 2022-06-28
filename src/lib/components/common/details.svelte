<script lang="ts">
	export let name: string;
	export let value: string | number;
	export let full: boolean = false;
</script>

<p class="my-details__name" class:full>
	{name}:
</p>
<p class="my-details__value" class:full>
	{value}
</p>

<style lang="scss">
	.my-details__name {
		@apply w-6/12 sm:w-3/12 md:w-6/12 2xl:w-3/12 text-right md:text-right py-1 px-1.5 font-semibold;
    font-family: sans-serif;
		&.full {
			@apply w-full text-center pb-0 sm:w-3/12 sm:text-right sm:pb-1 md:w-full md:text-center 2xl:w-3/12 2xl:text-right 2xl:pb-1;
		}
	}
	.my-details__value {
		@apply w-6/12 sm:w-3/12 md:w-6/12 2xl:w-3/12 text-left md:text-left py-1 px-1.5;
    font-family: sans-serif;
		&.full {
			@apply w-full text-center pt-0 sm:w-9/12 sm:text-left sm:pt-1 md:w-full md:text-center 2xl:w-9/12 2xl:text-left 2xl:pt-1;
		}
	}
</style>
