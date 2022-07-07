<script lang="ts">
	let className = '';
	export { className as class };
</script>

<section on:click class={className}>
  <slot />
</section>

<style lang="scss">
  section {
    @apply p-5 border-solid border-b-black/25 border-b-[1px] text-theme-base;
    &:last-child {
      @apply border-b-0;
    }
  }
</style>