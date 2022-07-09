<script lang="ts">
import { onMount } from "svelte";
import { page } from "$app/stores";
import { goto } from "$app/navigation";
import PageMessage from "$lib/components/page/message.svelte";

let redirect = $page.url.searchParams.get("to") || "/";
let hash = $page.url.hash;

const hashChange = () => {
  if (!location.hash.trim()) {
    goto(redirect);
  }
};

onMount(() => {
  if (!hash) {
    setTimeout(() => {
      goto(redirect);
    }, 2000);
  }
});
</script>

<svelte:window on:hashchange={hashChange} />

<PageMessage>
  <p>You are being redirected to:</p>
  <pre>{redirect}</pre>
</PageMessage>
