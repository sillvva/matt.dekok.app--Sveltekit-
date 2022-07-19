<script lang="ts">
import { fade } from "svelte/transition";
import { mdiBrightness6, mdiMenu, mdiChevronLeft } from "@mdi/js";
import { parse } from "cookie";
import { browser } from "$app/env";
import { page, session } from "$app/stores";
import { themes, conClasses } from "$lib/utils";
import { transitionDuration } from "$lib/constants";
import { pageProps, drawer } from "$lib/store";
import Menu from "$lib/components/page/menu.svelte";
import Title from "$lib/components/page/title.svelte";
import Fab from "$lib/components/common/fab.svelte";
import Icon from "$lib/components/common/icon.svelte";
import Drawer from "$lib/components/page/drawer.svelte";
import type { HexMenuItem } from "$lib/types";
import { onDestroy, onMount } from "svelte";

export let loaded = false;
export let delay = 0;
let scroll = 0;

let mm: MediaQueryList;
if (browser) mm = matchMedia("(prefers-color-scheme: dark)");
const listener = () => mm && toggleTheme(mm.matches ? "dark" : "light");

onMount(() => mm && mm.addEventListener("change", listener));
onDestroy(() => mm && mm.removeEventListener("change", listener));

let theme = $session.theme;
const toggleTheme = (newtheme?: typeof theme) => {
  theme = newtheme || themes[(themes.indexOf(theme) + 1) % themes.length];
  document.cookie = `theme=${theme}; path=/; domain=${$page.url.hostname}; expires=${new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 365.25 * 10
  ).toUTCString()}`;
  $session.theme = theme;
};
$: {
  if (browser && $session.theme !== parse(document.cookie).theme) {
    toggleTheme($session.theme);
  }
}

const menuItems: HexMenuItem[] = [
  { link: "/", label: "Intro" },
  { link: "/about", label: "About Me" },
  { link: "/experience", label: "Experience" },
  { link: "/skills", label: "Skills" },
  { link: "/projects", label: "Projects" },
  { link: "/blog", label: "Blog" }
];

$: smallTitle = ($pageProps.title || "").length > 12 ? "small-title" : "";
$: isAdmin = $session?.user && $page.url.pathname.startsWith("/admin");
</script>

<svelte:window bind:scrollY={scroll} />

<header
  class={conClasses([
    "flex flex-col items-center transition-all duration-500",
    "fixed top-0 left-0 right-0 z-[3]",
    scroll > 0 && "backdrop-blur-lg bg-theme-body bg-opacity-60"
  ])}>
  <div
    class="flex gap-4 w-full py-4 px-2 2xs:px-3 items-center text-center max-h-[80px]"
    in:fade={{ delay: delay, duration: transitionDuration / 2 }}
    out:fade={{ duration: transitionDuration / 2 }}>
    <div class="w-12">
      {#if isAdmin}
        <Fab ariaLabel="Open Drawer" on:click={() => ($drawer = !$drawer)}>
          <Icon path={mdiMenu} size={1.1} />
        </Fab>
      {:else if $pageProps.backTo === true}
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
    </div>
    {#if isAdmin}
      <div class="flex flex-1 justify-end items-center w-full gap-4">
        <a href="/api/auth/logout" class="text-theme-link">Sign out</a>
        <span class="hidden xs:inline">|</span>
        <a
          href="https://github.com/{$session?.user.user_metadata.user_name}"
          target="_blank"
          rel="noreferrer noopener"
          class="flex gap-4 items-center">
          <span class="hidden xs:inline">
            {$session?.user.user_metadata.user_name}
          </span>
          <div class="avatar">
            <div class="w-10 rounded-full ring ring-theme-link ring-offset-base-200 ring-offset-2">
              <img src={$session?.user.user_metadata.avatar_url} alt="" />
            </div>
          </div>
        </a>
      </div>
    {:else}
      <div class="flex-1 block relative h-14">
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
    {/if}
    <span class="hidden xs:inline">
      <Fab ariaLabel="Toggle Theme" active class="nav-fab" on:click={() => toggleTheme()}>
        <Icon path={mdiBrightness6} size={1.1} />
      </Fab>
    </span>
  </div>
  {#if !isAdmin}
    <div class="relative h-16 w-full hidden lg:block">
      {#if loaded}
        <Title key={$pageProps.title}>
          {$pageProps.title || ""}
        </Title>
      {/if}
    </div>
  {/if}
</header>

{#if $drawer}
<Drawer {menuItems} />
{/if}