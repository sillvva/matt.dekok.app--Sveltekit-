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
import { onMount, onDestroy } from "svelte";
import { mdiBrightness6, mdiMenu, mdiChevronLeft } from "@mdi/js";
import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
import { parse } from "cookie";
import { fade } from "svelte/transition";
import { page, session } from "$app/stores";
import { browser } from "$app/env";
import { goto } from "$app/navigation";
import type { Item } from "$lib/types/hex-menu";
import { pageProps, drawer } from "$lib/store";
import { themes, metaTags, conClasses } from "$lib/utils";
import { transitionDuration } from "$lib/constants";
import { supabase, auth } from "$lib/supabase/connection";
import Menu from "$lib/components/page/menu.svelte";
import Title from "$lib/components/page/title.svelte";
import Drawer from "$lib/components/page/drawer.svelte";
import Fab from "$lib/components/common/fab.svelte";
import Icon from "$lib/components/common/icon.svelte";
import "../app.scss";
import "../misc.scss";
import "../anim.scss";

supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    if (!$auth) {
      $auth = session;
    }
  } else if (event === "SIGNED_OUT") {
    $auth = null;
    goto("/");
  } else {
    console.log(event);
  }
});

const queryClient = new QueryClient();

export let path: string;
let loaded = false;
let scroll = 0;
let delay = 0;

if (browser && !$auth) $auth = supabase.auth.session();

let theme = $session.theme;
const toggleTheme = (newtheme?: typeof theme) => {
  theme = newtheme || themes[(themes.indexOf(theme) + 1) % themes.length];
  document.cookie = `theme=${theme}`;
  $session.theme = theme;
};
$: {
  if (typeof document !== "undefined" && $session.theme !== parse(document.cookie).theme) {
    toggleTheme($session.theme);
  }
}

let mm: MediaQueryList;
if (browser) mm = matchMedia("(prefers-color-scheme: dark)");
const listener = () => mm && toggleTheme(mm.matches ? "dark" : "light");

onMount(async () => {
  if (mm) mm.addEventListener("change", listener);
  loaded = true;

  setTimeout(() => {
    delay = transitionDuration / 2;
  }, transitionDuration / 2);
});

onDestroy(() => {
  if (mm) mm.removeEventListener("change", listener);
});

const menuItems: Item[] = [
  { link: "/", label: "Intro" },
  { link: "/about", label: "About Me" },
  { link: "/experience", label: "Experience" },
  { link: "/skills", label: "Skills" },
  { link: "/projects", label: "Projects" },
  { link: "/blog", label: "Blog" }
];

$: metaProps = metaTags($pageProps, $page.url.origin, theme);
$: smallTitle = ($pageProps.title || "").length > 12 ? "small-title" : "";
</script>

<svelte:window bind:scrollY={scroll} />

<svelte:head>
  <link rel="icon" href="/favicon.png" />
  <link rel="apple-touch-icon" href="{metaProps.origin}/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />

  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="msapplication-TileColor" content={metaProps.color} />
  <meta name="msapplication-tap-highlight" content="no" />
  <meta name="theme-color" content={metaProps.color} />
</svelte:head>

<QueryClientProvider client={queryClient}>
  <div
    id="app"
    class={conClasses(["min-h-screen min-w-full max-w-[100vw] absolute text-theme-base"])}
    data-theme={theme}>
    {#key theme}
      <div
        class={conClasses([
          "fixed inset-0 scale-x-[var(--bg-scale-x)] z-0",
          "bg-fixed bg-cover bg-no-repeat bg-theme-body bg-[image:var(--bg-img)]"
        ])}
        data-theme={theme}
        in:fade={{ duration: transitionDuration }}
        out:fade={{ duration: transitionDuration }} />
    {/key}
    <header
      class={conClasses([
        "flex flex-col items-center transition-all duration-500",
        "fixed top-0 left-0 right-0 z-[3]",
        scroll > 0 && "backdrop-blur-lg bg-theme-body bg-opacity-60"
      ])}>
      {#if $auth?.user && $page.url.pathname.startsWith("/admin")}
        <div
          class="flex w-full py-4 px-2 2xs:px-3 items-center text-center max-h-[80px]"
          in:fade={{ delay: delay, duration: transitionDuration / 2 }}
          out:fade={{ duration: transitionDuration / 2 }}>
          <Fab ariaLabel="Open Drawer" on:click={() => ($drawer = !$drawer)}>
            <Icon path={mdiMenu} />
          </Fab>
          <div class="flex flex-1 justify-end items-center w-full gap-4">
            <button on:click={() => supabase.auth.signOut()} class="text-theme-link">Sign Out</button>
            <span class="hidden xs:inline">|</span>
            <a
              href="https://github.com/{$auth?.user.user_metadata.user_name}"
              target="_blank"
              rel="noreferrer noopener"
              class="flex gap-4 items-center">
              <span class="hidden xs:inline">
                {$auth?.user.user_metadata.user_name}
              </span>
              <div class="avatar">
                <div class="w-10 rounded-full ring ring-theme-link ring-offset-base-200 ring-offset-2">
                  <img src={$auth?.user.user_metadata.avatar_url} alt="" />
                </div>
              </div>
              <!-- <img src={$auth?.user.user_metadata.avatar_url} alt="" class="w-12 h-12 rounded-full" /> -->
            </a>
            <span class="hidden xs:inline">
              <Fab ariaLabel="Toggle Theme" active class="nav-fab" on:click={() => toggleTheme()}>
                <Icon path={mdiBrightness6} size={1.1} />
              </Fab>
            </span>
          </div>
        </div>
      {:else}
        <div
          class="flex w-full py-4 px-2 2xs:px-3 items-center text-center max-h-[80px]"
          in:fade={{ delay: delay, duration: transitionDuration / 2 }}
          out:fade={{ duration: transitionDuration / 2 }}>
          {#if $pageProps.backTo === true}
            <Fab href="/" ariaLabel="Home">
              <Icon path={mdiChevronLeft} />
            </Fab>
          {:else if $pageProps.backTo}
            <Fab ariaLabel="Back" href={$pageProps?.backTo}>
              <Icon path={mdiChevronLeft} />
            </Fab>
          {:else}
            <Fab
              ariaLabel="Open Drawer"
              class={conClasses(["menu-fab", $page.url.pathname == "/" && "drawer-fab"])}
              on:click={() => ($drawer = !$drawer)}>
              <Icon path={mdiMenu} />
            </Fab>
          {/if}
          <div class="flex-1 block lg:pl-12 relative h-14">
            {#if $pageProps.menu}
              <nav
                class={conClasses(["hidden justify-center gap-3 px-3", loaded && "lg:flex"])}
                in:fade={{ delay, duration: transitionDuration / 2 }}
                out:fade={{ duration: transitionDuration / 2 }}>
                <Menu items={menuItems} />
              </nav>
            {/if}
            <Title key={$pageProps.title} class="nav-title {smallTitle}">
              {$pageProps.title || ""}
            </Title>
          </div>
          <Fab ariaLabel="Toggle Theme" class="nav-fab" on:click={() => toggleTheme()}>
            <Icon path={mdiBrightness6} size={1.1} />
          </Fab>
        </div>
        <div class="relative h-16 w-full hidden lg:block">
          {#if loaded}
            <Title key={$pageProps.title}>
              {$pageProps.title || ""}
            </Title>
          {/if}
        </div>
      {/if}
    </header>
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
    {#if $drawer}
      <Drawer {menuItems} />
    {/if}
  </div>
</QueryClientProvider>

<style lang="scss">
#app {
  color-scheme: var(--scheme);
  :global(a:not([role="button"])) {
    @apply text-theme-link no-underline;
  }
}
</style>
