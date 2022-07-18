<script lang="ts" context="module">
import type { Load } from "./__types/__error";
import Article from "$lib/components/page/article.svelte";
import Section from "$lib/components/page/section.svelte";
import Code from "$lib/components/blog/renderers/code.svelte";
import Heading from "$lib/components/blog/renderers/heading.svelte";

export const load: Load = ({ error, status }) => {
  return {
    props: {
      status,
      error
    }
  };
};
</script>

<script lang="ts">
export let status: number;
export let error: Error;
</script>

<Article class="w-full md:w-9/12">
  <Section>
    <Heading depth={2} class="!mt-4">{status} Error</Heading>
    {#if error}
      <p class="mb-4">{error.message}</p>
      {#if error.stack}
        <Code text={error.stack} lang="" />
      {/if}
    {/if}
  </Section>
</Article>
