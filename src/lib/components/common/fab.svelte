<script lang="ts">
let className = "";
export { className as class };
export let href: string | undefined = "";
export let ariaLabel: string = "";
export let active: boolean = false;
</script>

<a role="button" href={href || null} class={className} class:active on:click aria-label={ariaLabel}>
  <slot />
</a>

<style lang="scss">
a {
  @apply flex justify-center items-center w-12 h-12 rounded-full text-2xl cursor-pointer;
  @apply transition-[background] duration-500 ease-linear bg-transparent text-theme-base;
  &.menu-fab {
    @apply lg:hidden;
  }
  &.nav-fab {
    @apply my-4 xs:my-2;
  }
  &.drawer-fab {
    @apply hidden;
  }
  &:hover,
  &.active {
    @apply bg-theme-link text-theme-button;
  }
}
</style>
