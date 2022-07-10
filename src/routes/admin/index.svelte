<script lang="ts">
import { mdiUpload, mdiTrashCan, mdiRefresh, mdiOpenInNew, mdiAlertCircle, mdiCheckCircle } from "@mdi/js";
import { useQuery, useMutation, useQueryClient } from "@sveltestack/svelte-query";
import { goto } from "$app/navigation";
import { supabase } from "$lib/supabase/connection";
import { admin, auth } from "$lib/store";
import type { Admin } from "$lib/store";
import type { AdminMutation } from "./data";
import Icon from "$lib/components/common/icon.svelte";
import Alert from "$lib/components/common/alert.svelte";
import Image from "$lib/components/common/image.svelte";
import Fab from "$lib/components/common/fab.svelte";
import { onMount } from "svelte";
import { transitionDuration } from "$lib/constants";
import { blobToBase64 } from "$lib/utils";
import { ripple } from "$lib/directives";

let search: string = "";
let mounted = false;
let loading = true;
let errorMsg = "";
let successMsg = "";

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
    loading = true;
    errorMsg = "";
    successMsg = "";

    const response = await fetch(`/admin/data?select=posts&images=${$admin.success ? 0 : 1}`, { headers });
    const data: Admin = await response.json();

    const error = await checkError(data.error);
    if (error) throw new Error(data.error);

    return data;
  },
  {
    refetchOnWindowFocus: false,
    cacheTime: 30 * 60 * 1000,
    staleTime: 15 * 60 * 1000,
    onSuccess(result) {
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
      errorMsg = error;
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

    const error = await checkError(data.error);
    if (error) throw new Error(data.error);

    return data;
  },
  {
    onMutate() {
      loading = true;
      $admin.numposts = numloaders + 1;
    },
    onSuccess() {
      queryClient.invalidateQueries("posts");
      successMsg = "Post uploaded successfully";
    },
    onError(error: string) {
      queryClient.invalidateQueries("posts");
      errorMsg = error;
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

    const error = await checkError(data.error);
    if (error) throw new Error(data.error);

    return data;
  },
  {
    onMutate() {
      loading = true;
      $admin.numposts = Math.max(1, numloaders - 1);
    },
    onSuccess() {
      queryClient.invalidateQueries("posts");
      successMsg = "Post deleted successfully";
    },
    onError(error: string) {
      queryClient.invalidateQueries("posts");
      errorMsg = error;
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

const checkError = async (error?: string) => {
  if (error === "Unauthorized") {
    console.log("Token expired, refreshing...");
    const { session } = await supabase.auth.signIn({
      refreshToken: $auth?.refresh_token
    });
    if (session) $auth = session;
    else {
      console.log("Refresh failed, redirecting to login...");
      alert("Unauthorized user");
      await supabase.auth.signOut();
      $auth = null;
      await goto("/", { replaceState: true });
    }
    return "Unauthorized user";
  } else if (error) {
    return error;
  }
  return "";
};

$: loading = !($getResult.data && !$getResult.isFetching);
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
$: {
  if (!$getResult.isFetching && loaders === 0 && filteredPosts.length === 0) {
    console.log("No posts found, refreshing query...");
    queryClient.invalidateQueries("posts");
  }
}
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
  <Alert {successMsg} {errorMsg} on:close={(e) => e.detail === "success" ? successMsg = "" : errorMsg = ""} />
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
    {#if loaders == 0}
      {#each filteredPosts as post (post.slug)}
        <div
          class="flex flex-col bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden"
          style:--tw-shadow-color="#0006"
          style:--tw-shadow="var(--tw-shadow-colored)">
          <div class="aspect-video relative hidden sm:block">
            <a href="/blog/{post.slug}" target="_blank" class="relative block aspect-video" use:ripple>
              <Image src={post.image} lazy alt={post.title} class="bg-black" />
            </a>
            <Fab
              on:click={() => remove(post.slug)}
              class="absolute top-2 right-2 w-9 h-9 bg-red-700 drop-shadow-theme-text">
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
            <Fab on:click={() => remove(post.slug)} class="w-9 h-9 bg-red-700 drop-shadow-theme-text inline sm:hidden">
              <Icon path={mdiTrashCan} size={0.8} />
            </Fab>
          </div>
        </div>
      {/each}
    {:else}
      {#each new Array(loaders).fill(1) as i}
        <div
          class="flex flex-col bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden"
          style:--tw-shadow-color="#0006"
          style:--tw-shadow="var(--tw-shadow-colored)">
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
{/if}
