<script lang="ts">
	let className = '';
	export { className as class };
</script>

<section class={className}>
  <slot />
</section>

<style lang="scss">
  section {
    @apply p-5 border-solid border-b-black/25 border-b-[1px] text-[color:var(--text)];
    &:last-child {
      @apply border-b-0;
    }
  }
</style>