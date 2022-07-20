<script lang="ts">
import type { Rating } from "$lib/types";
import Stars from "./stars.svelte";

export let rating: Rating;
</script>

<div class="basis-full md:basis-6/12 xl:basis-4/12 p-3 grow-0">
  <div class="flex -m-3">
    <div class="p-3 pt-0.5 basis-0 grow even:text-right even:max-w-max">{rating.name}</div>
    <div class="p-3 pt-0.5 basis-0 grow even:text-right even:max-w-max">
      <Stars rating={rating.rating} />
    </div>
  </div>
</div>
