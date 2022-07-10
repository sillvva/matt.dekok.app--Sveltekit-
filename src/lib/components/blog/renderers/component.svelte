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

<div class="mockup-window border bg-theme-pre">
  <div class="grid p-4 bg-theme-code text-sm">
    {#if description}
      <p class="m-3 md:mb-0">{description}</p>
    {/if}
    {#if LoadedComponent}
      <svelte:component this={LoadedComponent} {...props} on:click={e => e.preventDefault()} />
    {/if}
  </div>
</div>
