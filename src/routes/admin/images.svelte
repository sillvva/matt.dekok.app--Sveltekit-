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

let search: string = "";
let loading = true;

const headers = {
  authorization: `Bearer ${$auth?.access_token}`
};

const queryClient = useQueryClient();
const imagePath = "https://slxazldgfeytirfrculz.supabase.co/storage/v1/object/public/images/";

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

// const deleteMutation = useMutation(
//   async (slug: string) => {
//     if (!slug && (await checkError("Slug not defined"))) return { success: false };

//     const response = await fetch(`/admin/data?select=posts&slug=${slug}`, {
//       method: "DELETE",
//       headers
//     });
//     const data: AdminMutation = await response.json();

//     if (await checkError(data.error)) return { success: false };
//     return data;
//   },
//   {
//     onMutate() {
//       loading = true;
//       $admin.numposts = Math.max(1, numloaders - 1);
//     },
//     onSuccess() {
//       queryClient.invalidateQueries("posts");
//     }
//   }
// );

const refresh = async () => {
  loading = true;
  await queryClient.invalidateQueries("posts");
};

const upload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    if (!input.files) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    $uploadMutation.mutate(formData);
  };
  input.click();
};

// const remove = async (slug: string) => {
//   if (!confirm("Are you sure you want to delete this post?")) return;
//   $deleteMutation.mutate(slug);
// };

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
$: numloaders = $admin.numimages ?? 6;
$: loaders = $getResult.data && !loading ? 0 : numloaders;
$: filteredImages =
  search.length > 2
    ? ($admin.images || [])
        .filter(image => {
          return image.name.toLowerCase().includes(search.toLowerCase());
        })
        .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
    : ($admin.images || []).sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
$: {
  console.log($admin.images);
}
</script>

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
    {#each filteredImages as image}
      <div
        class="flex flex-col bg-theme-article p-0 gap-2 rounded-md shadow-md relative overflow-hidden"
        style:--tw-shadow-color="#0006"
        style:--tw-shadow="var(--tw-shadow-colored)">
        <div class="aspect-video relative">
          <Image src={`${imagePath}/${image.name}`} lazy alt={image.name} class="bg-black" />
        </div>
        <div class="flex flex-row">
          <div class="flex-1 flex flex-col p-2">
            <h4 class="font-semibold">
              <a href={`${imagePath}/${image.name}`}>
                {image.name}
                <Icon path={mdiOpenInNew} />
              </a>
            </h4>
            <div class="text-sm">
              Created: {new Date(image.created_at).toLocaleString()}
            </div>
          </div>
          <!-- <button on:click={() => remove(post.slug)}>
            <Icon path={mdiTrashCan} />
          </button> -->
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
