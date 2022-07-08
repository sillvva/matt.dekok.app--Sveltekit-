<script lang="ts">
import { onMount } from "svelte";

export let component: string;
export let description: string;
export let props: any;

let LoadedComponent: any;

onMount(async () => {
  if (component == "post") {
    LoadedComponent = await import("$lib/components/blog/post.svelte").then(c => c.default);
  }
});
</script>

<div class="grid text-sm mb-4 pt-2 pb-0 md:p-2 bg-theme-pre rounded-lg">
  {#if description}
    <p class="m-3 md:mb-0">{description}</p>
  {/if}
  {#if LoadedComponent}
    <svelte:component this={LoadedComponent} {...props} on:click={e => e.preventDefault()} />
  {/if}
</div>
