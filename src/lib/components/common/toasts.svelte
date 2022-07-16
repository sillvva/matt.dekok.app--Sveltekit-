<script lang="ts">
import { slide } from "svelte/transition";
import { mdiAlertCircle, mdiCheckCircle } from "@mdi/js";
import { toasts } from "$lib/store";
import Icon from "$lib/components/common/icon.svelte";

function toastClass(type: string) {
  if (type === "success") {
    return "alert-success";
  } else if (type === "error") {
    return "alert-danger";
  } else if (type === "info") {
    return "alert-info";
  } else {
    return "alert-warning";
  }
}
</script>

<div class="fixed top-0 left-1/2 -translate-x-1/2 z-10 m-4 w-full sm:w-2/3 lg:1/2">
  {#each $toasts as toast, t}
    <div class="alert {toastClass(toast.type)} shadow-lg mb-3" in:slide out:slide>
      <div>
        <Icon path={toast.type === "success" ? mdiCheckCircle : mdiAlertCircle} />
        <span>{toast.message}</span>
      </div>
      <div class="flex-none">
        <button class="btn btn-sm btn-ghost" on:click={() => ($toasts = $toasts.filter((fToast, fT) => fT !== t))}>Close</button>
      </div>
    </div>
  {/each}
</div>
