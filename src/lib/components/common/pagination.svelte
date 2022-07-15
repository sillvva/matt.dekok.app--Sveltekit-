<script lang="ts">
import { page as p } from "$app/stores";
import { pageStore } from "$lib/store";
import { conClasses } from "$lib/utils";

export let page = 0;
export let pages: number;

$: pgs = page || $pageStore || 1;
$: {
  if (pages > 0 && pages < $pageStore) $pageStore = pages;
}

let pagination: (number | null)[] = [];
$: {
  pagination = pages > 1 ? [1, pages] : []
  if (pagination.length > 0) {
    const inMin = Math.max(2, pgs - 2);
    const inMax = Math.min(pages - 1, pgs + 2);
    const inserts =
      pages <= 2
        ? []
        : inMax - Math.min(pgs, inMin) + 1 >= 2
        ? Array(inMax - inMin + 1)
            .fill(null)
            .map((x, i) => i + inMin)
        : [2];
    pagination.splice(1, 0, ...inserts);
    if (inMin > 2) pagination.splice(1, 0, null);
    if (pages - inMax >= 2) pagination.splice(-1, 0, null);
  }
}

const pageHandler = (newPage: number) => {
  const query = new URLSearchParams($p.url.search);
  if (newPage === 1) query.delete("page");
  else query.set("page", newPage.toString());
  const q = query.toString();
  return `${$p.url.pathname}${q ? `?${q}` : ""}`;
};

const pageStoreHandler = (newPage: number) => {
  $pageStore = newPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<div class="flex justify-center gap-2 my-4">
  {#each pagination as p}
    {#if p == pgs}
      <span
        class="inline-flex w-8 h-8 justify-center items-center rounded-sm font-bold text-theme-button bg-theme-link drop-shadow-theme-text">
        {p}
      </span>
    {:else if p}
      {#if $pageStore}
        <button
          on:click={() => pageStoreHandler(p)}
          class={conClasses([
            "inline-flex w-8 h-8 justify-center items-center rounded-sm font-bold drop-shadow-sm bg-theme-article",
            "hover:text-theme-button hover:bg-theme-link hover:drop-shadow-theme-text"
          ])}>
          {p}
        </button>
      {:else}
        <a
          href={pageHandler(p)}
          class={conClasses([
            "inline-flex w-8 h-8 justify-center items-center rounded-sm font-bold drop-shadow-sm bg-theme-article",
            "hover:text-theme-button hover:bg-theme-link hover:drop-shadow-theme-text"
          ])}>
          {p}
        </a>
      {/if}
    {:else}
      <span class="inline-flex w-8 h-8 justify-center items-center"> | </span>
    {/if}
  {/each}
</div>
