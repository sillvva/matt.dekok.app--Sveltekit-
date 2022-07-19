<script lang="ts" context="module">
import type { Load } from "./__types/redirect";
export const load: Load = async ({ url, session }) => {
  const { pathname, searchParams } = url;
  if (pathname !== "/redirect") return { status: 200 };
  const to = searchParams.get("to");
  if (!to) return { status: 301, redirect: "/" };
  if (!searchParams.get("auth")) return { status: 301, redirect: to };
  if (session.user) return { status: 301, redirect: to };
  return { status: 200 };
};
</script>

<script lang="ts">
import { page, session } from "$app/stores";
import { goto } from "$app/navigation";
import { browser } from "$app/env";

let redirect = $page.url.searchParams.get("to") || "/";

$: {
  if ($session.user && browser)
    goto(redirect, {
      replaceState: true
    });
}
</script>
