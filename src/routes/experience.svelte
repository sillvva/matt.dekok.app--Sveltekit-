<script lang="ts">
import { page } from "$app/stores";
import { pageProps } from "$lib/store";
import Article from "$lib/components/page/article.svelte";
import Section from "$lib/components/page/section.svelte";
import Header from "$lib/components/page/section-header.svelte";
import Image from "$lib/components/common/image.svelte";
import type { ExperienceCategory } from "./experience";
import { metaTags } from "$lib/utils";

$pageProps = {
  title: "Experience",
  bodyClass: "page-body",
  menu: true
};

export let experience: ExperienceCategory[];

$: metaProps = metaTags($pageProps, $page.url.origin, $page.url.pathname);
</script>

<svelte:head>
  <title>{metaProps.title}</title>
  <meta name="description" content={metaProps.description} />

  {#each Object.entries(metaProps.ogProperties) as t}
    <meta name="og:{t[0]}" property="og:{t[0]}" content={t[1]} />
  {/each}
  {#each Object.entries(metaProps.twProperties) as t}
    <meta name="twitter:{t[0]}" content={t[1]} />
  {/each}
</svelte:head>

<Article class="w-full md:w-9/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12">
  {#each experience as section}
    <Section>
      <Header>{section.name}</Header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-y-5 gap-x-2">
        {#each section.experience as item}
          <div
            class="text-theme-base pb-5 lg:pb-0 min-h-[60px] overflow-hidden section-divider lg:border-b-0 last:pb-0 last:border-b-0">
            <div class="relative float-left w-14 h-14 grid justify-center items-center bg-white rounded-sm">
              <Image
                src={item.image}
                alt={item.name || ""}
                objectFit="contain"
                class="max-w-[56px] max-h-[56px] rounded-sm" />
            </div>
            <div class="ml-20">
              <h3 class="text-base font-medium font-montserrat m-0">
                {#if !item.nameLink}
                  {item.name}
                {:else}
                  <a href={item.nameLink} target="_blank" rel="noreferrer noopener">
                    {item.name}
                  </a>
                {/if}
              </h3>
              <h4 class="text-sm font-light mb-1">
                {#if !item.h4Link}
                  {item.h4}
                {:else}
                  <a href={item.h4Link} target="_blank" rel="noreferrer noopener" class="font-normal">
                    {item.h4}
                  </a>
                {/if}
              </h4>
              <h5 class="text-sm font-light m-0">
                {#if !item.h5Link}
                  {item.h5}
                {:else}
                  <a href={item.h5Link} target="_blank" rel="noreferrer noopener" class="font-normal">
                    {item.h5}
                  </a>
                {/if}
              </h5>
            </div>
          </div>
        {/each}
      </div>
    </Section>
  {/each}
</Article>
