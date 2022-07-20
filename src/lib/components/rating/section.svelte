<script lang="ts">
import Section from "$lib/components/page/section.svelte";
import Header from "$lib/components/page/section-header.svelte";

interface RatingColumnBreakpoints {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
}

export let name: string;
export let columns: RatingColumnBreakpoints;

$: colClasses = [
  ...(columns.sm ? ["sm:block"] : []),
  ...(columns.md ? ["md:block"] : []),
  ...(columns.xl ? ["xl:block"] : []),
  ...(columns.lg ? ["lg:block"] : []),
  ...(columns["2xl"] ? ["2xl:block"] : [])
];
</script>

<Section class="sm:block md:block lg:block xl:block 2xl:block">
  <Header>{name}</Header>
  <div class="flex flex-wrap -m-3 mt-4 mb-2">
    {#each colClasses as col, c}
      <div class={["p-3 pt-0.5 basis-0 grow", c > 0 && `hidden ${col}`, "even:text-right even:max-w-max"].join(" ")}>
        <strong>Skills</strong>
      </div>
      <div class={["p-3 pt-0.5 basis-0 grow", c > 0 && `hidden ${col}`, "even:text-right even:max-w-max"].join(" ")}>
        <strong>Rating</strong>
      </div>
    {/each}
  </div>
  <div class="flex flex-wrap -m-3">
    <slot />
  </div>
</Section>
