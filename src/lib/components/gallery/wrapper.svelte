<script lang="ts">
import { conClasses } from "$lib/utils";

export let link = "";
</script>

{#if link}
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    class={conClasses([
      "relative block overflow-hidden w-full h-full aspect-video rounded-md p-2",
      "bg-theme-article shadow-lg hover:shadow-xl transition-all duration-500"
    ])}
    style:--tw-shadow-color="var(--color-bg-shadow)"
    style:--tw-shadow="var(--tw-shadow-colored)">
    <slot />
  </a>
{:else}
  <div
    class={conClasses([
      "relative block overflow-hidden w-full h-full aspect-video rounded-md p-2",
      "bg-theme-article shadow-lg hover:shadow-xl transition-all duration-500"
    ])}
    style:--tw-shadow-color="var(--color-bg-shadow)"
    style:--tw-shadow="var(--tw-shadow-colored)">
    <slot />
  </div>
{/if}
