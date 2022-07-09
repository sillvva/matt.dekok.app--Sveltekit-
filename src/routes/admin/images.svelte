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
import { ripple } from "$lib/directives";

let search: string = "";
let loading = true;
let mounted = false;

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
    const response = await fetch("/admin/data?select=images", { headers });
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
    const response = await fetch("/admin/data?select=images", {
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
      queryClient.invalidateQueries("images");
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

    if (await checkError(data.error)) return { success: false };
    return data;
  },
  {
    onMutate() {
      loading = true;
      $admin.numposts = Math.max(1, numloaders - 1);
    },
    onSuccess() {
      queryClient.invalidateQueries("images");
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

const copy = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

$: {
  if ($getResult.data && !$getResult.isFetching) {
    admin.set($getResult.data);
    loading = false;
  }
}
$: numloaders = $admin.numimages ?? 12;
$: loaders = $getResult.data && !loading ? 0 : numloaders;
$: filteredImages =
  search.length > 2
    ? ($admin.images || [])
        .filter(image => {
          return image.name.toLowerCase().includes(search.toLowerCase());
        })
        .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
    : ($admin.images || []).sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
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
      {#each filteredImages as image, i (image.name)}
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
{/if}
