<script lang="ts">
import { conClasses } from "$lib/utils";

let className = "";
export { className as class };
export let href: string | undefined = "";
export let ariaLabel: string = "";
export let active: boolean = false;
</script>

<a
  role="button"
  href={href || null}
  class={conClasses([
    "flex justify-center items-center w-12 h-12 rounded-full text-2xl cursor-pointer",
    "transition-[background] duration-500 ease-linear text-theme-base",
    "hover:bg-theme-link hover:text-theme-button",
    className,
    active && "bg-theme-link text-theme-button"
  ])}
  on:click
  aria-label={ariaLabel}>
  <slot />
</a>

<style lang="scss">
.menu-fab {
  @apply lg:hidden;
}
.nav-fab {
  @apply my-4 xs:my-2;
}
.drawer-fab {
  @apply hidden;
}
</style>
