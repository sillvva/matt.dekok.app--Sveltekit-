<script lang="ts">
import Image from "$lib/components/common/image.svelte";
import type { ExperienceItem } from "src/routes/experience";

export let items: ExperienceItem[];
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-y-5 gap-x-2">
  {#each items as item}
    <div
      class="text-theme-base pb-5 lg:pb-0 min-h-[60px] overflow-hidden section-divider lg:border-b-0 last:pb-0 last:border-b-0">
      <div class="relative float-left w-14 h-14 grid justify-center items-center bg-white rounded-sm">
        <Image
          src={item.image}
          alt={item.name || ""}
          objectFit="contain"
          class="max-w-[56px] max-h-[56px] rounded-sm" />
      </div>
      <div class="ml-20">
        <h3 class="text-base font-medium font-montserrat m-0">
          {#if !item.nameLink}
            {item.name}
          {:else}
            <a href={item.nameLink} target="_blank" rel="noreferrer noopener">
              {item.name}
            </a>
          {/if}
        </h3>
        <h4 class="text-sm font-light mb-1">
          {#if !item.h4Link}
            {item.h4}
          {:else}
            <a href={item.h4Link} target="_blank" rel="noreferrer noopener" class="font-normal">
              {item.h4}
            </a>
          {/if}
        </h4>
        <h5 class="text-sm font-light m-0">
          {#if !item.h5Link}
            {item.h5}
          {:else}
            <a href={item.h5Link} target="_blank" rel="noreferrer noopener" class="font-normal">
              {item.h5}
            </a>
          {/if}
        </h5>
      </div>
    </div>
  {/each}
</div>
