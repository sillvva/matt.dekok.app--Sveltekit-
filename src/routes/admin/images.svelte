<script lang="ts">
import { onMount } from "svelte";
import { mdiUpload, mdiTrashCan, mdiRefresh, mdiOpenInNew, mdiClipboard } from "@mdi/js";
import { useQuery, useMutation, useQueryClient } from "@sveltestack/svelte-query";
import { page, navigating, session } from "$app/stores";
import { browser } from "$app/env";
import { goto } from "$app/navigation";
import { supabase } from "$lib/supabase/client";
import { admin, pageStore, queryStore } from "$lib/store";
import t from "$lib/trpc/client";
import { transitionDuration, itemsPerPage } from "$lib/constants";
import { toBase64 } from "$lib/utils";
import { ripple } from "$lib/directives";
import Icon from "$lib/components/common/icon.svelte";
import Alert from "$lib/components/common/alert.svelte";
import Image from "$lib/components/common/image.svelte";
import Fab from "$lib/components/common/fab.svelte";
import Pagination from "$lib/components/common/pagination.svelte";

let loading = true;
let mounted = false;
let errorMsg = "";
let successMsg = "";

const queryClient = useQueryClient();
const imagePath = "https://slxazldgfeytirfrculz.supabase.co/storage/v1/object/public/images/";

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
  "images",
  async () => {
    loading = true;
    errorMsg = "";
    successMsg = "";

    if (!$session.user) throw new Error("Not logged in");

    try {
      const data = await t.query("images:get");
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
      if (!result) return (errorMsg = "Error loading images");
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
  async ({ file, filename, upsert }: { file: string; filename: string; upsert: boolean }) => {
    try {
      const data = await t.mutation("images:post", {
        file,
        filename,
        upsert
      });
      return data;
    } catch (err: any) {
      const error = await checkError(err);
      if (error) throw new Error(err);
    }
  },
  {
    onMutate({ filename }) {
      $admin.numposts = numloaders + ($admin.images?.find(image => image.name === filename) ? 0 : 1);
      loading = true;
    },
    onSuccess() {
      if ($session.user) queryClient.invalidateQueries("images");
      successMsg = "Image uploaded successfully";
    },
    onError(error: string) {
      if ($session.user) queryClient.invalidateQueries("images");
      errorMsg = error;
    }
  }
);

const deleteMutation = useMutation(
  async (filename: string) => {
    if (!filename && (await checkError("File name not defined"))) return { success: false };

    try {
      const data = await t.mutation("images:delete", {
        filename
      });
      return data;
    } catch (err: any) {
      const error = await checkError(err);
      if (error) throw new Error(err);
    }
  },
  {
    onMutate() {
      $admin.numposts = Math.max(1, numloaders - 1);
      loading = true;
    },
    onSuccess() {
      if ($session.user) queryClient.invalidateQueries("images");
      successMsg = "Image deleted successfully";
    },
    onError(error: string) {
      if ($session.user) queryClient.invalidateQueries("images");
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
    let name = file.name;
    const parts = name.split(".");
    const blob = new Blob([file], { type: file.type });
    const base64 = await toBase64(blob);
    let overwrite = false;

    if (fileExists(name)) {
      if (confirm("File already exists. Overwrite?")) {
        overwrite = true;
      } else {
        let newName = prompt("Enter a new file name", `_${name}`) || "";
        if (newName.trim()) {
          const newParts = newName.trim().split(".");
          newName =
            newName + (parts[parts.length - 1] === newParts[newParts.length - 1] ? "" : "." + parts[parts.length - 1]);
          if (newName.trim() === name) {
            while (fileExists(name)) {
              name = `_${name}`;
            }
          } else name = newName;
        } else {
          return;
        }
      }
    }

    $uploadMutation.mutate({ file: base64, filename: name, upsert: overwrite });
  };
  input.click();
};

const fileExists = (name: string) => {
  return $admin.images?.find(image => image.name === name);
};

const remove = async (name: string) => {
  if (!confirm("Are you sure you want to delete this image?")) return;
  $deleteMutation.mutate(name);
};

const checkError = async (error?: Error | string) => {
  const message = typeof error === "string" ? error : error?.message;
  if (!supabase) return "Error connecting to database";
  if (message?.startsWith("Unauthorized")) {
    alert(message);
    await goto("/api/auth/logout");
    return "Unauthorized user";
  } else if (error) {
    return message;
  }
  return "Unknown error";
};

const copy = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

$: loading = !($getResult.data && !$getResult.isFetching);
$: numloaders = Math.min(itemsPerPage, $admin.numimages ?? itemsPerPage);
$: loaders = loading ? numloaders : 0;
$: filteredImages =
  $queryStore.length > 2
    ? ($admin.images || [])
        .filter(image => {
          return image.name.toLowerCase().includes($queryStore.toLowerCase());
        })
        .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
    : ($admin.images || []).sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
$: pages = Math.ceil(filteredImages.length / itemsPerPage);
$: paginatedImages = filteredImages.slice(($pageStore - 1) * itemsPerPage, $pageStore * itemsPerPage);
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
  <Alert {successMsg} {errorMsg} on:close={e => (e.detail === "success" ? (successMsg = "") : (errorMsg = ""))} />
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
    {#if loaders == 0}
      {#each paginatedImages as image (image.name)}
        <div class="flex sm:flex-col min-h-[5.5rem] bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden">
          <a
            href="{imagePath}{image.name}"
            target="_blank"
            class="relative block aspect-video w-[5.5rem] sm:w-full"
            use:ripple>
            <Image src="{imagePath}{image.name}" lazy alt={image.name} class="bg-black" />
          </a>
          <div class="flex-1 flex flex-col p-3 pr-12 sm:pr-3">
            <h4 class="font-semibold pb-1">
              <a href="{imagePath}{image.name}" target="_blank">
                {image.name}
                <Icon path={mdiOpenInNew} size={0.8} class="ml-1" />
              </a>
            </h4>
            <div class="text-sm pb-1">
              <span class="hidden sm:inline">Uploaded:</span>
              {new Date(image.created_at).toLocaleString()}
            </div>
          </div>
          <Fab
            on:click={() => remove(image.name)}
            class="absolute top-2 right-2 !w-8 !h-8 bg-red-700 drop-shadow-theme-text">
            <Icon path={mdiTrashCan} size={0.8} />
          </Fab>
          <Fab
            on:click={() => {
              if (image.copied) return;
              copy(`${imagePath}${image.name}`);
              image.copied = true;
              setTimeout(() => {
                image.copied = false;
              }, 2000);
            }}
            class="absolute top-12 right-2 !w-8 !h-8 bg-theme-link !duration-200 {image.copied
              ? '!bg-gray-500'
              : ''} drop-shadow-theme-text">
            <Icon path={mdiClipboard} size={0.8} />
          </Fab>
        </div>
      {/each}
    {:else}
      {#each new Array(loaders).fill(1) as i}
        <div class="flex flex-col bg-theme-article p-0 rounded-md shadow-md relative overflow-hidden">
          <div class="aspect-video animate-pulse bg-theme-hover bg-opacity-15" />
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
