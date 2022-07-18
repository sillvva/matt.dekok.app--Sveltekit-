<script lang="ts">
import { onMount } from "svelte";
import { mdiUpload, mdiTrashCan, mdiRefresh, mdiOpenInNew } from "@mdi/js";
import { useQuery, useMutation, useQueryClient } from "@sveltestack/svelte-query";
import t from "$lib/trpc/client";
import { browser } from "$app/env";
import { navigating, page, session } from "$app/stores";
import { goto } from "$app/navigation";
import { supabase } from "$lib/supabase/client";
import { admin, pageStore, queryStore, toasts } from "$lib/store";
import { itemsPerPage, transitionDuration } from "$lib/constants";
import { toBase64 } from "$lib/utils";
import { ripple } from "$lib/directives";
import Icon from "$lib/components/common/icon.svelte";
import Image from "$lib/components/common/image.svelte";
import Fab from "$lib/components/common/fab.svelte";
import Pagination from "$lib/components/common/pagination.svelte";

let mounted = false;
let loading = true;

const queryClient = useQueryClient();

onMount(() => {
  setTimeout(() => {
    mounted = true;
  }, transitionDuration / 2);

  if (browser && !$navigating) {
    $pageStore = parseInt($page.url.searchParams.get("page") || "1");
    $queryStore = $page.url.searchParams.get("q") || "";
  }
});

const getResult = useQuery(
  "posts",
  async () => {
    loading = true;
    toasts.reset();

    if (!$session.user) throw new Error("Not logged in");

    try {
      const data = await t.query("posts:get", { images: !$admin.success });
      return data;
    } catch (err: any) {
      const error = await checkError(err);
      if (error) throw new Error(err);
    }
  },
  {
    refetchOnWindowFocus: false,
    enabled: browser, // Errors during SSR
    cacheTime: 30 * 60 * 1000,
    staleTime: 15 * 60 * 1000,
    onSuccess(result) {
      if (!result) return toasts.add("error", "Error loading posts");
      if (!$admin.success) admin.set(result);
      else
        admin.update(data => {
          data.numposts = result.numposts;
          data.posts = result.posts;
          return data;
        });
      loading = false;
    },
    onError(error: string) {
      toasts.add("error", error);
      loading = false;
    }
  }
);

const uploadMutation = useMutation(
  async (input: { file: string; filename: string }) => {
    try {
      return await t.mutation("posts:post", input);
    } catch (err: any) {
      const error = await checkError(err);
      if (error) throw new Error(err);
    }
  },
  {
    onMutate({ filename }) {
      $admin.numposts = numloaders + ($admin.posts?.find(post => post.name === filename) ? 0 : 1);
      loading = true;
    },
    onSuccess() {
      if ($session.user) queryClient.invalidateQueries("posts");
      toasts.add("success", "Post uploaded successfully");
    },
    onError(error: string) {
      if ($session.user) queryClient.invalidateQueries("posts");
      toasts.add("error", error);
    }
  }
);

const deleteMutation = useMutation(
  async (slug: string) => {
    try {
      return await t.mutation("posts:delete", {
        slug
      });
    } catch (err: any) {
      const error = await checkError(err);
      if (error) throw new Error(err);
    }
  },
  {
    onMutate() {
      loading = true;
      $admin.numposts = Math.max(1, numloaders - 1);
    },
    onSuccess() {
      if ($session.user) queryClient.invalidateQueries("posts");
      toasts.add("success", "Post deleted successfully");
    },
    onError(error: string) {
      if ($session.user) queryClient.invalidateQueries("posts");
      toasts.add("error", error);
    }
  }
);

const refresh = async () => {
  await queryClient.invalidateQueries("posts");
  loading = true;
};

const upload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "*/*";
  input.onchange = async () => {
    if (!input.files) return;
    const file = input.files[0];
    if (!file.name.endsWith(".md")) return alert("Only markdown files are supported");
    const blob = new Blob([file], { type: file.type });
    const base64 = await toBase64(blob);
    $uploadMutation.mutate({ file: base64, filename: file.name });
  };
  input.click();
};

const remove = async (slug: string) => {
  if (!confirm("Are you sure you want to delete this post?")) return;
  $deleteMutation.mutate(slug);
};

const checkError = async (error?: string | Error) => {
  if (!supabase) return "Error connecting to database";
  const message = typeof error === "string" ? error : error?.message;
  if (message?.startsWith("Unauthorized")) {
    alert(message);
    await goto("/api/auth/logout");
    return "Unauthorized user";
  } else if (error) {
    return message;
  }
  return "";
};

$: loading = !($getResult.data && !$getResult.isFetching);
$: numloaders = Math.min(itemsPerPage, $admin.numposts ?? itemsPerPage);
$: loaders = loading ? numloaders : 0;
$: filteredPosts =
  $queryStore.length > 2
    ? ($admin.posts || [])
        .filter(post => {
          return (
            post.title.toLowerCase().includes($queryStore.toLowerCase()) ||
            (post.description || "").toLowerCase().includes($queryStore.toLowerCase()) ||
            (post.tags || []).find(tag => tag.toLowerCase() == $queryStore.toLowerCase())
          );
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
    : ($admin.posts || []).sort((a, b) => (a.date > b.date ? -1 : 1));
$: pages = Math.ceil(filteredPosts.length / itemsPerPage);
$: paginatedPosts = filteredPosts.slice(($pageStore - 1) * itemsPerPage, $pageStore * itemsPerPage);
</script>

{#if mounted}
  <div class="flex gap-2 mb-4">
    <div class="flex-1">
      <input type="text" bind:value={$queryStore} placeholder="Search" class="p-2 rounded-md w-full shadow-md" />
    </div>
    <div class="md:flex-1 flex justify-end gap-4">
      <button on:click={refresh}>
        <Icon path={mdiRefresh} />
      </button>
      <button on:click={upload}>
        <Icon path={mdiUpload} />
      </button>
    </div>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
    {#if loaders == 0}
      {#each paginatedPosts as post (post.slug)}
        <div class="flex flex-col bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden">
          <div class="aspect-video relative hidden sm:block">
            <a href="/blog/{post.slug}" target="_blank" class="relative block aspect-video" use:ripple>
              <Image src={post.image} lazy alt={post.title} class="bg-black" />
            </a>
            <Fab
              on:click={() => remove(post.slug)}
              class="absolute top-2 right-2 !w-9 !h-9 bg-red-700 drop-shadow-theme-text">
              <Icon path={mdiTrashCan} size={0.8} />
            </Fab>
          </div>
          <div class="flex flex-row items-center gap-2 p-3">
            <div class="flex-1 flex flex-col">
              <h4 class="font-semibold pb-1">
                <a href="/blog/{post.slug}" target="_blank">
                  {post.title}
                  <Icon path={mdiOpenInNew} size={0.8} class="ml-1" />
                </a>
              </h4>
              <div class="text-sm">
                Posted: {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
            <Fab
              on:click={() => remove(post.slug)}
              class="!w-9 !h-9 bg-red-700 drop-shadow-theme-text inline sm:hidden">
              <Icon path={mdiTrashCan} size={0.8} />
            </Fab>
          </div>
        </div>
      {/each}
    {:else}
      {#each new Array(loaders).fill(1) as i}
        <div class="flex flex-col bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden">
          <div class="aspect-video animate-pulse bg-theme-hover bg-opacity-15 hidden sm:block" />
          <div class="flex-1 flex flex-col p-3">
            <div class="loading-line title max-w-xs">
              <span />
            </div>
            <div class="loading-line text">
              <span />
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
  {#if pages > 1}
    <Pagination page={$pageStore} {pages} />
  {/if}
{/if}
