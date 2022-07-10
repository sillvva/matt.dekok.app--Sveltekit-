<script lang="ts">
import { onMount } from "svelte";
import { mdiUpload, mdiTrashCan, mdiRefresh, mdiOpenInNew } from "@mdi/js";
import { useQuery, useMutation, useQueryClient } from "@sveltestack/svelte-query";
import type { AdminMutation } from "./data";
import { goto } from "$app/navigation";
import { supabase, auth } from "$lib/supabase/connection";
import { admin } from "$lib/store";
import type { Admin } from "$lib/store";
import { transitionDuration } from "$lib/constants";
import { blobToBase64 } from "$lib/utils";
import { ripple } from "$lib/directives";
import Icon from "$lib/components/common/icon.svelte";
import Alert from "$lib/components/common/alert.svelte";
import Image from "$lib/components/common/image.svelte";
import Fab from "$lib/components/common/fab.svelte";
import Pagination from "$lib/components/common/pagination.svelte";
import { writable } from "svelte/store";

let search: string = "";
let loading = true;
let mounted = false;
let errorMsg = "";
let successMsg = "";

const headers = {
  authorization: `Bearer ${$auth?.access_token}`
};

const queryClient = useQueryClient();
const imagePath = "https://slxazldgfeytirfrculz.supabase.co/storage/v1/object/public/images/";

onMount(() => {
  setTimeout(() => {
    mounted = true;
  }, transitionDuration / 2);
});

const getResult = useQuery(
  "images",
  async () => {
    loading = true;
    errorMsg = "";
    successMsg = "";

    if (!$auth) throw new Error("Not logged in");

    const response = await fetch("/admin/data?select=images", { headers });
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
          data.numimages = result.numimages;
          data.images = result.images;
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
    const response = await fetch("/admin/data?select=images", {
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
    onMutate(vars) {
      const filename = vars.get("filename")?.toString() || "";
      $admin.numposts = numloaders + ($admin.posts?.find(post => post.name === filename) ? 0 : 1);
      loading = true;
    },
    onSuccess() {
      if ($auth) queryClient.invalidateQueries("images");
      successMsg = "Image uploaded successfully";
    },
    onError(error: string) {
      if ($auth) queryClient.invalidateQueries("images");
      errorMsg = error;
    }
  }
);

const deleteMutation = useMutation(
  async (name: string) => {
    if (!name && (await checkError("File name not defined"))) return { success: false };

    const response = await fetch(`/admin/data?select=images&file=${name}`, {
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
      $admin.numposts = Math.max(1, numloaders - 1);
      loading = true;
    },
    onSuccess() {
      if ($auth) queryClient.invalidateQueries("images");
      successMsg = "Image deleted successfully";
    },
    onError(error: string) {
      if ($auth) queryClient.invalidateQueries("images");
      errorMsg = error;
    }
  }
);

const refresh = async () => {
  loading = true;
  await queryClient.invalidateQueries("images");
};

const upload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    if (!input.files) return;
    const file = input.files[0];
    const blob = new Blob([file], { type: file.type });
    const base64 = await blobToBase64(blob);
    const formData = new FormData();
    formData.append("file", base64);
    formData.append("filename", file.name);
    $uploadMutation.mutate(formData);
  };
  input.click();
};

const remove = async (name: string) => {
  if (!confirm("Are you sure you want to delete this image?")) return;
  $deleteMutation.mutate(name);
};

const checkError = async (error?: string) => {
  if (error?.startsWith("Unauthorized")) {
    alert(error);
    await supabase.auth.signOut();
    $auth = null;
    await goto("/", { replaceState: true });
    return "Unauthorized user";
  } else if (error) {
    return error;
  }
  return "";
};

const copy = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

const perPage = 12;
let pageStore = writable(1);

$: loading = !($getResult.data && !$getResult.isFetching);
$: numloaders = Math.min(perPage, $admin.numimages ?? perPage);
$: loaders = loading ? numloaders : 0;
$: filteredImages =
  search.length > 2
    ? ($admin.images || [])
        .filter(image => {
          return image.name.toLowerCase().includes(search.toLowerCase());
        })
        .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
    : ($admin.images || []).sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
$: {
  if (!$getResult.isFetching && !loading && filteredImages.length === 0) {
    console.log("No images found, refreshing query...");
    queryClient.invalidateQueries("images");
  }
}
$: pages = Math.ceil(filteredImages.length / perPage);
$: paginatedImages = filteredImages.slice(($pageStore - 1) * perPage, $pageStore * perPage);
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
  <Alert {successMsg} {errorMsg} on:close={e => (e.detail === "success" ? (successMsg = "") : (errorMsg = ""))} />
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
    {#if loaders == 0}
      {#each paginatedImages as image (image.name)}
        <div
          class="flex flex-col bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden"
          style:--tw-shadow-color="#0006"
          style:--tw-shadow="var(--tw-shadow-colored)">
          <div class="relative">
            <a href="{imagePath}{image.name}" target="_blank" class="relative block aspect-video" use:ripple>
              <Image src="{imagePath}{image.name}" lazy alt={image.name} class="bg-black" />
            </a>
            <Fab
              on:click={() => remove(image.name)}
              class="absolute top-2 right-2 w-9 h-9 bg-red-700 drop-shadow-theme-text">
              <Icon path={mdiTrashCan} size={0.8} />
            </Fab>
          </div>
          <div class="flex-1 flex flex-col p-3">
            <h4 class="font-semibold pb-1">
              <a href="{imagePath}{image.name}" target="_blank">
                {image.name}
                <Icon path={mdiOpenInNew} size={0.8} class="ml-1" />
              </a>
            </h4>
            <div class="text-sm pb-1">
              Uploaded: {new Date(image.created_at).toLocaleString()}
            </div>
            <div class="text-sm">
              <button
                on:click={() => {
                  if (image.copied) return;
                  copy(`${imagePath}${image.name}`);
                  image.copied = true;
                  setTimeout(() => {
                    image.copied = false;
                  }, 2000);
                }}
                class:text-theme-link={!image.copied}>
                {image.copied ? "Copied" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      {#each new Array(loaders).fill(1) as i}
        <div
          class="flex flex-col bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden"
          style:--tw-shadow-color="#0006"
          style:--tw-shadow="var(--tw-shadow-colored)">
          <div class="aspect-video animate-pulse bg-theme-hover bg-opacity-15" />
          <div class="flex-1 flex flex-col p-3">
            <div class="loading-line title max-w-xs">
              <span />
            </div>
            <div class="loading-line text">
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
    <Pagination {pageStore} {pages} />
  {/if}
{/if}
