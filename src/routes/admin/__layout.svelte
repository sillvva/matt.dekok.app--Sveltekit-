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
import type { User } from "@supabase/supabase-js";
import { page } from "$app/stores";
import { browser } from "$app/env";
import { supabase } from "$lib/supabase/connection";
import { transitionDuration } from "$lib/constants";
import { pageProps, admin, auth } from "$lib/store";
import { conClasses } from "$lib/utils";
import { ripple } from "$lib/directives";
import Article from "$lib/components/page/article.svelte";
import Section from "$lib/components/page/section.svelte";
import PageMessage from "$lib/components/page/message.svelte";

export let path: string;
let user: User | null;
let width = 0;
let expanded = false;

$pageProps = {
  bodyClass: "page-body admin-body"
};

if (browser && !$auth?.user) $auth = supabase.auth.session();

onMount(async () => {
  if ($auth) user = $auth?.user;

  if (!user) {
    return await supabase.auth.signIn(
      {
        provider: "github"
      },
      {
        redirectTo: `${$page.url.origin}/redirect?to=${encodeURIComponent($page.url.pathname)}`
      }
    );
  }
});

$: paths = [
  { name: "Blog", path: "/admin", value: $admin.numposts, label: "posts" },
  { name: "Images", path: "/admin/images", value: $admin.numimages, label: "posts" },
  { name: "Experience", path: "/admin/experience", value: $admin.numexperience, label: "items" },
  { name: "Skills", path: "/admin/skills", value: $admin.numskills, label: "skills" },
  { name: "Projects", path: "/admin/projects", value: $admin.numprojects, label: "projects" }
];
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
                "relative section-border transition-[background] duration-500",
                "md:block md:bg-transparent last:border-b-0 hover:bg-theme-hover hover:bg-opacity-15",
                path == p.path || expanded ? "block" : "hidden",
                path == p.path && expanded && paths.length > 1 ? "bg-active" : ""
              ])}
              on:click={() => (expanded = !expanded)}
              use:ripple>
              <Section>
                <div class="flex">
                  <div class="flex-1">
                    <span class="text-theme-link font-semibold">{p.name}</span>
                  </div>
                  <div class="flex-1 min-w-fit text-right">
                    {#if typeof p.value !== "undefined"}
                      {p.value} {p.label}
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
          <a
            href="https://github.com/sillvva/sveltekit.dekok.app"
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
                  <span class="text-theme-link font-semibold">Github</span>
                </div>
              </div>
            </Section>
          </a>
          <a
            href="https://vercel.com/"
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
                  <span class="text-theme-link font-semibold">Vercel</span>
                </div>
              </div>
            </Section>
          </a>
          <a
            href="https://app.supabase.com/"
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
                  <span class="text-theme-link font-semibold">Supabase</span>
                </div>
              </div>
            </Section>
          </a>
        </Article>
      </div>
    </div>
    <div
      class="flex-1"
      in:fade={{ delay: transitionDuration / 2, duration: transitionDuration / 2 }}
      out:fade={{ duration: transitionDuration / 2 }}>
      <slot />
    </div>
  </div>
{:else}
  <PageMessage>Authenticating...</PageMessage>
{/if}
