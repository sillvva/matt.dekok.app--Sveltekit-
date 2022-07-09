<script lang="ts">
import { page as p } from "$app/stores";
import { browser } from "$app/env";
import { blogPostsPerPage } from "$lib/constants";
import { pageProps } from "$lib/store";
import type { PostData } from "$lib/types/blog";
import Message from "$lib/components/page/message.svelte";
import Post from "$lib/components/blog/post.svelte";
import Pagination from "$lib/components/common/pagination.svelte";
import { metaTags } from "$lib/utils";

const loaders: PostData[] = Array(blogPostsPerPage).fill({
  title: "",
  date: "",
  image: "",
  slug: "",
  tags: []
});

export let pages: number = 1;
export let num: number = 0;
export let posts: PostData[] = loaders;
export let error: Error = { name: "", message: "" };

if (num === 0) {
  error = { name: "", message: "No posts found." };
}

$pageProps = {
  title: "Blog",
  bodyClass: "page-body",
  menu: true
};

$: page = parseInt((browser && $p.url.searchParams.get("page")) || "1");
$: metaProps = metaTags($pageProps, $p.url.origin, $p.url.pathname);
</script>

<svelte:head>
  <title>{metaProps.title}</title>
  <meta name="description" content={metaProps.description} />

  {#each Object.entries(metaProps.ogProperties) as t}
    <meta name="og:{t[0]}" property="og:{t[0]}" content={t[1]} />
  {/each}
  {#each Object.entries(metaProps.twProperties) as t}
    <meta name="twitter:{t[0]}" content={t[1]} />
  {/each}
</svelte:head>

{#if error.message}
  <Message>{error.message}</Message>
{:else}
  <div class="flex justify-center" style:max-width="1800px">
    <div class="flex flex-wrap w-full -m-3 md:m-0">
      {#each posts as post}
        <Post {post} />
      {/each}
    </div>
  </div>
{/if}

{#if pages > 1}
  <Pagination {page} {pages} />
{/if}
