<script lang="ts">
import { page, session } from "$app/stores";
import { goto } from "$app/navigation";
import PageMessage from "$lib/components/page/message.svelte";

let redirect = $page.url.searchParams.get("to") || "/";
let isAuthRedirect = $page.url.searchParams.get("auth");

$: {
  if (isAuthRedirect) {
    if ($session.user)
      goto(redirect, {
        replaceState: true
      });
  } else {
    goto(redirect, {
      replaceState: true
    });
  }
}
</script>

<PageMessage>
  <p>You are being redirected to:</p>
  <pre>{redirect}</pre>
</PageMessage>
