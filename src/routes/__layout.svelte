<script lang="ts" context="module">
import type { Load } from "./__types/__layout";
export const load: Load = async ({ url }) => {
  return {
    props: {
      path: `${url.pathname}${url.search}`
    }
  };
};
</script>

<script lang="ts">
import { onMount } from "svelte";
import { fade } from "svelte/transition";
import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
import { afterNavigate } from "$app/navigation";
import { page, session } from "$app/stores";
import { browser } from "$app/env";
import { pageProps, pageStore, queryStore } from "$lib/store";
import { metaTags, conClasses } from "$lib/utils";
import { transitionDuration } from "$lib/constants";
import { SupaAuthHelper } from "@supabase/auth-helpers-svelte";
import { supabase } from "$lib/supabase/client";
import Toasts from "$lib/components/common/toasts.svelte";
import PageHeader from "$lib/components/page/header.svelte";
import "../app.scss";
import "../misc.scss";
import "../anim.scss";

const queryClient = new QueryClient();

export let path: string;

let delay = 0;
let loaded = false;
onMount(async () => {
  loaded = true;

  setTimeout(() => {
    delay = transitionDuration / 2;
  }, transitionDuration / 2);
});

pageStore.subscribe(p => {
  if (!browser) return;
  const search = new URLSearchParams($page.url.search);

  if (p <= 1) search.delete("page");
  else search.set("page", p.toString());
  if ($queryStore === "") search.delete("q");
  else search.set("q", $queryStore);

  const q = search.toString();
  history.pushState({}, "", `${$page.url.pathname}${q ? `?${q}` : ""}`);
});

queryStore.subscribe(query => {
  if (!browser) return;
  const search = new URLSearchParams($page.url.search);

  if ($pageStore <= 1) search.delete("page");
  else search.set("page", $pageStore.toString());
  if (query === "") search.delete("q");
  else search.set("q", query);

  const q = search.toString();
  history.pushState({}, "", `${$page.url.pathname}${q ? `?${q}` : ""}`);
});

afterNavigate(({ from, to }) => {
  if (!from) return;
  setTimeout(() => {
    $pageStore = 1;
    $queryStore = "";
  }, transitionDuration / 2);
});

$: metaProps = metaTags($pageProps, $page.url.origin, $session.theme);
</script>

<svelte:head>
  <link rel="icon" href="/favicon.png" />
  <link rel="apple-touch-icon" href="{metaProps.origin}/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />

  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="msapplication-TileColor" content={metaProps.color} />
  <meta name="msapplication-tap-highlight" content="no" />
  <meta name="theme-color" content={metaProps.color} />
</svelte:head>

<SupaAuthHelper supabaseClient={supabase} {session}>
  <QueryClientProvider client={queryClient}>
    <div
      id="app"
      class={conClasses(["min-h-screen min-w-full max-w-[100vw] absolute text-theme-base"])}
      data-theme={$session.theme}>
      {#key $session.theme}
        <div
          class={conClasses([
            "page-background fixed inset-0 scale-x-[var(--bg-scale-x)] z-0",
            "bg-fixed bg-cover bg-no-repeat bg-theme-body bg-[image:var(--bg-img)]"
          ])}
          data-theme={$session.theme}
          in:fade={{ duration: transitionDuration }}
          out:fade={{ duration: transitionDuration }} />
      {/key}
      <PageHeader {loaded} {delay} />
      {#key path + loaded}
        <main
          class={conClasses([
            loaded ? "flex" : "hidden",
            "relative flex-col justify-center items-center z-[2] px-2 pb-4 md:px-4",
            $page.url.pathname.startsWith("/admin") ? "mt-20" : "mt-24 lg:mt-36"
          ])}
          in:fade={{ delay, duration: transitionDuration / 2 }}
          out:fade={{ duration: transitionDuration / 2 }}>
          <slot />
        </main>
      {/key}
    </div>
    <Toasts />
  </QueryClientProvider>
</SupaAuthHelper>

<style lang="scss">
#app {
  color-scheme: var(--scheme);
  :global(a:not([role="button"])) {
    @apply text-theme-link no-underline;
  }
}
</style>
