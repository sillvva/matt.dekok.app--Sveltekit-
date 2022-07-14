<script lang="ts">
import { page } from "$app/stores";
import SvelteMarkdown from "svelte-markdown";
import Article from "$lib/components/page/article.svelte";
import Section from "$lib/components/page/section.svelte";
import Image from "$lib/components/common/image.svelte";
import type { PostProps } from "$lib/types";
import { pageProps } from "$lib/store";
import { metaTags } from "$lib/utils";

// Renderers
import code from "$lib/components/blog/renderers/code.svelte";
import heading from "$lib/components/blog/renderers/heading.svelte";
import paragraph from "$lib/components/blog/renderers/paragraph.svelte";
import codespan from "$lib/components/blog/renderers/codespan.svelte";
import image from "$lib/components/blog/renderers/image.svelte";
import html from "$lib/components/blog/renderers/html.svelte";

export let data: PostProps;
export let content: string;

$pageProps = {
  title: data.title,
  description: data?.description,
  image: data?.image || "",
  bodyClass: "page-body",
  articleMeta: {
    published_date: data?.dateISO,
    ...(data?.updatedISO && { modified_date: data?.updatedISO })
  },
  menu: true
};

const renderers = {
  code,
  heading,
  paragraph,
  codespan,
  image,
  html
};

$: metaProps = metaTags($pageProps, $page.url.origin, $page.url.pathname);
</script>

<svelte:head>
  <title>{metaProps.title}</title>
  <meta name="description" content={metaProps.description} />

  {#if metaProps.articleMeta}
    {#each Object.entries(metaProps.articleMeta) as t}
      <meta property="article:{t[0]}" content={t[1]} />
    {/each}
  {/if}
  {#each Object.entries(metaProps.ogProperties) as t}
    <meta name="og:{t[0]}" property="og:{t[0]}" content={t[1]} />
  {/each}
  {#each Object.entries(metaProps.twProperties) as t}
    <meta name="twitter:{t[0]}" content={t[1]} />
  {/each}
</svelte:head>

<Article class="w-full xl:w-9/12 2xl:w-8/12">
  {#if !data.full && data.image}
    <div class="aspect-video relative">
      <Image src={data.image} alt="Cover" objectFit="cover" />
    </div>
  {/if}
  <Section>
    <p class="mb-4 text-gray-400" aria-label="Date published">
      {data.date}
      {#if data.updated}(Updated: {data.updated}){/if}
    </p>
    <div class="mb-4">
      <SvelteMarkdown source={content} {renderers} />
    </div>
    {#if !!(data.tags || []).length}
      <p class="mt-4 mb-2">Tags:</p>
      <div class="flex flex-wrap gap-2">
        {#each data.tags as tag}
          <span class="rounded-full text-theme-base py-1 px-3 bg-theme-body">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
  </Section>
</Article>
