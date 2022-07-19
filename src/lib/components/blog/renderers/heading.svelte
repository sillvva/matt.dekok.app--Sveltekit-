<script lang="ts">
import { conClasses } from "$lib/utils";
import { slug } from "$lib/utils";
export let depth: number;
export let raw: any = "";
export let text: string = "";

let className = "";
export { className as class };

$: id = slug(text);
</script>

{#if depth === 1}
  <h1 {id} class={conClasses(["font-semibold mb-4 mt-8 relative scroll-m-40 text-theme-heading text-4xl", className])}>
    <slot />
  </h1>
{:else if depth === 2}
  <h2 {id} class={conClasses(["font-semibold mb-4 mt-8 relative scroll-m-40 text-theme-heading text-2xl", className])}>
    <slot />
  </h2>
{:else if depth === 3}
  <h3 {id} class={conClasses(["font-semibold mb-4 mt-8 relative scroll-m-40 text-theme-heading text-lg", className])}>
    <slot />
  </h3>
{:else if depth === 4}
  <h4 {id} class={conClasses(["font-semibold mb-4 mt-8 relative scroll-m-40 text-theme-heading text-base", className])}>
    <slot />
  </h4>
{:else}
  {raw}
{/if}
