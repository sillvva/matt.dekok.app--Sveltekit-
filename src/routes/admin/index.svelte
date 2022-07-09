<script lang="ts">
import { mdiUpload, mdiTrashCan, mdiRefresh, mdiOpenInNew } from "@mdi/js";
import { useQuery, useMutation, useQueryClient } from "@sveltestack/svelte-query";
import { goto } from "$app/navigation";
import { supabase } from "$lib/supabase/connection";
import { admin, auth } from "$lib/store";
import type { Admin } from "$lib/store";
import type { AdminMutation } from "./data";
import Icon from "$lib/components/common/icon.svelte";
import Image from "$lib/components/common/image.svelte";
import Fab from "$lib/components/common/fab.svelte";
import { onMount } from "svelte";
import { transitionDuration } from "$lib/constants";
import { blobToBase64 } from "$lib/utils";

let search: string = "";
let mounted = false;
let loading = true;

const headers = {
  authorization: `Bearer ${$auth?.access_token}`
};

const queryClient = useQueryClient();

onMount(() => {
  setTimeout(() => {
    mounted = true;
  }, transitionDuration / 2);
});

const getResult = useQuery(
  "posts",
  async () => {
    const response = await fetch("/admin/data?select=posts", { headers });
    const data: Admin = await response.json();

    if (await checkError(data.error)) return { success: false };
    return data;
  },
  {
    refetchOnWindowFocus: false,
    cacheTime: 30 * 60 * 1000,
    staleTime: 15 * 60 * 1000,
    onSuccess() {
      loading = false;
    }
  }
);

const uploadMutation = useMutation(
  async (formData: FormData) => {
    const response = await fetch("/admin/data?select=posts", {
      method: "POST",
      headers,
      body: formData
    });
    const data: AdminMutation = await response.json();
    if (await checkError(data.error)) return { success: false };
    return data;
  },
  {
    onMutate() {
      loading = true;
      $admin.numposts = numloaders + 1;
    },
    onSuccess() {
      queryClient.invalidateQueries("posts");
    }
  }
);

const deleteMutation = useMutation(
  async (slug: string) => {
    if (!slug && (await checkError("Slug not defined"))) return { success: false };

    const response = await fetch(`/admin/data?select=posts&slug=${slug}`, {
      method: "DELETE",
      headers
    });
    const data: AdminMutation = await response.json();

    if (await checkError(data.error)) return { success: false };
    return data;
  },
  {
    onMutate() {
      loading = true;
      $admin.numposts = Math.max(1, numloaders - 1);
    },
    onSuccess() {
      queryClient.invalidateQueries("posts");
    }
  }
);

const refresh = async () => {
  loading = true;
  await queryClient.invalidateQueries("posts");
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
    const base64 = await blobToBase64(blob);
    const formData = new FormData();
    formData.append("file", base64);
    formData.append("filename", file.name);
    $uploadMutation.mutate(formData);
  };
  input.click();
};

const remove = async (slug: string) => {
  if (!confirm("Are you sure you want to delete this post?")) return;
  $deleteMutation.mutate(slug);
};

const checkError = async (error: any) => {
  if (error === "Unauthorized") {
    alert("Unauthorized user");
    await supabase.auth.signOut();
    $auth = null;
    await goto("/", { replaceState: true });
    return true;
  } else if (error) {
    alert(error);
    return true;
  }
  return false;
};

$: {
  if ($getResult.data && !$getResult.isFetching) {
    admin.set($getResult.data);
    loading = false;
  }
}
$: numloaders = $admin.numposts ?? 6;
$: loaders = $getResult.data && !loading ? 0 : numloaders;
$: filteredPosts =
  search.length > 2
    ? ($admin.posts || [])
        .filter(post => {
          return (
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            (post.description || "").toLowerCase().includes(search.toLowerCase()) ||
            (post.tags || []).find(tag => tag.toLowerCase() == search.toLowerCase())
          );
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))
    : ($admin.posts || []).sort((a, b) => (a.date > b.date ? -1 : 1));
</script>

{#if mounted}
  <div class="flex gap-4 mb-4">
    <div class="flex-1">
      <input type="text" bind:value={search} placeholder="Search" class="p-2 rounded-md w-full" />
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
      {#each filteredPosts as post (post.slug)}
        <div
          class="flex flex-col bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden"
          style:--tw-shadow-color="#0006"
          style:--tw-shadow="var(--tw-shadow-colored)">
          <div class="aspect-video relative hidden sm:block">
            <Image src={post.image} lazy alt={post.title} class="bg-black" />
            <Fab
              on:click={() => remove(post.slug)}
              class="absolute top-2 right-2 w-9 h-9 bg-red-700 drop-shadow-theme-text">
              <Icon path={mdiTrashCan} size={0.8} />
            </Fab>
          </div>
          <div class="flex flex-row items-center gap-2 p-3">
            <div class="flex-1 flex flex-col">
              <h4 class="font-semibold pb-1">
                <a href={`/blog/${post.slug}`} target="_blank">
                  {post.title}
                  <Icon path={mdiOpenInNew} size={0.8} class="ml-1" />
                </a>
              </h4>
              <div class="text-sm">
                Posted: {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
            <Fab on:click={() => remove(post.slug)} class="w-9 h-9 bg-red-700 drop-shadow-theme-text inline sm:hidden">
              <Icon path={mdiTrashCan} size={0.8} />
            </Fab>
          </div>
        </div>
      {/each}
    {:else}
      {#each new Array(loaders).fill(1) as i}
        <div class="flex flex-col gap-2 bg-theme-article p-2 md:p-4 rounded-md">
          <div class="loading-line title max-w-xs">
            <span />
          </div>
          <div class="loading-line text">
            <span />
          </div>
        </div>
      {/each}
    {/if}
  </div>
{/if}
