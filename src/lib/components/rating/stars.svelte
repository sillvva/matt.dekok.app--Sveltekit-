<script lang="ts">
import { mdiStar, mdiStarHalfFull, mdiStarOutline } from "@mdi/js";
import Icon from "$lib/components/common/icon.svelte";

export let rating: number;

const getStars = () => {
  const max = 5;
  let full = Math.floor(rating);
  let half = full === rating ? 0 : 1;
  let empty = max - full - half;
  if (rating - full !== 0) {
    if (rating - full >= 3 / 4) {
      half = 0;
      full += 1;
    } else if (rating - full < 1 / 4) {
      half = 0;
      empty += 1;
    }
  }

  return [...Array(full).fill(mdiStar), ...Array(half).fill(mdiStarHalfFull), ...Array(empty).fill(mdiStarOutline)];
};
</script>

<div class="rating text-right">
  {#each getStars() as star}
    <Icon
      path={star}
      class="rating-zoom"
      styles={`color: ${star === mdiStarOutline ? `var(--ratingOff)` : `var(--ratingOn)`}`}
      size={0.7} />
  {/each}
</div>
