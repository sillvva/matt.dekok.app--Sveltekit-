<script lang="ts">
import { ripple } from "$lib/directives";
import Image from "$lib/components/common/image.svelte";
import type { blog } from "@prisma/client";
import { conClasses } from "$lib/utils";

export let post: blog;
let active = false;
</script>

<a
  href={post.link ? post.link.trim() : `/blog/${post.slug}`}
  target={post.link && post.link.startsWith("http") ? "_blank" : ""}
  rel={post.link && post.link.startsWith("http") ? "noreferrer noopener" : ""}
  on:click
  class="basis-full md:basis-6/12 xl:basis-4/12 p-1 md:p-3">
  <div
    class={conClasses([
      "flex flex-col 2xs:flex-row relative h-full shadow-lg ring-1 rounded-lg ring-gray-900/5 overflow-hidden",
      "bg-theme-article transition-all duration-500 ease-linear isolate",
      "[--tw-shadow-color:var(--shadowColor)] [--tw-shadow:var(--tw-shadow-colored)]",
      "hover:shadow-xl hover:[--tw-shadow-color:var(--shadowHover)]"
    ])}
    class:post-focused={active && !post.link}
    use:ripple
    on:click={e => (active = true)}>
    <div
      class={conClasses([
        "relative bg-clip-content bg-cover bg-center bg-theme-hover bg-opacity-15",
        "h-[40vw] 2xs:h-full min-w-full 2xs:min-w-[128px] max-w-full 2xs:max-w-[30%]"
      ])}
      class:animate-pulse={!post.slug && !post.link}>
      {#if post.image}
        <Image src={post.image} alt={post.title} />
      {/if}
    </div>
    {#if post.slug || post.link}
      <div class="p-3">
        <h1 class="text-lg font-semibold">{post.title}</h1>
        <p class="text-gray-400">
          {new Date(post.date).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric"
          })}
        </p>
        <p class="text-theme-base">{post.description}</p>
      </div>
    {:else}
      <div class="p-3 w-full">
        <div class="loading-line title max-w-[200px]">
          <span />
        </div>
        <div class="loading-line text max-w-[150px]">
          <span />
        </div>
        <div class="loading-line text">
          <span />
        </div>
        <div class="loading-line text">
          <span />
        </div>
      </div>
    {/if}
  </div>
</a>