<script lang="ts">
import { createEventDispatcher } from "svelte";
import { slide } from "svelte/transition";
import { mdiAlertCircle, mdiCheckCircle } from "@mdi/js";
import Icon from "$lib/components/common/icon.svelte";

const dispatch = createEventDispatcher();

export let successMsg = "";
export let errorMsg = "";
</script>

{#if successMsg}
  <div class="alert alert-success shadow-lg mb-3" in:slide out:slide>
    <div>
      <Icon path={mdiCheckCircle} />
      <span>{successMsg}</span>
    </div>
    <div class="flex-none">
      <button class="btn btn-sm btn-ghost" on:click={() => dispatch("close", "success")}>Close</button>
    </div>
  </div>
{/if}
{#if errorMsg}
  <div class="alert alert-error shadow-lg mb-3" in:slide out:slide>
    <div>
      <Icon path={mdiAlertCircle} />
      <span>{errorMsg}</span>
    </div>
    <div class="flex-none">
      <button class="btn btn-sm btn-ghost" on:click={() => dispatch("close", "error")}>Close</button>
    </div>
  </div>
{/if}
