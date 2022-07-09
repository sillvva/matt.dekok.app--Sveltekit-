<script lang="ts">
import { slug } from "$lib/utils";
export let depth: number;
export let raw: any;
export let text: string;
$: id = slug(text);
</script>

{#if depth === 1}
  <h1 {id} class="font-semibold mb-2 mt-4 relative scroll-m-40 text-theme-heading text-4xl"><slot /></h1>
{:else if depth === 2}
  <h2 {id} class="font-semibold mb-2 mt-4 relative scroll-m-40 text-theme-heading text-2xl"><slot /></h2>
{:else if depth === 3}
  <h3 {id} class="font-semibold mb-2 mt-4 relative scroll-m-40 text-theme-heading text-lg"><slot /></h3>
{:else if depth === 4}
  <h4 {id} class="font-semibold mb-2 mt-4 relative scroll-m-40 text-theme-heading text-base"><slot /></h4>
{:else}
  {raw}
{/if}
