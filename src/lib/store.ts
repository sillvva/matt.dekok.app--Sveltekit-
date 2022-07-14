import { writable } from "svelte/store";
import type { InferQueryOutput } from "./trpc/client";

export interface PageProps {
  title?: string;
  description?: string;
  bodyClass?: string;
  backTo?: boolean | string;
  menu?: boolean;
  articleMeta?: object;
  image?: string;
};
export const pageProps = writable<PageProps>({});

export const drawer = writable(false);

export const admin = writable<InferQueryOutput<"posts:get">>({
  success: false,
  posts: [],
  experience: [],
  skills: [],
  projects: []
});
