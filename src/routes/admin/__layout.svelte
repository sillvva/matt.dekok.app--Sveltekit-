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
import { mdiOpenInNew } from "@mdi/js";
import type { User } from "@supabase/supabase-js";
import { browser } from "$app/env";
import { page } from "$app/stores";
import { supabase, auth } from "$lib/supabase/client";
import { pageProps, admin } from "$lib/store";
import { conClasses } from "$lib/utils";
import { ripple } from "$lib/directives";
import Article from "$lib/components/page/article.svelte";
import Section from "$lib/components/page/section.svelte";
import PageMessage from "$lib/components/page/message.svelte";
import Icon from "$lib/components/common/icon.svelte";

export let path: string;
let user: User | null;
let width = 0;
let expanded = false;

$pageProps = {
  bodyClass: "page-body admin-body"
};

onMount(async () => {
  if ($auth) user = $auth?.user;

  if (!user) {
    return await supabase.auth.signIn(
      {
        provider: "github"
      },
      {
        redirectTo: `${$page.url.origin}/redirect?to=${encodeURIComponent($page.url.pathname)}&auth=1`
      }
    );
  }
});

$: paths = [
  { name: "Blog", path: "/admin", value: $admin.numposts, label: "posts" },
  { name: "Images", path: "/admin/images", value: $admin.numimages, label: "posts" }
  // { name: "Experience", path: "/admin/experience", value: $admin.numexperience, label: "items" },
  // { name: "Skills", path: "/admin/skills", value: $admin.numskills, label: "skills" },
  // { name: "Projects", path: "/admin/projects", value: $admin.numprojects, label: "projects" }
];
$: resources = [
  { name: "Github", path: "https://github.com/sillvva/sveltekit.dekok.app" },
  { name: "Vercel", path: "https://vercel.com/dashboard" },
  { name: "Supabase", path: "https://app.supabase.com/" }
];
$: {
  if (browser && $auth)
    document.cookie = `supabase_auth=${$auth.access_token}; path=/; expires=${new Date(
      ($auth.expires_at || 0) * 1000
    ).toUTCString()}`;
}
</script>

<svelte:head>
  <title>Admin - Matt DeKok</title>
</svelte:head>

<svelte:window bind:innerWidth={width} />

{#if user}
  <div class="flex flex-col md:flex-row w-full gap-4">
    <div class="flex-1 md:max-w-[20rem] relative">
      <div class="static md:sticky top-20">
        <Article>
          {#each paths as p}
            <a
              href={p.path}
              class={conClasses([
                "relative section-divider transition-[background] duration-500",
                "md:block last:border-b-0 md:hover:bg-theme-hover md:hover:bg-opacity-15",
                path == p.path || expanded ? "block" : "hidden",
                path == p.path &&
                  (width >= 768 || (width < 768 && expanded)) &&
                  "bg-theme-hover bg-opacity-15 cursor-default"
              ])}
              on:click={() => (expanded = !expanded)}
              use:ripple={{ enabled: path !== p.path }}>
              <Section>
                <div class="flex">
                  <div class="flex-1">
                    <span class="text-theme-link font-semibold">{p.name}</span>
                  </div>
                  <div class="flex-1 min-w-fit text-right">
                    {#if typeof p.value !== "undefined"}
                      <span class="badge badge-lg">{p.value} {p.label}</span>
                    {:else}
                      <div class="loading-line text">
                        <span />
                      </div>
                    {/if}
                  </div>
                </div>
              </Section>
            </a>
          {/each}
        </Article>
        <Article class="hidden md:block">
          {#each resources as p}
            <a
              href={p.path}
              target="_blank"
              rel="noreferrer noopener"
              class={conClasses([
                "relative border-solid border-b-black/25 border-b-[1px] transition-[background] duration-500",
                "md:block md:bg-transparent last:border-b-0 hover:bg-theme-hover hover:bg-opacity-15"
              ])}
              use:ripple>
              <Section>
                <div class="flex">
                  <div class="flex-1">
                    <span class="text-theme-link font-semibold">
                      {p.name}
                      <Icon path={mdiOpenInNew} size={0.8} class="ml-1" />
                    </span>
                  </div>
                </div>
              </Section>
            </a>
          {/each}
        </Article>
      </div>
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
{:else}
  <PageMessage>Authenticating...</PageMessage>
{/if}
