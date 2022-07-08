<script lang="ts">
import { fade, scale } from "svelte/transition";
import { page } from "$app/stores";
import { drawer } from "$lib/store";
import type { Item } from "$lib/types/hex-menu";
import HexMenu from "$lib/components/hex-menu/svg.svelte";

export let menuItems: Item[];
const duration = 300;

$: menuItems = menuItems.map(item => {
  return {
    ...item,
    ...(item.link === $page.url.pathname && { active: true })
  };
});
</script>

<div class="backdrop" in:fade={{ duration }} out:fade={{ duration }} on:click={() => ($drawer = false)}>
  <div in:scale={{ duration, start: 0.8 }} out:scale={{ duration, start: 0.5 }}>
    <HexMenu
      items={menuItems}
      maxLength={3}
      classes={["[--scale:0.7]", "3xs:[--scale:0.9]", "2xs:[--scale:1]", "xl:[--scale:1.2]"]}
      rotated={true} />
  </div>
</div>

<style lang="scss">
.backdrop {
  @apply fixed inset-0 z-10 bg-black/70;
  @apply flex justify-center items-center;
}
</style>
